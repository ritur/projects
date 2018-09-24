import { Component, OnInit } from '@angular/core';
import {AdminapiService} from './../adminapi.service'
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userlogininfo:any;
  constructor(private route: ActivatedRoute,
    private router: Router,private api:AdminapiService) {
    
   }

  ngOnInit() {
    this.api.checkloginuseradmin()
    .subscribe(res => {
      console.log(res);
      this.userlogininfo = res;
    if (!this.userlogininfo.loginUserResult.success||!this.userlogininfo.loginUserResult.is_admin){
        this.router.navigate(['admin-login']);
      }
    }, err => {
      console.log(err);
    })
  }

}
