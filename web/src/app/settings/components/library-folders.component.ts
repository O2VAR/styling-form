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
      <mat-list-item *ngIf="loading">
        <mat-spinner mat-list-icon [diameter]="24"></mat-spinner>
        <span matLine>Loading...</span>
      </mat-list-item>
    </mat-list>
    <button mat-button tabindex="0" (click)="addFolder.emit()">
      <mat-icon mat-list-icon>create_new_folder</mat-icon>
      <span matLine