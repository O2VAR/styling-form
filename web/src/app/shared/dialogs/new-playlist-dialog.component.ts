import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-playlist-dialog',
  template: `
    <h3 mat-dialog-title>New Playlist</h3>
    <div mat-dialog-content>
      <mat-form-field>
        <