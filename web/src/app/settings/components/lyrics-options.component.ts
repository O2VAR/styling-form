import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {LyricsOptions} from '@app/model';

@Component({
  selector: 'app-lyrics-options',
  template: `
    <p>
      <mat-slide-toggle color="primary" [(ngModel)]="lyricsOpts.useService" (change)="toggleUseService()">
        Find lyrics on the Web
      </mat-slide-toggle>
    </p>
    <p class="sub">
      <mat-slide-toggle color="primary" [(ngModel)]="lyricsOpts.services.wikia"
                    [disabl