import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { PostRequestBody, PostResponseValue } from '@app/models/post.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private http: HttpClient = inject(HttpClient);
    createPost(body: PostRequestBody): Observable<ApiResponseValue<PostResponseValue>> {
        return this.http.post<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/api/v1/post`, body);
    }

    updatePost(id:string,body: PostRequestBody): Observable<ApiResponseValue<PostResponseValue>> {
        return this.http.put<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/api/v1/post/${id}`, body);
    }

    getPostById(id:string): Observable<ApiResponseValue<PostResponseValue>> {
        return this.http.get<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/api/v1/post/${id}`);
    }

    getAllPost(idUser:string): Observable<ApiResponseValue<PostResponseValue[]>> {
        const params = new HttpParams().set('id', idUser);
        return this.http.get<ApiResponseValue<PostResponseValue[]>>(`${environment.apiUrl}/api/v1/post/all`, {params});
    }

    deletePost(id: string): Observable<ApiResponseValue<PostResponseValue>> {
        return this.http.delete<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/api/v1/post/${id}`);
    }
}