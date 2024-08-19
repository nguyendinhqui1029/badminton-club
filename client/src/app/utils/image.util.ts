import { imageOrientation } from "@app/constants/common.constant";
import { Observable } from "rxjs/internal/Observable";

export function getImageOrientation(url: string): Observable<{ url: string, orientation: string }> {
  return new Observable(observer => {
    const img = new Image();
    img.onload = () => {
      const orientation = img.width > img.height ? imageOrientation.LANDSCAPE : imageOrientation.PORTRAIT;
      observer.next({ url, orientation });
      observer.complete();
    };
    img.onerror = () => {
      observer.error('Failed to load image.');
    };
    img.src = url;
  });
}