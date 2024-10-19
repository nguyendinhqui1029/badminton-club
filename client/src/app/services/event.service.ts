import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { EventRequestBody, EventResponseValue } from '@app/models/event.model';
import { PostRequestBody, PostResponseValue } from '@app/models/post.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private http: HttpClient = inject(HttpClient);
    
    createEvent(body: EventRequestBody): Observable<ApiResponseValue<EventResponseValue>> {
        return this.http.post<ApiResponseValue<EventResponseValue>>(`${environment.apiUrl}/api/v1/event`, body);
    }

    updateEvent(id:string,body: EventRequestBody): Observable<ApiResponseValue<EventResponseValue>> {
        return this.http.put<ApiResponseValue<EventResponseValue>>(`${environment.apiUrl}/api/v1/event/${id}`, body);
    }

    getEventById(id:string): Observable<ApiResponseValue<EventResponseValue>> {
        return this.http.get<ApiResponseValue<EventResponseValue>>(`${environment.apiUrl}/api/v1/event/${id}`);
    }

    getAllEvent(idUser:string): Observable<ApiResponseValue<EventResponseValue[]>> {
        return this.http.get<ApiResponseValue<EventResponseValue[]>>(`${environment.apiUrl}/api/v1/event/all/${idUser}`);
    }

    deleteEvent(id: string): Observable<ApiResponseValue<EventResponseValue>> {
        return this.http.delete<ApiResponseValue<EventResponseValue>>(`${environment.apiUrl}/api/v1/event/${id}`);
    }
}