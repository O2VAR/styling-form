import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-library-folders',
  template: `
    <mat-list>
      <mat-list-item class="hover" *ngFor="let folder of folders">
   