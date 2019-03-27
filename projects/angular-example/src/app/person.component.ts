import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Person } from './person.type';
import { Film } from './film.type';

@Component({
  selector: 'app-person',
  template: `
    <ul>
      <li *ngFor="let film of person?.films">
        <span>{{film.title}}</span>
        <button (click)="updateFilm(person, film)">Update film</button>
        <button (click)="removeFilm(person, film)">Remove film</button>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonComponent implements OnChanges {
  @Input() person: Person;
  @Output() filmUpdated = new EventEmitter();
  @Output() filmRemoved = new EventEmitter();

  ngOnChanges(simpleChanges): void {
    console.log(simpleChanges);
  }

  updateFilm(person: Person, film: Film): void {
    this.filmUpdated.emit({ person, film });
  }

  removeFilm(person: Person, film: Film): void {
    this.filmRemoved.emit({ person, film });
  }
}
