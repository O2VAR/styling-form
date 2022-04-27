import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatDialog} from '@angular/material';
import {combineLatest, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import {Playlist} from '@app/model';
import {InfoComp