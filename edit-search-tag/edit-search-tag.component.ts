import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminapiService } from '../adminapi.service';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-search-tag',
  templateUrl: './edit-search-tag.component.html',
  styleUrls: ['./edit-search-tag.component.css']
})
export class EditSearchTagComponent implements OnInit {
  editsearchtagform: FormGroup;
  message_return: string;
  show_message = false;
  searchtagres: any;
  loading = false;
  searchtagresults: any;
  editid: any;
  show_message_success = null;
  searchtagname: any;
  constructor(private formBuilder: FormBuilder, private adminapi: AdminapiService, private router: Router, private route: ActivatedRoute) {
    if (typeof this.route.snapshot.queryParams.id !== "undefined") {
      console.log(this.route.snapshot.queryParams.id)
      this.editid = this.route.snapshot.queryParams.id;

    }


  }

  ngOnInit() {
    this.editsearchtagform = this.formBuilder.group({
      searchtagName: ['']
    });
    this.adminapi.singlesearchtag(this.editid)
      .subscribe(res => {
        console.log(res);
        this.searchtagresults = res;
        if (!this.searchtagresults.searchtagresult.success) {
          location.reload()
        }
        else {
          this.searchtagname = this.searchtagresults.searchtagresult.searchtag.name;
          this.editsearchtagform = this.formBuilder.group({

            searchtagName: [this.searchtagresults.searchtagresult.searchtag.name, Validators.required],

          });
        }
      }, err => {
        console.log(err);
      })
  }
  get f() { return this.editsearchtagform.controls; }
  onSubmit(form: NgForm) {
    console.log(form);
    if (this.editsearchtagform.invalid) {
      return;
    }
    else {
      form['id'] = this.editid;
      this.loading = true;
      this.adminapi.editsinglesearchtag(form)
        .subscribe(res => {
          this.loading = false;
          console.log(res);
          this.searchtagres = res;
          if (!this.searchtagres.searchtagupdateresult.success) {
            this.show_message = true;
            this.message_return = this.searchtagres.searchtagupdateresult.processStatus
            setTimeout(() => {
              this.show_message = null;
              this.message_return = ''
            }, 3000);
          }
          else {
            this.show_message_success = true;
            this.message_return = this.searchtagres.searchtagupdateresult.processStatus
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
