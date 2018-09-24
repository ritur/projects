import { Component, OnInit, ViewChild, HostListener, Directive, ElementRef, Output, EventEmitter } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  showdivprofile = false;
  firstName = "";
  lastName = "";
  result: any;
  emailId = "";
  show: boolean = false;
  profile_image: any = null;
  constructor(private router: Router, private location: Location, private route: ActivatedRoute, private eRef: ElementRef) {
    // console.log("emailId", localStorage.getItem('emailId'))
    // console.log("firstname", localStorage.getItem('firstName'))
    // console.log( "lastname",localStorage.getItem('lastName'))
  }

  ngOnInit() {

    this.emailId = localStorage.getItem('admin-emailId')

    this.firstName = localStorage.getItem('admin-firstName')

    this.lastName = localStorage.getItem('admin-lastName')
    console.log()
    if (typeof localStorage.getItem('admin-profile_image') !== "undefined" && localStorage.getItem('admin-profile_image') !== undefined && localStorage.getItem('admin-profile_image') !== "undefined") {
      this.profile_image = "../images/assets/profile_images/" + localStorage.getItem('admin-profile_image')
    }

    // this.api.profileuser()
    // .subscribe(res => {
    //   this.result = res;
    //   console.log("this.result", this.result)
    //   if (this.result.Activationdata.success == true) {
    //     console.log("this.result", this.result)
    //     this.firstName = this.result.Activationdata.firstName;
    //     this.lastName = this.result.Activationdata.lastName;
    //     this.emailId = this.result.Activationdata.emailId;
    //     if (typeof this.result.Activationdata.profile_image !== "undefined" && this.result.Activationdata.profile_image !== null) {
    //       this.profile_image = "../images/assets/profile_images/" + this.result.Activationdata.profile_image;
    //     }
    //   }
    // }, err => {
    //   console.log(err);
    // })
  }
  @ViewChild('suggestbox') suggestbox: ElementRef;
  @ViewChild('suggestboxicon') suggestboxicon: ElementRef;
  @HostListener('document:click', ['$event'])
  clickout(event) {

    if (typeof this.suggestbox !== "undefined" && this.suggestbox.nativeElement.contains(event.target)) {
      // inside the dropdown
      this.showdivprofile = true;

    } else if (typeof this.suggestboxicon !== "undefined" && this.suggestboxicon.nativeElement.contains(event.target)) {
      // outside the dropdown
      this.showdivprofile = true;
    } else {
      // outside the dropdown
      this.showdivprofile = false;
    }
  }


  showprofile() {
    this.showdivprofile = !this.showdivprofile
  }
  logout() {
    localStorage.removeItem("admin-emailId")
    localStorage.removeItem('admin-emailId');
    localStorage.removeItem('admin-firstName');
    localStorage.removeItem('admin-lastName');
    localStorage.removeItem('admin-profile_image');
    localStorage.removeItem('token_id');
    this.router.navigate(['/admin-login']);
    // this.api.logoutuser()
    //   .subscribe(res => {
    //     localStorage.clear();
    //     this.router.navigate(['/']);
    //   }, err => {
    //     console.log(err);
    //   })
  }
  editprofile() {

    // this.router.navigate(['/livefurnish/profile']);

  }
}