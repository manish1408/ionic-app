import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './shared.service';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class GenericService {

    httpOptions = {};

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private sharedService: SharedService,
        private apiService: ApiService
    ) { }

    getCountryCode(): Observable<any> {
        const formData: FormData = new FormData();
        const url = environment.apiURL + '/generic/get-country-code';
        return this.http
            .post(url, formData, this.httpOptions)
            .pipe(map((response: any) => response));
    }

    setSupportRequest(type: string, value: string): Observable<any> {
        const params: FormData = new FormData();
        params.append('type', type);
        params.append('value', value);
        return this.apiService.postForm('generic/set-support-request', params, {}, true);
    }

    setFeedback(value: string): Observable<any> {
        const params: FormData = new FormData();
        params.append('value', value);
        return this.apiService.postForm('generic/set-feedback', params, {}, true);
    }
}
