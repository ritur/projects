import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  token_id: string;
  param2: string;
  userlogininfo:any;
  constructor(private location: Location,private router: Router,private route: ActivatedRoute,private api:ApiService) {
    this.token_id = this.route.snapshot.params.token_id;
    this.api.checkloginuser()
    .subscribe(res => {
      console.log(res);
      this.userlogininfo=res;
      if(!this.userlogininfo.loginUserResult.success){
        this.router.navigate(['login']);
      }
     }, err => {
       console.log(err);
     })
   }

  ngOnInit() {
    
   

  }

}
