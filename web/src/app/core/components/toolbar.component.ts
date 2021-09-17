import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Theme} from '@app/core/core.utils';

@Component({
  selector: 'app-toolbar',
  template: `
    <mat-toolbar>
      <button mat-icon-button (click)="toggleSidenav.emit()" class="toggle">
        <mat-icon>{{ sideNavOpened ? 'close' : 'menu' }}</mat-icon>
      </button>
      <h1>
        <!--<img src="assets/logo_green_optimized.svg" alt="Logo" height="30">-->
        Musicalypse
      </h1>
      <div class="filler"></div>
      <button mat-button
              class="install-button"
              *ngIf="showInstallPrompt"
              (click)="install.emit()">
        <mat-icon>get_app</mat-icon>
        Install
      </button>
      <div class="micro-player" *ngIf="!isElectron">
        <button mat-icon-button *ngIf="isPlaying" (click)="pause.emit()">
          <mat-icon>pause</mat-icon>
        </button>
        <button mat-icon-button *ngIf="!isPlaying" (click)="play.emit()">
          <mat-icon>play_arrow</mat-icon>
        </button>
      </div>
      <div class="electron-buttons" *ngIf="isElectron">
        <mat-icon (click)="pause.emit()" *ngIf="isPlaying">pause</mat-icon>
        <mat-icon (click)="play.emit()" *ngI