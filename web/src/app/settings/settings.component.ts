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
  