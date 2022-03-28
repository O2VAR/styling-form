import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Track} from '@app/model';
import {SelectionModel} from '@angular/cdk/collections';
import {CoreUtils} from '@app/core/core.utils';
import {MatTable} from '@angular/material';

@Component({
  selector: 'app-player-playlist',
  template: `
    <em *ngIf="playlist.length === 0" class="empty">Playlist is empty</em>
    <mat-table [dataSource]="playlist" #table>

      <ng-cont