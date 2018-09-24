import { Component, OnInit, ViewChild, ElementRef, Inject, HostListener, Input, Directive } from '@angular/core';
import { ApiService } from '../api.service';
import { Location } from "@angular/common";
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';
export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-image-credits',
  templateUrl: './image-credits.component.html',
  styleUrls: ['./image-credits.component.css']
})

export class ImageCreditsComponent implements OnInit {
  usercreditprice: number;
  imglogdata: any;
  activation: any;
  message_disable = false;
  resultquantity: any;
  // messagedata:string="please verify your account from your email address.. if you did not receive an email,";
  userlogininfo: any;
  credits: any;
  actualamount: any;
  buyoption: any = 0;
  handler: any;
  amount = 0;
  is_active = true;
  emailId: string;
  _id: any;
  msg: string;
  credit: any;
  credit_response: any;
  message: any = "";
  loader: boolean = false;
  disableoptionbutton = true;
  disableoption: any = false;
  constructor(private router: Router, private location: Location,
    private route: ActivatedRoute, private api: ApiService, private el: ElementRef) {
    this.api.checkloginuser()
      .subscribe(res => {
        console.log(res);
        this.userlogininfo = res;
        if (!this.userlogininfo.loginUserResult.success) {
          this.router.navigate(['/']);
        }
      }, err => {
        console.log(err);
      })
    console.log("this.is_active", this.is_active);
  }
  @Directive({
    selector: '[OnlyNumber]'
  })
  @Input() OnlyNumber: boolean;

  // @HostListener('keydown', ['$event']) onKeyDown(event) {
  //   let e = <KeyboardEvent> event;
  //   
  // }
  ngOnInit() {



    this.api.getcredits()
      .subscribe(res => {
        console.log(res.is_active)
        this.is_active = res.is_active;
        this.imglogdata = res.user_data;
        this.credits = res.card;
        this.credit = res.credit;
        this.emailId = res.emailId
        this.usercreditprice = res.cardprice;
        if (this.credits.length > 0) {
          if (this.credits.length == 1) {
            console.log("this.credits.length", this.credits.length)
            this.buyoption = 1;
            this._id = res.card[0]._id
          }
          else {
            this.buyoption = "morethanone"
          }
        }
      }, err => {
        console.log(err);
      })


    //payement without any card detail
    this.handler = (<any>window).StripeCheckout.configure({
      key: environment.stripeKey,
      image: '../../assets/images/logo1.jpg',
      locale: 'auto',
      token: token => {
        this.loader = true;
        // this.disableoption = true;
        this.api.processPayment(token, this.actualamount)
          .subscribe(res => {
            console.log("res", res)
            this.credit_response = res;
            this.message = res.UserInformation.processStatus;
            this.loader = false;
            // this.disableoption = true;
            setTimeout(() => {
              this.message = "";
              location.reload()
              // this.router.navigate(['/livefurnish/imagecredits']);
            }, 2000);

          }, (err) => {
            console.log(err);
            // this.disableoption = true;
            this.loader = false;
          }
          );
      }
    });

    $('.Checkbox').on('click', function() {
       console.log("Checkbox tick");
        });
  
  // $('.spinner .btn:first-of-type').on('click', function() {
  //   $('.spinner input').val( parseInt($('.spinner input').val(), 10) + 1);
  //  var value_spinner=$('.spinner input').val();
  //   this.paymentquantitycheck(value_spinner)
  //   });
  //   $('.spinner .btn:last-of-type').on('click', function() {
  //   $('.spinner input').val( parseInt($('.spinner input').val(), 10) - 1);
  //   this.paymentquantitycheck($('.spinner input').val())
  //   });
    
  }
  handlechangeamt(evt) {
    console.log("keyCode ",evt.keyCode );
    if ((evt.keyCode!==8&&evt.keyCode!==46)&&((evt.keyCode === 190) || ((evt.shiftKey || (evt.keyCode < 48 || evt.keyCode > 57)) && (evt.keyCode < 96 || evt.keyCode > 105)))) {
      console.log("Please stoop");
      evt.preventDefault();
    }
    // if (this.OnlyNumber) {
    //   if ([46, 8, 9, 27, 13, 110, evt.keyCode === 65].indexOf(evt.keyCode) !== -1 ||
    //     // Allow: Ctrl+A
    //     (evt.keyCode === 65 && (evt.ctrlKey || evt.metaKey)) ||
    //     // Allow: Ctrl+C
    //     (evt.keyCode === 67 && (evt.ctrlKey || evt.metaKey)) ||
    //     // Allow: Ctrl+V
    //     (evt.keyCode === 86 && (evt.ctrlKey || evt.metaKey)) ||
    //     // Allow: Ctrl+X
    //     (evt.keyCode === 88 && (evt.ctrlKey || evt.metaKey)) ||
    //     // Allow: home, end, left, right
    //     (evt.keyCode >= 35 && evt.keyCode <= 39)) {
    //     // let it happen, don't do anything
    //     return;
    //   }
    //   // Ensure that it is a number and stop the keypress
    //   if ((evt.shiftKey || (evt.keyCode < 48 || evt.keyCode > 57)) && (evt.keyCode < 96 || evt.keyCode > 105)) {
    //     evt.preventDefault();
    //   }
    // }
    else {
      console.log("typeof eventvalu", typeof parseInt(evt.target.value))
      console.log("typeof eventvalu value", parseInt(evt.target.value))
      if (evt.target.value == 0) {
        this.actualamount = 0;
        this.amount = 0;
      }

      this.paymentquantitycheck(evt.target.value)
    }

  }

  //payement with card detail saved

  payPayment(amt) {
    console.log(amt);

    if (amt > 0) {
      this.loader = true;
      this.api.creditpricequantity(this._id)
        .subscribe(res => {
          this.resultquantity = res;
          console.log(this.resultquantity.success);
          if (this.resultquantity.success == true) {
            this.usercreditprice = this.resultquantity.data.creditprice
            if (amt > 0 && this.resultquantity.data.is_active) {
              // this.disableoption = false;
            
              this.actualamount =parseInt(amt) * (this.usercreditprice* 100); 
              this.amount = (parseInt(amt)) * (this.usercreditprice);
              if (this.amount >= 0.5) {
                this.api.processcreditPayment(this._id, this.actualamount)
                  .subscribe(res => {
                    console.log("res", res)
                    this.credit_response = res;
                    this.message = res.UserInformation.processStatus;
                    // this.disableoption = true;
                    this.loader = false;
                    setTimeout(() => {
                      this.message = "";
                      location.reload();
                    }, 2000);

                    // this.router.navigate(['/livefurnish/imagecredits']);
                  }, (err) => {
                    console.log(err);
                  }
                  );
              }
              else {
                this.loader = false;
                this.disableoption = true;
                this.msg = "Credit Price must be $0.5 or more";
                setTimeout(() => {
                  this.disableoption = false;
                }, 2000);
              }
            }

          }
          else if (this.resultquantity.success == false) {
            setTimeout(() => {
              this.message = "user in not authorized";
              location.reload();
            }, 2000);
          }

          // this.router.navigate(['/livefurnish/imagecredits']);
        }, (err) => {
          console.log(err);
          this.message = "Some error occured";
          setTimeout(() => {
            this.message = "";
          }, 1000);
          return false;
        }
        );

      // this.disableoption = true;

    }
    else {
      this.disableoption = true;
      this.msg = "Credit quantity is not applicable";
      setTimeout(() => {
        this.disableoption = false;
      }, 2000);
    }
  }


  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close()
  }


  handlePayment(amt) {
    console.log("amount", amt)
    this.paymentquantitycheck(amt);
    if (amt > 0) {
      this.handler.open({
        name: 'Live Furnish',
        excerpt: 'Image credit buy',
        amount: this.actualamount,
        email: this.emailId
      });
    }
    else {
      this.disableoption = true;
      this.msg = "Credit quantity is not applicable"
      setTimeout(() => {
        this.disableoption = false;
      }, 2000);
    }
  }

  increasevalue(inputvalue, event) {
    
    var eventvalu = parseInt(inputvalue)
    console.log("event",$('.spinner input').val())
    console.log("typeof eventvalu", typeof eventvalu)
    if (typeof eventvalu !== "undefined") {
      $('.spinner input').val( parseInt($('.spinner input').val(), 10) + 1);


    }
    else {
      console.log("#amountofcredit.value")
      console.log(event.target)
      $('.spinner input').val(1);

    }
    if (parseInt(inputvalue) == 0) {
      this.actualamount = 0;
      this.amount = 0;
    }
   
    this.paymentquantitycheck($('.spinner input').val())

  }

  deacreasevalue(inputvalue, event) {

    var eventvalu = parseInt(inputvalue);
    if (eventvalu > 0) {
      $('.spinner input').val( parseInt($('.spinner input').val(), 10) - 1);
    }
    if (parseInt($('.spinner input').val()) == 0) {
      this.actualamount = 0;
      this.amount = 0;
    }

    this.paymentquantitycheck($('.spinner input').val())
  }


  public paymentquantitycheck(valueofinput: any) {
    if (parseInt(valueofinput) > 0) {
      this.api.creditpricequantity(this._id)
        .subscribe(res => {
          this.resultquantity = res;
          console.log(this.resultquantity.success);
          if (this.resultquantity.success == true) {
            this.usercreditprice = this.resultquantity.data.creditprice
            if (valueofinput > 0 && this.resultquantity.data.is_active) {
              // this.disableoption = false;
             
              this.actualamount =parseInt(valueofinput) * (this.usercreditprice* 100); 
              
              this.amount = (parseInt(valueofinput)) *( this.usercreditprice);
              return true
            }

          }
          else if (this.resultquantity.success == false) {
            setTimeout(() => {
              this.message = "user in not authorized";
              location.reload();
            }, 2000);
          }

          // this.router.navigate(['/livefurnish/imagecredits']);
        }, (err) => {
          console.log(err);
          this.message = "Some error occured";
          setTimeout(() => {
            this.message = "";
          }, 1000);
          return false;
        }
        );
    }
    else {
      return false
    }
  }

  // Checkbox-tick.on('is-checked', function(event){

  // });
}
