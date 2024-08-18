import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { ApiResponseValue } from '@app/models/api-response.model';
import { FileModel } from '@app/models/file-upload.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private http: HttpClient = inject(HttpClient);
    uploadFile(formDate: FormData): Observable<ApiResponseValue<FileModel[]>> {
        return this.http.post<ApiResponseValue<FileModel[]>>(`${environment.apiUrl}/files`,formDate);
    }

    removeFile(fileNames: string[]): Observable<ApiResponseValue<number>> {
        const paramsHeader = new HttpParams().set('fileNames', JSON.stringify(fileNames));
        return this.http.delete<ApiResponseValue<number>>(`${environment.apiUrl}/files`, {params: paramsHeader});
    }

    updateIsUsedFile(body: {fileNames: string[], isUse: boolean}): Observable<ApiResponseValue<number>> {
        return this.http.put<ApiResponseValue<number>>(`${environment.apiUrl}/files`, body);
    }
}