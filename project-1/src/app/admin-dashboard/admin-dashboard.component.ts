import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';

import { AdminapiService } from '../adminapi.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  token_id: string;
  param2: string;
  userlogininfo:any;
  constructor(private location: Location,private router: Router,private route: ActivatedRoute,private api:AdminapiService) {
    this.token_id = this.route.snapshot.params.token_id;
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

  ngOnInit() {
    
   

  }
}