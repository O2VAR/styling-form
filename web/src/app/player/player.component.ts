
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {mergeMap, take, tap} from 'rxjs/operators';

import {Playlist, Track} from '@app/model';
import {PlaylistsDialogComponent} from '@app/shared/dialogs/playlists-dialog.component';

import {LibraryService} from '@app/library/services/library.service';

@Component({
  selector: 'app-player',
  template: `
    <div class="player-background">
      <div class="b1" [style]="getAvatarStyle(currentTrack$ | async)"></div>
      <div class="b2"></div>
    </div>
    <div class="player">
      <app-player-header [currentTrack]="currentTrack$ | async"></app-player-header>
      <app-player-progress [loading]="loading$ | async"
                           [duration]="duration$ | async"
                           [currentTime]="currentTime$ | async"
                           (seekTo)="seekTo($event)">
      </app-player-progress>
      <app-player-controls [volume]="volume$ | async"
                           [muted]="muted$ | async"
                           [currentTrack]="currentTrack$ | async"
                           [playing]="playing$ | async"
                           [isFavorite]="isFavorite$ | async"
                           [playlist]="playlist$ | async"
                           [playlists]="playlists$ | async"
                           [repeat]="repeat$ | async"
                           [shuffle]="shuffle$ | async"
                           (pause)="pause()"
                           (resume)="resume()"
                           (setRepeat)="setRepeat($event)"
                           (setShuffle)="setShuffle($event)"
                           (playNext)="playNext()"
                           (playPrevious)="playPrevious()"
                           (toggleFavorite)="toggleFavorite($event)"
                           (setMute)="setMute($event)"
                           (setVolume)="setVolume($event)"
                           (showInLibrary)="showInLibrary()"