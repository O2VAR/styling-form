import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {MatDialog} from '@angular/material';
import {ConfirmComponent} from '@app/shared/dialogs/confirm.component';

@Injectable()
export class UpdateService {

  constructor(private updates: SwUpdate, private dialog: MatDialog) {}

  initialize(): void {
    this.updates.available.subscribe(event => {
      // console.log('current version 