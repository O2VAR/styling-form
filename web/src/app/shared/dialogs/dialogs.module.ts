import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@app/shared/material/material.module';
import {FormsModule} from '@angular/forms';
import {ConfirmComponent} from './confirm.component';
import {DetailsComponent} from './details.component';
import {FolderComponent} from './folder/folder.component';
import {PlaylistsDialogComponent} from './playlists-dialog.component';
import {NewPlaylistDialogComponent} from '@app/shared/dialogs/new-playlist-dialog.component';
import {InfoComponent} from '@app/shared/dialogs/info.component';

export const COMPONENTS = [
  ConfirmComponent,
  DetailsComponent,
  FolderComponen