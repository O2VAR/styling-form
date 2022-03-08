
import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Album, Artist} from '@app/model';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-my-music-albums',
  template: `
    <div class="controls">
      <a class="play-all">
        <mat-icon>shuffle</mat-icon>
        Play all randomly ({{ albums.length }})
      </a>
      <div class="filler"></div>
      <mat-form-field floatLabel="never" class="search">
        <input matInput title="Search" [(ngModel)]="search" spellcheck="false">
        <mat-placeholder>
          <mat-icon class="search-icon">search</mat-icon>
          Search
        </mat-placeholder>
        <button mat-button *ngIf="search" matSuffix mat-icon-button aria-label="Clear" (click)="search=''">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>
    </div>

    <app-box-list [center]="false"
                  [list]="displayedAlbums"
                  [primaryFunc]="primaryFunc"
                  [secondaryFunc]="secondaryFunc"
                  (itemClicked)="play($event)">
    </app-box-list>
  `,
  styles: [`
    .controls {
      padding: 0 1rem;