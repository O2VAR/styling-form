import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-confirm',
  template: `
    <h3 mat-dialog-title>{{ data.title }}</h3>
    <div mat-dialog-content class="ma