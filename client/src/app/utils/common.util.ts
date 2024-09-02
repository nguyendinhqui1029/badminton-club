import { WritableSignal } from "@angular/core";
import { interval, Subscription } from "rxjs";

export function startTimer(countdown: WritableSignal<number>, callback?: Function, waitFor15Second: number = 15): Subscription {
  const countdownSubscription: Subscription = interval(1000).subscribe((secondsElapsed) => {
    countdown.set(waitFor15Second - secondsElapsed - 1)

    if (countdown() <= 0) {
      callback?.();
      countdownSubscription && countdownSubscription.unsubscribe(); // Stop the timer
    }
  });
  return countdownSubscription;
}

export function formatLargeNumber(num: number) {
  const units = [
    { value: 1000000000000000, symbol: 'P' }, // Peta
    { value: 1000000000000, symbol: 'T' },    // Tera
    { value: 1000000000, symbol: 'B' },        // Billion
    { value: 1000000, symbol: 'M' },            // Million
    { value: 1000, symbol: 'K' }                  // Thousand
  ];

  if (num < 1000) {
    return num.toString();
  }

  for (const unit of units) {
    if (num >= unit.value) {
      return (num / unit.value).toFixed(1) + unit.symbol;
    }
  }
  return num?.toString() || '0';
}

export async function getUserLocation(callback: Function) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        callback(position);
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
    return;
  }
  console.error("Geolocation API is not supported in this browser.");
}