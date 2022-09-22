import {ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatSlideToggleChange, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {map, share} from 'rxjs/operators';

import {FolderComponent} from '../shared/dialogs/folder/folder.component';
import {HttpSocketClientService} from '../core/services/http-socket-client.service';
import {SettingsService} from './services/settings.service';
import {ConfirmComponent} from '../shared/dialogs/confirm.component';
import {environment} from '@env/environment';
import {CoreUtils, Theme} from '../core/core.utils';
import {ElectronService} from '@app/core/services/electron.service';
import {CoreService} from '@app/core/services/core.service';
import {LyricsOptions} from '@app/model';
import {LibraryService} from '@app/library/services/library.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="wrapper">
      <div class="settings">
        <h2>Settings</h2>
        <mat-tab-group animationDuration="0ms">
          <mat-tab label="Library">
            <p>
              Specify which folders contain your music and make up your library.<br>
              Currently we are watching the following folder(s):
            </p>
            <app-library-folders [folders]="libraryFolders$ | async"
                                 [error]="error$ | async"
                                 [loading]="loading$ | async"
                                 (addFolder)="addFolderDialog()"
                                 (removeFolder)="removeFolderDialog($event)"
                                 (scanRequest)="requestLibraryScan()">
            </app-library-folders>
          </mat-tab>
          <mat-tab label="Theme">
            <app-themes [themes]="themes"
                        [currentTheme]="currentTheme$ | async"
                        (changeTheme)="changeTheme($event)">
            </app-themes>
          </mat-tab>
          <mat-tab label="Streaming" *ngIf="isElectron">
            <p>
              You can stream your music to your home devices on your local network by connecting to:
            </p>
            <div *ngIf="hostIps$ | async; let ips">
              <ul *ngIf="ips.length > 0">
                <li *ngFor="let ip of ips">
                  <a [href]="'http://' + ip + ':8080'" (click)="openExternally($event)" target="_blank">{{ 'http://' + ip + ':8080' }}</a>
                </li>
              </ul>
              <p *ngIf="ips.length === 0">No network connection detected.</p>
            </div>
            <div>
              <mat-slide-toggle (change)="toggleSleepPrevent($event)" color="primary">
                Prevent the system from going to sleep
              </mat-slide-toggle>
            </div>
          </mat-tab>
          <mat-tab label="Lyrics">
            <app-lyrics-options [lyricsOpts]="lyricsOpts$ | async"
                                (optionsChanged)="saveLyricsOptions($event)"
                                (linkClicked)="openExternally($event)">
            </app-lyrics-options>
          </mat-tab>
          <mat-tab label="Cache">
            <p>
              Musicalypse stores some data in a local cache.<br>
              If you experience any issue or want a clean slate you can clear your cache here.
            </p>
            <ul class="cache">
              <li>
                <mat-checkbox color="primary" [(ngModel)]="cache.favorites">Favorites</mat-checkbox>
              </li>
              <li>
                <mat-checkbox color="primary" [(ngModel)]="cache.recent">Recent tracks</mat-checkbox>
              </li>
              <li>
                <mat-checkbox color="primary" [(ngModel)]="cache.playlist">Current playlist</mat-checkbox>
              </li>
              <li>
                <mat-checkbox color="primary" [(ngModel)]="cache.playlists">Saved playlists</mat-checkbox>
              </li>
              <li>
                <mat-checkbox color="primary" [(ngModel)]="cache.theme">Theme</mat-checkbox>
              </li>
              <li>
                <mat-checkbox color="primary" [(ngModel)]="cache.player">Player (volume, shuffle, repeat)</mat-checkbox>
              </li>
            </ul>
            <button mat-button (click)="selectCacheAll()">
              Select all
            </button>
            <button mat-button
                    class="clear"
                    (click)="clearCache()"
                    [disabled]="!hasSelectedCacheOption()">
              Clear selected
            </button>
          </mat-tab>
          <mat-tab label="Metadata">
            <p>
              Musicalypse stores extracted covers and lyrics in separate files on disk.<br>
              If you want to delete those files, for instance if you have edited your covers using an external software, you can do it here.
            </p>
            <ul class="cache">
              <!--<li class="select-all-wrapper">
                <button mat-icon-button id="select-all-meta" (click)="selectMetadataAll()">
                  <mat-icon>select_all</mat-icon>
                </button>
                <label for="select-all-meta">Select all</label>
              </li>-->
              <li>
                <mat-checkbox color="primary" [(ngModel)]="metadata.covers">Covers</mat-checkbox>
              </li>
              <li>
                <mat-checkbox color="primary" [(ngModel)]="metadata.lyrics">Lyrics</mat-checkbox>
              </li>
            </ul>
            <button mat-button
                    class="clear"
                    (click)="clearMetadata()"
                    [disabled]="!hasSelectedMetadataOption()">
              Clear selected
            </button>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: flex;
      width: 100%;
      box-sizing: border-box;
    }
    .settings {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      max-width: 900px;
      width: 100%;
      padding: 0.5rem 1rem;
      box-sizing: border-box;
    }
    mat-spinner {
      margin-left: 0.5rem;
    }
    mat-divider {
      margin: 1rem 0;
    }
    .cache {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .cache li {
      list-style: none;
      padding-left: 1rem;
      margin-bottom: 1rem;
    }
    button.clear {
      max-width: 8rem;
    }
    @media screen and (max-width: 598px){
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {

  isElectron = environment.electron;

  themes = CoreUtils.allThemes;

  lyricsOpts$: Observable<LyricsOptions>;

  cache: {
    favorites: boolean,
    recent: boolean,
    playlist: boolean,
    playlists: boolean,
    theme: boolean,
    player: boolean
  } = {
    favorites: false,
    recent: false,
    playlist: false,
    playlists: false,
    theme: false,
    player: false
  };

  metadata: {
    covers: boolean,
    lyrics: boolean
  } = {
    covers: false,
    lyrics: false,
  };

  error$: Observable<string>;
  loading$: Observable<boolean>;
  libraryFolders$: Observable<string[]>;
  currentTheme$: Observable<Theme>;
  hostIps$: Ob