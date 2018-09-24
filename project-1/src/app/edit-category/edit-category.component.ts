import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AdminapiService } from '../adminapi.service';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {
  editcategoryform: FormGroup;
  message_return: string;
  show_message = false;
  categoryres: any;
  loading = false;
  categoryresults: any;
  editid: any;
  show_message_success = null;
  categoryname: any;
  constructor(private formBuilder: FormBuilder, private adminapi: AdminapiService, private router: Router, private route: ActivatedRoute) {
    if (typeof this.route.snapshot.queryParams.id !== "undefined") {
      console.log(this.route.snapshot.queryParams.id)
      this.editid = this.route.snapshot.queryParams.id;

    }


  }

  ngOnInit() {
    this.editcategoryform = this.formBuilder.group({
      categoryName: ['']
    });
    this.adminapi.singlecategory(this.editid)
      .subscribe(res => {
        console.log(res);
        this.categoryresults = res;
        if (!this.categoryresults.Categoryresult.success) {
          location.reload()
        }
        else {
          this.categoryname = this.categoryresults.Categoryresult.category.name;
          this.editcategoryform = this.formBuilder.group({

            categoryName: [this.categoryresults.Categoryresult.category.name, Validators.required],

          });
        }
      }, err => {
        console.log(err);
      })
  }
  get f() { return this.editcategoryform.controls; }
  onSubmit(form: NgForm) {
    console.log(form);
    if (this.editcategoryform.invalid) {
      return;
    }
    else {
      form['id'] = this.editid;
      this.loading = true;
      this.adminapi.editsinglecategory(form)
        .subscribe(res => {
          this.loading = false;
          console.log(res);
          this.categoryres = res;
          if (!this.categoryres.Categoryupdateresult.success) {
            this.show_message = true;
            this.message_return = this.categoryres.Categoryupdateresult.processStatus
            setTimeout(() => {
              this.show_message = null;
              this.message_return = ''
            }, 3000);
          }
          else {
            this.show_message_success = true;
            this.message_return = this.categoryres.Categoryupdateresult.processStatus
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
