import { Component } from '@angular/core';
import { Person } from './person.type';
import { PeopleService } from './people.service';
import { ApplicationState, PeopleSelectors } from './state';
import { Store } from '@yeast/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'state-example';
  people$ = this.state.select(PeopleSelectors.people());
  selectedPerson$ = this.state.select(PeopleSelectors.selectedPerson());
  personWithId6$ = this.state.select(PeopleSelectors.person('6')); // we can do deepselect

  constructor(private peopleService: PeopleService, private state: Store<ApplicationState>) {
    this.peopleService.getAll().subscribe(resp => {
      this.state.update(PeopleSelectors.people(), resp);
    });
  }

  updateName(person: Person): void {
    this.state.update(PeopleSelectors.person(person.id), { ...person, name: person.name + '!' });
  }

  updateFilm({ person, film }): void {
    this.state.update(PeopleSelectors.film(person, film), { ...film, title: film.title + '!' });
  }

  removeFilm({ person, film }): void {
    const fn = this.state.remove(PeopleSelectors.film(person, film));
    setTimeout(() => {
      // undo after 5 seconds
      this.state.undo(fn);
    }, 5000);
  }


  remove(person: Person): void {
    this.state.remove(PeopleSelectors.person(person.id));
  }

  selectPerson(person: Person): void {
    this.state.update(PeopleSelectors.selectedPerson(), person);
  }

  addPerson(): void {
    this.state.add(PeopleSelectors.people(), {
      films: [],
      name: 'fake person',
      id: new Date().getTime().toString(),
      url: 'fakeurl/' + new Date().getTime().toString()
    });
  }
}
