import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  apiUrl = environment.apiURL;

  get<T>(endpoint: string, options: object = {}): Observable<T> {
    if (endpoint.startsWith('./')) {
      return this.http.get<T>(`${endpoint}`, options).pipe(catchError(this.handleError));
    }

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, options).pipe(catchError(this.handleError));
  }

  getByParams<T>(endpoint: string, options: any): Observable<T> {
    if (endpoint.startsWith('./')) {
      return this.http.get<T>(`${endpoint}`, { params: options }).pipe(catchError(this.handleError));
    }

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params: options }).pipe(catchError(this.handleError));
  }

  post(endpoint: string, body: object = {}, options: object = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, body, options).pipe(catchError(this.handleError));
  }

  postForm<T>(endpoint: string, body: any, options: object = {}, isPayloadFd = false): Observable<any> {
    let fd = isPayloadFd ? body : this.jsonToFormData(body);
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, fd, options).pipe(catchError(this.handleError));
  }

  put(endpoint: string, body: object = {}, options: object = {}): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}`, body, options).pipe(catchError(this.handleError));
  }

  putForm<T>(endpoint: string, body: object = {}, options: object = {}): Observable<any> {
    let fd = this.jsonToFormData(body);
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, fd, options).pipe(catchError(this.handleError));
  }

  delete(endpoint: string, options: object = {}): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}`, options).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    //TODO: We will log the error here as well as in the generic handler
    return throwError(`There was an error calling our API. We have been informed of this. Please try again or contact ${environment.appName} support`);
  }

  jsonToFormData(model: any, form: FormData = null, namespace = ''): FormData {
    let formData = form || new FormData();
    let formKey = '';

    for (let propertyName in model) {

      if (!model.hasOwnProperty(propertyName) || !model[propertyName]) {
        continue;
      }

      let formKey = namespace ? `${namespace}.${propertyName}` : propertyName;

      if (model[propertyName] instanceof Date) {
        formData.append(formKey, model[propertyName].toISOString());
      } else if (model[propertyName] instanceof Array) {

        model[propertyName].forEach((element, index) => {

          if (typeof element !== 'object') {

            const tempFormKey = `${formKey}[${index}]`;

            formData.append(tempFormKey, element);

          } else {

            const tempFormKey = `${formKey}[${index}]`;

            this.jsonToFormData(element, formData, tempFormKey);
          }
        });

      }
      else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File)) {
        this.jsonToFormData(model[propertyName], formData, formKey);
      }
      else if (typeof model[propertyName] === 'object' && (model[propertyName] instanceof File)) {

        formData.append(formKey, model[propertyName]);
      }
      else {
        formData.append(formKey, model[propertyName]);
      }

    }
    return formData;
  }
}
