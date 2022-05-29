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
            <button mat-menu-item (click)="deletePlaylist(item)">
              <mat-icon>delete</mat-icon>
              <span>Delete Playlist</span>
            </button>
          </mat-menu>
          <span class="primary" [matTooltip]="item.name">{{ item.name }}</span>
          <span class="secondary">{{ item.tracks.length }} songs</span>
        </li>
      </ul>
      <mat-divider></mat-divider>
      <h2>Main Artists</h2>
      <ul class="list center">
        <li class="item" *ngFor="let item of artistsPlaylists | async">
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
          </div>
          <span class="primary" [matTooltip]="item.name">{{ item.name }}</span>
          <span class="secondary">{{ item.tracks.length }} songs</span>
        </li>
      </ul>
      <mat-divider></mat-divider>
      <h2>
        Suggested Albums
        <mat-icon class="info" matTooltip="A random list of albums based on your favorites and music you played recently.">info</mat-icon>
      </h2>
      <ul class="list center">
        <li class="item" *ngFor="let item of suggestedAlbumsPlaylists | async">
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
          </div>
          <span class="primary" [matTooltip]="item.name">{{ item.name }}</span>
          <span class="secondary">{{ item.tracks.length }} songs</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    h2 {
      margin: 0.5rem 1rem 0;
    }
    .playlists {
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }
    .list {
      display: flex;
      flex-direction: row;
      list-style: none;
      margin: 0;
      padding: .5rem;
      overflow-x: scroll;
    }
    .list {
      padding-bottom: 6px;
    }
    .list::-webkit-scrollbar {
      display: none;
    }
    .list:hover {
      padding-bottom: 0;
    }
    .list:hover::-webkit-scrollbar {
      display: unset;
    }
    .item {
      width: 150px;
      margin: 0.5rem;
      display: flex;
      flex-direction: column;
    }
    .item:hover .covers {
      box-shadow: 0 5px 10px 2px rgba(0, 0, 0, 0.2);
    }
    .covers {
      position: relative;
      box-sizing: border-box;
      width: 150px;
      height: 150px;
      background-size: cover;
      margin-bottom: 0.5rem;
      display: flex;
      cursor: pointer;
      flex-wrap: wrap;
      overflow: hidden;
    }
    .covers .play-icon, .covers .avatar-icon {
      width: 60px;
      height: 60px;
      line-height: 60px;
      font-size: 60px;
      user-select: none;
    }
    .cover {
      background-size: cover;
    