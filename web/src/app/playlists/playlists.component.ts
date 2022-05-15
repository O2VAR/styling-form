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
            <mat-icon class="play-icon">bookmark</mat-icon>
          </div>
          <span class="primary" style="opacity: .5">My First Playlist</span>
          <!--<span class="secondary">0 songs</span>-->
        </li>
        <li class="item" *ngFor="let item of playlists | async">
          <div class="covers"
               [ngClass]="{
                  noCover: getCovers(item).length === 0,
                  c1: getCovers(item).length < 4,
                  c4: getCovers(item).length >= 4 && getCovers(item).length < 9,
                  c9: getCovers(item).length >= 9 && getCovers(item).length < 16,
                  c16: getCovers(item).length >= 16
               }"
               (click)="itemClicked(item)">
            <mat-icon class="avatar-icon">music_note</mat-icon>
            <ng-container *ngFor="let cover of getCovers(item).slice(0, 16)">
              <div [style]="getStyle(cover)" class="cover">&nbsp;</div>
            </ng-container>
            <mat-icon class="play-icon">play_circle_outline</mat-icon>
            <button mat-button mat-icon-button class="more" (click)="$event.stopPropagation()" [matMenuTriggerFor]="playlistMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
          <mat-menu #playlistMenu="matMenu">
            <button mat-menu-item (click)="itemClicked(item)">
              <mat-icon>playlist_play</mat-icon>
              <span>Load Playlist</span>
            </button>
