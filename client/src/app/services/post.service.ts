import { HttpClient } from '@angular/common/http';
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
        return this.http.post<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/post`, body);
    }

    updatePost(id:string,body: PostRequestBody): Observable<ApiResponseValue<PostResponseValue>> {
        return this.http.put<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/post/${id}`, body);
    }

    getPostById(id:string): Observable<ApiResponseValue<PostResponseValue>> {
        return this.http.get<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/post/${id}`);
    }

    getAllPost(): Observable<ApiResponseValue<PostResponseValue[]>> {
        return this.http.get<ApiResponseValue<PostResponseValue[]>>(`${environment.apiUrl}/post`);
    }

    deletePost(id: string): Observable<ApiResponseValue<PostResponseValue>> {
        return this.http.delete<ApiResponseValue<PostResponseValue>>(`${environment.apiUrl}/post/${id}`);
    }
}