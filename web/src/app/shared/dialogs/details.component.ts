import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
// import {CoreUtils} from '@app/core/core.utils';

@Component({
  selector: 'app-details',
  template: `
    <h3 mat-dialog-title>Details of "{{ data.track.title }}"</h3>
    <div mat-dialog-content>
      <mat-grid-list cols="2" rowHeight="fit" gutterSize="1rem">
        <mat-grid-tile [colspan]="2">
  