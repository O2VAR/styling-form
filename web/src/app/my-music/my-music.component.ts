import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LibraryService} from '@app/library/services/library.service';
import {Observable} from 'rxjs';
import {Album, Artist, Track} from '@app/model';

@Component({
  selector: 'app-my-music',
  template: `
    <div class="my-music">
      <mat-tab-group>
        <mat-tab [label]="'Artists'">
          <app-my-music-artists [artists]="artists$ | async">
          </app-my-music-artists>
        </mat-tab>
       