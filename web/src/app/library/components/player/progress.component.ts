import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-progress',
  template: `
    <div class="progress">
      <span class="time-elapsed">{{ currentTime ? (currentTime | sgTime) : '00:00' }}</span>
      <mat-progress-bar
        *ngIf="loading"
        mode="indeterminate"></mat-progress-bar>
  