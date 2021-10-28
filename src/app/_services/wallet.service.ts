import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PagingResponse, ServerResponse } from '../_models/server-response';
import { UserModel } from '../_models/userModel';

@Injectable({
    providedIn: 'root'
})
export class WalletService {

    constructor(private apiService: ApiService) { }

    getBalance(): Observable<ServerResponse<number>> {
        return this.apiService.get<ServerResponse<number>>('wallet/balance');
    }
}
