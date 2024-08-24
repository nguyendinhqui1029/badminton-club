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