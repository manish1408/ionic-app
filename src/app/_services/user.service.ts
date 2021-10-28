import { UserModel } from './../_models/userModel';
import { SharedService } from 'src/app/_services/shared.service';
import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    httpOptions = {};

    constructor(
        private cookieService: CookieService,
        private http: HttpClient,
        private sharedService: SharedService
    ) { }

    get(): Observable<any> {
        const params: FormData = new FormData();
        return this.http.post(environment.apiURL + 'user/get', params, this.httpOptions).pipe(
            map((response: any) => {
                const ret = response;
                if (ret) {
                    return ret;
                } else {
                    console.log('error');
                }
            })
        );
    }

    getUser(token: string): Observable<any> {
        const params: FormData = new FormData();

        const httpOptionsCustom = {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token,
            }),
        };

        console.log(token);

        return this.http.post(environment.apiURL + 'user/get', params, httpOptionsCustom).pipe(
            map((response: any) => {
                const ret = response;
                if (ret) {
                    return ret;
                } else {
                    console.log('error');
                }
            })
        );
    }

    isUsernameAvailable(username: string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('username', username);
        return this.http.post(environment.apiURL + 'user/is-username-available', formData, this.httpOptions).pipe(
            map((response: any) => {
                const ret = response;
                if (ret) {
                    return ret;
                } else {
                    console.log('error');
                }
            })
        );
    }

    update(user: UserModel): Observable<any> {
        const params: FormData = new FormData();
        return this.http.post(environment.apiURL + 'user/update', user, this.httpOptions).pipe(
            map((response: any) => {
                const ret = response;
                if (ret) {
                    return ret;
                }
            })
        );
    }

    updateLight(firstName: string, lastName: string, username: string): Observable<any> {
        const params: FormData = new FormData();
        params.append('firstName', firstName);
        params.append('lastName', lastName);
        params.append('username', username);
        return this.http.post(environment.apiURL + 'user/update-light', params, this.httpOptions).pipe(
            map((response: any) => {
                const ret = response;
                if (ret) {
                    return ret;
                }
            })
        );
    }

    updatePicture(image: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', image);
        return this.http.post(environment.apiURL + 'user/upload-picture', formData, this.httpOptions).pipe(
            map((response: any) => {
                const ret = response;
                if (ret) {
                    return ret;
                } else {
                    console.log('error');
                }
            })
        );
    }

    getById(userId: string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('userId', userId);
        return this.http.post(environment.apiURL + 'user/get-by-id', formData, this.httpOptions).pipe(
            map((response: any) => {
                const ret = response;
                if (ret) {
                    return ret;
                } else {
                    console.log('error');
                }
            })
        );
    }

}
