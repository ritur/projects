import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminapiService } from '../adminapi.service';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {
  categoryform: FormGroup;
  message_return: string;
  submitted=false;
  show_message = false;
  show_message_success = null;
  categoryres: any;
  userlogininfo: any;
  loading = false;
  constructor(private location: Location, private formBuilder: FormBuilder, private adminapi: AdminapiService, private router: Router, private route: ActivatedRoute) {
    this.adminapi.checkloginuseradmin()
      .subscribe(res => {
        console.log(res);
        this.userlogininfo = res;
        if (!this.userlogininfo.loginUserResult.success) {
          this.router.navigate(['admin-login']);
        }
      }, err => {
        console.log(err);
      })
  }

  ngOnInit() {
    this.categoryform = this.formBuilder.group({

      categoryName: ['', Validators.required],

    });
  }
  get f() { return this.categoryform.controls; }
  onSubmit(form: NgForm) {
    this.submitted=true;
    console.log(form);
    if (this.categoryform.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.adminapi.categorysave(form)
        .subscribe(res => {
          console.log(res);
          this.categoryres = res;
          this.loading = false;
          if (!this.categoryres.categoryresult.success) {
            if (!this.categoryres.categoryresult.is_admin) {
              this.router.navigate(['admin-login']);
            }
            else {
              this.show_message = true;
              this.message_return = this.categoryres.categoryresult.processStatus
              setTimeout(() => {
                this.show_message = false;
                this.message_return = ''
              }, 2000);
            }
          }
          else {
            this.show_message_success = true;
            this.message_return = this.categoryres.categoryresult.processStatus
            setTimeout(() => {
              this.router.navigate(['/admin/categorylist']);
            }, 1500);
          }
        }, err => {
          this.loading = false;
          console.log(err);
        })
    }


  }
}
