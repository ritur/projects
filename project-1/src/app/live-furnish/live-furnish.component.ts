import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-live-furnish',
  templateUrl: './live-furnish.component.html',
  styleUrls: ['./live-furnish.component.css']
})
export class LiveFurnishComponent implements OnInit {
  activation: any;
  message = false;
  emailId:any;
  messagesuccess=false;
  nextactivation:any;
  messagedata:string="please verify your account from your email address.. if you did not receive an email,";
  constructor(private api: ApiService, private route: ActivatedRoute,
    private router: Router) {
    
    this.api.checkactive()

    .subscribe(res => {
      
      this.activation = res;
      if (!this.activation.Activationdata.success) {
        
        this.message = true;
        this.emailId=this.activation.Activationdata.emailId

      }
      else{
        if(this.activation.Activationdata.is_admin){
          this.router.navigate(['/admin/admin-dashboard']);
        }
      }
    }, err => {
      console.log(err);
    })
   }

  ngOnInit() {
  }
  click_link() {
    // console.log("ckucj ubj")
    // console.log("this.emailId",this.emailId)
    this.api.resendemail( this.emailId)

      .subscribe(res => {
        
        this.nextactivation = res;
        if (this.nextactivation.signupProcessResult.success) {
          this.messagesuccess = true;
          setTimeout(() => {
            
            this.messagesuccess=false;
          }, 5000);
        }
      }, err => {
        console.log(err);
      })
  }
}
