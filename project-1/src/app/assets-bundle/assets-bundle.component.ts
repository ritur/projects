import { Component, OnInit } from '@angular/core';
import { AdminapiService } from '../adminapi.service'
import { Observable } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload'
import { FormControl, FormGroupDirective, FormBuilder, FormArray, FormGroup, NgForm, Validators } from '@angular/forms';
export interface freeze_rota {
  value: boolean;
  viewValue: string;
}
@Component({
  selector: 'app-assets-bundle',
  templateUrl: './assets-bundle.component.html',
  styleUrls: ['./assets-bundle.component.css']
})
export class AssetsBundleComponent implements OnInit {
  uploaderweb: FileUploader;
  uploaderwind: FileUploader;
  uploadermac: FileUploader;
  uploaderios: FileUploader;
  uploaderand: FileUploader;
  submitted = false;
  assetsres: any
  assetbundleform: FormGroup;
  // seachtagtoppings = new FormControl();
  searchtagtoppingList: any[];
  // toppings = new FormControl();
  toppingList: any[];
  assetsdata: any;
  selectedPeople1: any[];
  imageselected: any;
  url="./assets/images/profile.png"
  // myControl = new FormControl();
  // options: string[] 
  loading = false;
  dataofform: any;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  showpredefined = false;
  webwindowfile: any = {};
  webiosfile: any = {};
  webmacfile: any = {};
  webwebglfile: any = {};
  webandroidfile: any = {};
  showwinsuccess = null;
  showmacsuccess = null;
  showiossuccess = null;
  showandsuccess = null;
  showwebsuccess = null;
  thumbnailfile=null;

  freeze_rotas: freeze_rota[] = [
    { value: true, viewValue: 'true' },
    { value: false, viewValue: 'false' }

  ];
  constructor(private formBuilder: FormBuilder, private api: AdminapiService, private route: ActivatedRoute, private router: Router) {
    this.api.getassetsdata()
      .subscribe(res => {
        console.log(res);
        this.assetsdata = res;
        if (this.assetsdata.assetsBundleData.success) {
          console.log()
          this.searchtagtoppingList=this.assetsdata.assetsBundleData.data.searchtaglistdata
          this.toppingList = this.assetsdata.assetsBundleData.data.categorylistdata
          this.options = this.assetsdata.assetsBundleData.data.user_list
        }
        else {
          this.router.navigate(['admin-login']);
        }
      }, err => {
        console.log(err);
      })
 
  }

  get itemRows(): FormArray {
    return this.assetbundleform.get('itemRows') as FormArray;
  }

  addNewRow() {
    // control refers to your formarray
    const control = <FormArray>this.assetbundleform.controls['itemRows'];
    // add new formgroup
    control.push(this.initItemRows());
  }

  deleteRow(index: number) {
    // control refers to your formarray
    const control = <FormArray>this.assetbundleform.controls['itemRows'];
    // remove the chosen row
    control.removeAt(index);
  }
  initItemRows() {
    return this.formBuilder.group({
      // list all your form controls here, which belongs to your form array
      angleName: ['', Validators.required],
      angleversion: ['', Validators.required, Validators.min(0)],
      xRotation: ['', Validators.required, Validators.min(0)],
      yRotation: ['', Validators.required, Validators.min(0)],
      zRotation: ['', Validators.required, Validators.min(0)],
      xPosition: ['', Validators.required, Validators.min(0)],
      yPosition: ['', Validators.required, Validators.min(0)],
      zPosition: ['', Validators.required, Validators.min(0)],
      field_view: ['', Validators.required, Validators.min(0)],
      freeze_rotation: ['', Validators.required],
      distance: ['', Validators.required]
    });
  }

  ngOnInit() {

    this.assetbundleform = this.formBuilder.group({

      assetName: ['', Validators.required],
      windowinput: ['', Validators.required],
      macinput: ['', Validators.required],
      iosinput: [],
      androidinput: [],
      webinput: [],
      thumbnailinput: ['', Validators.required],
      thumbnail: [''],
      myControl: [[], Validators.required],
      categories: [null, Validators.required],
      searchtages: [null],
      version: [null, Validators.required],
      itemRows: this.formBuilder.array([this.initItemRows()])
    });
    this.uploaderwind = new FileUploader({
      url: '/assetapi/upload_single_file',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
    });
    this.uploadermac = new FileUploader({
      url: '/assetapi/upload_single_file',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
    });

    this.uploaderios = new FileUploader({
      url: '/assetapi/upload_single_file',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
    });
    this.uploaderand = new FileUploader({
      url: '/assetapi/upload_single_file',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
    });
    this.uploaderweb = new FileUploader({
      url: '/assetapi/upload_single_file',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
    });
    this.uploaderwind.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploaderwind.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'windowinput');
    this.uploadermac.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploadermac.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'macinput');
    this.uploaderios.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploaderios.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'iosinput');
    this.uploaderand.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploaderand.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'androidinput');
    this.uploaderweb.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploaderweb.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'webinput');


  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, name: any): any {
    let data = JSON.parse(response); //success server response
    if (name == "windowinput") {
      this.webwindowfile.name = data.filesdetail[0].filename;
      this.webwindowfile.title = data.filesdetail[0].originalname;
      this.showwinsuccess = true;
      setTimeout(() => {
        this.showwinsuccess = null;
      }, 2000);
    }
    if (name == "macinput") {
      this.webmacfile.name = data.filesdetail[0].filename;
      this.webmacfile.title = data.filesdetail[0].originalname;
      this.showmacsuccess = true;
      setTimeout(() => {
        this.showmacsuccess = null;
      }, 2000);
    }
    if (name == "webinput") {
      this.webwebglfile.name = data.filesdetail[0].filename;
      this.webwebglfile.title = data.filesdetail[0].originalname;
      this.showmacsuccess = true;
      setTimeout(() => {
        this.showmacsuccess = null;
      }, 2000);
    }
    if (name == "iosinput") {
      this.webiosfile.name = data.filesdetail[0].filename;
      this.webiosfile.title = data.filesdetail[0].originalname;
      this.showiossuccess = true;
      setTimeout(() => {
        this.showiossuccess = null;
      }, 2000);
    }
    if (name == "androidinput") {
      this.webandroidfile.name = data.filesdetail[0].filename;
      this.webandroidfile.title = data.filesdetail[0].originalname;
      this.showandsuccess = true;
      setTimeout(() => {
        this.showandsuccess = null;
      }, 2000);
    }
    console.log("this.assetbundleform.controls[name]", this.assetbundleform.controls[name])
    this.assetbundleform.controls[name].setValue(data.filesdetail[0].originalname);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let error = JSON.parse(response); //error server response
  }
  get f() { return this.assetbundleform.controls; }

  changepredefined() {

    this.showpredefined = true;

  }




  

  onFileChange1(event) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      }
  
      reader.readAsDataURL(event.target.files[0]);
    }
    let file = event.target.files[0]; // <--- File Object for future use.
    this.thumbnailfile=file;
    this.assetbundleform.controls['thumbnailinput'].setValue(file ? file.name : ''); // <-- Set Value for Validation
  }

  async onSubmit(form: NgForm, event) {
    this.submitted = true;
    // console.log(event);
    // await event.target[3].click()
    // await event.target[6].click()
    // await event.target[9].click()
    // await event.target[12].click()
    // event.target[15].click()
    console.log("insert")
    if (form['categories'].length > 0 && form['assetName'] !== ''&& form['thumbnailinput'] !== '' && form['windowinput'] !== '' && form['macinput'] !== '' && form['myControl'] !== [] && form['version'] !== '') {
      if (!this.showpredefined) {

        this.assetbundleform.value.itemRows = [];
        const control = <FormArray>this.assetbundleform.controls['itemRows'];
        control.removeAt(0);

      }
    }
    if (this.assetbundleform.invalid) {
      console.log("this.assetbundleform.invalid", this.assetbundleform.invalid)
      return

    }
    else {
      this.loading = true;
      console.log("form", form)
      this.api.addassetbundle(form, [this.webwindowfile, this.webmacfile, this.webiosfile, this.webandroidfile, this.webwebglfile,this.thumbnailfile]).subscribe(res => {

        this.assetsres = res;

        if (this.assetsres.assetresult.success) {
          this.router.navigate(['/admin/assetsbundlelist']);
        }
        else {
          this.loading = false;
        }

      }, err => {
        this.loading = false;
        console.log(err);
      })
    }

  }
}
