import { Person } from './person.type';
import { Film } from './film.type';

export type ApplicationState = {
  readonly people: Person[];
  readonly selectedPerson: Person;
};
export const initialState: ApplicationState = {
  people: [],
  selectedPerson: null
};

export type Selector = () => ((state: any) => any)[];

export const peopleSelector: Selector = () => [(state: ApplicationState) => state.people];
export const selectedPersonSelector: Selector = () => [(state: ApplicationState) => state.selectedPerson];
export const personSelector = (id: string) =>
  [
    ...peopleSelector(),
    (people: Person[]) => people.find(p => p.id === id)
  ];
export const filmsSelector = () => [(p: Person) => p.films];

export const filmSelector = (person: Person, film: Film) =>
  [
    ...personSelector(person.id),
    ...filmsSelector(),
    (films: Film[]) => films.find(f => f.id === film.id)
  ];



