
import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Track} from '@app/model';
import {Sort} from '@angular/material';
import {PageEvent} from '@angular/material/paginator/typings/paginator';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-my-music-tracks',
  template: `
    <div class="controls">
      <a class="play-all">
        <mat-icon>shuffle</mat-icon>
        Play all randomly ({{ tracks.length }})
      </a>
      <div class="filler"></div>
      <mat-form-field floatLabel="never" class="search">
        <input matInput title="Search" [(ngModel)]="search" spellcheck="false">
        <mat-placeholder>
          <mat-icon class="search-icon">search</mat-icon>
          Search
        </mat-placeholder>
        <button mat-button *ngIf="search" matSuffix mat-icon-button aria-label="Clear" (click)="search=''">
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>
    </div>

    <mat-table [dataSource]="paginatedTracks" matSort (matSortChange)="sortState = $event">

      <ng-container matColumnDef="select">
        <mat-header-cell *matHeaderCellDef>
          <mat-checkbox (change)="$event ? masterToggle() : null"
                        [checked]="selection.hasValue() && isAllSelected()"
                        [indeterminate]="selection.hasValue() && !isAllSelected()"
                        color="primary">
          </mat-checkbox>
        </mat-header-cell>
        <mat-cell *matCellDef="let row">
          <mat-checkbox (click)="$event.stopPropagation()"
                        (change)="$event ? selection.toggle(row) : null"
                        [checked]="selection.isSelected(row)"
                        color="primary">
          </mat-checkbox>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="title">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Title</mat-header-cell>
        <mat-cell *matCellDef="let track">{{ track.title }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="artist">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Artist</mat-header-cell>
        <mat-cell *matCellDef="let track">{{ track.albumArtist }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="album">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Album</mat-header-cell>
        <mat-cell *matCellDef="let track">{{ track.album }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="year">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Year</mat-header-cell>
        <mat-cell *matCellDef="let track">{{ track.year }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="duration">
        <mat-header-cell *matHeaderCellDef mat-sort-header>Duration</mat-header-cell>
        <mat-cell *matCellDef="let track">{{ track.duration | sgTime }}</mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="columns"></mat-header-row>

      <mat-row *matRowDef="let row; columns: columns;"></mat-row>

    </mat-table>
    <mat-paginator #paginator
                   [length]="filteredTracks.length"
                   [pageIndex]="0"
                   [pageSize]="500"
                   [pageSizeOptions]="[500, 1000, 2000]"
                   [showFirstLastButtons]="true"
                   (page)="pageEvent = $event">
    </mat-paginator>
  `,
  styles: [`
    .controls {
      padding: 0 1rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }
    .play-all {
      margin: 1rem 0
    }
    .play-all mat-icon {
      vertical-align: middle;
      margin-right: 0.2rem;
    }
    .filler {
      flex-grow: 1;
    }
    .search {
      min-width: 13rem;
    }
    mat-table {
      background: unset !important;
    }
    mat-row, mat-header-row {