import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { BufferEntry } from './buffer-entry';
import { StateHook } from './state-hook';
import { ActionTypes } from './action-types';

export class Store<T> {
  private stateSub$ = new BehaviorSubject<T>(null);
  private stateBuffer$ = new BehaviorSubject<BufferEntry<T>[]>([]);
  private itemsToBuffer = 0;
  private hookFns: ((stateHook: StateHook<any>) => void)[] = [];
  state$ = this.stateSub$.pipe(filter(v => !!v));

  constructor(initialState: T) {
    this.stateSub$.next(initialState);
  }

  registerHook(fn: (stateHook: StateHook<any>) => void): void {
    this.hookFns.push(fn);
  }

  startBuffer(itemsToBuffer = 100): void {
    this.itemsToBuffer = itemsToBuffer;
  }

  select(selectors: any[]): Observable<any> {
    return this.state$.pipe(
      map(state => this.selectPartOfState(state, [...selectors])),
      distinctUntilChanged());
  }

  remove(selectors: any[]): (state: T) => T {
    const previousState = this.selectPartOfState(this.stateSub$.getValue(), selectors);
    const fn = (state: T) => this.removePartOfState(state, selectors);
    this.stateSub$.next(fn(this.stateSub$.getValue()));
    this.addToBuffer(fn);
    const currentState = this.selectPartOfState(this.stateSub$.getValue(), selectors);
    this.triggerHooks({ currentState, previousState, type: ActionTypes.Remove, selectors });
    return fn;
  }

  update(selectors: any[], itemToUpdate: any): (state: T) => T {
    const previousState = this.selectPartOfState(this.stateSub$.getValue(), selectors);
    const fn = (state: T) => this.updatePartOfState(state, selectors, itemToUpdate);
    const newState = fn(this.stateSub$.getValue());
    this.stateSub$.next(newState);
    this.addToBuffer(fn);
    const currentState = this.selectPartOfState(this.stateSub$.getValue(), selectors);
    this.triggerHooks({ currentState, previousState, type: ActionTypes.Update, selectors });
    return fn;
  }

  add(selectors: any[], itemToUpdate: any): (state: T) => T {
    const previousState = this.selectPartOfState(this.stateSub$.getValue(), selectors);
    const fn = (state: T) => this.pushPartOfState(state, selectors, itemToUpdate);
    this.stateSub$.next(fn(this.stateSub$.getValue()));
    this.addToBuffer(fn);
    const currentState = this.selectPartOfState(this.stateSub$.getValue(), selectors);
    this.triggerHooks({ currentState, previousState, type: ActionTypes.Add, selectors });
    return fn;
  }

  undo(fn: (state: T) => T): void {
    const previousState = this.stateSub$.getValue();
    const currentBuffer: BufferEntry<T>[] = [...this.stateBuffer$.getValue()];
    const rolledBackState = currentBuffer
      .filter(v => v.fn !== fn)
      .map(v => v.fn)
      .reduce((state: any, v) => v(state), currentBuffer[0].state);
    this.stateSub$.next(rolledBackState);
    this.stateBuffer$.next(currentBuffer
      .filter(v => v.fn !== fn));

    this.triggerHooks({ previousState, currentState: rolledBackState, type: ActionTypes.Undo, selectors: [] });
  }

  private triggerHooks(hook: StateHook<any>): void {
    this.hookFns.forEach(fn => fn(hook));
  }

  private addToBuffer(fn: (state: T) => T): void {
    const bufferEntry = { state: this.stateSub$.getValue(), fn };
    const currentBuffer = this.stateBuffer$.getValue();
    if (currentBuffer.length === this.itemsToBuffer) {
      currentBuffer.shift();
    }
    this.stateBuffer$.next([...currentBuffer, bufferEntry]);
  }

  private selectPartOfState<S>(state: S, selectors: ((state: S) => S)[]): S {
    const newSelectors = [...selectors];
    const currentSelector = newSelectors.shift();

    if (!currentSelector) {
      return state;
    }
    return this.selectPartOfState(currentSelector(state), newSelectors);
  }

  private updatePartOfState<S>(state: S, selectors: ((state: S) => S)[], itemToUpdate?: any): S {
    const newSelectors = [...selectors];
    const currentSelector = newSelectors.shift();
    if (!currentSelector) {
      return Array.isArray(state) ? [...itemToUpdate] : { ...itemToUpdate };
    }
    const foundItem = currentSelector(state);
    return (Array.isArray(state)
      ? state.map(i => i === foundItem
        ? this.updatePartOfState(foundItem, newSelectors, itemToUpdate)
        : i
      )
      : { ...state, [this.getKey(state, foundItem)]: this.updatePartOfState(foundItem, newSelectors, itemToUpdate) }) as S;
  }

  private removePartOfState<S>(state: S, selectors: ((state: S) => S)[]): S {
    const newSelectors = [...selectors];
    const selector = newSelectors.shift();
    const foundItem = selector(state);
    if (selectors.length === 1 && Array.isArray(state)) {
      return (state as any).filter(item => item !== foundItem) as S; // remove
    }
    return (Array.isArray(state)
      ? state.map(i => i === foundItem ? this.removePartOfState(foundItem, newSelectors) : i)
      : { ...state, [this.getKey(state, foundItem)]: this.removePartOfState(foundItem, newSelectors) }) as S;
  }

  private pushPartOfState<S>(state: S, selectors: ((state: S) => S)[], itemToUpdate?: any): S {
    const newSelectors = [...selectors];
    const currentSelector = newSelectors.shift();
    if (!currentSelector) {
      return [...state as any, itemToUpdate] as any;
    }
    const foundItem = currentSelector(state);
    return (Array.isArray(state)
      ? state.map(i => i === foundItem ? this.pushPartOfState(foundItem, newSelectors, itemToUpdate) : i)
      : { ...state, [this.getKey(state, foundItem)]: this.pushPartOfState(foundItem, newSelectors, itemToUpdate) }) as S;
  }

  private getKey<S>(object: S, item: any): string {
    return Object.keys(object)
      .find(k => object[k] === item);
  }
}

