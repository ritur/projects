import { Component, OnInit } from '@angular/core';
import { AdminapiService } from '../adminapi.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload'
@Component({
  selector: 'app-build-files',
  templateUrl: './build-files.component.html',
  styleUrls: ['./build-files.component.css']
})
export class BuildFilesComponent implements OnInit {
  uploaderwind: FileUploader;
  uploadermac: FileUploader;
  allowedMimeType: any;
  loading = false;
  messagerrormac = null;
  messagerrorwin = null;
  showwindowsuccess = false;
  showmacsuccess = false;
  showwindowsuccess_btn = false;
  showmacsuccess_btn = false;
  webmacfile: any = {};
  webwindowfile: any = {};
  message_succ_mac = false;
  message_succ_win = false;
  message_fail_mac = false;
  message_fail_win = false;
  constructor(private api: AdminapiService, private route: ActivatedRoute, private router: Router) { }



  ngOnInit() {
    // this.allowedMimeType = ['application/x-rar-compressed','application/octet-stream','application/zip','application/x-zip-compressed', 'multipart/x-zip', 'application/x-msdownload','application/vnd.olpc-sugar'];
    this.uploaderwind = new FileUploader({
      url: '/assetapi/upload_build?name=window',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
      // allowedMimeType: this.allowedMimeType 
    });
    this.uploadermac = new FileUploader({
      url: '/assetapi/upload_build?name=mac',
      headers: [{ name: 'Accept', value: 'application/json' }],
      autoUpload: true,
      // allowedMimeType: this.allowedMimeType 
    })

    this.uploaderwind.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers, 'windowinput');
    this.uploaderwind.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'windowinput');
    this.uploadermac.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers, 'macinput');
    this.uploadermac.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, 'macinput');
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, name: any): any {
    let data = JSON.parse(response); //success server response
    if (name == "windowinput") {
      this.showwindowsuccess = true;
      this.showwindowsuccess_btn = true;
      setTimeout(() => {
        this.showwindowsuccess = null;
      }, 2000);
      this.webwindowfile.name = data.filesdetail[0].filename;
      this.webwindowfile.title = data.filesdetail[0].originalname;
    }
    if (name == "macinput") {
      this.showmacsuccess = true;
      this.showmacsuccess_btn = true;
      setTimeout(() => {
        this.showmacsuccess = null;
      }, 2000);
      this.webmacfile.name = data.filesdetail[0].filename;
      this.webmacfile.title = data.filesdetail[0].originalname;
    }

    // console.log("this.assetbundleform.controls[name]", this.assetbundleform.controls[name])
    // this.assetbundleform.controls[name].setValue(data.filesdetail[0].originalname);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, name: any): any {

    let error = JSON.parse(response); //error server response

    if (name == "windowinput") {
      this.messagerrorwin = "Upload not successful"

      setTimeout(() => {
        this.messagerrorwin = null;
      }, 2000);
    }
    if (name == "macinput") {
      this.messagerrormac = "Upload not successful";
      setTimeout(() => {
        this.messagerrormac = null;
      }, 2000);
    }

    console.log(error)
  }


  save_build(name: string) {
    console.log(name);
    let data = [];
    this.loading = true;
    if (name == "mac") {
      data['build_name'] = "mac";
      data['build_detail'] = this.webmacfile;
    }
    else {
      data['build_name'] = "window";
      data['build_detail'] = this.webwindowfile;
    }

    this.api.savebuild(data)
      .subscribe(res => {
        this.loading = false;
        console.log(res);
        if (res.buildupdate.success) {

          if (res.buildupdate.buildname == "mac") {
            this.message_succ_mac = true;
            setTimeout(() => {
              this.message_succ_mac = false;
            }, 1500);
            this.showmacsuccess_btn = false;
          }
          else {
            this.message_succ_win = true;
            setTimeout(() => {
              this.message_succ_win = false;
            }, 1500);
            this.showwindowsuccess_btn = false;
          }
        }
        else {
          if (res.buildupdate.buildname == "mac") {
            this.message_fail_mac = true;
            setTimeout(() => {
              this.message_fail_mac = false;
            }, 1500);
          }
          else{
            this.message_fail_win = true;
            setTimeout(() => {
              this.message_fail_win = false;
            }, 1500);
          }
        }
      }, err => {
        this.loading = false;
        console.log(err);
      })

  }
}
