import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: `app-list-item`,
  template: `
    <a class="list-item hover" mat-list-item>

      <mat-checkbox matListIcon
                    color="primary"
                    [checked]="selected"
                    (change)="checked.emit($event.checked)"
                    (click)="$event.stopPropagation()">
      </mat-checkbox>

      <div matListAvatar class="avatar" [style]="avatarStyle">
        <mat-icon *ngIf="!avatarStyle">music_note</mat-icon>
      </div>

      <div ma