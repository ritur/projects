import { Component, OnInit } from '@angular/core';
import {FileUploader, FileItem, ParsedResponseHeaders} from 'ng2-file-upload'

// const URL = '/api/';
// const URL = 'http://localhost:3000/assetapi/upload_single_file';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  uploader:FileUploader;
  
  constructor() { }
  ngOnInit(): void {
      this.uploader = new FileUploader({
          url: 'http://localhost:3000/assetapi/upload_single_file',
          headers: [{name:'Accept', value:'application/json'}],
          autoUpload: true,
      });
      this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
      this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    }
    
    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
      let data = JSON.parse(response); //success server response
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
      let error = JSON.parse(response); //error server response
  }
 
}
