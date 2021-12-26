import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: `app-list-item`,
  template: `
    <a class="list-item hover" mat-list-item>

      <mat-checkbox matListIcon
                    color="primary"
                 