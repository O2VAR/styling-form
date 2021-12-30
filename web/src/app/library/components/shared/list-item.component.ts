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

      <div matLine class="primary-text">
        <mat-icon class="warn" *ngIf="warn" color="warn" matTooltip="Unset tags!">warning</mat-icon>
        <span class="item-name" [innerHtml]="primaryHTML" [matTooltip]="tooltip"></span>
      </div>

      <div matLine class="secondary-text" [innerHtml]="secondaryHTML"></div>

      <button mat-button mat-icon-button (click)="arrowClicked.emit(); $event.stopPropagation()">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>

      <mat-divider></mat-divider>

    </a>
  `,
  styles: [`
    .list-item {
      cursor: pointer;
      text-decoration