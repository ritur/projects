var express = require('express');
var router = express.Router();
var user = require('./../schema/users');
var Promise = require("bluebird");
// var session = require('express-session');
var crypto = require('crypto');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var creditpriceuser = require('./../schema/creditpriceuser');


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
    var findemail = { 'emailId': req.body.userData.emailId.toLowerCase() };
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
                    if (isEmail.registration_success == true) {
                        return true;
                    }
                    else {
                        return false;
                    }
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

                    if (user_exist && user_exist.registration_success == false) { //var token_id = [{ "token_id": token }]
                        var registerData = {
                            'firstName': req.body.userData.firstName,
                            'lastName': req.body.userData.lastName,
                            'emailId': req.body.userData.emailId,
                            'password': req.body.userData.password,
                            'mobileNo': req.body.userData.mobileNo,
                            'activeTokenId': token,
                            'loginTokenId': token,
                            'registration_success': true,
                            'credit_detail': { "current_balance": 10, "how_much_purchase": 0 },


                        };

                        responseMessage = 'Registration Successfull.An activation link has been sent to ' + req.body.userData.emailId + '.';
                        user.findOneAndUpdate({ "emailId": req.body.userData.emailId }, registerData, { upsert: true })
                            .then(function (user_detail) {

                                if (user_detail) {
                                    req.session.user = user_detail;
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
                                console.log("result_userDeatail", result_userDeatail)
                                var mailOptions = {
                                    to: result_userDeatail.emailId,
                                    subject: 'Activate Account',
                                    user: { // data to view template, you can access as - user.name
                                        name: req.body.userData.firstName + " " + req.body.userData.lastName,
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
                        var registerDatanew = new user({
                            'firstName': req.body.userData.firstName,
                            'lastName': req.body.userData.lastName,
                            'emailId': req.body.userData.emailId,
                            'password': req.body.userData.password,
                            'mobileNo': req.body.userData.mobileNo,
                            'activeTokenId': token,
                            'loginTokenId': token,
                            'registration_success': true,
                            'credit_detail': { "current_balance": 10, "how_much_purchase": 0 },


                        });
                        return registerDatanew.save()
                            .then(function (user_detail) {

                                if (user_detail) {
                                    req.session.user = user_detail;
                                    var userInfo = {
                                        user_id: user_detail._id,
                                        firstName: user_detail.firstName,
                                    }

                                }
                                return user_detail;

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

                }

                else {
                    console.log("user_exist", user_exist)

                    res.json({
                        "signupProcessResult": {
                            "processStatus": responseMessage,
                            "resultData": responseUserId,
                            "status": false
                        }
                    });

                }

            })

            .catch(function (error) {
                console.log(error);
                res.json({ status: 500, success: false, message: 'Something wrong' });
            })

    }


});




router.post('/signup_email_save', function (req, res, next) {

    // console.log(req.body);
    var userdata = {};
    var responseMessage = '';
    var token;
    var user_exist = {};
    var findemail = { "emailId": req.body.userData.emailId.toLowerCase() }
    user.findOne(findemail, ["emailId", "registration_success"])
        .then(function (isEmail) {
            console.log("isEmail", isEmail)
            if (!isEmail) {
                console.log("registerData")
                var registerData = new user({

                    'emailId': req.body.userData.emailId,



                });
                console.log("registerData", registerData)
                return registerData.save()
                    .then(function (user_detail) {


                        res.json({
                            "signup_email_save": {
                                "message": "new user",
                                "status": true
                            }
                        });

                    })
            }
            else {
                if (isEmail.registration_success == false) {
                    res.json({
                        "signup_email_save": {
                            "message": "user exist but registeration is not complete",
                            "status": true
                        }
                    });
                }
                else {
                    res.json({
                        "signup_email_save": {
                            "message": "user exist",
                            "status": false
                        }
                    });
                }
            }

        })
        .catch(function (error) {
            console.log("error", error);
            res.json({ status: 500, success: false, message: 'Something wrong' });
        })



});




//API hit to confirm user validity
router.get('/confirm_user', function (req, res, next) {
    var token;
    var users_detail = {};
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');

    });
    var verifytoken = [];
    verifytoken = req.query.token_id.split("_");
    if (verifytoken[1] == "accoutto") {
        var condition_tok = { activeTokenId: verifytoken[0] }
    }
    else if (verifytoken[1] == "loginto") {
        var condition_tok = { loginTokenId: verifytoken[0] }
    }
    user.findOne(condition_tok, function (err, users) {
        if (!users) {
            res.json({ success: false, message: 'Validation is not done token Id is not valid' });

        }
        else {

            if (req.session.user) {                 //to check if user is logged in 
                req.session.user = null;
            }



            if (verifytoken[1] == "accoutto") {
                users.activeTokenId = undefined;
                users.is_active = true;
            }
            else if (verifytoken[1] == "loginto") {

                users.loginTokenId = undefined;
            }
            users['login_tokenid'] = [{ "token_id": token }];;

            users.save(function (err, result) {
                if (err) {
                    res.json({ success: false, message: 'Some error occured' });
                }
                else {
                    console.log(result)
                    req.session.user = result;
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
                    // req.session.user.login_tokenid = [{ "token_id": token }];
                    res.json({ success: true, message: 'User is valid', users: users_detail });

                }

            });
        }
    });

});



//API hit to Resend user validation email
router.get('/resendMail', function (req, res, next) {
    var token;
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');

    });
    user.findOne({ emailId: req.query.emailId }, ["activeTokenId"])
        .then(function (users) {

            if (!users) {
                res.json({ success: false, message: 'User is not registered' });

            }
            else {


                console.log("token", token)
                var option = { activeTokenId: token }
                return user.findOneAndUpdate({ emailId: req.query.emailId }, option, { new: true }).exec()
            }
        })
        .then((resultuser) => {
            var mailOptions = {
                to: resultuser.emailId,
                subject: 'Activate Account',
                user: { // data to view template, you can access as - user.name
                    name: resultuser.firstName + " " + resultuser.lastName,
                    url: 'http://livefurnish.com:3000/verify_user?token_id=' + resultuser.activeTokenId
                }
            }

            // Send email.
            res.mailer.send('activateEmail', mailOptions, function (err, message) {


                if (err) {
                    console.log(err);

                    res.json({
                        "signupProcessResult": {

                            "success": false
                        }
                    });


                }
                res.json({
                    "signupProcessResult": {

                        "success": true
                    }
                });

            });
        })


        .catch(function (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Something wrong' });
        })


});


//API call for LogIn User 
router.get('/logInUser/:emailId/:password/:remember', function (req, res, next) {
    var token;
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');

    });


    // console.log(req.session.user)
    var emailId = req.params.emailId;
    var password = req.params.password;
    var rememberme = req.params.remember;
    var findemail = { $and: [{ "emailId": emailId }, { registration_success: true }] };
    // var generate_jwt=user.generateJwt();
    console.log("emailId", emailId)
    console.log("password", password)


    // if (req.session.user && req.session.user.is_admin == 1) {
    //     res.json({
    //         "loginUserResult": {
    //             "users": req.session.user,
    //             "success": true,
    //             "is_admin": 1,
    //         }
    //     }
    //     );
    // }
    if (req.session.user) {
        var users_detail = {};
        users_detail._id = req.session.user._id;
        users_detail.firstName = req.session.user.firstName;
        users_detail.lastName = req.session.user.lastName;
        users_detail.password = req.session.user.password;
        users_detail.address = req.session.user.address;
        users_detail.country = req.session.user.country;
        users_detail.mobileNo = req.session.user.mobileNo;
        users_detail.street = req.session.user.street;
        users_detail.city = req.session.user.city;
        users_detail.pincode = req.session.user.pincode;
        users_detail.profile_image = req.session.user.profile_image;
        users_detail.image_credit = req.session.user.image_credit;
        res.json({
            "loginUserResult": {
                'users': users_detail,
                "success": true,
                "is_admin": 0,
            }
        })
    }
    else {
        user.findOne(findemail, ["password", "firstName", "login_tokenid", "state", "allowed_no_of_login", "lastName", "emailId", "mobileNo", "emailId", "street", "address", "city", "state", "pincode", "country", "credit_detail"])
            .then(function (users) {

                if (users) {

                    if (password == users.password) {
                        var no_of_login = users.allowed_no_of_login;
                        var login;
                        var flag = false;
                        var users_detail = {};

                        console.log(users)
                        var users_detail = {};
                        req.session.user = users;
                        users_detail._id = users._id;
                        users_detail.firstName = users.firstName;
                        users_detail.lastName = users.lastName;
                        users_detail.password = users.password;
                        users_detail.address = users.address;
                        users_detail.country = users.country;
                        users_detail.mobileNo = users.mobileNo;
                        users_detail.street = users.street;
                        users_detail.city = users.city;
                        users_detail.pincode = users.pincode;
                        users_detail.profile_image = users.profile_image;
                        users_detail.image_credit = users.image_credit,
                            // user_detail.profile_image = result.profile_image;

                            console.log(" req.", rememberme);
                        users_detail.emailId = users.emailId;
                        console.log(" req.session.cookie.expires", req.session.cookie);
                        if (rememberme == true || rememberme == 'true') {
                            req.session.cookie.expires = false;
                            req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
                            console.log(" req.session.cookie.expires", req.session.cookie);
                        }
                        console.log("req.session.user", req.session.user);
                        res.json({
                            "loginUserResult": {
                                'users': users_detail,
                                "success": true,
                                "is_admin": 0,
                            }
                        }
                        );



                    }
                    else {
                        res.json({
                            "loginUserResult": {
                                "processStatus": "Wrong password Entered by user",
                                "resultData": null,
                                "success": false,
                                "is_admin": 0
                            }

                        });
                    }


                }
                else {

                    res.json({
                        "loginUserResult": {
                            "processStatus": "User not authorized for access.",
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
    }
});

//Api call for admin login
router.get('/logInAdmin/:emailId/:password/:remember', function (req, res, next) {

    var generate_jwt;
    // console.log(req.session.user)
    var emailId = req.params.emailId;
    var password = req.params.password;
    var rememberme = req.params.remember;
    if (emailId === "support@livefurnish.com" && (password === 123456 || password === "123456")) {
        console.log(emailId)
        var userdetail = {
            emailId: "support@livefurnish.com",
            is_admin: 1,
            is_active: true,
            firstName: "suppot",
            lastName: "sharma",
            profile_image: undefined

        };
        console.log("remember me",rememberme)
        if (rememberme == true || rememberme == '"true"'||rememberme == "true") {
            console.log("remember me2",rememberme)
            // req.session.cookie.expires = false;
            // req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
            // console.log(" req.session.cookie.expires", req.session.cookie);
            generate_jwt = jwt.sign({
                emailId: "support@livefurnish.com",
                is_admin: 1,
                is_active: true,
                firstName: "suppot",
                lastName: "sharma",
                profile_image: undefined,
                exp: 365 * 24 * 60 * 60 * 1000,
            }, "sshhsecret");
        }
        else {
            console.log("remember me3",rememberme)
            var expiry = new Date();
            expiry.setDate(expiry.getDate() + 7);
            console.log(expiry);
            console.log("parseInt(expiry.getTime() / 1000)", parseInt(expiry.getTime() / 1000));
            console.log("expiration date",Math.floor(Date.now() / 1000) + (60 * 60));
            generate_jwt = jwt.sign({
                emailId: "support@livefurnish.com",
                is_admin: 1,
                is_active: true,
                firstName: "suppot",
                lastName: "sharma",
                profile_image: undefined,
                exp:Math.floor(Date.now() / 1000) + (60 * 60),
            }, "sshhsecret");
        }
        // req.session.user.is_admin = 1;
       
        res.json({
            "loginUserResult": {
                'users': "Welcome user admin ",
                "success": true,
                "is_admin": 1,
                "token": generate_jwt,
                'users': userdetail,
            }
        }
        );


    } else {

        res.json({
            "loginUserResult": {
                "processStatus": "User not authorized for access.",
                "resultData": null,
                "success": false,
                "is_admin": 0,
            }

        });
    }
})

//API hit to check logged in 
router.get('/session_check', function (req, res, next) {
    if (req.session.user) {
        var flag = false;
        console.log(" user_detail.login_tokenid00", req.session.user.login_tokenid)
        if (req.session.user.is_admin == 1) {
            res.json({
                "loginUserResult": {
                    "processStatus": "User still logged in ",
                    "success": true,
                    "is_admin": true
                }
            }
            );
        }
        else {
            user.findOne({ "emailId": req.session.user.emailId }, ["login_tokenid", "allowed_no_of_login"])
                .then((user_detail) => {
                    if (!user_detail) {
                        req.session.destroy();
                        res.json({
                            "loginUserResult": {
                                "processStatus": "User not authorized for access.",
                                "is_admin": false,
                                "success": false
                            }
                        })
                    }
                    else {

                        res.json({
                            "loginUserResult": {
                                "processStatus": "User still logged in ",
                                "success": true,
                                "is_admin": false
                            }
                        }
                        );
                    }


                })

        }
    }
    else {
        console.log("you have no session ");
        res.json({
            "loginUserResult": {
                "processStatus": "User not authorized for access.",

                "success": false
            }
        }
        )
    }


});


//API hit to check logged in for admin
router.get('/session_check_admin/:token', function (req, res, next) {
    var token=req.params.token;
    // console.log("token",token)
    jwt.verify(token, 'sshhsecret', function (err, decoded) {

        if (err) {
            res.json({
                "loginUserResult": {
                    "processStatus": "token id does not match",

                    "success": false
                }
            });
        }
        else {
            console.log("Decoded code:",decoded)
            if (decoded.is_admin == 1) {
                res.json({
                    "loginUserResult": {
                        "processStatus": "User still logged in ",
                        "success": true,
                        "is_admin": true
                    }
                });

            }
            else {
                console.log("you have no session ");
                res.json({
                    "loginUserResult": {
                        "processStatus": "User not authorized for access.",
                        "is_admin": false,
                        "success": false
                    }
                }
                )
            }
        }

    })
});

//API to logout user (destroy session)
router.get('/logoutUser', function (req, res, next) {

    console.log("req.body");
    if (req.session.user) {                 //to check if user is logged in 
        // if (req.session.user.is_admin !== 1) {
        //     // var condition_check = { "_id": req.session.user._id };
        //     // var sessiontokenid = req.session.user.login_tokenid[0].token_id
        //     req.session.destroy();
        //     // return user.findOneAndUpdate(condition_check, { $pull: { "login_tokenid": { "token_id": sessiontokenid } } }, { upsert: true }).exec()
        //     // .then((datadelete) => {
            
        //     res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        //     res.json({
        //         "logoutUserResult": {
        //             "processStatus": "logout Successfully.",
        //             "resultData": "logout Successfully.",
        //             "success": true
        //         }
        //     })
        //     // })
        // }
        // else {
            req.session.destroy();
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.json({
                "logoutUserResult": {
                    "processStatus": "logout Successfully.",
                    "resultData": "logout Successfully.",
                    "success": true
                }
            })
        // }
    }
    else {                                     //without logged In no log out
        res.json({
            "logoutUserResult": {
                "processStatus": "User not authorized for access.",
                "resultData": null,
                "success": false
            }
        }
        )
    }

});


//API to logout user (destroy session)
router.get('/logoutAdmin', function (req, res, next) {

    console.log("req.body");
    if (req.session.user) {                 //to check if user is logged in 
        if (req.session.user.is_admin !== 1) {
            // var condition_check = { "_id": req.session.user._id };
            // var sessiontokenid = req.session.user.login_tokenid[0].token_id
            
            // return user.findOneAndUpdate(condition_check, { $pull: { "login_tokenid": { "token_id": sessiontokenid } } }, { upsert: true }).exec()
            // .then((datadelete) => {
            console.log(datadelete);
            
            res.json({
                "logoutUserResult": {
                    "processStatus": "logout Successfully.",
                    "resultData": "logout Successfully.",
                    "success": true
                }
            })
            // })
        }
        else {
           
            
            res.json({
                "logoutUserResult": {
                    "processStatus": "logout Successfully.",
                    "resultData": "logout Successfully.",
                    "success": true
                }
            })
        }
    }
    else {                                     //without logged In no log out
        res.json({
            "logoutUserResult": {
                "processStatus": "User not authorized for access.",
                "resultData": null,
                "success": false
            }
        }
        )
    }

});


router.get('/activation_check', function (req, res, next) {
    console.log(" user_detail.login_tokenid00", req.session.user)
    if (req.session.user) {

        console.log(" user_detail.login_tokenid00", req.session.user.login_tokenid)
        if (req.session.user.is_admin == 1) {
            res.json({
                "Activationdata": {
                    "processStatus": "User is active",
                    "success": true,
                    "is_admin": true

                }
            }
            );
        }
        else {
            user.findOne({ "emailId": req.session.user.emailId }, ["is_active", "emailId"])
                .then((user_detail) => {

                    if (user_detail.is_active) {

                        res.json({
                            "Activationdata": {
                                "processStatus": "User is active",
                                "success": true,
                                "emailId": user_detail.emailId,
                                "is_admin": false

                            }
                        }
                        );
                    }
                    else if (!user_detail.is_active) {
                        res.json({
                            "Activationdata": {
                                "processStatus": "User is not active",
                                "success": false,
                                "emailId": user_detail.emailId,
                                "is_admin": false
                            }
                        }
                        );
                    }

                })
                .catch(function (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: 'Something wrong' });
                })

        }
    }
    else {
        console.log("you have no session ");
        res.json({
            "Activationdata": {
                "processStatus": "User not authorized for access.",
                "emailId": "",
                "is_admin": false,
                "success": false
            }
        }
        )
    }
})



router.post('/temp_allow', function (req, res, next) {


    var condition = { "emailId": req.body.emailId };
    var updateData = { "allowed_no_of_login": req.body.no_of_login }
    user.updateOne(condition, updateData, { new: true }).exec()
        .then(function (result) {


            res.json({
                "loginUserResult": {

                    "success": true
                }
            }
            );
        })

});

router.get('/userdetail', function (req, res, next) {
    console.log(" user_detail.login_tokenid0userdetail", req.session.user)
    if (req.session.user) {


        user.findOne({ "emailId": req.session.user.emailId }, ["firstName", "emailId", "lastName", "profile_image"]).exec()
            .then((user_detail) => {

                if (user_detail) {

                    console.log("user_detailsdfgsdfg", user_detail)

                    res.json({
                        "Activationdata": {
                            "processStatus": "User is active",
                            "success": true,
                            "emailId": user_detail.emailId,
                            "firstName": user_detail.firstName,
                            "lastName": user_detail.lastName,
                            "profile_image": user_detail.profile_image
                        }
                    }
                    );
                }
                else {
                    res.json({
                        "Activationdata": {
                            "processStatus": "User is not authorized",
                            "success": false,

                        }
                    }
                    );
                }

            })
            .catch(function (error) {
                console.log(error);
                res.status(500).json({ success: false, message: 'Something wrong' });
            })

    }

})

module.exports = router;