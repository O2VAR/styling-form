import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-initializer',
  template: `
    <div class="app-loader" *ngIf="initializing">
      <mat-spinner [diameter]="50" *ngIf="!hasErrors"></mat-spinner>
      <mat-icon class="error-icon" color="warn" *ngIf="hasErrors">error_outline</mat-icon>
      <span>{{ ini