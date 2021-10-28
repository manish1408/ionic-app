import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PagingResponse, ServerResponse } from '../_models/server-response';
import { UserModel } from '../_models/userModel';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(private apiService: ApiService, private httpClient: HttpClient) { }

    getUserProfile(userId): Observable<PagingResponse<any>> {
        return this.apiService.get(`profile/user/${userId}`);
    }

    getCompanyProfile(companyId): Observable<PagingResponse<any>> {
        return this.apiService.get(`profile/company/${companyId}`);
    }

    comment(model: any): Observable<ServerResponse<any>> {
        return this.apiService.post(`profile/user-comment`, model);
    }
}
