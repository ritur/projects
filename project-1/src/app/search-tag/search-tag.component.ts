import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminapiService } from '../adminapi.service';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'app-search-tag',
  templateUrl: './search-tag.component.html',
  styleUrls: ['./search-tag.component.css']
})
export class SearchTagComponent implements OnInit {
  searchtagform: FormGroup;
  message_return: string;
  submitted=false;
  show_message = false;
  show_message_success = null;
  searchtagres: any;
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
    this.searchtagform = this.formBuilder.group({

      searchtagName: ['', Validators.required],

    });
  }
  get f() { return this.searchtagform.controls; }
  onSubmit(form: NgForm) {
    this.submitted=true;
    console.log(form);
    if (this.searchtagform.invalid) {
      return;
    }
    else {
      this.loading = true;
      this.adminapi.searchtagsave(form)
        .subscribe(res => {
          console.log(res);
          this.searchtagres = res;
          this.loading = false;
          if (!this.searchtagres.searchtagresult.success) {
            if (!this.searchtagres.searchtagresult.is_admin) {
              this.router.navigate(['admin-login']);
            }
            else {
              this.show_message = true;
              this.message_return = this.searchtagres.searchtagresult.processStatus
              setTimeout(() => {
                this.show_message = false;
                this.message_return = ''
              }, 2000);
            }
          }
          else {
            this.show_message_success = true;
            this.message_return = this.searchtagres.searchtagresult.processStatus
            setTimeout(() => {
              this.router.navigate(['/admin/searchtaglist']);
            }, 1500);
          }
        }, err => {
          this.loading = false;
          console.log(err);
        })
    }


  }
}
