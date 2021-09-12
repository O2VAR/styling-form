import {Data, ParamMap, RouterStateSnapshot} from '@angular/router';
import {RouterStateSerializer} from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: ParamMap;
  queryParams: ParamMap;
  data: Data;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapsh