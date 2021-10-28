import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class CMSService {

    constructor(
        private cookieService: CookieService,
        private http: HttpClient
    ) { }

    getSupport(): Observable<any> {
        const url =
            'https://cloud.squidex.io/api/content/signalled/support?$orderby=created asc';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }

    getFaq(): Observable<any> {
        const url =
            'https://cloud.squidex.io/api/content/signalled/faq?$orderby=created asc';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }

    getPrivacy(): Observable<any> {
        const url =
            'https://cloud.squidex.io/api/content/signalled/privacy';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }

    getTerms(): Observable<any> {
        const url = 'https://cloud.squidex.io/api/content/signalled/terms/';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }

    getWarnings(): Observable<any> {
        const url = 'https://cloud.squidex.io/api/content/signalled/warnings/';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }

    getHomeTops(): Observable<any> {
        const url =
            'https://cloud.squidex.io/api/content/signalled/home-tops?$orderby=created asc';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }

    getHelp(): Observable<any> {
        const url = 'https://cloud.squidex.io/api/content/signalled/help/';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }

    getAdvantages(): Observable<any> {
        const url = 'https://cloud.squidex.io/api/content/signalled/advantages/';

        return this.http
            .get<string>(url)
            .pipe(map((response: any) => response));
    }
}
