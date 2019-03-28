import { ActionTypes } from './action-types';
import { Selector } from './selector';

export type StateHook<S> = {
  previousState: S;
  currentState: S;
  type: ActionTypes,
  selectors: Selector[]
};
