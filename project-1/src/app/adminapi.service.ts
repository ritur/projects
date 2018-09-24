import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const httpOptionsUpload = {
  headers: new HttpHeaders({
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
  })
};
// const apiUrl = "/creditapi";

@Injectable({
  providedIn: 'root'
})
export class AdminapiService {
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
    console.log(res)
    return body || {};
  }
  authenticationService(data): Observable<any> {

    console.log(data)
    return this.http.get("/userapi/logInAdmin/" + data.emailId + "/" + data.password + "/" + data.remember, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getassetslist(): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/assetapi/listassests/" + token, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  deleteassetBundle(id): Observable<any> {

    var token = localStorage.getItem("token_id");
    return this.http.post("/assetapi/deleteasset", JSON.stringify({ 'id': id, "token": token }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getassetsdata(): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/assetapi/" + token, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }


  editassetbundle(id): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/assetapi/editasset/" + token + "?id=" + id, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  categorysave(form): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.post("/categoryapi/category_create", JSON.stringify({ 'categoryname': form.categoryName, 'token': token }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addassetbundle(form, file: any[]): Observable<any> {
    var token = localStorage.getItem("token_id");

    // form['window'] = file[0];
    // form['mac'] = file[1];
    // form['ios'] = file[2];
    // form['android'] = file[3];
    // form['webgl'] = file[4];
    // form['token'] = token;
    var formData = new FormData();
    formData.append('window', JSON.stringify(file[0], form.windowinput));
    formData.append('mac', JSON.stringify(file[1], form.macinput));
    formData.append('ios', JSON.stringify(file[2], form.iosinput));
    formData.append('android', JSON.stringify(file[3], form.androidinput));
    formData.append('webgl', JSON.stringify(file[4], form.androidinput));
    formData.append('thumbnail', file[5], form.thumbnailinput);
    formData.append('token', JSON.stringify(token));
    formData.append('assetName', JSON.stringify(form.assetName));
    formData.append('version', JSON.stringify(form.version));
    formData.append('categories', JSON.stringify(form.categories));
    formData.append('searchtages', JSON.stringify(form.searchtages));
    formData.append('itemRows', JSON.stringify(form.itemRows));
    formData.append('myControl', JSON.stringify(form.myControl));
   
    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    let params = new HttpParams();

    return this.http.post("/assetapi/create/", formData, { params, headers })
      .pipe(
        catchError(this.handleError)
      );
    // return this.http.post("/assetapi/create/", JSON.stringify(form), httpOptionsUpload)
    //   .pipe(
    //     catchError(this.handleError)
    //   );
  }
  editassetbundlepost(form, id, file: any[]): Observable<any> {
    var token = localStorage.getItem("token_id");
    console.log(form)
    // form['id'] = id;
    // form['window'] = file[0];
    // form['mac'] = file[1];
    // form['ios'] = file[2];
    // form['android'] = file[3];
    // form['token'] = token;
    var formData = new FormData();
    formData.append('id', JSON.stringify(id));
    formData.append('window', JSON.stringify(file[0], form.windowinput));
    formData.append('mac', JSON.stringify(file[1], form.macinput));
    formData.append('ios', JSON.stringify(file[2], form.iosinput));
    formData.append('android', JSON.stringify(file[3], form.androidinput));
    formData.append('webgl', JSON.stringify(file[4], form.androidinput));
    formData.append('thumbnail', file[5], form.thumbnailinput);
    formData.append('thumbnailname', JSON.stringify(form.thumbnailinput));
    formData.append('token', JSON.stringify(token));
    formData.append('assetName', JSON.stringify(form.assetName));
    formData.append('version', JSON.stringify(form.version));
    formData.append('categories', JSON.stringify(form.categories));
    formData.append('searchtages', JSON.stringify(form.searchtages));
    formData.append('itemRows', JSON.stringify(form.itemRows));
    formData.append('myControl', JSON.stringify(form.myControl));
    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    let params = new HttpParams();
    return this.http.post("/assetapi/editAsset", formData, { params, headers })
      .pipe(
        catchError(this.handleError)
      );
    // return this.http.post("/assetapi/editAsset", JSON.stringify(form), httpOptions)
    //   .pipe(
    //     catchError(this.handleError)
    //   );
  }


  getuserlist(): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/creditapi/listuser/" + token, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }


  editUserCreditPrice(id, price): Observable<any> {

    var token = localStorage.getItem("token_id");
    return this.http.post("/creditapi/edituserprice", JSON.stringify({ 'id': id, 'price': price, "token": token }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getuserdetail(id): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/creditapi/usercreditdetail/" + token + "?user_id=" + id, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  updateuserprofile(form): Observable<any> {
   
    //  form[id]=id;
    var token = localStorage.getItem("token_id");
    form['token'] = token;
    return this.http.post("/edit_profile/edituser", JSON.stringify(form), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  forgotpasswordsend(form): Observable<any> {

    return this.http.get("/forgot_password/sendemail?email_forgot_password=" + form.email, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  resetpasswordsend(form, token): Observable<any> {
    console.log(form)
    //  form[id]=id;
    return this.http.post("/forgot_password/reset/" + token, JSON.stringify(form), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteuser(id): Observable<any> {
   
    var token = localStorage.getItem("token_id");
    return this.http.post("/edit_profile/deletuser", JSON.stringify({ 'id': id, 'token': token }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  uplaoadbuild(data): Observable<any> {
    
    var token = localStorage.getItem("token_id");
    data['token'] = token;
    return this.http.post("/edit_profile/deletuser", JSON.stringify({ data }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  categoryapi(): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/categoryapi/category_list/" + token, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  deletecategory(id): Observable<any> {
    
    var token = localStorage.getItem("token_id");
    return this.http.post("/categoryapi/deletecategory", JSON.stringify({ 'id': id, 'token': token }), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  singlecategory(id): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/categoryapi/singlecategory/" + token + "?category_id=" + id, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
  checkloginuseradmin(): Observable<any> {
    var token = localStorage.getItem("token_id");
    return this.http.get("/userapi/session_check_admin/" + token, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  editsinglecategory(data): Observable<any> {
    
    var token = localStorage.getItem("token_id");
    data['token'] = token;
    
    return this.http.post("/categoryapi/singlecategory", JSON.stringify(data), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  savebuild(data_build:any): Observable<any> {
    
    var token = localStorage.getItem("token_id");
    data_build['token'] = token;
    console.log("data33",data_build);
    return this.http.post("/buildapi/savebuild", JSON.stringify({build_detail:data_build['build_detail'],build_name:data_build['build_name'],token:token}), httpOptions)
      .pipe(
        catchError(this.handleError)
      );
    }
    searchtagsave(form): Observable<any> {
      var token = localStorage.getItem("token_id");
      return this.http.post("/searchtagapi/searchtag_create", JSON.stringify({ 'searchtagname': form.searchtagName, 'token': token }), httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }

    singlesearchtag(id): Observable<any> {
      var token = localStorage.getItem("token_id");
      return this.http.get("/searchtagapi/singlesearchtag/" + token + "?searchtag_id=" + id, httpOptions).pipe(
        map(this.extractData),
        catchError(this.handleError));
    }
    editsinglesearchtag(data): Observable<any> {
    
      var token = localStorage.getItem("token_id");
      data['token'] = token;
      
      return this.http.post("/searchtagapi/singlesearchtag", JSON.stringify(data), httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }
    searchtagapi(): Observable<any> {
      var token = localStorage.getItem("token_id");
      return this.http.get("/searchtagapi/searchtag_list/" + token, httpOptions).pipe(
        map(this.extractData),
        catchError(this.handleError));
    }
  
    deletesearchtag(id): Observable<any> {
      
      var token = localStorage.getItem("token_id");
      return this.http.post("/searchtagapi/deletesearchtag", JSON.stringify({ 'id': id, 'token': token }), httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }
  
}
