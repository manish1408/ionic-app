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
export class SignalService {

    constructor(private apiService: ApiService, private httpClient: HttpClient) { }

    sell(model): Observable<ServerResponse<any>> {
        var fd = new FormData();
        Object.keys(model).forEach(key => {
            if (key === 'documents') {
                model[key].forEach(k => {
                    fd.append(key, k);
                });
            } else if (key === 'price') {
                fd.append('price.value', model[key].value);
            } else if (model[key]) {
                fd.append(key, model[key]);
            }
        });

        return this.httpClient.post<ServerResponse<any>>(environment.apiURL + '/signal/sell', fd);
    }

    update(signalId, model): Observable<ServerResponse<any>> {
        var fd = new FormData();
        Object.keys(model).forEach(key => {
            if (key === 'documents') {
                model[key].forEach(k => {
                    fd.append(key, k);
                });
            } else if (key === 'price') {
                fd.append('price.value', model[key].value);
            } else if (model[key]) {
                fd.append(key, model[key]);
            }
        });

        return this.httpClient.put<ServerResponse<any>>(environment.apiURL + '/signal/' + signalId, fd);
    }

    get(params: any): Observable<PagingResponse<any>> {
        return this.apiService.getByParams(`signal/get-all`, params);
    }

    hasPurchased(id): Observable<ServerResponse<boolean>> {
        return this.apiService.get(`signal/${id}/has-purchased`);
    }

    getDetail(signalId: string): Observable<ServerResponse<any>> {
        return this.apiService.get(`signal/${signalId}`);
    }

    getPricing(signalId: string): Observable<ServerResponse<any>> {
        return this.apiService.get(`signal/${signalId}/get-pricing`);
    }

    comment(model: any): Observable<ServerResponse<any>> {
        return this.apiService.post(`signal/comment`, model);
    }

    favorite(id: any): Observable<ServerResponse<any>> {
        return this.apiService.put(`signal/${id}/favorite`);
    }

    unfavorite(id: any): Observable<ServerResponse<any>> {
        return this.apiService.put(`signal/${id}/unfavorite`);
    }

    activate(id: any): Observable<ServerResponse<any>> {
        return this.apiService.put(`signal/${id}/activate`);
    }

    deactive(id: any): Observable<ServerResponse<any>> {
        return this.apiService.put(`signal/${id}/deactive`);
    }

    delete(id: any): Observable<ServerResponse<any>> {
        return this.apiService.delete(`signal/${id}`);
    }

    purchase(id: any): Observable<ServerResponse<any>> {
        return this.apiService.post(`purchase/signal/${id}`);
    }

    rate(id: any, rating): Observable<ServerResponse<any>> {
        return this.apiService.putForm(`signal/${id}/rate`, { value: rating });
    }
}
