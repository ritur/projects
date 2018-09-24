import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
// const apiUrl = "/creditapi";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {

  }
  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

  private extractData(res: Response) {
    let body = res;

    return body || {};
  }

  getcredits(): Observable<any> {
    return this.http.get("/creditapi/image_credit", httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getuserdetail(): Observable<any> {
    return this.http.get("/edit_profile?user_id=5b3f3d6d9b57c643c885f5f7", httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  updateprofile(data): Observable<any> {

    return this.http.post("/edit_profile?user_id=5b3f3d6d9b57c643c885f5f7", JSON.stringify({ 'userData': data }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  authenticationService(data): Observable<any> {
    console.log(data)
    return this.http.get("/userapi/logInUser/" + data.emailId + "/" + data.password + "/" + data.remember, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  checkloginuser(): Observable<any> {
    return this.http.get("/userapi/session_check", httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));

  }
  processPayment(token, amount): Observable<any> {


    return this.http.post("/paymentapi/charge?user_id=5b51834cc4947b115cc2ea16", JSON.stringify({ 'token': token, 'amount': amount }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  processcreditPayment(_id, amount): Observable<any> {


    return this.http.post("/paymentapi/chargecard?user_id=5b51834cc4947b115cc2ea16", JSON.stringify({ 'custid': _id, 'amount': amount }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  checkactive(): Observable<any> {

    return this.http.get("/userapi/activation_check", httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));

  }
  resendemail(emailId): Observable<any> {

    return this.http.get("/userapi/resendMail?emailId=" + emailId, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));

  }
  logoutuser(): Observable<any> {
    return this.http.get("/userapi/logoutUser", httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  profileuser(): Observable<any> {
    return this.http.get("/userapi/userdetail", httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  // upload_profile(){

  // }

  creditpricequantity(id): Observable<any> {
    return this.http.get("/creditapi/crediprice?id=" + id, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  

  passwordchange(form): Observable<any> {
    return this.http.post("/edit_profile/password_change", JSON.stringify( form ), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
