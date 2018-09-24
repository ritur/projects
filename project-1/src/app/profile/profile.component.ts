import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { DataservicecscService } from '../dataservicecsc.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
export interface DialogData {
  id: any;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  error_lastname = false
  error_firstname = false;
  uploadimage: FileUploader;
  profiledata: any
  emailId: string;
  userlogininfo: any;
  editprofile: FormGroup;
  id: any;
  country_id: any;
  submitform = false;
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  street: string = '';
  pincode: string = '';
  state: string = '';
  city: string = '';
  country: string = '';
  statevalue: any = "";
  cityvalue: any = "";
  password: string = '';
  cnfpassword: string = '';
  mobileNo: string = '';
  showNav: boolean = true;
  isDisabled: boolean;
  loading = false;
  state_id: any;
  profile_image: any = null;
  states: any = []; cities: any = [];
  showlogo = false;
  countryvalue: any;
  countries: any = [];
  loadingedit = false;
  // statearay: any = [];
  // cityarray: any = [];
  stateinputvalue: any;
  countryinputvalue: any;
  cityinputvalue: any;
  // countries: any = [
  //   {
  //     "country": "Afghanistan",
  //     "states": [{
  //       "name": "Nurestan",
  //       "cities": ["c1", "c2", "c3"]
  //     }, {
  //       "name": "Oruzgan",
  //       "cities": ["orc1", "oruc2", "oruc3"]
  //     },
  //     { "name": "Panjshir", "cities": ["3c1", "3c2", "3c3"] }]
  //   }, {
  //     "country": "Albania", "states": [{ "name": "Korce", "cities": ["c1", "c2", "c3"] }, { "name": "Kukes", "cities": ["orc1", "oruc2", "oruc3"] }, { "name": "Lezhe", "cities": ["orc1", "oruc2", "oruc3"] }, { "name": "Shkoder", "cities": ["orc1", "oruc2", "oruc3"] }, { "name": "Tirane", "cities": ["orc1", "oruc2", "oruc3"] }]
  //   },
  //   // { "country": "Antarctica", "states": [] }
  // ]
  constructor(public dialog: MatDialog, private _dataService: DataservicecscService, private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) {
    console.log("this.route.snapshot.queryParams.get('edit')", this.route.snapshot.queryParams.edit)

    this.countries = this._dataService.getCountries();
    this.api.checkloginuser()
      .subscribe(res => {
        console.log(res);
        this.userlogininfo = res;
        if (!this.userlogininfo.loginUserResult.success) {
          this.router.navigate(['/']);
        }
      }, err => {
        console.log(err);
      })
  }

  ngOnInit() {
    this.isDisabled = false;
    this.editprofile = this.formBuilder.group({});
    // this.editprofile.addControl('profile_pic', new FormControl(this.profiledata.firstName, [Validators.required]));
    // this.editprofile = this.formBuilder.group({
    //   'firstName': [''],
    //   'lastName': [''],
    //   'mobileNo': [''],
    //   'address': [''],
    //   'street': [''],
    //   // 'pincode': [''],
    //   'state': [''],
    //   'city': [''],
    //   'country': [''],
    //   'password': [''],
    //   'cnfpassword': ['']
    // })
    this.api.getuserdetail()
      .subscribe(res => {

        this.profiledata = res.updateUserResult.user_data;
        if (res.updateUserResult.user_data.profile_image !== null && typeof res.updateUserResult.user_data.profile_image !== "undefined" && res.updateUserResult.user_data.profile_image !== undefined) {
          this.profile_image = "../images/assets/profile_images/" + res.updateUserResult.user_data.profile_image;
          console.log("res.user_data.profile_image", res.updateUserResult.user_data.profile_image)
        }
        this.emailId = res.updateUserResult.user_data.emailId;
        this.id = res.updateUserResult.user_data._id;
        this.firstName = res.updateUserResult.user_data.firstName;
        this.lastName = res.updateUserResult.user_data.lastName;
        this.mobileNo = res.updateUserResult.user_data.mobileNo;
        this.address = res.updateUserResult.user_data.address;
        this.street = res.updateUserResult.user_data.street;
        this.pincode = res.updateUserResult.user_data.pincode,
          this.stateinputvalue = res.updateUserResult.user_data.state;
        this.countryinputvalue = res.updateUserResult.user_data.country;
        this.cityinputvalue = res.updateUserResult.user_data.city;

        this.country = res.updateUserResult.user_data.country;
        this.state = "";
        this.city = "";

        this.states = [];
        this.countries.forEach(element => {
          if (element.name == this.country) {
            this.countryvalue = element;
            this.country = element.id;
          }
        })

        this.states = this._dataService.getStates().filter(element => element.country_id == this.country);
        this.cities = []
        this.states.forEach(element => {
          if (element.name == this.stateinputvalue) {
            this.statevalue = element.name;
            this.state = element.id;
          }
        })
        this.cities = this._dataService.getCities().filter(element => element.state_id == this.state)
        this.cities.forEach(element => {
          if (element.name == this.cityinputvalue) {
            this.cityvalue = element.name
            this.city = element.id;
          }
        })
        if (typeof this.route.snapshot.queryParams.edit !== "undefined" && this.route.snapshot.queryParams.edit == 'true') {
          console.log("disable click");
          this.disableClick()
        }
        //   this.editprofile.setValue({
        //     firstName: res.user_data.firstName,
        //     lastName: res.user_data.lastName,
        //     mobileNo: "" + res.user_data.mobileNo,
        //     address: res.user_data.address,
        //     street: res.user_data.street,
        //     // pincode: res.user_data.pincode,
        //     state: res.user_data.state,
        //     city: res.user_data.city,
        //     country: res.user_data.country,
        //     password: '',
        //     cnfpassword: ''
        //   }
        // );

      }, err => {
        console.log(err);
        if (typeof this.route.snapshot.queryParams.edit !== "undefined" && this.route.snapshot.queryParams.edit == 'true') {
          console.log("disable click");
          this.disableClick()
        }
      })
    this.uploadimage = new FileUploader({
      url: '/edit_profile/upload_profile_pic',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
    });

    this.uploadimage.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploadimage.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'androidinput');

  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, name: any): any {
    let data = JSON.parse(response);
    this.profile_image = "../images/assets/profile_images/" + data.filesdetail
    localStorage.setItem("profile_image", data.filesdetail);
    this.showlogo = false;
    this.loading = false;
    //success server response
    console.log("data is data", data)

    // if (name == "androidinput") {
    //   // this.webandroidfile.name = data.filesdetail[0].filename;
    //   // this.webandroidfile.title = data.filesdetail[0].originalname;
    // }
    // console.log("this.assetbundleform.controls[name]", this.assetbundleform.controls[name])
    // this.assetbundleform.controls[name].setValue(data.filesdetail[0].originalname);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    this.showlogo = false;
    let error = JSON.parse(response); //error server response
    this.loading = false;
  }
  openDialog() {

    const dialogRef = this.dialog.open(PasswordChangeComponent, {
      width: '500px',
      data: { id: "dfg" }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  get f() { return this.editprofile.controls; }
  disableClick() {
    console.log("this.disableClick", this.isDisabled);
    this.isDisabled = true;
    this.editprofile.addControl('firstName', new FormControl(this.profiledata.firstName, [Validators.required]));
    this.editprofile.addControl('lastName', new FormControl(this.profiledata.lastName, [Validators.required]));
    this.editprofile.addControl('mobileNo', new FormControl(this.profiledata.mobileNo, []));
    this.editprofile.addControl('address', new FormControl(this.profiledata.address));
    this.editprofile.addControl('pincode', new FormControl(this.profiledata.pincode, []));
    this.editprofile.addControl('street', new FormControl(this.profiledata.street));
    // 'pincode': [res.user_data.pincode, Validators.required],
    // this.editprofile.addControl('state', new FormControl(this.profiledata.state, [Validators.required]));
    // this.editprofile.addControl('city', new FormControl(this.profiledata.city, [Validators.required]));
    // this.editprofile.addControl('country', new FormControl(this.profiledata.country, [Validators.required]));
    // this.editprofile.addControl('password', new FormControl('', [Validators.required]));
    // 'cnfpassword': ['', [Validators.compose(
    //   [Validators.required, this.validateAreEqual.bind(this)])]]
    // })
    // this.editprofile.addControl('cnfpassword', new FormControl(
    //   '', [Validators.compose(
    //     [Validators.required, this.validateAreEqual.bind(this)]
    //   )]
    // ));
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


  onFormSubmit(form: NgForm) {
    form["emailId"] = this.emailId;
    form["_id"] = this.id;

    this.submitform = true

    if (this.editprofile.invalid || this.error_lastname || this.error_firstname) {
      console.log("this.editprofile.invalid", this.editprofile.invalid)
      return;
    }
    this.loadingedit = true
    if (typeof this.countryvalue !== "undefined") { form["country"] = this.countryvalue.name; }
    else {
      form["country"] = "";
    }
    if (typeof this.statevalue !== "undefined") { form["state"] = this.statevalue }
    else { form["state"] = ""; }
    if (typeof this.cityvalue !== "undefined") { form["city"] = this.cityvalue }
    else { form["city"] = ""; }

    console.log(form);
    console.log(this.statevalue);
    console.log(this.cityvalue);
    // form['country']=this.countries[ (form['country'])-1]
    // form['state']=this.countries[ (form['state'])-1];
    // form['country']=this.countries[ (form['country'])-1]
    this.api.updateprofile(form)
      .subscribe(res => {
        console.log("res", res.updateUserProcessResult.data)
        this.loadingedit = false;
        if (res.updateUserProcessResult.success == true) {
          localStorage.setItem("firstName", res.updateUserProcessResult.data.firstName)
          localStorage.setItem("lastName", res.updateUserProcessResult.data.lastName)
          this.router.navigate(['/livefurnish']);
        }
        else {

        }
      }, (err) => {
        this.loadingedit = false;
        console.log(err);
      }
      );
  }

  countryChange(e) {

    this.states = this._dataService.getStates().filter(statese => statese.country_id == e)
    this.countryvalue = this.countries[e - 1];
    console.log("countryvalue", this.countryvalue);
    this.statevalue = ""
    // this.countries.filter(element => {
    //   if (element.country == e.target.value) {
    //     console.log(element.states[0], "first state")
    //     this.states = element.states;
    //   }
    // });
    this.cities = [];
  }
  statesChange(evt) {
    this.cities = this._dataService.getCities().filter(cityie => cityie.state_id == evt);
    // this.statevalue=this.statearay[evt-1];
    this.states.forEach(element => {
      if (element.id == evt) {

        this.statevalue = element.name;
      }
    })
    this.cityvalue = "";
    // this.states.filter(element => {
    //   if (element.name == evt.target.value) {
    //     this.cities = element.cities;
    //   }
    // })


  }
  citychange(evt) {
    this.cities.forEach(element => {
      if (element.id == evt) {

        this.cityvalue = element.name;
      }
    })

    // this.cityvalue=this.cityarray[evt-1];
  }

  changefile(event) {
    console.log('evemt', event)
    event.target.nextSibling.click()
  }




  changeshowlogo() {
    console.log("change")
    this.showlogo = true;
    this.loading = true;
  }


}


@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})


export class PasswordChangeComponent implements OnInit {
  changepasswordresult: any;
  editpassword: FormGroup;
  submit = false;
  passmatch = false;
  messageshow = null;
  loading = null;
  messagesuccess = null;
  constructor(private api: ApiService, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PasswordChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.editpassword = this.formBuilder.group({})
    this.editpassword.addControl('oldpassword', new FormControl('', [Validators.required]));
    this.editpassword.addControl('password', new FormControl('', [Validators.required]));
    this.editpassword.addControl('cnfpassword', new FormControl(
      '', [Validators.required]

    ));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get pass() { return this.editpassword.controls; }



  //on form submit
  onFormSubmit(form: NgForm) {

    this.submit = true;
    form['emailId'] = localStorage.getItem('emailId');
    if (this.editpassword.invalid) {
      console.log("this.editprofile.invalid", this.editpassword.invalid)
      return;
    }
    console.log(form)
    this.loading = true;
    this.api.passwordchange(form)
      .subscribe(res => {
        console.log(res);
        this.changepasswordresult = res;
        this.loading = false;
        if (this.changepasswordresult.EditPassword.success) {
          this.messagesuccess = this.changepasswordresult.EditPassword.processStatus;

          setTimeout(() => {
            this.dialogRef.close();
          }, 1000);
        }
        else {
          this.messageshow = this.changepasswordresult.EditPassword.processStatus;
        }
      }, err => {
        this.loading = false;
        console.log(err);
      })
  }
  valuenull() {
    if (this.submit) {
      this.messageshow = null;

    }
  }
  validateequal() {

    var passw = this.editpassword.get("password").value;
    var cpassw = this.editpassword.get("cnfpassword").value;

    console.log(passw);
    console.log(cpassw);
    console.log("passw !== cpassw", passw !== cpassw)
    console.log("cpassw !== ", cpassw !== "")
    console.log(this.passmatch)
    if (passw !== cpassw && cpassw !== "") { this.passmatch = true }
    else {
      this.passmatch = false
    }
  }

  private validateAreEqual(fieldControl: FormControl) {
    console.log(this.editpassword.get("password").value)

    console.log(' fieldControl.value', fieldControl.value)
    return fieldControl.value === this.editpassword.get("password").value ? null : {
      NotEqual: true
    };
  }
}