import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {webSocket} from 'rxjs/webSocket';
import {concat, Observable, Subject} from 'rxjs';
import {filter, map, share, take} from 'rxjs/operators';

import {environment} from '@env/environment';
