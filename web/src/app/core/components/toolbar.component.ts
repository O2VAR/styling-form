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
              (click)="i