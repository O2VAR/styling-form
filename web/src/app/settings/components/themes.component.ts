import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Theme} from '@app/core/core.utils';

@Component({
  selector: 'app-themes',
  template: `
    <mat-radio-group>
      <mat-radio-button *ngFor="let theme of themes"
                        [value]="theme.cssClass"
                        [checked]="currentTheme.cssClass === theme.cssClass"
                        (change)="changeTheme.emit(theme)"
                        color="primary">
        {{ theme.name }}
      </mat-radio-button>
    </mat-radio-group>
  `,
  styles: [`
    