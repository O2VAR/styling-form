import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

// TODO refactor with app-progress
@Component({
  selector: 'app-player-progress',
  template: `
    <div class="progress">
      <span class="time-elapsed">{{ currentTime ? (currentTime | sgTime) : '00:00' }}</span>
      <mat-progress-ba