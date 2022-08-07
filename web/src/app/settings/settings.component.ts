import {ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatSlideToggleChange, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {map, share} from 'rxjs/operators';

import {FolderComponent} from '../shared/dialogs/folder/folder.component';
import {HttpSocketClientService} from '../core/services/http-socket-client.service';
import {SettingsService} from './services/settings.service';
import {ConfirmComponent} from '../shared/dialogs/confirm.component';
import {environment} from '@env/environment';
import {CoreUtils, Theme} from '../core/core.utils';
import {ElectronService} from '@app/core/services/electron.service';
import {CoreService} from '@app/core/se