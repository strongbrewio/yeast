import { Film } from './film.type';

export type Person = {
  url: string;
  name: string;
  id: string;
  films: Film[]
};
