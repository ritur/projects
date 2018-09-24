import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminapiService } from '../adminapi.service';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-token',
  templateUrl: './reset-token.component.html',
  styleUrls: ['./reset-token.component.css']
})
export class ResetTokenComponent implements OnInit {
  resetpasswordform: FormGroup;
  message_return: string;
  show_message = false;
  submitted = false;
  passwordres: any;
  token_id:any;
  // unamePattern = "/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i";
  categoryres: any;
  constructor(private router: Router,private location: Location,private route: ActivatedRoute, private formBuilder: FormBuilder, private api: AdminapiService) { 
    if(typeof this.route.snapshot.queryParams.token!=="undefined")
    { this.token_id = this.route.snapshot.queryParams.token;
     
   }
  }

  ngOnInit() {
    this.resetpasswordform = this.formBuilder.group({

      password: ['', Validators.required]});
      this.resetpasswordform.addControl('confirmpsd', new FormControl( '',
      [ Validators.required,this.validateAreEqual.bind(this)]
        ))
     
        // confirmpsd: ['',[ Validators.required,this.validateAreEqual.bind(this)]]
  
  }
  
  get f() { return this.resetpasswordform.controls; }
  onSubmit(form: NgForm) {
    this.submitted = true;
    console.log(form);
    if (this.resetpasswordform.invalid) {
      return;
    }
    else {
      this.api.resetpasswordsend(form,this.token_id)
        .subscribe(res => {
          console.log(res);
          this.passwordres = res;
          this.show_message = true;
          this.message_return = this.passwordres.message;
          setTimeout(() => 
          {
              this.router.navigate(['/']);
          },
          5000);

        }, err => {
          console.log(err);
        })
    }


  }
  private validateAreEqual(fieldControl: FormControl) {

    let EMAIL_REGEXP = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (fieldControl.value.length == 0) {
      this.show_message = true;
      this.message_return = "*Password required"
    } else if (!(fieldControl.value === this.resetpasswordform.get("password").value)) {
      this.show_message = true;
      this.message_return = "Password does not match"
    }
    else {
      this.show_message = false;
    }

    console.log(this.resetpasswordform.get("password").value)
    console.log(' fieldControl.value',fieldControl.value)
    return fieldControl.value === this.resetpasswordform.get("password").value ? null : {
      NotEqual: true
    };
  }
  gotohome(){
    this.router.navigate(['/']);
  }
}
