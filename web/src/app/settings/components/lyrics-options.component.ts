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
                    [disabled]="!lyricsOpts.useService" (change)="toggleService()">
        Search on lyrics.wikia.com
        <a href="http://lyrics.wikia.com" target="_blank"
           aria-label="http://lyrics.wikia.com" class="open" (click)="linkClicked.emit($event)">
          <mat-icon class="small">open_in_new</mat-icon>
        </a>
      </mat-slide-toggle>
    </p>
    <p class="sub">
      <mat-slide-toggle color="primary" [(ngModel)]="lyricsOpts.services.lyricsOvh"
                    [disabled]="!lyricsOpts.useService" (change)="toggleService()">
        Use the lyrics.ovh service
        <a href="http://lyrics.ovh" target="_blank"
           aria-label="https://lyrics.ovh" class="open" (click)="linkClicked.emit($event)">
          <mat-icon class="small">open_in_new</mat-icon>
        </a>
      </mat-slide-toggle>
    </p>
    <p class="sub">
      <mat-slide-toggle color="pr