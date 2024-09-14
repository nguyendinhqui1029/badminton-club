import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { CommentRequestBody, CommentResponseValue } from '@app/models/comment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http: HttpClient = inject(HttpClient);
  getAllCommentByIdPost(id: string): Observable<ApiResponseValue<CommentResponseValue[]>> {
    const params = new HttpParams().set('id', id)
    return this.http.get<ApiResponseValue<CommentResponseValue[]>>(`${environment.apiUrl}/api/v1/comment`, {params});
  }

  createComment(body: CommentRequestBody) {
    return this.http.post<ApiResponseValue<CommentResponseValue>>(`${environment.apiUrl}/api/v1/comment`, body);
  }
}