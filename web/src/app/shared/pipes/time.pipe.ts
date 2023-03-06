import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sgTime'
})
export class TimePipe implements PipeTransform {

  transform(value: number): string {

    const hours = Math.floor(value / 3600);
    const minutes = Math.fl