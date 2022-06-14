import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-library-folders',
  template: `
    <mat-list>
      <mat-list-item class="hover" *ngFor="let folder of folders">
        <mat-icon mat-list-icon>folder_open</mat-icon>
        <span matLine>{{ folder }}</span>
        <button class="close" mat-button mat-icon-button (click)="removeFolder.emit(folder)">
          <mat-icon>close</mat-icon>
        </button>
      </mat-list-item>
      <mat-list-item *ngIf="loadi