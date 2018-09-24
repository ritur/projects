import { Component, OnInit } from '@angular/core';
import { AdminapiService } from '../adminapi.service';

import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-admin-usereditprice',
  templateUrl: './admin-usereditprice.component.html',
  styleUrls: ['./admin-usereditprice.component.css']
})
export class AdminUsereditpriceComponent implements OnInit {
  profiledata: any
  emailId: string;
  error_lastname = false
  error_firstname = false;
  editprofile: FormGroup;
  id: any;
  password: any;
  firstName: string = '';
  lastName: string = '';
  creditprice: number;
  editid: any;
  editres: any;
  showNav: boolean = true;
  isDisabled: boolean;
  mobileNo: any;
  street: any;
  address: any;
  submitForm = false;
  updateres: any;
  loader = false;
  message = false;
  allowed_no_of_login: any;
  constructor(private router: Router, private route: ActivatedRoute, private api: AdminapiService, private formBuilder: FormBuilder) {
    if (typeof this.route.snapshot.queryParams.id !== "undefined") {
      console.log(this.route.snapshot.queryParams.id)
      this.editid = this.route.snapshot.queryParams.id;

    }
  }

  ngOnInit() {
    this.editprofile = this.formBuilder.group({
      'firstName': [''],
      'lastName': [''],
      'creditprice': [''],
      'emailId': [''],
      'purchasecredit': [''],
      'password': [''],
      'street': [''],
      'address': [''],
      'mobileNo': [''],
      "allowed_login": ['']

    })
    this.isDisabled = false;
    this.api.getuserdetail(this.editid)
      .subscribe(res => {
        console.log("profiledata", res.user_data)
        this.profiledata = res.user_data;
        this.mobileNo = res.user_data.data.mobileNo
        this.emailId = res.user_data.data.emailId;
        this.id = res.user_data.data._id;
        this.firstName = res.user_data.data.firstName;
        this.lastName = res.user_data.data.lastName;
        this.emailId = res.user_data.data.emailId;
        this.creditprice = res.user_data.data.creditprice;
        this.password = res.user_data.data.password;
        this.street = this.profiledata.data.street;
        this.address = this.profiledata.data.address;
        this.allowed_no_of_login = this.profiledata.data.allowed_no_of_login;
        //       this.editprofile.setValue({
        //         firstName: res.user_data.data.firstName,
        //         lastName: res.user_data.data.lastName,
        //         emailId:res.user_data.data.emailId,
        //         creditprice:res.user_data.data.creditprice,
        //         street:'',
        //  address:'',
        //       });
        this.editprofile = this.formBuilder.group({
          'firstName': [this.profiledata.data.firstName, Validators.required],
          'lastName': [this.profiledata.data.lastName, Validators.required],
          'creditprice': [this.profiledata.data.creditprice, Validators.compose([Validators.required, Validators.min(0.5)])],
          'emailId': [this.profiledata.data.emailId, [Validators.required, this.validateEmailId.bind(this)]],
          'purchasecredit': [''],
          'password': [this.profiledata.data.password, Validators.required],
          'street': [this.profiledata.data.street],
          'address': [this.profiledata.data.address],
          'mobileNo': [this.profiledata.data.mobileNo],
          'allowed_login': [this.profiledata.data.allowed_no_of_login]


        })
      }, err => {
        console.log(err);
      })

  }
  hasExclamationMark(input: FormControl) {
    console.log("input", input)
    const hasExclamation = input.value >= 0.4;
    return hasExclamation ? null : { creditpricemin: true };
  }
  get f() {
   
    return this.editprofile.controls;
  }

  valuefirst() {
    let firstname = this.editprofile.controls.firstName.value;

    let trimname = firstname.trim();
    console.log("this.editprofile.controls.firstName.errors",typeof this.editprofile.controls.firstName.errors)

    if (trimname == "" &&  this.editprofile.controls.firstName.errors == null) {
      this.error_firstname = true
    }
    else {
      this.error_firstname = false;
    }
    console.log(" this.error_firstname", this.error_firstname)
  }

  valuelast() {
    let firstname = this.editprofile.controls.lastName.value;
console.log("this.editprofile.controls.lastName.errors",typeof this.editprofile.controls.lastName.errors)
    let trimname = firstname.trim();
    if (trimname == "" &&  this.editprofile.controls.lastName.errors == null) {
      this.error_lastname = true
    }
    else {
      this.error_lastname = false;
    }
    console.log(" this.error_firstname", this.error_lastname)
  }





  editassets(editid, event) {
    console.log("delteelement", editid)
    var price = event.path[3].children[2].children[0].value
    this.api.editUserCreditPrice(editid, price)
      .subscribe(res => {
        console.log(res);
        this.editres = res;
        if (this.editres.Assetdeletionresult.success) {
          location.reload();
        }
      }, err => {
        console.log(err);
      })
  }
  onFormSubmit(form: NgForm) {
    // form["emailId"] = this.emailId;
    form["_id"] = this.editid;
    console.log(form)
    this.submitForm = true;
    if (this.editprofile.invalid|| this.error_lastname || this.error_firstname) {
      return;
    }

    this.loader = true

    this.api.updateuserprofile(form)
      .subscribe(res => {
        this.updateres = res
        console.log("res", this.updateres)
        if (this.updateres.updateUserProcessResult.success == true) {
          console.log("res", this.updateres)
          this.loader = false;
          this.router.navigate(['/admin/adminuserlist']);
        }
        else {
          this.loader = false;
          this.message = this.updateres.updateUserProcessResult.message;
          console.log("res.", this.updateres.updateUserProcessResult.message)
        }
      }, (err) => {
        console.log(err);
      }
      );
  }

  private validateEmailId(fieldControl: FormControl) {

    console.log(' fieldControl.value', fieldControl.value)
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // return regex.test(email);
    return regex.test(fieldControl.value) ? null : true
  }
}
