import { Person } from './person.type';
import { Film } from './film.type';
import { Selector } from '@yeast/state';

export type ApplicationState = {
  readonly people: Person[];
  readonly selectedPerson: Person;
};
export const initialState: ApplicationState = {
  people: [],
  selectedPerson: null
};

export class PeopleSelectors  {
  static people(): Selector {
    return [(state: ApplicationState) => state.people];
  }

  static selectedPerson(): Selector {
    return [(state: ApplicationState) => state.selectedPerson];
  }

  static person(id: string): Selector {
    return this.people().concat(
      (people: Person[]) => people.find(p => p.id === id)
    );
  }

  static films(personId: string): Selector {
    return this.person(personId).concat((p: Person) => p.films);
  }

  static film(person: Person, film: Film): Selector {
    return this.films(person.id)
      .concat((films: Film[]) => films.find(f => f.id === film.id));
  }

  static selectedPersonOfPeopleName(): Selector {
    return createCombinedSelector(this.selectedPerson(), this.people(), (person: Person, people: Person[]) => {
      return people.find(p => p.id === person.id).name;
    });
  }
}

function createCombinedSelector(selector1: Selector, selector2: Selector, fn): Selector {
  return [() => selector1];
}
