import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {LyricsOptions} from '@app/model';

@Component({
  selector: 'app-lyrics-options',
  template: `
    <p>
      <mat-sli