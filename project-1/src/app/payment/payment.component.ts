import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  userlogininfo:any;
  imglogdata = [{'date' : '08/3/11', 'invoice' : '19:03', 'amount' : '$300', 'emailid' : 'xyz@gmail.com', 'invoic' : '5'},
    {'date' : '05/3/11', 'invoice' : '19:03', 'amount' : '$300', 'emailid' : 'xyz@gmail.com', 'invoic' : '5'},
    {'date' : '03/3/11', 'invoice' : '09:03', 'amount' : '$300', 'emailid' : 'xyz@gmail.com', 'invoic' : '4'},
    {'date' : '02/3/11', 'invoice' : '15:03', 'amount' : '$300', 'emailid' : 'xyz@gmail.com', 'invoic' : '7'},
    {'date' : '07/3/11', 'invoice' : '13:03', 'amount' : '$300', 'emailid' : 'xyz@gmail.com', 'invoic' : '6'},
    {'date' : '06/3/11', 'invoice' : '16:03', 'amount' : '$300', 'emailid' : 'xyz@gmail.com', 'invoic' : '3'},]

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) { 
    // this.api.checkloginuser()
    // .subscribe(res => {
    //   console.log(res);
    //   this.userlogininfo=res;
    //   if(!this.userlogininfo.loginUserResult.success){
    //     this.router.navigate(['/']);
    //   }
    //  }, err => {
    //    console.log(err);
    //  })
  }

  ngOnInit() {
  }

}
