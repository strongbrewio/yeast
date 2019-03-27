import { HttpClient } from '@angular/common/http';
import { Person } from './person.type';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private httpClient: HttpClient) {

  }

  getAll(): Observable<Person[]> {
    return this.httpClient.get<{ results: Person[] }>('https://swapi.co/api/people')
      .pipe(
        map(resp => {
          return resp.results.map(res => {
            const id = res.url.split('/').filter(v => v !== '').pop();
            const films = [{
              title: 'A new Hope',
              director: 'George Lucas',
              producer: 'Gary Kurtz',
              id: '1'
            }];
            return { ...res, id, films };
          });
        }));
  }
}
