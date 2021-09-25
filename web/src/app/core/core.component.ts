
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {environment} from '@env/environment';

import {LoaderService} from './services/loader.service';
import {UpdateService} from './services/update.service';
import {AudioService} from './services/audio.service';
import {ElectronService} from './services/electron.service';

import {CoreUtils, Theme} from './core.utils';

import * as fromCore from '@app/core/core.reducers';

// TODO dependency on settings, refactor
import {SetLyricsOptions} from '@app/settings/settings.actions';
import {getLyricsOptions} from '@app/settings/settings.reducers';
import {SetAudioVolume} from '@app/core/actions/audio.actions';
import {ChangeTheme, CloseSidenav, ToggleSidenav} from '@app/core/actions/core.actions';

@Component({
  selector: 'app-root',
  template: `
    <div ngClass="mat-typography main-wrapper"
         [class]="currentThemeCssClass$ | async"
         [class.focused]="isElectronFocused"
         [class.electron]="isElectron">

      <app-initializer [initializing]="initializing$ | async"
                       [initializingLog]="logs$ | async"
                       [hasErrors]="hasErrors$ | async"
                       (retry)="initialize()">
      </app-initializer>

      <app-toolbar [sideNavOpened]="showSidenav$ | async"
                   [themes]="featuredThemes"
                   [currentTheme]="currentTheme$ | async"
                   [isElectron]="isElectron"
                   [isMaximized]="isMaximized"
                   [showInstallPrompt]="installPromptEvent !== null"
                   [isPlaying]="isPlaying$ | async"
                   (closeWindow)="closeWindow()"
                   (maximizeWindow)="maximizeWindow()"
                   (minimizeWindow)="minimizeWindow()"
                   (unmaximizeWindow)="unmaximizeWindow()"
                   (changeTheme)="changeTheme($event)"
                   (toggleSidenav)="toggleSidenav()"
                   (install)="install()"
                   (play)="play()"
                   (pause)="pause()">
      </app-toolbar>
      <ng-container *ngIf="getLoading() | async; let loading">
        <mat-progress-bar class="main-loader"
                          [value]="loading * 100"
                          [mode]="loading > 0 ? 'determinate' : 'indeterminate'"
                          [class.show]="loading !== 0">
        </mat-progress-bar>
      </ng-container>
      <app-side-menu [sideNavOpened]="showSidenav$ | async"
                     (closeSidenav)="closeSidenav()"
                     (toggleSidenav)="toggleSidenav()">
      </app-side-menu>

      <mat-sidenav-container (backdropClick)="closeSidenav()">

        <mat-sidenav [opened]="showSidenav$ | async" [mode]="'over'">
          <app-side-nav (closeSidenav)="closeSidenav()"></app-side-nav>
        </mat-sidenav>

        <router-outlet></router-outlet>

      </mat-sidenav-container>

    </div>
  `,
  styles: [`
    .main-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100vh; /* 100vh TODO figure out the issue with player menu */
      min-height: 450px;
      box-sizing: border-box;
    }
    .main-loader {
      position: absolute;
      z-index: 3;
      height: 3px;
      top: 50px;
      display: none;
    }
    .main-loader.show {
      display: inline-block;
    }
    .electron .main-loader {
      top: 34px;
    }
    mat-sidenav-container {
      height: 100%;
    }
    mat-sidenav {
      width: 250px;
    }
    @media screen and (min-width: 599px){
      mat-sidenav-container {
        padding-left: 44px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreComponent implements OnInit {

  showSidenav$: Observable<boolean>;
  currentTheme$: Observable<Theme>;
  currentThemeCssClass$: Observable<string>;

  isElectron = environment.electron;