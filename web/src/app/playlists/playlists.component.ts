import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {combineLatest, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {Playlist} from '@app/model';
import {InfoComponent} from '@app/shared/dialogs/info.component';
import {LibraryService} from '@app/library/services/library.service';
import {LibraryUtils} from '@app/library/library.utils';
import {ConfirmComponent} from '@app/shared/dialogs/confirm.component';

@Component({
  selector: 'app-playlists',
  template: `
    <div class="playlists">
      <h2>System Playlists</h2>
      <ul class="list center">
        <li class="item favorites" *ngIf="favoritePlaylist | async; let pl;">
          <div class="covers noCover" (click)="itemClicked(pl)">
            <mat-icon class="avatar-icon">favorite</mat-icon>
            <mat-icon class="play-icon">play_circle_outline</mat-icon>
          </div>
          <span class="primary">Favorites</span>
          <span class="secondary">{{ pl.tracks.length }} songs</span>
        </li>
        <li class="item favorites" *ngIf="recentPlaylist | async; let pl;">
          <div class="covers noCover" (click)="itemClicked(pl)">
            <mat-icon class="avatar-icon">schedule</mat-icon>
            <mat-icon class="play-icon">play_circle_outline</mat-icon>
          </div>
          <span class="primary">Recently Played</span>
          <span class="secondary">{{ pl.tracks.length }} songs</span>
        </li>
        <li class="item favorites" *ngIf="allPlaylist | async; let pl;">
          <div class="covers noCover" (click)="itemClicked(pl)">
            <mat-icon class="avatar-icon">music_note</mat-icon>
            <mat-icon class="play-icon">play_circle_outline</mat-icon>
          </div>
          <span class="primary">All songs</span>
          <span class="secondary">{{ pl.tracks.length }} songs</span>
        </li>
      </ul>
      <mat-divider></mat-divider>
      <h2>My Playlists</h2>
      <ul class="list center">
        <li class="item" *ngIf="(playlists | async).length === 0" (click)="openInfoDialog()">
          <div class="covers noCover">
            <mat-icon class="avatar-icon">bookmark_border</mat-icon>
           