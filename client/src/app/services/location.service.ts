import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { LocationRequestParams, LocationResponseValue } from '@app/models/location.model';
import { getUserLocation } from '@app/utils/common.util';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http: HttpClient = inject(HttpClient);
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  getLocationNearby(requestParams: LocationRequestParams): Observable<ApiResponseValue<LocationResponseValue[]>> {
    const params = new HttpParams().set('keyword', requestParams.keyword)
      .set('latitude', requestParams.latitude || 0)
      .set('longitude', requestParams.longitude || 0);
    return this.http.get<ApiResponseValue<LocationResponseValue[]>>(`${environment.apiUrl}/api/v1/location/nearby`, { params });
  }

  openDatabase(): Observable<IDBDatabase> {
    const DB_NAME = 'userInfo';
    const DB_VERSION = 1;
    return new Observable<IDBDatabase>((subscriber) => {
      if (!this.isBrowser || !window.indexedDB) {
        console.error("Your browser doesn't support IndexedDB.");
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('coordinates')) {
          db.createObjectStore('coordinates', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        subscriber.next(db);
        subscriber.complete();
      };

      request.onerror = (event: Event) => {
        subscriber.error((event.target as IDBOpenDBRequest).error);
      };
    });
  }
  addCoordinateToIndexDB(db: IDBDatabase, coordinates: { id: number, longitude: number, latitude: number, date: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('coordinates', 'readwrite');
      const store = transaction.objectStore('coordinates');
      const request = store.add(coordinates);

      request.onsuccess = () => resolve();
      request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
  }
  getAllCoordinatesFromIndexDB(db: IDBDatabase): Promise<{ id: number, longitude: number, latitude: number, date: number }[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('coordinates', 'readonly');
      const store = transaction.objectStore('coordinates');
      const request = store.getAll();

      request.onsuccess = (event: Event) => {
        resolve((event.target as IDBRequest).result as { id: number, longitude: number, latitude: number, date: number }[]);
      };

      request.onerror = (event: Event) => reject((event.target as IDBRequest).error);
    });
  }
  saveUserLocationWhenOffLine() {
    if (navigator.onLine) {
      console.log("Có mạng");
    } else {
      console.log("Ko Có mạng");
      this.openDatabase().subscribe(db => {
        getUserLocation(async (position: GeolocationPosition) => {
          const date = new Date();
          await this.addCoordinateToIndexDB(db, { id: new Date().getTime(), longitude: position.coords.longitude, latitude: position.coords.latitude, date: date.getTime() });
        });
      })
    }
  }
}