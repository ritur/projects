import { Component, OnInit,ViewChild,HostListener,Directive, ElementRef, Output, EventEmitter } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showdivprofile = false;
  firstName = "";
  lastName = "";
  result: any;
  emailId = "";
 show: boolean = false;
  profile_image: any = null;
  constructor(private api: ApiService, private router: Router, private location: Location, private route: ActivatedRoute,private eRef: ElementRef) {
    // console.log("emailId", localStorage.getItem('emailId'))
    // console.log("firstname", localStorage.getItem('firstName'))
    // console.log( "lastname",localStorage.getItem('lastName'))
  }

  ngOnInit() {
    
    this.emailId =localStorage.getItem('emailId')
  
    this.firstName = localStorage.getItem('firstName')
   
    this.lastName =localStorage.getItem('lastName')

    if (typeof localStorage.getItem('profile_image') !== "undefined" && localStorage.getItem('profile_image')!== undefined&& localStorage.getItem('profile_image')!== "undefined") {
      this.profile_image = "../images/assets/profile_images/" +localStorage.getItem('profile_image')
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
@ViewChild('suggestboxicon') suggestboxicon:ElementRef;
  @HostListener('document:click', ['$event'])
  clickout(event){
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
    this.api.logoutuser()
      .subscribe(res => {
        // localStorage.clear();
        this.router.navigate(['/']);
      }, err => {
        console.log(err);
      })
  }
  editprofile() {

      this.router.navigate(['/livefurnish/profile'],{queryParams:{edit:'true'}});

  }
}
