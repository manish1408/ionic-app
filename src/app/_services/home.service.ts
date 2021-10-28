import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PagingResponse, ServerResponse } from '../_models/server-response';
import { UserModel } from '../_models/userModel';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    constructor(private apiService: ApiService) { }

    getNewSignalsCount(): Observable<ServerResponse<Number>> {
        return this.apiService.get<ServerResponse<Number>>('home/new-signals-count');
    }

    getSuperSignalsCount(): Observable<ServerResponse<Number>> {
        return this.apiService.get<ServerResponse<Number>>('home/super-signals-count');
    }

    getNewTradersCount(): Observable<ServerResponse<Number>> {
        return this.apiService.get<ServerResponse<Number>>('home/new-traders-count');
    }

    getMonitoredSignalsCount(): Observable<ServerResponse<Number>> {
        return this.apiService.get<ServerResponse<Number>>('home/monitored-signals-count');
    }

    getSoldSignalsCount(): Observable<ServerResponse<Number>> {
        return this.apiService.get<ServerResponse<Number>>('home/sold-signals-count');
    }

    getSoldSubscriptionCount(): Observable<ServerResponse<Number>> {
        return this.apiService.get<ServerResponse<Number>>('home/sold-subscriptions-count');
    }
}
