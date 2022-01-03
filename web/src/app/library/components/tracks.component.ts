
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MatDialog, MatMenu} from '@angular/material';
import {Observable} from 'rxjs';

import {Track} from '@app/model';
import {DetailsComponent} from '@app/shared/dialogs/details.component';
import {SettingsService} from '@app/settings/services/settings.service';
import {LibraryService} from '@app/library/services/library.service';

@Component({
  selector: 'app-tracks',
  template: `
    <div class="wrapper">

      <app-controls [(search)]="search"
                    [searchPlaceholder]="'Search a track'"
                    [matMenu]="tracksMenu"
                    [backButton]="true"
                    (backClicked)="previous.emit()">
        <span class="select-text">
          Total tracks: {{ filteredTracks.length }}
        </span>
      </app-controls>

      <mat-menu #tracksMenu>
        <button mat-menu-item (click)="addTracksToPlaylist()" [disabled]="filteredTracks.length == 0">
          <mat-icon>playlist_add</mat-icon>
          <span>Add all to current playlist</span>
        </button>
        <button mat-menu-item (click)="sortedAlphabetically = true" [disabled]="sortedAlphabetically">
          <mat-icon>sort_by_alpha</mat-icon>
          <span>Sort alphabetically</span>
        </button>
        <button mat-menu-item (click)="sortedAlphabetically = false" [disabled]="!sortedAlphabetically">
          <mat-icon>sort</mat-icon>
          <span>Sort by location</span>
        </button>
      </mat-menu>

      <div #list class="list-wrapper" (swiperight)="previous.emit()" (swipeleft)="next.emit()">
        <mat-list class="list" [class.sorted-alpha]="sortedAlphabetically" dense>
          <app-track *ngFor="let track of filteredTracks; trackBy: trackByURL"
                     [track]="track"
                     [isCurrentTrack]="isCurrentTrack(track)"
                     [search]="search"
                     [favorite]="isFavorite(track) | async"
                     (click)="trackClicked(track)"
                     (addTrackToPlaylist)="addTrackToPlaylist(track)"
                     (openDetailsDialog)="openDetailsDialog(track)"
                     (playTrack)="playTrack(track)"
                     (playTrackNext)="playTrackNext(track)"
                     (addToFavorites)="addToFavorites(track)"
                     (removeFromFavorites)="removeFromFavorites(track)">
          </app-track>