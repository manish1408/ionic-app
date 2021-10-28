import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PagingResponse, ServerResponse } from '../_models/server-response';
import { UserModel } from '../_models/userModel';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(private apiService: ApiService) { }

    get(): Observable<ServerResponse<UserModel>> {
        return this.apiService.get<ServerResponse<UserModel>>('account/me');
    }

    deleteAccount(): Observable<ServerResponse<UserModel>> {
        return this.apiService.delete('account');
    }

    getCompanyInfo(): Observable<ServerResponse<any>> {
        return this.apiService.get<ServerResponse<any>>('account/get-company');
    }

    getSubscription(): Observable<ServerResponse<any>> {
        return this.apiService.get<ServerResponse<any>>('account/get-subscription');
    }

    onBoardSell(model): Observable<ServerResponse<UserModel>> {
        return this.apiService.postForm('account/onboard-sell', model);
    }

    updateSubscription(model): Observable<ServerResponse<UserModel>> {
        return this.apiService.postForm('account/update-subscription', model);
    }

    update(model: any): Observable<ServerResponse<UserModel>> {
        return this.apiService.putForm<ServerResponse<UserModel>>('account', model);
    }

    updateNotifications(model: any): Observable<ServerResponse<any>> {
        return this.apiService.put('account/update-notification-settings', model);
    }

    updateCompany(model: any): Observable<ServerResponse<any>> {
        return this.apiService.put('account/update-company', model);
    }

    getCompliance(): Observable<ServerResponse<any>> {
        return this.apiService.get<ServerResponse<any>>('account/get-compliance');
    }

    updateCompliance(model: any): Observable<ServerResponse<any>> {
        return this.apiService.putForm('account/update-compliance', model);
    }

    submitAcknowledgement(): Observable<ServerResponse<any>> {
        return this.apiService.put('account/acknowledge');
    }

    deleteCompliancePhoto(id: any): Observable<ServerResponse<any>> {
        return this.apiService.delete(`account/${id}/compliance-photo`);
    }

    deleteComplianceDocument(id: any): Observable<ServerResponse<any>> {
        return this.apiService.delete(`account/${id}/compliance-document`);
    }

    onboardSell(model): Observable<ServerResponse<UserModel>> {
        return this.apiService.postForm('account/onboard-sell', model);
    }

    onboard(model): Observable<ServerResponse<UserModel>> {
        var fd = new FormData();
        Object.keys(model).forEach(key => {
            fd.append(key, model[key]);
        });

        return this.apiService.postForm('account/onboard', fd, {}, true);
    }

    isUsernameAvailable(username: string): Observable<ServerResponse<boolean>> {
        const params: FormData = new FormData();
        params.append('username', username);
        return this.apiService.postForm('account/is-username-available', params, {}, true);
    }

    getNotifications(page: number, count: number): Observable<PagingResponse<any>> {
        return this.apiService.get(`account/notifications?count=${count}&page=${page}`);
    }

    invite(model): Observable<ServerResponse<UserModel>> {
        return this.apiService.postForm('invite/send', model);
    }

}
