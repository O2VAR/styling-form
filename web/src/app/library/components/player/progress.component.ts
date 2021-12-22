import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-progress',
  template: `
    <div class="progress">
      <span class="time-elapsed">{{ currentTime ? (currentTime | sgTime) : '00:00' }}</span>
      <mat-progress-bar
        *ngIf="loading"
        mode="indeterminate"></mat-progress-bar>
      <mat-slider
        *ngIf="!loading"
        color="primary"
        [step]="1"
        [disabled]="!duration"
        [max]="duration"
        [value]="currentTime"
        (change)="seekTo.emit($event.value)"></mat-slider>
      <span class="time-total">{{ duration ? (duration | sgTime) : '00:00' }}</span