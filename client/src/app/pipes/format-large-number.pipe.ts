import { Pipe, PipeTransform } from '@angular/core';
import { formatLargeNumber } from '@app/utils/common.util';

@Pipe({
  name: 'formatLargeNumber',
  standalone: true
})
export class FormatLargeNumberPipe implements PipeTransform {

  transform(value: number): string {
    return formatLargeNumber(value);
  }
}
