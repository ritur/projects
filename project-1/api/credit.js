var express = require('express');
var router = express.Router();
var user = require('./../schema/users');
var Promise = require("bluebird");
// var session = require('express-session');
var crypto = require('crypto');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var creditpriceuser = require('./../schema/creditpriceuser');

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




router.get('/image_credit', function (req, res, next) {

    console.log("req.session.user", req.session.user)
    if (!req.session.user) {
        res.json({
            "logoutUserResult": {
                "processStatus": "User not authorized for access.",

                "success": false
            }
        })
    }
    else {
        var result = [];
        var flag = false;
        user.findOne({ "emailId": req.session.user.emailId }, ["login_tokenid", "allowed_no_of_login"])
            .then((user_detail) => {
                console.log("user_detail", user_detail);
                // user_detail.login_tokenid.forEach((value, index) => {
                //     if (req.session.user.login_tokenid[0].token_id == value.token_id) {
                //         flag = true;

                //     }

                // });

                if (user_detail) {
                    console.log("flag", flag);

                    return user.findOne({ "_id": req.session.user._id }, { is_active: 1, emailId: 1, transaction: 1, credit_detail: 1, "cards._id": 1, "cards.last_no": 1, creditprice: 1, "credit_detail.current_balance": 1 }).exec()
                }
                else {
                    console.log("flag", flag);
                    return false;
                }
            })
            .then((user_result) => {
                if (user_result) {
                    console.log("user_result", user_result)

                    var card = [];
                    card = user_result.cards;
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
                    })
                    // });
                    // return creditpriceuser.findOne({ "email": user_result.emailId }, ("price")).exec()
                    //     .then((creditprice) => {
                    console.log("user_result.result", result)
                    console.log("card", card)
                    console.log(" user_result.is_active", user_result.is_active)
                    console.log("user_result.creditprice", user_result.creditprice)
                    console.log(user_result.creditprice)
                    res.json({

                        "processStatus": "User ceredit detail",
                        "user_data": result,
                        "card": card,
                        "credit": user_result.credit_detail.current_balance,
                        "emailId": user_result.emailId,
                        "is_active": user_result.is_active,
                        "cardprice": user_result.creditprice,
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


//admin list user for edit
router.get('/listuser/:token', function (req, res, next) {
    var assetslistdatatemp = [];
    var token = req.params.token;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "userlist": {
                    "processStatus": "token id is not applicable",
                    "success": false,
                    "is_admin":false
                }
            });
        }
        else {

            if (decoded.is_admin == 1) {
                user.find({}, ("emailId creditprice firstName lastName credit_detail.current_balance")).exec()
                    .then(function (creditpriceuserdata) {



                        console.log("assetslistdatatemp", creditpriceuserdata)
                        res.json({
                            "userlist": {
                                "processStatus": "Succefully fetched",
                                "data": creditpriceuserdata,
                                "success": true,
                                "is_admin":true
                            }
                        });


                    })
            }

            else {
                res.json({
                    "userlist": {
                        "processStatus": "User is not authorized",
                        "data": [],
                        "is_admin":false,
                        "success": false
                    }
                });
            }
        }

    })
        


})


//Detail of user using api of admin
router.get('/usercreditdetail/:token', function (req, res, next) {
    var userId = req.query.user_id;
    var tempuserdata = {};
    var token = req.params.token;

    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "user_data": {
                    "processStatus": "token id is not applicable",
                    "is_admin":false,
                    "success": false
                }
            });
        }
        else {

            if (decoded.is_admin == 1) {
                user.findById({ '_id': userId }, ["firstName", "lastName", "emailId", "creditprice", "street", "address", "password", "mobileNo", "allowed_no_of_login"]).exec()


                    .then(function (userlistdata) {
                        console.log("assetslist", userlistdata)
                        if (userlistdata) {
                            tempuserdata.firstName = userlistdata.firstName;
                            tempuserdata.lastName = userlistdata.lastName;
                            tempuserdata.emailId = userlistdata.emailId;
                            tempuserdata.creditprice = userlistdata.creditprice;
                            tempuserdata.password = userlistdata.password;
                            tempuserdata.allowed_no_of_login = userlistdata.allowed_no_of_login;

                            if (typeof userlistdata.mobileNo == "undefined") {
                                tempuserdata.mobileNo = "";
                            }
                            else {
                                tempuserdata.mobileNo = userlistdata.mobileNo;
                            }
                            if (typeof userlistdata.street == "undefined") {
                                tempuserdata.street = "";
                            }
                            else {
                                tempuserdata.street = userlistdata.street;
                            }
                            if (typeof userlistdata.address == "undefined") {
                                tempuserdata.address = "";
                            }
                            else {
                                tempuserdata.address = userlistdata.address;
                            }

                            console.log("tempuserdata", tempuserdata)
                            res.json({
                                "user_data": {
                                    "processStatus": "Succefully fetched",
                                    "data": tempuserdata,
                                    "success": true,
                                    "is_admin":true
                                }
                            });
                        }
                        else {
                            res.json({
                                "user_data": {
                                    "processStatus": "Something happened",
                                    "is_admin":true,
                                    "success": false
                                }
                            });
                        }
                    })
            }
            else {

                res.json({
                    "user_data": {
                        "processStatus": "User is not authorized",
                        "is_admin":false,
                        "success": false
                    }
                });
            }
        }

    });
})


//edit
router.post('/edituserprice', function (req, res, next) {
    var token = req.body.token;
    var id = req.body.id;
    var option = {
        'price': req.body.price

    };
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "user_data": {
                    "processStatus": "token id is not applicable",
                    "is_admin":false,
                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                creditpriceuser.findByIdAndUpdate(id, option, { upsert: true }, function (err, updatedata) {
                    if (err) {
                        res.json({
                            "Asseteditresult": {
                                "processStatus": "user is credit price is not updated",
                                "is_admin":true,
                                "success": false
                            }
                        });
                    }
                    else {
                        console.log('user is credit price is not updated');
                        res.json({
                            "Asseteditresult": {
                                "processStatus": "user is credit price is  updated",
                                "is_admin":true,
                                "success": true
                            }
                        });
                    }
                });
            }
            else {
                res.json({
                    "Asseteditresult": {
                        "processStatus": "User is not authorized",
                        "is_admin":false,
                        "success": false
                    }
                });
            }
        }
    })
})


//edit credit
router.post('/creditdecrease', function (req, res, next) {

    var emailOption = { "emailId": req.body.email };
    var option = {
        $inc: { "credit_detail.current_balance": -1 }

    };
    var msg;

    user.findOne(emailOption, ["emailId", "credit_detail", "is_active"]).exec()
        .then((checkcredit) => {
            if (checkcredit) {
                if (checkcredit.is_active == false) {
                    msg = "user is still not activated"
                    return false;
                }
                else if (checkcredit.credit_detail.current_balance == 0) {
                    msg = "User have not enough credits";
                    return false;
                }
                else if (checkcredit.credit_detail.current_balance > 0) {
                    msg = "User have succefully credited"
                    return user.findOneAndUpdate(emailOption, option, { upsert: true }).exec();
                }
                else {
                    msg = "Something happen wrong";
                    return false;
                }
            }
            else {
                msg = "User is not Authorized";
                return false;
            }


        })
        .then(function (updatedata) {
            if (updatedata) {
                console.log('user is credit price is  updated');
                res.json({
                    "Creditdeduction": {
                        "processStatus": msg,

                        "success": true
                    }
                });
            }
            else {
                res.json({
                    "Creditdeduction": {
                        "processStatus": msg,

                        "success": false
                    }
                });
            }
        })
        .catch(function (error) {
            console.log(error);
            res.json({ status: 500, success: false, message: 'Something wrong' });
        })

})


router.get('/crediprice', function (req, res, next) {
    var id = req.session.user._id;
    user.findById(id, ["creditprice", "is_active"]).exec()
        .then((userdetail) => {
            if (userdetail) {
                res.json({

                    "processStatus": "User exist",
                    "data": userdetail,
                    "success": true

                });
            }
            else {
                res.json({

                    "processStatus": "User does not exist",
                    "data": {},
                    "success": false

                });
            }
        })
        .catch(function (error) {
            console.log(error);
            res.json({ status: 500, success: false, message: 'Something wrong' });
        })

})

module.exports = router;