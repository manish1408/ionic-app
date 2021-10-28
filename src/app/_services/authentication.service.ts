import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from './shared.service';
import { UserModel } from '../_models/userModel';
import { get, set } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  httpOptions = {};

  private user: UserModel;
  _userDetails$: Subject<any> = new Subject();

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  initialize(): Observable<any> {
    const formData: FormData = new FormData();
    return this.http.post(environment.apiURL + '/authentication/initialize', formData).pipe(
      map((response: any) => {
        const ret = response;
        if (ret) {
          return ret;
        }
      })
    );
  }

  validate(value: string, mode: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('value', value);
    formData.append('mode', mode);
    return this.http.post(environment.apiURL + '/authentication/validate', formData).pipe(
      map((response: any) => {
        const ret = response;
        if (ret) {
          return ret;
        }
      })
    );
  }

  signin(value: string, code: string, mode: string): Observable<any> {
    const params: FormData = new FormData();
    params.append('value', value);
    params.append('code', code);
    params.append('mode', mode);
    return this.http.post(environment.apiURL + '/authentication/signin', params).pipe(
      map((response: any) => {
        const ret = response;
        if (ret) {
          return ret;
        }
      })
    );
  }

  register(payload) {
    return this.http.post(environment.apiURL + '/authentication/register', payload).pipe(
      map((response: any) => {
        const ret = response;
        if (ret) {
          return ret;
        }
      })
    );
  }

  isSignedIn() {
    const token = this.cookieService.get('token');
    return !!token;
  }

  async setUserDetails$(user) {
    await set('SGNL_USER', JSON.stringify(user));
    this.user = user;
    this._userDetails$.next(user);
  }

  getUserDetails$() {
    if (this.user == null) {
      return this._userDetails$.asObservable();
    } else {
      this._userDetails$.next(this.user);
      return this._userDetails$.asObservable();
    }
  }

  async getUser(): Promise<UserModel> {
    const userJSON = await get('SGNL_USER');

    if (userJSON) {
      return JSON.parse(userJSON) as UserModel;
    } else {
      return null;
    }
  }

  async isSellOnboarded(): Promise<boolean> {
    const user = await this.getUser();
    if (user && user.companyId) return true;
    return false;
  }

  async isOnboarded(): Promise<boolean> {
    const user = await this.getUser();
    if (user && user.isOnboarded) return true;
    return false;
  }
}
