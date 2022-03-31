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

      <ng-container matColumnDef="select">
        <mat-cell *matCellDef="let row" class="select">
          <mat-checkbox (click)="$event.stopPropagation()"
                        (change)="$event ? selection.toggle(row) : null"
                        [checked]="selection.isSelected(row)"
                        color="primary">
          </mat-checkbox>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="title">
        <mat-cell *matCellDef="let track" class="title">
          <mat-icon class="equalizer" *ngIf="currentTrack ? currentTrack.url === track.url : false">equalizer</mat-icon>
          