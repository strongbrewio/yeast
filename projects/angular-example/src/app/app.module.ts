import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { initialState } from './state';
import { Store } from '@yeast/state';
import { PersonComponent } from './person.component';
import { HttpClientModule } from '@angular/common/http';

const store = new Store(initialState);
store.startBuffer(100);

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
