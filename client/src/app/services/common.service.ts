import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { SearchByKeywordResponseValue } from '@app/models/common.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private http: HttpClient = inject(HttpClient);
  searchByKeyword(keyword: string): Observable<ApiResponseValue<SearchByKeywordResponseValue[]>> {
    const params = new HttpParams().set('query', keyword);
    return this.http.get<ApiResponseValue<SearchByKeywordResponseValue[]>>(`${environment.apiUrl}/api/v1/common/search`, { params });
  }
}