import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Component({
  selector: 'app-verification-user',
  templateUrl: './verification-user.component.html',
  styleUrls: ['./verification-user.component.css']
})
export class VerificationUserComponent implements OnInit {
  showNav:boolean=true;
  token_id:any='';
  message:string=null;
response:any;
verifyfrom:any;
  constructor(private router: Router,private location: Location,private route: ActivatedRoute,private http: HttpClient) {
    
   if(typeof this.route.snapshot.queryParams.token_id!=="undefined")
   { this.token_id = this.route.snapshot.queryParams.token_id;
    this.verifyfrom='accoutto'
  }
  if(typeof this.route.snapshot.queryParams.logintoken_id!=="undefined"){
    this.token_id = this.route.snapshot.queryParams.logintoken_id;
    this.verifyfrom='loginto'
  }
  
}

  ngOnInit() {
    this.verifyuser();
  }
  verifyuser() {
      
    this.http.get("/userapi/confirm_user?token_id="+this.token_id+"_"+this.verifyfrom, httpOptions)
    .subscribe(res => {
      console.log("response",res)
      this.response=res;
    if(this.response.success==true){
      localStorage.setItem("emailId",this.response.users.emailId)
      localStorage.setItem("firstName",this.response.users.firstName)
      localStorage.setItem("lastName",this.response.users.lastName)
      localStorage.setItem("profile_image",this.response.users.profile_image)
      setTimeout(() => 
      {
         this.router.navigate(['/livefurnish']);
      },3000);
    }
    else{
      this.message=this.response.message;
      setTimeout(() => 
      {
          this.router.navigate(['/']);
      },
      5000);
    }
      
     }, err => {
       console.log(err);
     })
  }
 
}
