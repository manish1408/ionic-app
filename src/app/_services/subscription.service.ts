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
export class SubscriptionService {

    constructor(private apiService: ApiService, private httpClient: HttpClient) { }

    get(params: any): Observable<PagingResponse<any>> {
        return this.apiService.getByParams(`subscription/get-all`, params);
    }

    getDetail(id: string): Observable<ServerResponse<any>> {
        return this.apiService.get(`subscription/${id}`);
    }

    purchase(id: any): Observable<ServerResponse<any>> {
        return this.apiService.post(`purchase/subscription/${id}`);
    }

    unsubscribe(id) {
        return this.apiService.delete(`purchase/subscription/${id}`);
    }

    hasPurchased(id): Observable<ServerResponse<boolean>> {
        return this.apiService.get(`subscription/${id}/has-purchased`);
    }
}
