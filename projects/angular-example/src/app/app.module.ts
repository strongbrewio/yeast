import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { initialState } from './state';
import { ActionTypes, StateHook, Store } from '@yeast/state';
import { PersonComponent } from './person.component';
import { HttpClientModule } from '@angular/common/http';

const store = new Store(initialState);
store.startBuffer(100);
store.registerHook((hook: StateHook<any>) => {
  switch (hook.type) {
    case ActionTypes.Update:
      console.group('UPDATE');
      console.log('Previous state', hook.previousState);
      hook.selectors.forEach(console.log);
      console.log('New state', hook.currentState);
      console.groupEnd();
      break;
    case ActionTypes.Add:
      console.group('ADD');
      console.log('Previous state', hook.previousState);
      hook.selectors.forEach(console.log);
      console.log('New state', hook.currentState);
      console.groupEnd();
      break;
    case ActionTypes.Remove:
      console.group('REMOVE');
      console.log('Previous state', hook.previousState);
      hook.selectors.forEach(console.log);
      console.log('New state', hook.currentState);
      console.groupEnd();
      break;
    case ActionTypes.Undo:
      console.group('UNDO');
      console.log('Previous state', hook.previousState);
      hook.selectors.forEach(console.log);
      console.log('New state', hook.currentState);
      console.groupEnd();
      break;
  }
});

@NgModule({
  declarations: [
    AppComponent,
    PersonComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [{
    provide: Store,
    useValue: store
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
