import { Component } from '@angular/core';
import { Person } from './person.type';
import { PeopleService } from './people.service';
import { ApplicationState, filmSelector, peopleSelector, personSelector, selectedPersonSelector } from './state';
import { Store } from '@yeast/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'state-example';
  people$ = this.state.select(peopleSelector());
  selectedPerson$ = this.state.select(selectedPersonSelector());
  personWithId6$ = this.state.select(personSelector('6')); // we can do deepselect

  constructor(private peopleService: PeopleService, private state: Store<ApplicationState>) {
    this.peopleService.getAll().subscribe(resp => {
      this.state.update(peopleSelector(), resp);
    });
  }

  updateName(person: Person): void {
    this.state.update(personSelector(person.id), { ...person, name: person.name + '!' });
  }

  updateFilm({ person, film }): void {
    const updatedFilm = { ...film, title: film.title + '!' };
    const fn = this.state.update(filmSelector(person, film), updatedFilm);
  }

  removeFilm({ person, film }): void {
    const fn = this.state.remove(filmSelector(person, film));
    setTimeout(() => {
      // undo after 5 seconds
      this.state.undo(fn);
    }, 5000);
  }


  remove(person: Person): void {
    this.state.remove<Person>(personSelector(person.id));
  }

  selectPerson(person: Person): void {
    this.state.update(selectedPersonSelector(), person);
  }

  addPerson(): void {
    const person: Person = {
      films: [],
      name: 'fake person',
      id: new Date().getTime().toString(),
      url: 'fakeurl/' + new Date().getTime().toString()
    };
    this.state.add(peopleSelector(), person);
  }
}
