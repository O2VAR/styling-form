import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Album, Artist} from '@app/model';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-my-music-artists',
  template: `
    <div class="controls">
      <a class="play-all">
        <mat-icon>shuffle</mat-icon>
        Play all randomly ({{ artists.length }})
      </a>
      <div class="filler"></div>
      <mat-form-field floatLabel="never" class="search">
        <input #searchInput matInput title="Search" [(ngModel)]="search" spellc