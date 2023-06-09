
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';

import {SharedModule} from '@app/shared/shared.module';

import {CoreComponent} from './core.component';
import {AboutComponent} from './components/about.component';
import {SideMenuComponent} from './components/sidemenu.component';
import {SidenavComponent} from './components/sidenav.component';
import {ToolbarComponent} from './components/toolbar.component';

import {LoaderService} from './services/loader.service';
import {HttpSocketClientService} from './services/http-socket-client.service';
import {AudioService} from './services/audio.service';

import {CoreEffects} from './core.effects';
import {InitializerComponent} from '@app/core/components/initializer.component';
import {UpdateService} from '@app/core/services/update.service';
import {RouterService} from '@app/core/services/router.service';
import {ElectronService} from '@app/core/services/electron.service';
import {CoreService} from '@app/core/services/core.service';
import {StoreModule} from '@ngrx/store';
import {reducers} from '@app/core/core.reducers';

export const COMPONENTS = [
  CoreComponent,
  AboutComponent,
  SideMenuComponent,
  SidenavComponent,
  ToolbarComponent,
  InitializerComponent
];

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('core', reducers),
    EffectsModule.forFeature([CoreEffects]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    CoreService,
    HttpSocketClientService,
    LoaderService,
    AudioService,
    UpdateService,
    RouterService,
    ElectronService
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}