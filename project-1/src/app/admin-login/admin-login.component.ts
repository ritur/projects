import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { AdminapiService } from '../adminapi.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  loginresult: any;
  userlogininfo: any;
  message_incorrect: string;
  incorrect = false;
  emailvalid = true
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, private api: ApiService,private adminapi:AdminapiService) {
    this.adminapi.checkloginuseradmin()
      .subscribe(res => {
        console.log(res);
        this.userlogininfo = res;
      if (this.userlogininfo.loginUserResult.success&&this.userlogininfo.loginUserResult.is_admin){
          this.router.navigate(['/admin/']);
        }
      }, err => {
        console.log(err);
      })
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailId: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(form: NgForm) {
    this.submitted = true;

    console.log(form)
    // stop here if form is invalid
    if (this.loginForm.invalid || !this.emailvalid) {
      return;
    }

    this.loading = true;
    this.adminapi.authenticationService(form)
      .subscribe(res => {
        console.log("res", res)
        this.loginresult = res
        if (this.loginresult.loginUserResult.success) {
          localStorage.setItem('admin-emailId', this.loginresult.loginUserResult.users.emailId);
          localStorage.setItem('admin-firstName', this.loginresult.loginUserResult.users.firstName);
          localStorage.setItem('admin-lastName', this.loginresult.loginUserResult.users.lastName);
          localStorage.setItem('admin-profile_image', this.loginresult.loginUserResult.users.profile_image);
          if (this.loginresult.loginUserResult.is_admin == 1) {
            localStorage.setItem('token_id', this.loginresult.loginUserResult.token);
            this.router.navigate(['/admin/admin-dashboard']);
          }
          // else { this.router.navigate(['/login']); }
        }
        else {
          // this.loginresult.invalid.password.errors.incorrect=true;
          this.loading = false;
          this.incorrect = true;
          this.message_incorrect = this.loginresult.loginUserResult.processStatus;
          setTimeout(() => {
            this.message_incorrect = "";
            this.incorrect = false;
          }, 2000);
        }
        // this.router.navigate(['/dashboard']);
      }, (err) => {
        console.log(err);
      }
      );

  }

  validemail() {

    if (this.loginForm.get("emailId").value !== "") {
      var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (regex.test(this.loginForm.get("emailId").value)) {
        this.emailvalid = true
      }
      else {
        this.emailvalid = false
      }

    }
    else {
      this.emailvalid = true
    }
  }

  redirectforgot(event) {
    console.log("click label")
    this.router.navigate(['/forgotPassword']);
  }
  // private isEmail(email) {
  // 	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  // 	return regex.test(email);
  // }
}
