import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { LocationRequestParams, LocationResponseValue } from '@app/models/location.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private http: HttpClient = inject(HttpClient);
    getLocationNearby(requestParams: LocationRequestParams): Observable<ApiResponseValue<LocationResponseValue[]>> {
        const params = new HttpParams().set('keyword', requestParams.keyword)
        .set('latitude', requestParams.latitude || 0 )
        .set('longitude', requestParams.longitude || 0);
        return this.http.get<ApiResponseValue<LocationResponseValue[]>>(`${environment.apiUrl}/api/v1/location/nearby`,{params });
    }
}