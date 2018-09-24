import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminapiService } from '../adminapi.service';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotpasswordform: FormGroup;
  message_return: string;
  show_message = false;
  show_messagetrue = false;
  submitted = false;
  passwordres: any;
  loading = false;
  // unamePattern = "/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i";
  categoryres: any;
  constructor(private location: Location, private formBuilder: FormBuilder, private api: AdminapiService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.forgotpasswordform = this.formBuilder.group({

      email: ['', [
        Validators.required, this.validateAreEqual.bind(this)
      ]],

    });
  }
  changepredefined() {

    this.router.navigate(['/']);
  }
  onSubmit(form: NgForm) {
    this.submitted = true;
    console.log(form);
    if (this.forgotpasswordform.invalid) {
      return;
    }

    else {
      this.loading = true;
      this.api.forgotpasswordsend(form)
        .subscribe(res => {
          console.log(res);
          this.passwordres = res;
          if (this.passwordres.success) {
            this.show_messagetrue = true;
            this.message_return = this.passwordres.message;
            this.loading = false;
          }
          else {
            this.show_message = true;
            this.message_return = this.passwordres.message;
            this.loading = false;
          }

        }, err => {
          this.loading = false;
          console.log(err);
        })
    }


  }
  private validateAreEqual(fieldControl: FormControl) {

    let EMAIL_REGEXP = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (fieldControl.value.length == 0) {
      this.show_message = true;
      this.message_return = "*Email is required"
    } else if (!EMAIL_REGEXP.test(fieldControl.value)) {
      this.show_message = true;
      this.message_return = "Provided email is not a valid"
    }
    else {
      this.show_message = false;
    }

    return EMAIL_REGEXP.test(fieldControl.value) ? null : {
      "Provided is not a valid email": true
    };
  }
}