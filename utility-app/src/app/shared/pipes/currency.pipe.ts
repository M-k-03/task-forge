import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a number as currency with the ₹ symbol.
 *
 * Usage: {{ amount | appCurrency }}
 * Output: ₹1,250.00
 */
@Pipe({
  name: 'appCurrency',
  standalone: true,
})
export class AppCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined, symbol: string = '₹'): string {
    if (value === null || value === undefined) {
      return `${symbol}0.00`;
    }
    return `${symbol}${value.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
