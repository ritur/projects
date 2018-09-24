var express = require('express');
var router = express.Router();
var user = require('./../schema/users');
var room = require('./../schema/rooms');
var Promise = require("bluebird");
var searchtag = require('./../schema/searchtag');
// var session = require('express-session');
var crypto = require('crypto');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var creditpriceuser = require('./../schema/creditpriceuser');
var assetsbunddle = require('./../schema/assetsbunddle');
var category = require('./../schema/category');
var ObjectId = require('mongoose').Types.ObjectId;
var whitelist = ['http://locahost:3000', 'http://167.99.1.205/wp-content/themes/x/ajax-signUpForm.php']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

router.post('/signup', function (req, res, next) {

    // console.log(req.body);
    var userdata = {};
    var responseMessage = '';
    var token;
    var user_exist = {};
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');

    });
    var findemail = { $and: [{ 'emailId': req.body.userData.emailId.toLowerCase() }, { registration_success: true }] };
    if (req.body.userData.firstName == "" || req.body.userData.lastName == "" || req.body.userData.emailId == "" || req.body.userData.password == "") {
        res.json({
            "signupProcessResult": {
                "processStatus": "Some of the required fields are empty",
                "resultData": "586110356859050ba867463f",
                "status": true
            }
        });
    } else {
        user.findOne(findemail, ["emailId", "is_active", "lastName", "firstName", "registration_success"])
            .then(function (isEmail) {
                console.log(isEmail);
                user_exist = isEmail;
                if (isEmail) {
                    return true;
                }
                else {
                    return false;
                }
            })
            .then(function (response) {
                console.log(response);

                if (response) {
                    if (user_exist.is_active == true) {
                        responseMessage = 'User already present.';
                        responseUserId = null
                        return false;
                    }
                    else {
                        responseMessage = 'User already exist but account is not activated an email have sent';
                        responseUserId = null
                        return false;

                    }

                }
                else {

                    return true;
                }
            }).then(function (response) {

                if (response) {

                    //var token_id = [{ "token_id": token }]
                    var registerData = {
                        'firstName': req.body.userData.firstName,
                        'lastName': req.body.userData.lastName,
                        'emailId': req.body.userData.emailId,
                        'password': req.body.userData.password,
                        'mobileNo': req.body.userData.mobileNo,
                        'activeTokenId': token,
                        'loginTokenId': token,
                        'registration_success': true,
                        'credit_detail': { "current_balance": 20, "how_much_purchase": 0 },


                    };

                    responseMessage = 'Registration Successfull.An activation link has been sent to ' + req.body.userData.emailId + '.';
                    user.findOneAndUpdate({ "emailId": req.body.userData.emailId }, registerData, { upsert: true }).then(function (user_detail) {

                        if (user_detail) {
                            var generate_jwt = jwt.sign({
                                _id: user_detail._id,
                                loginTokenId: [{ "token_id": token }],
                                emailId: user_detail.emailId,
                                exp: parseInt(expiry.getTime() / 1000),
                            }, "sshhsecret");
                            // req.session.user = user_detail;
                            var userInfo = {
                                user_id: user_detail._id,
                                firstName: user_detail.firstName,
                            }

                        }
                        return user_detail;
                        // }).then((result_userDeatail) => {
                        //     userdata = result_userDeatail;
                        //     var creditpriceuserdata = new creditpriceuser({
                        //         'email': result_userDeatail.emailId,

                        //     });
                        //     return creditpriceuserdata.save().then(function (user_detail_credit) {

                        //     })
                    }).then((result_userDeatail) => {
                        var mailOptions = {
                            to: result_userDeatail.emailId,
                            subject: 'Activate Account',
                            user: { // data to view template, you can access as - user.name
                                name: result_userDeatail.firstName + " " + result_userDeatail.lastName,
                                url: 'http://livefurnish.com:3000/verify_user?token_id=' + token
                            }
                        }

                        // Send email.
                        res.mailer.send('activateEmail', mailOptions, function (err, message) {
                            console.log("message", message)
                            if (err) {
                                console.log(err);

                                res.json({ status: false, message: 'There was an error sending the email' });

                            }
                            res.json({
                                "signupProcessResult": {
                                    "processStatus": responseMessage,
                                    "resultData": result_userDeatail._id,//userid
                                    "loginTokenId": token,
                                    "status": true
                                }
                            });

                        });
                    })

                }

                else {
                    console.log("user_exist", user_exist)
                    // if (user_exist.is_active == false) {
                    //     if (typeof req.body.userData.mobileNo !== "undefined") {
                    //         var mobileNo = req.body.userData.mobileNo
                    //     }
                    //     else {
                    //         var mobileNo = null;
                    //     }
                    //     var updateData = {
                    //         'firstName': req.body.userData.firstName,
                    //         'lastName': req.body.userData.lastName,
                    //         'emailId': req.body.userData.emailId,
                    //         'password': req.body.userData.password,
                    //         'mobileNo': mobileNo,
                    //         'activeTokenId': token,

                    //     };

                    //     user.findByIdAndUpdate(user_exist._id, updateData, { new: true }).exec()
                    //         .then(function (result) {
                    //             console.log("result_message1", result);
                    //             var mailOptions = {
                    //                 to: result.emailId,
                    //                 subject: 'Activate Account',
                    //                 user: { // data to view template, you can access as - user.name
                    //                     name: result.firstName + " " + result.lastName,
                    //                     url: 'http://167.99.1.205:3000/verify_user?token_id=' + token
                    //                 }
                    //             }

                    //             // Send email.
                    //             res.mailer.send('activateEmail', mailOptions, function (err, message) {
                    //                 console.log("message2", message)
                    //                 console.log("responseMessage", responseMessage)
                    //                 if (err) {
                    //                     console.log(err);

                    //                     res.json({
                    //                         "signupProcessResult": {
                    //                             "processStatus": responseMessage,
                    //                             "resultData": responseUserId,
                    //                             "status": false
                    //                         }
                    //                     });

                    //                 }
                    //                 res.json({
                    //                     "signupProcessResult": {
                    //                         "processStatus": responseMessage,
                    //                         "resultData": responseUserId,
                    //                         "status": true
                    //                     }
                    //                 });

                    //             });

                    //         })
                    // }
                    // else {
                    res.json({
                        "signupProcessResult": {
                            "processStatus": responseMessage,
                            "resultData": responseUserId,
                            "status": false
                        }
                    });
                    // }

                }

            })

            .catch(function (error) {
                console.log(error);
                res.json({ status: 500, success: false, message: 'Something wrong' });
            })

    }


})
//login app user
router.get('/logInUser/:emailId/:password/:remember', function (req, res, next) {
    var token;
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');

    });

    // if (req.session.user) {                         //Already logged In User
    //     res.json({

    //             "redirect":true,
    //             "status": false


    //     });
    // }
    // else {

    var emailId = req.params.emailId;
    var password = req.params.password;
    var rememberme = req.params.remember;
    var findemail = { $and: [{ "emailId": emailId }, { registration_success: true }] };
    // var generate_jwt=user.generateJwt();

    user.findOne(findemail, ["password", "firstName", "login_tokenid", "state", "allowed_no_of_login", "lastName", "emailId", "mobileNo", "street", "address", "city", "state", "country", "credit_detail"])
        .then(function (users) {

            if (users) {

                if (password === users.password) {
                    var no_of_login = users.allowed_no_of_login;
                    var login;
                    var flag = false;
                    var users_detail = {};
                    console.log("token", token);


                    console.log("session closed");
                    var updateData;

                    // req.session.user.login_tokenid = [{ "token_id": token }]
                    if (users.allowed_no_of_login > users.login_tokenid.length) {
                        var token_id = [];
                        for (var tonkenindex = 0; tonkenindex < users.login_tokenid.length; tonkenindex++) {
                            var temptoken = {};
                            temptoken.token_id = users.login_tokenid[tonkenindex].token_id;
                            token_id.push(temptoken);
                        }
                        token_id.push({ "token_id": token })
                        updateData = { "login_tokenid": token_id };
                        console.log("updateData1", updateData);
                    }
                    else {
                        var token_id = [];
                        for (var tonkenindex = 1; tonkenindex < users.login_tokenid.length; tonkenindex++) {
                            var temptoken = {};
                            temptoken.token_id = users.login_tokenid[tonkenindex].token_id;
                            token_id.push(temptoken);
                        }
                        token_id.push({ "token_id": token })
                        updateData = { "login_tokenid": token_id };
                        console.log("updateData2", updateData);
                    }

                    user.findByIdAndUpdate(users._id, updateData, { new: true }).exec()
                        .then(function (result) {
                            console.log(result)
                            var users_detail = {};
                            // req.session.user = result;
                            users_detail._id = result._id;
                            users_detail.firstName = result.firstName;
                            users_detail.lastName = result.lastName;
                            users_detail.password = result.password;
                            if (typeof result.address !== "undefined")
                                users_detail.address = result.address;
                            else
                                users_detail.address = ""
                            if (typeof result.country !== "undefined")
                                users_detail.country = result.country;
                            else
                                users_detail.country = ""
                            if (typeof result.pincode !== "undefined")
                                users_detail.pincode = result.pincode;
                            else
                                users_detail.pincode = ""
                            if (typeof result.mobileNo !== "undefined")
                                users_detail.mobileNo = result.mobileNo;
                            else
                                users_detail.mobileNo = ""
                            if (typeof result.street !== "undefined")
                                users_detail.street = result.street;
                            else
                                users_detail.street = ""
                            if (typeof result.city !== "undefined")
                                users_detail.city = result.city;
                            else
                                users_detail.city = ""
                            if (typeof result.state !== "undefined")
                                users_detail.state = result.state;
                            else
                                users_detail.state = ""

                            users_detail.image_credit = result.credit_detail.current_balance,


                                console.log(" req.", rememberme);
                            users_detail.emailId = result.emailId;
                            // console.log(" req.session.cookie.expires", req.session.cookie);
                            var generate_jwt
                            if (rememberme == true || rememberme == 'true') {
                                // req.session.cookie.expires = false;
                                // req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                                // console.log(" req.session.cookie.expires", req.session.cookie);
                                generate_jwt = jwt.sign({
                                    _id: result._id,
                                    emailId: result.emailId,
                                    login_tokenid: [{ "token_id": token }],
                                    exp: 365 * 24 * 60 * 60 * 1000,
                                }, "sshhsecret");
                            }
                            else {
                                var expiry = new Date();
                               
                                // expiry.setDate(expiry.getDate() + 7);
                                generate_jwt = jwt.sign({
                                    _id: result._id,
                                    emailId: result.emailId,
                                    login_tokenid: [{ "token_id": token }],
                                    exp: Math.floor(Date.now() / 1000) + (2 * 60 *  60),
                                }, "sshhsecret");
                            }

                            // DO NOT KEEP YOUR SECRET IN THE CODE!

                            // req.session.user.login_tokenid = [{ "token_id": token }];

                            res.json({
                                "loginUserResult": {
                                    'users': users_detail,
                                    "success": true,
                                    "token": generate_jwt
                                }
                            }
                            );
                        })


                }
                else {
                    res.json({
                        "loginUserResult": {
                            "processStatus": "Wrong password entered ",
                            "resultData": null,
                            "success": false
                        }

                    });
                }


            }
            else {

                res.json({
                    "loginUserResult": {
                        "processStatus": "User is not authorized",
                        "resultData": null,
                        "success": false
                    }

                });
            }
        })


        .catch(function (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Something wrong' });
        })


    // }

});



//App API hit to confirm user validity
router.get('/confirm_user', function (req, res, next) {
    var token;
    var users_detail = {};
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');

    });
    var verifytoken = [];
    verifytoken = req.query.token_id;

    var condition_tok = { loginTokenId: verifytoken[0] };

    user.findOne(condition_tok, function (err, users) {
        if (!users) {
            res.json({ success: false, message: 'Validation is not done token Id is not valid' });

        }
        else {

            users.loginTokenId = undefined;

            users['login_tokenid'] = [{ "token_id": token }];;

            users.save(function (err, result) {
                if (err) {
                    res.json({ success: false, message: 'Some error occured' });
                }
                else {
                    console.log(result)

                    users_detail._id = result._id;
                    users_detail.firstName = result.firstName;
                    users_detail.lastName = result.lastName;
                    users_detail.password = result.password;
                    users_detail.address = result.address;
                    users_detail.country = result.country;
                    users_detail.mobileNo = result.mobileNo;
                    users_detail.street = result.street;
                    users_detail.city = result.city;
                    users_detail.pincode = result.pincode;
                    users_detail.state = result.state;
                    users_detail.image_credit = result.image_credit,
                        users_detail.emailId = result.emailId;

                    users_detail.profile_image = result.profile_image;
                    var expiry = new Date();
                    expiry.setDate(expiry.getDate() + 7);
                    generate_jwt = jwt.sign({
                        _id: result._id,
                        emailId: result.emailId,
                        login_tokenid: [{ "token_id": token }],
                        exp: parseInt(expiry.getTime() / 1000),
                    }, "sshhsecret");
                    // req.session.user.login_tokenid = [{ "token_id": token }];
                    res.json(
                        { success: true, message: 'User is valid', users: users_detail, "token_id": generate_jwt });

                }

            });
        }
    });

});


//decrease the user credit
router.post('/creditdecrease', function (req, res, next) {

    var emailOption = { "emailId": req.body.email.toLowerCase() };

    var flag = false;
    var msg;
    var token = req.body.token
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || decoded.emailId !== req.body.email) {
            res.json({
                "Creditdeduction": {
                    "processStatus": "token id does not match",

                    "success": false
                }
            });
        }

        else if (decoded.emailId == req.body.email) {
            console.log(decoded)
            user.findOne(emailOption, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;
                            console.log("flag is true");
                        }

                    });
                    if (flag) {
                        return user.findOne(emailOption, ["emailId", "credit_detail", "is_active"]).exec()



                    }
                    else {
                        return false;
                    }
                })


                .then((checkcredit) => {
                    if (checkcredit) {
                        if (checkcredit.is_active == false) {
                            msg = "Please activate your account to use this feature"
                            return false;
                        }
                        else if (checkcredit.credit_detail.current_balance == 0) {
                            msg = "You do not have enough credits please buy credits to save image";
                            return false;
                        }
                        else if (checkcredit.credit_detail.current_balance > 0) {
                            var d = new Date();
                            var tempdate = [];
                            var datedd = d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm#");
                            tempdate = datedd.split(" ");
                            msg = "User have successfully  credited";
                            var option = {
                                $push: {
                                    // "cards": { $each: [{ "_id": new mongodb.ObjectID(), "strip_cust_id": charge.customer, 'strip_token_id': charge.id, "last_no": charge.source.last4 }] },
                                    "transaction":
                                        {
                                            $each: [{
                                                "remaining_credit": (checkcredit.credit_detail.current_balance) - 1,
                                                "date": tempdate[0],
                                                "time": tempdate[1],
                                                "credit": 1,
                                                "amount": "-1",
                                                "discount": 0
                                            }]
                                        }
                                },
                                $inc: { "credit_detail.current_balance": -1 }

                            }
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
                    console.log('user is credit price is  updated', updatedata);
                    if (updatedata) {
                        console.log('user is credit price is  updated', updatedata);
                        res.json({
                            "Creditdeduction": {
                                "processStatus": msg,
                                "no_of_credit": (updatedata.credit_detail.current_balance - 1),
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
        }
        else {
            res.json({
                "Creditdeduction": {
                    "processStatus": "user is not authorized",

                    "success": true
                }
            });
        }
    })
})

router.post('/edit_profile', function (req, res, next) {
    var token = req.body.userData.token;
    console.log(req.body);
    var msg = "";
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || decoded.emailId !== req.body.userData.emailId) {
            res.json({
                "updateUserProcessResult": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }
        else {

            var flag = false;
            user.findOne({ "emailId": decoded.emailId }, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });


                    if (user_detail && flag) {
                        if (req.body.userData.firstName == "" || req.body.userData.lastName == "" || req.body.userData.emailId == "") {
                            msg = "User not authorized for access";
                            return false;

                        }
                        else {
                            var findemail = { 'emailId': req.body.userData.emailId.toLowerCase() };
                            return user.find(findemail).exec()
                        }


                    }
                    else {
                        msg = ""
                        return false;
                    }
                })


                .then(function (isEmail) {
                    if (isEmail !== false) {
                        var login_user_id = decoded._id;            //change req.session.userid
                        if (isEmail.length < 2) {
                            if (isEmail.length === 1) {
                                console.log(isEmail);
                                console.log("isEmail[0]", isEmail[0])
                                // console.log("req.session.user._id", req.session.user._id)
                                if (isEmail[0]._id == decoded._id) {  //change req.session.userid
                                    console.log('result');
                                    var tempresult = {};
                                    if (typeof req.body.userData.pincode !== "undefined" && req.body.userData.pincode !== null)
                                        tempresult.pincode = req.body.userData.pincode;
                                    else
                                        tempresult.pincode = "";
                                    if (typeof req.body.userData.mobileNo !== "undefined" && req.body.userData.mobileNo !== null)
                                        tempresult.mobileNo = req.body.userData.mobileNo;
                                    else
                                        tempresult.mobileNo = "";
                                    if (typeof req.body.userData.address !== "undefined")
                                        tempresult.address = req.body.userData.address;
                                    else
                                        tempresult.address = "";
                                    if (typeof req.body.userData.street !== "undefined")
                                        tempresult.street = req.body.userData.street;
                                    else
                                        tempresult.street = "";
                                    if (typeof req.body.userData.state !== "undefined")
                                        tempresult.state = req.body.userData.state;
                                    else
                                        tempresult.state = "";
                                    if (typeof req.body.userData.country !== "undefined")
                                        tempresult.country = req.body.userData.country;
                                    else
                                        tempresult.country = "";
                                    if (typeof req.body.userData.pincode !== "undefined")
                                        tempresult.pincode = req.body.userData.pincode;
                                    else
                                        tempresult.pincode = "";
                                    if (typeof req.body.userData.city !== "undefined")
                                        tempresult.city = req.body.userData.city;
                                    else
                                        tempresult.city = "";
                                    var updateData = {
                                        'firstName': req.body.userData.firstName,
                                        'lastName': req.body.userData.lastName,
                                        // 'emailId': req.body.userData.emailId,
                                        // 'password': req.body.userData.password,
                                        'address': tempresult.address,
                                        'country': tempresult.country,
                                        'state': tempresult.state,
                                        'mobileNo': tempresult.mobileNo,
                                        'street': tempresult.street,
                                        'city': tempresult.city,
                                        'pincode': tempresult.pincode

                                    };
                                    console.log('updateData', updateData);
                                    return user.findByIdAndUpdate(login_user_id, updateData, { new: true }).exec()
                                        .then(function (result) {
                                            console.log('result', result);

                                            res.json({
                                                "updateUserProcessResult": {
                                                    "processStatus": "User Updated Succesfully.",
                                                    "resultData": decoded._id,    //change req.session.userid
                                                    "data": { "firstName": req.body.userData.firstName, "lastName": req.body.userData.lastName },
                                                    "success": true
                                                }
                                            }
                                            );
                                        })
                                }
                                else {
                                    res.json({
                                        "updateUserProcessResult": {
                                            "processStatus": "Email already exist",

                                            "success": false
                                        }
                                    });
                                }
                            }
                            else {
                                var tempresult = {};
                                if (typeof req.body.userData.pincode !== "undefined" && req.body.userData.pincode !== null)
                                    tempresult.pincode = req.body.userData.pincode;
                                else
                                    tempresult.pincode = "";
                                if (typeof req.body.userData.mobileNo !== "undefined" && req.body.userData.mobileNo !== null)
                                    tempresult.mobileNo = req.body.userData.mobileNo;
                                else
                                    tempresult.mobileNo = ""
                                if (typeof req.body.userData.address !== "undefined")
                                    tempresult.address = req.body.userData.address;
                                else
                                    tempresult.address = ""
                                if (typeof req.body.userData.street !== "undefined")
                                    tempresult.street = req.body.userData.street;
                                else
                                    tempresult.street = ""
                                if (typeof req.body.userData.state !== "undefined")
                                    tempresult.state = req.body.userData.state;
                                else
                                    tempresult.state = ""
                                if (typeof req.body.userData.country !== "undefined")
                                    tempresult.country = req.body.userData.country;
                                else
                                    tempresult.country = ""
                                if (typeof req.body.userData.pincode !== "undefined")
                                    tempresult.pincode = req.body.userData.pincode;
                                else
                                    tempresult.pincode = ""
                                if (typeof req.body.userData.city !== "undefined")
                                    tempresult.city = req.body.userData.city;
                                else
                                    tempresult.city = ""
                                var updateData = {
                                    'firstName': req.body.userData.firstName,
                                    'lastName': req.body.userData.lastName,
                                    // 'emailId': req.body.userData.emailId,
                                    // 'password': req.body.userData.password,
                                    'address': tempresult.address,
                                    'country': tempresult.country,
                                    'state': tempresult.states,
                                    'mobileNo': parseFloat(tempresult.mobileNo),
                                    'street': tempresult.street,
                                    'city': tempresult.city,
                                    'pincode': tempresult.pincode

                                };

                                user.findByIdAndUpdate(login_user_id, updateData, { new: true }).exec()
                                    .then(function (result) {
                                        console.log('result', result);

                                        res.json({
                                            "updateUserProcessResult": {
                                                "processStatus": "User Updated Succesfully.",
                                                "resultData": decoded._id,           //change req.session
                                                "success": true,
                                                "data": { "firstName": req.body.userData.firstName, "lastName": req.body.userData.lastName },
                                            }
                                        }
                                        );
                                    })
                            }
                        }
                        else {
                            res.json({
                                "updateUserProcessResult": {
                                    "processStatus": "Email already exist",

                                    "success": false
                                }
                            });
                        }
                    }
                    else if (req.body.userData.firstName == "" || req.body.userData.lastName == "" || req.body.userData.emailId == "") {
                        res.json({
                            "updateUserProcessResult": {
                                "processStatus": msg,
                                "resultData": "",
                                "success": false
                            }
                        });
                    }
                    else {
                        res.json({
                            "updateUserProcessResult": {
                                "processStatus": msg,

                                "success": false
                            }
                        })
                    }

                })

                .catch(function (error) {
                    console.log(error);
                    res.json({ "updateUserProcessResult": { status: 500, success: false, message: 'Something wrong' } });
                })

        }
    })



});

router.get('/edit_profile/:token/:emailId', function (req, res, next) {
    var token = req.params.token;

    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || decoded.emailId !== req.params.emailId) {
            res.json({
                "Pofileresult": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else {
            var flag = false;
            user.findOne({ "emailId": req.params.emailId }, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });

                    if (user_detail) {
                        console.log("flag", flag);

                        return user.findOne({ "_id": decoded._id }, ("firstName emailId lastName address mobileNo street state country city pincode profile_image")).exec()
                    }
                    else {
                        console.log("flag", flag);
                        return false;
                    }
                })
                .then((user_result) => {
                    console.log("user_result", user_result)
                    if (user_result) {
                        console.log("user_result", user_result)

                        var tempresult = {};
                        tempresult._id = user_result._id;
                        tempresult.profile_image = user_result.profile_image;
                        tempresult.firstName = user_result.firstName;
                        tempresult.lastName = user_result.lastName;
                        tempresult.emailId = user_result.emailId;
                        if (typeof user_result.pincode !== "undefined" && user_result.pincode !== null)
                            tempresult.pincode = user_result.pincode;
                        else
                            tempresult.mobileNo = ""
                        if (typeof user_result.mobileNo !== "undefined" && user_result.mobileNo !== null)
                            tempresult.mobileNo = user_result.mobileNo;
                        else
                            tempresult.mobileNo = ""
                        if (typeof user_result.address !== "undefined")
                            tempresult.address = user_result.address;
                        else
                            tempresult.address = ""
                        if (typeof user_result.street !== "undefined")
                            tempresult.street = user_result.street;
                        else
                            tempresult.street = ""
                        if (typeof user_result.state !== "undefined")
                            tempresult.state = user_result.state;
                        else
                            tempresult.state = ""
                        if (typeof user_result.country !== "undefined")
                            tempresult.country = user_result.country;
                        else
                            tempresult.country = ""
                        if (typeof user_result.pincode !== "undefined")
                            tempresult.pincode = user_result.pincode;
                        else
                            tempresult.pincode = ""
                        if (typeof user_result.city !== "undefined")
                            tempresult.city = user_result.city;
                        else
                            tempresult.city = ""



                        res.json({
                            "Pofileresult": {
                                "processStatus": "User Detail",
                                "user_data": tempresult,
                                "success": true
                            }

                        })


                    }
                    else {
                        res.json({
                            "Pofileresult": {
                                "processStatus": "User is not authorized",

                                "success": false
                            }
                        })

                    }
                })
        }
    })


});



//API hit to check logged in 
router.get('/session_check/:emailId/:token', function (req, res, next) {
    var token = req.params.token;
    var token_regen = false;

    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || decoded.emailId !== req.params.emailId) {
            console.log("err", err)
            res.json({
                "loginUserResult": {
                    "processStatus": "User is not authorized",
                    "is_admin": false,
                    "success": false
                }
            });
        }

        else {
            var flag = false;

            return user.findOne({ "emailId": req.params.emailId }, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {

                    if (user_detail.allowed_no_of_login >= user_detail.login_tokenid.length) {
                        user_detail.login_tokenid.forEach((value, index) => {
                            if (decoded.login_tokenid[0].token_id == value.token_id) {
                                flag = true;

                            }

                        });
                    }
                    else {
                        for (var allow = user_detail.login_tokenid.length - 1; allow >= user_detail.login_tokenid.length - user_detail.allowed_no_of_login; allow--) {


                            if (decoded.login_tokenid[0].token_id == user_detail.login_tokenid[allow].token_id) {
                                flag = true;

                            }


                        }
                    }

                    if (user_detail && flag) {


                        return true;
                    }
                    else {

                        return false;
                    }
                })

                .then((user_detail) => {
                    if (user_detail) {
                        var expiry = new Date();
                        expiry = Math.floor(Date.now() / 1000) + (2 * 60)
                        if (decoded.exp < expiry) {
                            token_regen = true
                        }
                        res.json({
                            "loginUserResult": {
                                "processStatus": "User still logged in ",
                                "token_regenerate": token_regen,
                                "success": true,
                                "is_admin": false
                            }
                        }
                        );

                    }
                    else {

                        res.json({
                            "loginUserResult": {
                                "processStatus": "User is not authorized",
                                "is_admin": false,
                                "success": false
                            }
                        })
                    }


                })

        }
    })


});

//Api regenrate
router.get('/regenrate_token/:emailId/:token', function (req, res, next) {
    var token = req.params.token;
    var generate_jwt;
    console.log()
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || decoded.emailId !== req.params.emailId) {
            res.json({
                "regenerate_token_result": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else {
            var flag = false;
            var sessiontokenid;
            console.log("regular", decoded)
            return user.findOne({ "emailId": req.params.emailId }, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    if (user_detail.allowed_no_of_login >= user_detail.login_tokenid.length) {
                        user_detail.login_tokenid.forEach((value, index) => {
                            if (decoded.login_tokenid[0].token_id == value.token_id) {
                                flag = true;

                            }

                        });
                    }
                    else {
                        for (var allow = user_detail.login_tokenid.length - 1; allow >= user_detail.login_tokenid.length - user_detail.allowed_no_of_login; allow--) {


                            if (decoded.login_tokenid[0].token_id == user_detail.login_tokenid[allow].token_id) {
                                flag = true;
                                break;

                            }


                        }
                    }

                    if (user_detail && flag) {

                        console.log("mai aaya")

                        generate_jwt = jwt.sign({
                            _id: decoded._id,
                            loginTokenId: [{ "token_id": decoded.login_tokenid[0].token_id }],
                            emailId: decoded.emailId,
                            exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60 ),
                        }, "sshhsecret");
                        console.log(generate_jwt);
                        sessiontokenid = decoded.login_tokenid[0].token_id
                        var condition_token = {
                            "$pull": { "login_tokenid": { "token_id": sessiontokenid } },

                        }
                        var condition_check = { "_id": decoded._id }
                        return user.findOneAndUpdate(condition_check, condition_token, { upsert: true }).exec()
                    }
                    else {

                        return false;
                    }
                })

                .then((user_detail) => {
                    if (user_detail) {
                        console.log(user_detail._id);
                        // var sessiontokenid = decoded.login_tokenid[0].token_id
                        var condition_check = { "_id": decoded._id }
                        var updation_p = {
                            "$push": {
                                "login_tokenid": {
                                    $each: [{ "token_id": sessiontokenid }]
                                }
                            }
                        }
                        return user.findOneAndUpdate(condition_check, updation_p, { upsert: true }).exec()


                    }
                    else {

                        return false;
                    }


                })
                .then((user_detail) => {
                    if (user_detail) {

                        res.json({
                            "regenerate_token_result": {
                                "processStatus": "New token id",
                                "token": generate_jwt,
                                "success": true,

                            }
                        }
                        );

                    }
                    else {

                        res.json({
                            "regenerate_token_result": {
                                "processStatus": "User is not authorized",

                                "success": false
                            }
                        })
                    }


                })

        }
    })


});

//credit detail
router.get('/credit_detial/:emailId/:token', function (req, res, next) {

    var emailOption = { "emailId": req.params.emailId.toLowerCase() };

    var flag = false;
    var msg;
    var token = req.params.token
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || decoded.emailId !== req.params.emailId.toLowerCase()) {
            res.json({
                "Credit_Detail": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else if (decoded.emailId == req.params.emailId.toLowerCase()) {
            console.log(decoded)
            var flag = false;
            user.findOne(emailOption, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;
                            console.log("flag is true");
                        }

                    });
                    if (flag) {
                        return user.findOne(emailOption, ["credit_detail", "is_active"]).exec()



                    }
                    else {
                        return false;
                    }
                })


                .then((checkcredit) => {
                    if (checkcredit) {
                        if (checkcredit.is_active) {
                            if (checkcredit.credit_detail.current_balance > 0) {
                                res.json({
                                    "Credit_Detail": {
                                        "processStatus": "User current credit Remains",
                                        "number_of_credit": checkcredit.credit_detail.current_balance,
                                        "success": true
                                    }
                                });
                            }
                            else {
                                res.json({
                                    "Credit_Detail": {
                                        "processStatus": "You do not have enough credits please buy credits to save image",

                                        "success": false
                                    }
                                });

                            }
                        }
                        else {
                            res.json({
                                "Credit_Detail": {
                                    "processStatus": "Please activate your account to use this feature",

                                    "success": false
                                }
                            });
                        }
                    }
                    else {
                        msg = "User is not Authorized";
                        res.json({
                            "Credit_Detail": {
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
        }
        else {
            res.json({
                "Creditdeduction": {
                    "processStatus": "user is not authorized",

                    "success": true
                }
            });
        }
    })
})


router.get('/logoutUser/:emailId/:token', function (req, res, next) {
    var token = req.params.token;
    var emailOption = { "emailId": req.params.emailId.toLowerCase() };
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || decoded.emailId !== req.params.emailId.toLowerCase()) {
            res.json({
                "logoutUserResult": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else if (decoded.emailId == req.params.emailId.toLowerCase()) {               //to check if user is logged in 
            console.log("token", decoded);
            var flag = false;
            user.findOne(emailOption, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;
                            console.log("flag is true");
                        }

                    });
                    if (flag) {
                        var condition_check = { "_id": decoded._id };
                        var sessiontokenid = decoded.login_tokenid[0].token_id

                        return user.findOneAndUpdate(condition_check, { $pull: { "login_tokenid": { "token_id": sessiontokenid } } }, { upsert: true }).exec()



                    }
                    else {
                        return false;
                    }
                })
                .then((datadelete) => {
                    console.log(datadelete);

                    if (datadelete) {
                        res.json({
                            "logoutUserResult": {
                                "processStatus": "logout Successfully.",

                                "success": true
                            }
                        })
                    }
                    else {
                        res.json({
                            "logoutUserResult": {
                                "processStatus": "User is not authorized",

                                "success": false
                            }
                        })
                    }
                })
        }
        else {

            res.json({
                "logoutUserResult": {
                    "processStatus": "User not authorized",

                    "success": true
                }
            })
        }

    })

});


//Get assets list for users
//App API hit to confirm user validity
router.get('/assets_list_user', function (req, res, next) {
    var token = req.query.token;
    var users_detail = {};
    var useremail = ""

    var assetslistdatatemp = [];
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            res.json({
                "loginUserResult": {
                    "processStatus": "User is not authorized",
                    "is_admin": false,
                    "success": false
                }
            });
        }

        else {
            var flag = false;
            console.log("regular", decoded)
            if (typeof req.query.email !== "undefined" && decoded.emailId == req.query.email) {
                useremail = req.query.email
            }
            return user.findOne({ "emailId": decoded.emailId }, ["login_tokenid", "allowed_no_of_login"]).exec()
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });

                    if (user_detail && flag && decoded.emailId == req.query.email) {
                        console.log("flag", flag);

                        var condition_assets = {
                            $or: [{ "userpermission": { $elemMatch: { "value": "all" } } }, { "userpermission": { $elemMatch: { "name": useremail } } }]

                        }
                        return assetsbunddle.find(condition_assets, ("assetsName searchtag version windowsAssetbundle macAssetbundle androidAssetbundle iosAssetbundle webglAssetbundle category thumbnail predefinedAngles")).exec()
                    }
                    else {
                        console.log("flag", flag);
                        return false;
                    }
                })


                .then(function (assetsbunddle_Data) {
                    console.log("assetsbunddle_Data", assetsbunddle_Data)
                    if (assetsbunddle_Data) {
                        var promiseasset = Promise.each(assetsbunddle_Data, (value, index) => {
                            let tempasset = {}

                            tempasset._id = value._id;

                            tempasset.assetsName = value.assetsName;
                            tempasset.thumbnail = "http://livefurnish.com:3000/images/assets/images/" + value.thumbnail;
                            tempasset.version = value.version;
                            console.log(typeof value.windowsAssetbundle);
                            if (typeof value.windowsAssetbundle)
                                console.log(value.windowsAssetbundle)
                            if (typeof value.macAssetbundle !== "undefined" && typeof value.macAssetbundle.title !== "undefined") {
                                tempasset.macAssetbundle = "http://livefurnish.com:3000/images/assets/images/" + value.macAssetbundle.name;
                                tempasset.macAssetbundlename = value.macAssetbundle.title;
                            }
                            else {
                                tempasset.macAssetbundle = "";
                                tempasset.macAssetbundlename = "";
                            }
                            if (typeof value.iosAssetbundle !== "undefined" && typeof value.iosAssetbundle.title !== "undefined") {
                                tempasset.iosAssetbundle = "http://livefurnish.com:3000/images/assets/images/" + value.iosAssetbundle.name;
                                tempasset.iosAssetbundlename = value.iosAssetbundle.title;
                            }
                            else {
                                tempasset.iosAssetbundle = "";
                                tempasset.iosAssetbundlename = "";
                            }
                            if (typeof value.windowsAssetbundle !== "undefined" && typeof value.windowsAssetbundle.title !== "undefined") {
                                tempasset.windowsAssetbundle = "http://livefurnish.com:3000/images/assets/images/" + value.windowsAssetbundle.name;
                                tempasset.windowsAssetbundlename = value.windowsAssetbundle.title;
                            }
                            else {
                                tempasset.windowsAssetbundle = "";
                                tempasset.windowsAssetbundlename = "";
                            }
                            if (typeof value.androidAssetbundle !== "undefined" && typeof value.androidAssetbundle.title !== "undefined") {
                                tempasset.androidAssetbundle = "http://livefurnish.com:3000/images/assets/images/" + value.androidAssetbundle.name;
                                tempasset.androidAssetbundlename = value.androidAssetbundle.title;
                            }
                            else {
                                tempasset.androidAssetbundle = "";
                                tempasset.androidAssetbundlename = "";
                            }
                            if (typeof value.webglAssetbundle !== "undefined" && typeof value.webglAssetbundle.title !== "undefined") {
                                tempasset.webglAssetbundle = "http://livefurnish.com:3000/images/assets/images/" + value.webglAssetbundle.name;
                                tempasset.webglAssetbundlename = value.webglAssetbundle.title;
                            }
                            else {
                                tempasset.webglAssetbundle = "";
                                tempasset.webglAssetbundlename = "";
                            }

                            tempasset.predefinedAngles = value.predefinedAngles;

                            var category_name = [];
                            var searchtag_name = [];
                            var condition = { '_id': { $in: value.category } };
                            var condition_searchtag = { '_id': { $in: value.searchtag } };
                            return category.find(condition)
                                .then((categoryname) => {
                                    if (categoryname) {
                                        categoryname.forEach((valuecat, indexcat) => {
                                            category_name.push("" + valuecat.name);
                                        })
                                    }
                                    tempasset.category = category_name;

                                    return searchtag.find(condition_searchtag)
                                })
                                .then((searchtagname) => {
                                    if (searchtagname) {
                                        searchtagname.forEach((valueser, indexser) => {
                                            searchtag_name.push("" + valueser.name);
                                        })
                                    }
                                    tempasset.searchtag = searchtag_name;
                                    assetslistdatatemp.push(tempasset);
                                })



                            // return assetslistdatatemp;
                        })

                        Promise.all(promiseasset).then(function (results) {
                            console.log("results", results);
                            console.log("assetslistdatatemp", assetslistdatatemp)
                            res.json({
                                "assetslist": {
                                    "processStatus": "Succefully fetched",
                                    "data": assetslistdatatemp,
                                    "success": true
                                }
                            });
                        })
                    }
                    else {
                        res.json({
                            "assetslist": {
                                "processStatus": "User is not authorized",
                                "data": [],
                                "success": false
                            }
                        });
                    }


                })
                .catch(function (error) {
                    console.log(error);
                    res.json({ "assetslist": { success: false, processStatus: 'something happened wrong' } });
                })

        }
    })
});

//App API hit to save the room angle for user
router.post('/user_saved_angle', function (req, res, next) {
    var token = req.body.token;
    var users_detail = {};
    var useremail = ""
    var condition_overwrite = req.body.condition_overwrite;
    var assetslistdatatemp = [];
    console.log("req.body.roomassetbundleid", req.body.roomassetbundleid)
    console.log("typeof req.body.roomassetbundleid", typeof req.body.roomassetbundleid)
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || req.body.email !== decoded.emailId) {
            res.json({
                "room_saved_angle": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else {
            var msg = "Something happened wrong"
            var flag = false;
            console.log("decoded", decoded)

            return user.findOne({ "emailId": decoded.emailId }, ["login_tokenid", "allowed_no_of_login"]).exec()
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });
                    console.log("typeof req.body.roomassetbundleid !== undefined", typeof req.body.roomassetbundleid !== "undefined")
                    if (user_detail && flag && decoded.emailId == req.body.email && typeof req.body.roomassetbundleid !== "undefined") {
                        console.log("flag", flag);
                        console.log("typeof req.body.roomassetbundleid !== undefined", typeof req.body.roomassetbundleid !== "undefined")

                        var condition = { "$and": [{ "user_id": decoded._id }, { "roomassetbundleid": req.body.roomassetbundleid }] };
                        return room.findOne(condition, ("roomName room_angle")).exec();

                    }
                    else {
                        console.log("flag", flag);
                        if (typeof req.body.roomassetbundleid == "undefined") {
                            msg = "Room asset bundle id is not applicable";
                        }
                        else { msg = "User is not authorized" }
                        return false;
                    }
                })


                .then(function (assetsbunddle_Data) {
                    console.log("assetsbunddle_Data", assetsbunddle_Data)
                    if (assetsbunddle_Data) {
                        var truesame = false;
                        var index;
                        assetsbunddle_Data.room_angle.forEach((value, indexs) => {
                            if (value.angleName == req.body.angleName) {
                                truesame = true;
                                index = indexs;
                            }
                        });
                        if (!truesame || (condition_overwrite)) {
                            if (!truesame) {
                                var roomdata = {
                                    "roomName": req.body.roomName,
                                    "$push": {
                                        "room_angle": {
                                            $each: [
                                                {
                                                    "angleName": req.body.angleName,
                                                    "xRotation": req.body.xRotation,
                                                    "yRotation": req.body.yRotation,
                                                    "zRotation": req.body.zRotation,
                                                    "xPosition": req.body.xPosition,
                                                    "yPosition": req.body.yPosition,
                                                    "zPosition": req.body.zPosition,
                                                    "field_of_view": req.body.field_of_view,
                                                    "distance": req.body.distance,
                                                    "centerXPos": req.body.centerXPos,
                                                    "centerYPos": req.body.centerYPos,
                                                    "centerZPos": req.body.centerZPos
                                                }
                                            ]
                                        }
                                    }
                                }
                                return room.findByIdAndUpdate(assetsbunddle_Data._id, roomdata, { upsert: true }).exec();
                            }
                            else {
                                var fieldname = "room_angle." + index + ".angleName"
                                var conditionupdate = { $and: [{ "_id": assetsbunddle_Data._id }, { "room_angle.angleName": req.body.angleName }] }
                                var room_data = {
                                    "roomName": req.body.roomName,
                                    "room_angle.$.angleName": req.body.angleName,
                                    "room_angle.$.xRotation": req.body.xRotation,
                                    "room_angle.$.yRotation": req.body.yRotation,
                                    "room_angle.$.zRotation": req.body.zRotation,
                                    "room_angle.$.xPosition": req.body.xPosition,
                                    "room_angle.$.yPosition": req.body.yPosition,
                                    "room_angle.$.zPosition": req.body.zPosition,
                                    "room_angle.$.field_of_view": req.body.field_of_view,
                                    "room_angle.$.distance": req.body.distance,
                                    "room_angle.$.centerXPos": req.body.centerXPos,
                                    "room_angle.$.centerYPos": req.body.centerYPos,
                                    "room_angle.$.centerZPos": req.body.centerZPos
                                }
                                return room.findOneAndUpdate(conditionupdate, room_data, { upsert: true }).exec();
                            }
                        }
                        else {
                            msg = "Camera angle already exist"
                            return false
                        }
                    }
                    else if (!assetsbunddle_Data && flag && typeof req.body.roomassetbundleid !== "undefined") {
                        var roomdata = new room({
                            "roomassetbundleid": req.body.roomassetbundleid,
                            "roomName": req.body.roomName,
                            "room_angle": [
                                {
                                    "angleName": req.body.angleName,
                                    "xRotation": req.body.xRotation,
                                    "yRotation": req.body.yRotation,
                                    "zRotation": req.body.zRotation,
                                    "xPosition": req.body.xPosition,
                                    "yPosition": req.body.yPosition,
                                    "zPosition": req.body.zPosition,
                                    "field_of_view": req.body.field_of_view,
                                    "distance": req.body.distance,
                                    "centerXPos": req.body.centerXPos,
                                    "centerYPos": req.body.centerYPos,
                                    "centerZPos": req.body.centerZPos
                                }
                            ],
                            "user_id": decoded._id,
                            "user_email": decoded.emailId
                        })
                        return roomdata.save()
                    }
                    else {
                        return false
                    }


                })
                .then(function (room_Data) {
                    if (room_Data) {
                        res.json({
                            "room_saved_angle": {
                                "processStatus": "Succefully saved",

                                "success": true
                            }
                        });
                    }
                    else {
                        res.json({
                            "room_saved_angle": {
                                "processStatus": msg,

                                "success": false
                            }
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    res.json({
                        "room_saved_angle": {
                            "processStatus": "User is not authorized",

                            "success": false
                        }
                    });
                })

        }
    })
});

//App API hit to get list of room angles save for user
router.get('/user_saved_angle', function (req, res, next) {
    var token = req.query.token;
    var roomassetbundleid = "";
    if (typeof req.query.roomassetbundleid !== "undefined") {
        roomassetbundleid = req.query.roomassetbundleid;;
    }
    var users_detail = {};
    var useremail = ""

    var assetslistdatatemp = [];
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || req.query.email !== decoded.emailId) {
            res.json({
                "room_angle": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else {
            var msg = "Something happened wrong"
            var flag = false;
            console.log("regular", decoded)

            return user.findOne({ "emailId": decoded.emailId }, ["login_tokenid", "allowed_no_of_login"]).exec()
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });

                    if (user_detail && flag && (useremail == "" || decoded.emailId == req.query.email)) {
                        console.log("flag", flag);

                        var condition;
                        if (roomassetbundleid == "") {
                            condition = { "user_id": decoded._id }
                        }
                        else {
                            condition = { "$and": [{ "user_id": decoded._id }, { "roomassetbundleid": roomassetbundleid }] }
                        }
                        return room.find(condition, ("room_angle roomassetbundleid roomName user_email user_id")).exec();

                    }
                    else {
                        console.log("flag", flag);
                        msg = "User is not authorized"
                        return false;
                    }
                })


                .then(function (room_Data) {
                    console.log("assetsbunddle_Data", room_Data)
                    if (room_Data.length > 0) {

                        res.json({
                            "room_angle": {
                                "processStatus": "Succefully fetched",
                                "room_data": room_Data,
                                "success": true
                            }
                        });
                    }
                    else if (flag) {
                        res.json({
                            "room_angle": {
                                "processStatus": "No data found",
                                "room_data": [],
                                "success": false
                            }
                        });
                    }
                    else {
                        res.json({
                            "room_angle": {
                                "processStatus": msg,

                                "success": false
                            }
                        });
                    }


                })

                .catch(function (error) {
                    console.log(error);
                    res.json({
                        "room_angle": {
                            "processStatus": "User is not authorized",

                            "success": false
                        }
                    });
                })

        }
    })
});


//App API hit to save the room setting for user
router.post('/roomSetting_save', function (req, res, next) {
    var token = req.body.token;
    var users_detail = {};
    var useremail = ""

    var assetslistdatatemp = [];
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || req.body.email !== decoded.emailId) {
            res.json({
                "room_saved_setting": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else {
            var msg = "Something happened wrong"
            var flag = false;
            console.log("regular", decoded)

            return user.findOne({ "emailId": decoded.emailId }, ["login_tokenid", "allowed_no_of_login"]).exec()
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });

                    if (user_detail && flag && (useremail == "" || decoded.emailId == req.query.email)) {
                        console.log("flag", flag);


                        var condition = { "$and": [{ "user_id": decoded._id }, { "roomassetbundleid": req.body.roomassetbundleid }] };
                        return room.findOne(condition, ("roomName")).exec();

                    }
                    else {
                        console.log("flag", flag);
                        msg = "User is not authorized"
                        return false;
                    }
                })


                .then(function (assetsbunddle_Data) {
                    console.log("assetsbunddle_Data", assetsbunddle_Data)
                    if (assetsbunddle_Data) {
                        var roomdata = {
                            "roomName": req.body.roomName,
                            "brightness": req.body.brightness,
                            "contrast": req.body.contrast,
                            "saturation": req.body.saturation,
                            "resetBrightness": req.body.resetBrightness,
                            "resetContrast": req.body.resetContrast,
                            "resetSaturation": req.body.resetSaturation,
                            "horizontalSpeed": req.body.horizontalSpeed,
                            "verticalSpeed": req.body.verticalSpeed,
                            "fov": req.body.fov,
                        }
                        return room.findByIdAndUpdate(assetsbunddle_Data._id, roomdata, { upsert: true }).exec();
                    }
                    else if (!assetsbunddle_Data && flag) {
                        var roomdata = new room({
                            "roomassetbundleid": req.body.roomassetbundleid,
                            "roomName": req.body.roomName,
                            "brightness": req.body.brightness,
                            "contrast": req.body.contrast,
                            "saturation": req.body.saturation,
                            "resetBrightness": req.body.resetBrightness,
                            "resetContrast": req.body.resetContrast,
                            "resetSaturation": req.body.resetSaturation,
                            "horizontalSpeed": req.body.horizontalSpeed,
                            "verticalSpeed": req.body.verticalSpeed,
                            "fov": req.body.fov,
                            "user_id": decoded._id,
                            "user_email": decoded.emailId
                        })
                        return roomdata.save()
                    }
                    else {
                        return false
                    }


                })
                .then(function (room_Data) {
                    if (room_Data) {
                        res.json({
                            "room_saved_setting": {
                                "processStatus": "Succefully saved",

                                "success": true
                            }
                        });
                    }
                    else {
                        res.json({
                            "room_saved_setting": {
                                "processStatus": msg,

                                "success": false
                            }
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    res.json({
                        "room_saved_setting": {
                            "processStatus": "User is not authorized",

                            "success": false
                        }
                    });
                })

        }
    })
});

//App API hit to save the room setting for user
router.post('/delete_user_angle', function (req, res, next) {

    var token = req.body.token;
    var users_detail = {};
    var useremail = ""

    var assetslistdatatemp = [];
    console.log("req.body.roomassetbundleid", req.body.roomassetbundleid)
    console.log("typeof req.body.roomassetbundleid", typeof req.body.roomassetbundleid)
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || req.body.email !== decoded.emailId) {
            res.json({
                "room_angle_delete": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else {
            var msg = "Something happened wrong"
            var flag = false;
            console.log("decoded", decoded)
            var exist_angle_name = false;
            return user.findOne({ "emailId": decoded.emailId }, ["login_tokenid", "allowed_no_of_login"]).exec()
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });

                    if (user_detail && flag && decoded.emailId == req.body.email && typeof req.body.roomassetbundleid !== "undefined") {


                        var condition = { "$and": [{ "user_id": decoded._id }, { "roomassetbundleid": req.body.roomassetbundleid }] };
                        return room.findOne(condition, ("roomName room_angle")).exec();

                    }
                    else {
                        console.log("flag", flag);
                        if (typeof req.body.roomassetbundleid == "undefined") {
                            msg = "Room asset bundle id is not applicable";
                        }
                        else { msg = "User is not authorized" }
                        return false;
                    }
                })
                // .then(function (assetsbunddle_Data) {
                //     if (assetsbunddle_Data && flag && decoded.emailId == req.body.email && typeof req.body.roomassetbundleid !== "undefined") {
                //         console.log("flag", flag);
                //         console.log("typeof req.body.roomassetbundleid !== undefined", typeof req.body.roomassetbundleid !== "undefined")

                //         var condition = { "$and": [{ "user_id": decoded._id }, { "roomassetbundleid": req.body.roomassetbundleid }] };
                //         return room.findOne(condition, ("roomName room_angle")).exec();

                //     }
                //     else {
                //         console.log("flag", flag);
                //         if (typeof req.body.roomassetbundleid == "undefined") {
                //             msg = "Room asset bundle id is not applicable";
                //         }
                //         else { msg = "User is not authorized" }
                //         return false;
                //     }
                // })

                .then(function (assetsbunddle_Data) {
                    console.log("assetsbunddle_Data", assetsbunddle_Data)
                    if (assetsbunddle_Data) {

                        assetsbunddle_Data.room_angle.forEach((value, index) => {
                            console.log("value.angleName1", value.angleName)
                            console.log("req.body.angle_name", req.body.angle_name)
                            if (value.angleName === req.body.angle_name) {
                                console.log("value.angleName2", value.angleName)
                                exist_angle_name = true;
                            }
                        });
                        var condition_pull = { assetsbunddle_Data };

                        if (exist_angle_name) {
                            var updation_pull = { $pull: { "room_angle": { "angleName": req.body.angle_name } } }
                            return room.findByIdAndUpdate(assetsbunddle_Data._id, updation_pull, { upsert: true }).exec()
                        }
                        else {
                            msg = "Room angle doesn't  exist"
                            return false
                        }
                    }
                    else if (!assetsbunddle_Data && flag && typeof req.body.roomassetbundleid !== "undefined") {
                        msg = "Room  doesn't  exist"
                        return false
                    }
                    else {
                        return false
                    }


                })
                .then(function (room_Data) {
                    console.log(room_Data)
                    if (room_Data) {
                        res.json({
                            "room_angle_delete": {
                                "processStatus": "Succefully deleted",

                                "success": true
                            }
                        });
                    }
                    else {
                        res.json({
                            "room_angle_delete": {
                                "processStatus": msg,

                                "success": false
                            }
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    res.json({
                        "room_angle_delete": {
                            "processStatus": "User is not authorized",

                            "success": false
                        }
                    });
                })

        }
    })

});

//App API hit to get the room setting
router.get('/roomSetting_save', function (req, res, next) {
    var token = req.query.token;
    var roomassetbundleid = "";
    if (typeof req.query.roomassetbundleid !== "undefined") {
        roomassetbundleid = req.query.roomassetbundleid;;
    }
    var users_detail = {};
    var useremail = ""

    var assetslistdatatemp = [];
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err || req.query.email !== decoded.emailId) {
            res.json({
                "room_saved_setting": {
                    "processStatus": "User is not authorized",

                    "success": false
                }
            });
        }

        else {
            var msg = "Something happened wrong"
            var flag = false;
            console.log("regular", decoded)

            return user.findOne({ "emailId": decoded.emailId }, ["login_tokenid", "allowed_no_of_login"]).exec()
                .then((user_detail) => {
                    console.log("user_detail", user_detail);
                    user_detail.login_tokenid.forEach((value, index) => {
                        if (decoded.login_tokenid[0].token_id == value.token_id) {
                            flag = true;

                        }

                    });

                    if (user_detail && flag && (useremail == "" || decoded.emailId == req.query.email)) {
                        console.log("flag", flag);

                        var condition;
                        if (roomassetbundleid == "") {
                            condition = { "user_id": decoded._id }
                        }
                        else {
                            condition = { "$and": [{ "user_id": decoded._id }, { "roomassetbundleid": roomassetbundleid }] }
                        }
                        return room.find(condition, ("horizontalSpeed verticalSpeed fov resetSaturation roomassetbundleid resetContrast roomName brightness saturation resetBrightness contrast user_id")).exec();

                    }
                    else {
                        console.log("flag", flag);
                        msg = "User is not authorized"
                        return false;
                    }
                })


                .then(function (room_Data) {
                    console.log("assetsbunddle_Data", room_Data)
                    if (room_Data.length > 0) {

                        res.json({
                            "room_saved_setting": {
                                "processStatus": "Succefully fetched",
                                "room_data": room_Data,
                                "success": true
                            }
                        });
                    }
                    else if (flag) {
                        res.json({
                            "room_angle": {
                                "processStatus": "No data found",
                                "room_data": [],
                                "success": false
                            }
                        });
                    }
                    else {
                        res.json({
                            "room_saved_setting": {
                                "processStatus": msg,

                                "success": false
                            }
                        });
                    }


                })

                .catch(function (error) {
                    console.log(error);
                    res.json({
                        "room_saved_setting": {
                            "processStatus": "User is not authorized",

                            "success": false
                        }
                    });
                })

        }
    })
});



module.exports = router;