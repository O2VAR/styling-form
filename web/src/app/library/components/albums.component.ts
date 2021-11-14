
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';

import {Album} from '@app/model';

import {SettingsService} from '@app/settings/services/settings.service';
import {LibraryService} from '@app/library/services/library.service';
import {DisplayType} from '@app/library/library.component';

@Component({
  selector: 'app-albums',
  template: `
    <div class="wrapper">

      <app-chips [hidden]="!showChipList"
                 [list]="selectedAlbums"
                 displayProperty="title"
                 (clickedElement)="scrollTo($event.title); showChipList = false;"
                 (removedAll)="deselectAll()"
                 (removedElement)="deselect($event)">
      </app-chips>

      <app-controls [(search)]="search"
                    [searchPlaceholder]="'Search an album'"
                    [backButton]="true"
                    (backClicked)="previous.emit()">
        <span class="select-text" *ngIf="selectedAlbums.length == 0">
          Select an album or
          <mat-chip class="select-all" (click)="selectAll()">Select All</mat-chip>
        </span>
        <mat-chip-list *ngIf="selectedAlbums.length > 0">
          <mat-chip *ngFor="let album of selectedAlbums.length <= 2 ? selectedAlbums : selectedAlbums.slice(0,1)"
                    (click)="scrollTo(album.title)">
            <span class="chip-text" [matTooltip]="album.title">{{ album.title }}</span>
            <mat-icon matChipRemove (click)="deselect(album)">cancel</mat-icon>
          </mat-chip>
          <mat-chip *ngIf="selectedAlbums.length > 2"
                    (click)="showChipList = !showChipList"
                    class="chip-more">
            <span class="chip-text">{{ showChipList ? "Close" : (selectedAlbums.length - 1) + " more…" }}</span>
          </mat-chip>
        </mat-chip-list>
      </app-controls>

      <div #list class="list-wrapper" (swiperight)="previous.emit()" (swipeleft)="next.emit()">
        <mat-list class="list" dense>
          <app-list-item *ngFor="let album of filteredAlbums; trackBy: trackByTitle"
                         [selected]="isSelected(album) | async"
                         [avatarStyle]="getAvatarStyle(album)"
                         [primaryHTML]="album.title | sgSearch:search"
                         [secondaryHTML]="getSecondaryHTML(album)"
                         [tooltip]="album.title"
                         (click)="selectOnly(album); next.emit()"
                         (arrowClicked)="select(album); next.emit()"
                         (checked)="$event ? select(album) : deselect(album)">
          </app-list-item>
        </mat-list>
      </div>

      <app-dictionary (letterClicked)="scrollTo($event)"></app-dictionary>

    </div>
  `,
  styles: [`
    .wrapper {
      padding-top: 60px;
      height: 100%;
      box-sizing: border-box;
    }
    .list-wrapper {
      overflow-y: scroll;
      height: 100%;
    }
    .list {
      padding-top: 0;
      padding-right: 1rem;
    }
    .select-text {
      font-weight: 300;
    }
    .select-text mat-chip {
      vertical-align: middle;
    }
    mat-chip-list {
      width: 100%;
    }
    mat-chip {
      cursor: pointer;
      font-size: 12px;
      max-width: calc(50% - 27px);
      white-space: nowrap;
    }
    mat-chip:only-child {
      max-width: 100%;
    }
    .chip-text {
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnChanges {