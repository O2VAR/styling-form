import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-initializer',
  template: `
    <div class="app-loader" *ngIf="initializing">
      <mat-spinner [diameter]="50" *ngIf="!hasErrors"></mat-spinner>
      <mat-icon class="error-icon" color="warn" *ngIf="hasErrors">error_outline</mat-icon>
      <span>{{ initializingLog }}</span>
      <span *ngIf="hasErrors" class="retry" (click)="retry.emit()">Retry</span>
      <span *ngIf="!hasErrors" class="filler">&nbsp;</span>
    </div>
  `,
  styles: [`
    :host-context(.electron) .app-loader {
      top: 34px;
    }
    .app-loader {
      position: absolute;
      left: 0;
      r