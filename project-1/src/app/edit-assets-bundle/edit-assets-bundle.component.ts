import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { AdminapiService } from '../adminapi.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload'
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, FormArray, NgForm, Validators } from '@angular/forms';
export interface freeze_rota {
  value: boolean;
  viewValue: string;
}
@Component({
  selector: 'app-edit-assets-bundle',
  templateUrl: './edit-assets-bundle.component.html',
  styleUrls: ['./edit-assets-bundle.component.css']
})
export class EditAssetsBundleComponent implements OnInit {
  uploaderwind: FileUploader;
  uploadermac: FileUploader;
  uploaderios: FileUploader;
  uploaderand: FileUploader;
  uploaderweb: FileUploader;
  submitted = false;
  editid: any;
  editdata: any;
  loading = false
  version: any;
  assetbundleform: FormGroup;
  toppings = new FormControl();
  toppingList: any[] = [{ _id: "", name: "" }];
  searchtagtoppingList: any[] = [{ _id: "", name: "" }];
  showpredefined = true;
  assetsdata1: any;
  assetName: string = '';
  // myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  windowassest: any;
  selectedcategory: any[] = ["D"];
  selectedsearchtag: any[] = ["D"];
  acceptform: boolean = false;
  editres: any;
  windowinputfile = "";
  macinputfile = "";
  iosinputfile = "";
  webglinputfile = "";
  thumbnailfile = "";
  androidinputfile = "";
  webwindowfile: any = {};
  webiosfile: any = {};
  webmacfile: any = {};
  webandroidfile: any = {};
  webwebglfile: any = {};
  freeze_rotas: freeze_rota[] = [
    { value: true, viewValue: 'true' },
    { value: false, viewValue: 'false' }

  ];
  url = "./assets/images/profile.png";
  showwinsuccess = null;
  showmacsuccess = null;
  showiossuccess = null;
  showandsuccess = null;
  showwebsuccess = null;
  constructor(private formBuilder: FormBuilder, private api: AdminapiService, private router: Router, private location: Location, private route: ActivatedRoute, ) {

    // this.createForm();

    if (typeof this.route.snapshot.queryParams.id !== "undefined") {
      console.log(this.route.snapshot.queryParams.id)
      this.editid = this.route.snapshot.queryParams.id;

    }

  }

  createForm() {
    this.assetbundleform = this.formBuilder.group({
      itemRows: this.formBuilder.array([])
    });
    this.assetbundleform.setControl('itemRows', this.formBuilder.array([]));
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

      angleName: ['', Validators.required],
      angleversion: ['', Validators.required],
      xRotation: ['', Validators.required],
      yRotation: ['', Validators.required],
      zRotation: ['', Validators.required],
      xPosition: ['', Validators.required],
      yPosition: ['', Validators.required],
      zPosition: ['', Validators.required],
      field_view: ['', Validators.required],
      freeze_rotation: ['', Validators.required],
      distance: ['', Validators.required]
    });
  }
  addloopeditdata() {
    // control refers to your formarray
    const control = <FormArray>this.assetbundleform.controls['itemRows'];
    // add new formgroup
    for (var i = 0; i < this.editdata.AssetEditresult.assetsdata.predefinedAngles.length; i++) {
      console.log("looping" + i);

      control.push(this.initItemRowsLoops(i));
    }
    return control;
  }
  initItemRowsLoops(index) {
    var tempdata = this.editdata.AssetEditresult.assetsdata.predefinedAngles[index];

    return this.formBuilder.group({

      angleName: [tempdata.angleName, Validators.required],
      angleversion: [tempdata.angleversion, Validators.required],
      xRotation: [tempdata.xRotation, Validators.required],
      yRotation: [tempdata.yRotation, Validators.required],
      zRotation: [tempdata.zRotation, Validators.required],
      xPosition: [tempdata.xPosition, Validators.required],
      yPosition: [tempdata.yPosition, Validators.required],
      zPosition: [tempdata.zPosition, Validators.required],
      field_view: [tempdata.field_view, Validators.required],
      freeze_rotation: [tempdata.freeze_rotation, Validators.required],
      distance: [tempdata.distance, Validators.required],

    });
  }
  ngOnInit() {

    this.assetbundleform = this.formBuilder.group({
      // here
      assetName: [''],
      windowinput: [''],
      macinput: [''],
      iosinput: [''],
      androidinput: [''],
      webglinput: [''],
      thumbnailinput: [''],
      thumbnail: [''],
      myControl: [''],
      categories: [''],
      searchtages: [''],
      version: [''],
      itemRows: this.formBuilder.array([this.initItemRows()])

    });

    this.api.editassetbundle(this.editid)
      .subscribe(res => {
        console.log(res);
        this.editdata = res;
        this.toppingList = this.editdata.AssetEditresult.category
        this.searchtagtoppingList = this.editdata.AssetEditresult.searchtag;
        this.selectedcategory = this.editdata.AssetEditresult.assetsdata.category;
        this.selectedsearchtag = this.editdata.AssetEditresult.assetsdata.searchtag;
        this.assetName = this.editdata.AssetEditresult.assetsdata.assetsName
        this.version = this.editdata.AssetEditresult.assetsdata.version
        this.url = "../images/assets/images/" + this.editdata.AssetEditresult.assetsdata.thumbnail;
        this.options = this.editdata.AssetEditresult.userList;
        if (typeof this.editdata.AssetEditresult.assetsdata.windowsAssetbundle !== "undefined") {
          this.windowinputfile = this.editdata.AssetEditresult.assetsdata.windowsAssetbundle.title;
          this.webwindowfile = this.editdata.AssetEditresult.assetsdata.windowsAssetbundle;
        }
        if (typeof this.editdata.AssetEditresult.assetsdata.macAssetbundle !== "undefined") {
          this.macinputfile = this.editdata.AssetEditresult.assetsdata.macAssetbundle.title;
          this.webmacfile = this.editdata.AssetEditresult.assetsdata.macAssetbundle;
        }
        if (typeof this.editdata.AssetEditresult.assetsdata.androidAssetbundle !== "undefined") {
          this.androidinputfile = this.editdata.AssetEditresult.assetsdata.androidAssetbundle.title;
          this.webandroidfile = this.editdata.AssetEditresult.assetsdata.macAssetbundle;
        }
        if (typeof this.editdata.AssetEditresult.assetsdata.iosAssetbundle !== "undefined") {
          this.iosinputfile = this.editdata.AssetEditresult.assetsdata.iosAssetbundle.title;
          this.webiosfile = this.editdata.AssetEditresult.assetsdata.iosAssetbundle;
        }
        if (typeof this.editdata.AssetEditresult.assetsdata.webglAssetbundle !== "undefined") {
          this.webglinputfile = this.editdata.AssetEditresult.assetsdata.webglAssetbundle.title;
          this.webwebglfile = this.editdata.AssetEditresult.assetsdata.webglAssetbundle;
        }
        console.log("this.editdata.AssetEditresult.assetsdata.predefinedAngles.length", this.editdata.AssetEditresult.assetsdata.predefinedAngles.length)
        if (this.editdata.AssetEditresult.assetsdata.predefinedAngles.length > 0) {
          this.assetbundleform = this.formBuilder.group({
            // here
            assetName: [this.editdata.AssetEditresult.assetsdata.assetsName, Validators.required],
            windowinput: [this.windowinputfile, Validators.required],
            macinput: [this.macinputfile, Validators.required],
            iosinput: [this.iosinputfile],
            androidinput: [this.androidinputfile],
            webglinput: [this.webglinputfile],
            thumbnailinput: [this.editdata.AssetEditresult.assetsdata.thumbnail, Validators.required],
            thumbnail: [''],
            myControl: [this.editdata.AssetEditresult.assetsdata.userpermission, Validators.required],
            categories: [this.editdata.AssetEditresult.assetsdata.category, Validators.required],
            searchtages: [this.editdata.AssetEditresult.assetsdata.searchtag],
            version: [this.editdata.AssetEditresult.assetsdata.version, Validators.required],
            itemRows: this.formBuilder.array([this.initItemRowsLoops(0)]),
          });
        }
        else {
          this.showpredefined = false;
          this.assetbundleform = this.formBuilder.group({
            // here
            assetName: [this.editdata.AssetEditresult.assetsdata.assetsName, Validators.required],
            windowinput: [this.windowinputfile, Validators.required],
            macinput: [this.macinputfile, Validators.required],
            iosinput: [this.iosinputfile],
            androidinput: [this.androidinputfile],
            webglinput: [this.webglinputfile],
            thumbnailinput: [this.editdata.AssetEditresult.assetsdata.thumbnail, Validators.required],
            thumbnail: [''],
            myControl: [this.editdata.AssetEditresult.assetsdata.userpermission, Validators.required],
            categories: [this.editdata.AssetEditresult.assetsdata.category, Validators.required],
            searchtages: [this.editdata.AssetEditresult.assetsdata.searchtag],
            version: [this.editdata.AssetEditresult.assetsdata.version, Validators.required],
            itemRows: this.formBuilder.array([this.initItemRows()]),
          })
        }

        if (this.editdata.AssetEditresult.assetsdata.predefinedAngles.length > 1) {
          const control = <FormArray>this.assetbundleform.controls['itemRows'];
          // add new formgroup


          for (var i = 1; i < this.editdata.AssetEditresult.assetsdata.predefinedAngles.length; i++) {


            control.push(this.initItemRowsLoops(i));
          }
        }



      }, err => {
        console.log(err);
      })
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
    this.uploaderweb.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'webglinput');



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
    if (name == "webglinput") {
      this.webwebglfile.name = data.filesdetail[0].filename;
      this.webwebglfile.title = data.filesdetail[0].originalname;
      this.showwebsuccess = true;
      setTimeout(() => {
        this.showwebsuccess = null;
      }, 2000);
    }
    console.log("this.assetbundleform.controls[name]", this.assetbundleform.controls[name])
    this.assetbundleform.controls[name].setValue(data.filesdetail[0].originalname);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let error = JSON.parse(response); //error server response
  }

  changepredefined() {

    this.showpredefined = true;
  }


  get f() { return this.assetbundleform.controls; }

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
    this.thumbnailfile = file;
    this.assetbundleform.controls['thumbnailinput'].setValue(file ? file.name : ''); // <-- Set Value for Validation
  }

  //Submit form 
  onSubmit(form: NgForm) {
    this.submitted = true;
    console.log("form data", form)
    if (form['categories'].length > 0 && form['assetName'] !== '' && form['thumbnailinput'] !== '' && form['windowinput'] !== '' && form['macinput'] !== '' && form['myControl'] !== [] && form['version'] !== '') {
      if (!this.showpredefined) {
        this.assetbundleform.value.itemRows = [];
        const control = <FormArray>this.assetbundleform.controls['itemRows'];
        control.removeAt(0);

      }
    }

    if (this.assetbundleform.invalid) {
      console.log("this.assetbundleform.invalid", this.assetbundleform.invalid)
      return;
    }
    else {
      this.loading = true;
      this.api.editassetbundlepost(form, this.editid, [this.webwindowfile, this.webmacfile, this.webiosfile, this.webandroidfile, this.webwebglfile, this.thumbnailfile]).subscribe(res => {
        console.log("response");
        this.editres = res;
        if (this.editres.categoryresult.success) {
          this.router.navigate(['/admin/assetsbundlelist']);
        }
        else {
          this.loading = false;
        }


      }, err => {
        console.log(err);
      })
    }
  }

}
