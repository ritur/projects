var express = require('express');
var router = express.Router();
var user = require('./../schema/users');
var Promise = require("bluebird");
var session = require('express-session');
var crypto = require('crypto');
var cors = require('cors');

var mongodb = require('mongodb');

const stripe = require("stripe")(keySecret);
var jwt = require('jsonwebtoken');
var whitelist = ['http://locahost:4200', 'http://167.99.1.205/wp-content/themes/x/ajax-signUpForm.php']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}


//create the customer
router.post('/charge', function (req, res) {
    console.log("req.body", req.body);
    var login_user_id = { "_id": req.session.user._id };
    var tempcreditprice;
    var current_balance;
    user.findById(login_user_id, ["creditprice", "credit_detail"]).exec()
        .then((creditpricetemp) => {
            tempcreditprice = creditpricetemp.creditprice
            current_balance = creditpricetemp.credit_detail.current_balance;
            console.log("creditpricetemp", creditpricetemp)

            return stripe.customers.create({
                email: req.body.token.email, // customer email, which user need to enter while making payment
                card: req.body.token.id // token for the given card 
            })
        })

        .then(customer =>
            stripe.charges.create({
                amount: req.body.amount,
                description: "Credit Charge",
                currency: "usd",
                customer: customer.id
            }))
        .then(charge => {

            console.log(charge);

            var options = { upsert: true, multi: true };
            var d = new Date();
            //     var datecreated=d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()
            var tempdate = [];
            var datedd = d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#");
            tempdate = datedd.split(" ");
            var charges_detail = charge.amount / (tempcreditprice * 100)
            console.log("datedd", tempdate)
            updateData = {
                $push: {
                    "cards": { $each: [{ "_id": new mongodb.ObjectID(), "strip_cust_id": charge.customer, 'strip_token_id': charge.id, "last_no": charge.source.last4 }] },
                    "transaction":
                        {
                            $each: [{
                                "remaining_credit": parseInt(current_balance) + (charge.amount / (tempcreditprice * 100)),
                                "date": tempdate[0],
                                "time": tempdate[1],
                                "credit": 0,
                                "amount": "+" + charges_detail,
                                "discount": 0
                            }]
                        }
                },
                $inc: { "credit_detail.current_balance": charge.amount / (tempcreditprice * 100) }

            }
            console.log('updateData', updateData)
            stripe.invoiceItems.create({
                amount: 1000,
                currency: 'usd',
                customer: charge.customer,
                description: 'One-time setup fee',
            });
            stripe.invoices.create({
                customer: charge.customer,
                billing: 'send_invoice',
                days_until_due: 30,
            });
            return user.findOneAndUpdate(login_user_id, updateData, options).exec()
        }).then(function (result) {
            console.log('result', result);
           
            res.json({
                "UserInformation": {
                    "processStatus": "Payment successful",

                    "success": true
                }
            })
        })
        .catch(err => {
            console.log("Error:", err);
            res.json({
                "UserInformation": {
                    "processStatus": "Payment fail",

                    "success": false
                }
            })
        });


});


//Date format function
Date.prototype.customFormat = function (formatString) {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th;
    YY = ((YYYY = this.getFullYear()) + "").slice(-2);
    MM = (M = this.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][M - 1]).substring(0, 3);
    DD = (D = this.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][this.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
    h = (hhh = this.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    hhhh = hhh < 10 ? ('0' + hhh) : hhh;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = this.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = this.getSeconds()) < 10 ? ('0' + s) : s;
    return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM);
};



//Reuse the card
router.post('/chargecard', function (req, res) {
    console.log("req.body", req.body)
    var tempinfo = {}
    var customer_id;;
    user.findById({ "_id": req.session.user._id }, ["cards", "credit_detail", "creditprice"]).exec()
        .then((result) => {
            console.log("credit", result)
            tempinfo = result

            result.cards.forEach((value, index) => {
                if (req.body.custid == value._id) {
                    customer_id = value.strip_cust_id;
                }
            });
            return stripe.charges.create({
                amount: req.body.amount,
                currency: 'usd',
                customer: customer_id,
            }
            )
        })

        .then(charge => {
            var options = { new: true };
            var d = new Date();


            var tempdate = [];
            var datedd = d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#");
            tempdate = datedd.split(" ");
            var charges_detail = charge.amount / (tempinfo.creditprice * 100);
            console.log(charge);
            updateData = {
                $push: {
                    // "cards": { $each: [{ "_id": new mongodb.ObjectID(), "strip_cust_id": charge.customer, 'strip_token_id': charge.id, "last_no": charge.source.last4 }] },
                    "transaction":
                        {
                            $each: [{
                                "remaining_credit": parseInt(tempinfo.credit_detail.current_balance) + (charge.amount / (tempinfo.creditprice * 100)),
                                "date": tempdate[0],
                                "time": tempdate[1],
                                "credit": 0,
                                "amount": "+" + charges_detail,
                                "discount": 0
                            }]
                        }
                },
                $inc: { "credit_detail.current_balance": charge.amount / (tempinfo.creditprice * 100) }
              

            }
            console.log('updateData', updateData)
            console.log('updattempinfo._id tempinfo._id tempinfo._ideData', tempinfo._id)
            return user.findOneAndUpdate({ "_id": tempinfo._id }, updateData, options).exec()
                .then(charge => {
                    console.log("charge",charge)
                    return stripe.invoiceItems.create({
                        amount: req.body.amount,
                        currency: 'usd',
                        customer: customer_id,
                        description: 'One-time setup fee',
                    })


                }).then((payment_De) => {
                    console.log("payement", payment_De)
                    return stripe.invoices.create({
                        customer: customer_id,
                        billing: 'send_invoice',
                        days_until_due: 30,
                    })
                })
                .then((payment_De2) => {
                    console.log("payement", payment_De2)
                    res.json({
                        "UserInformation": {
                            "processStatus": "Payment successful",

                            "success": true
                        }
                    })
                }).catch(err => {
                    console.log("Error:", err);
                    res.json({
                        "UserInformation": {
                            "processStatus": "Payment successful",
        
                            "success": true
                        }
                    })
                });
        })
        .catch(err => {
            console.log("Error:", err);
            res.json({
                "UserInformation": {
                    "processStatus": "Payment failed",

                    "success": false
                }
            })
        });


});


router.get('/', function (req, res, next) {

    if (!req.session.user) {
        res.json({
            "logoutUserResult": {
                "processStatus": "User not authorized for access.",

                "success": false
            }
        })
    }
    else {
        var flag = false;
        user.findOne({ "emailId": req.session.user.emailId }, ["login_tokenid", "allowed_no_of_login"])
            .then((user_detail) => {


                if (user_detail) {
                    console.log("flag", flag);

                    return user.findOne({ "_id": req.session.user._id }, ("emailId transaction credit_detail cards")).exec()
                }
                else {
                    console.log("flag", flag);
                    return false;
                }
            })
            .then((user_result) => {
                if (user_result) {
                    console.log("user_result", user_result)
                    var result = [];
                    (user_result.transaction).forEach((value, index) => {
                        var tempresult = {};
                        if (value.credit !== 0) {
                            tempresult.date = value.date;
                            tempresult.time = value.time;
                            tempresult.users = user_result.emailId;
                            tempresult.credit = value.credit;
                            tempresult.remaining = value.remaining_credit;
                            result.push(tempresult);
                        }

                    });
                    res.json({

                        "processStatus": "User",
                        "user_data": result,
                        "success": true

                    })


                }
                else {
                    res.json({
                        "logoutUserResult": {
                            "processStatus": "User not authorized for access.",

                            "success": false
                        }
                    })

                }
            })
    }


});

module.exports = router;