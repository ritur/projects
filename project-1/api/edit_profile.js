var express = require('express');
var router = express.Router();
var user = require('./../schema/users');
var Promise = require("bluebird");
var session = require('express-session');
var path = require('path')
var fs = require('fs');
var root_path = require('app-root-path');
var multer = require("multer");
var jwt = require('jsonwebtoken');
//For storing image files
var storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, './public/images/assets/profile_images'); // set the destination
    },
    filename: function (req, file, callback) {
        // callback(null, Date.now() + '.png'); // set the file name and extension
        callback(null, Date.now() + ".png"
        );
    }
});
var upload = multer({ storage: storage });



router.post('/', function (req, res, next) {

    console.log(req.body);
    if (!req.session.user) {
        res.json({
            "updateUserProcessResult": {
                "processStatus": "User not authorized for access.",

                "success": false
            }
        })
    }
    else {
        console.log("req.session.user", req.session.user);
        var flag = false;
        user.findOne({ "emailId": req.session.user.emailId }, ["login_tokenid", "allowed_no_of_login"])
            .then((user_detail) => {
                console.log("user_detail", user_detail);

                if (user_detail) {
                    if (req.body.userData.firstName == "" || req.body.userData.lastName == "" || req.body.userData.emailId == "") {
                        return false;

                    }
                    else {
                        var findemail = { 'emailId': req.body.userData.emailId.toLowerCase() };
                        return user.find(findemail).exec()
                    }


                }
                else {
                    return false;
                }
            })


            .then(function (isEmail) {
                if (isEmail !== false) {
                    var login_user_id = req.session.user._id;            //change req.session.userid
                    if (isEmail.length < 2) {
                        if (isEmail.length === 1) {
                            console.log(isEmail);
                            console.log("isEmail[0]", isEmail[0])
                            // console.log("req.session.user._id", req.session.user._id)
                            if (isEmail[0]._id == req.session.user._id) {  //change req.session.userid
                                console.log('result');
                                var updateData = {
                                    'firstName': req.body.userData.firstName,
                                    'lastName': req.body.userData.lastName,
                                    // 'emailId': req.body.userData.emailId,
                                    // 'password': req.body.userData.password,
                                    'address': req.body.userData.address,
                                    'country': req.body.userData.country,
                                    'state': req.body.userData.state,
                                    'mobileNo': req.body.userData.mobileNo,
                                    'street': req.body.userData.street,
                                    'city': req.body.userData.city,
                                    'pincode': req.body.userData.pincode

                                };
                                console.log('updateData', updateData);
                                return user.findByIdAndUpdate(login_user_id, updateData, { new: true }).exec()
                                    .then(function (result) {
                                        console.log('result', result);

                                        res.json({
                                            "updateUserProcessResult": {
                                                "processStatus": "User Updated Succesfully.",
                                                "resultData": req.session.user._id,    //change req.session.userid
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

                            var updateData = {
                                'firstName': req.body.userData.firstName,
                                'lastName': req.body.userData.lastName,
                                // 'emailId': req.body.userData.emailId,
                                // 'password': req.body.userData.password,
                                'address': req.body.userData.address,
                                'country': req.body.userData.country,
                                'state': req.body.userData.states,
                                'mobileNo': parseFloat(req.body.userData.mobileNo),
                                'street': req.body.userData.street,
                                'city': req.body.userData.city,
                                'pincode': req.body.userData.pincode

                            };

                            user.findByIdAndUpdate(login_user_id, updateData, { new: true }).exec()
                                .then(function (result) {
                                    console.log('result', result);

                                    res.json({
                                        "updateUserProcessResult": {
                                            "processStatus": "User Updated Succesfully.",
                                            "resultData": req.session.user.user._id,           //change req.session
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
                            "processStatus": "Some of the required fields are empty",
                            "resultData": "",
                            "success": false
                        }
                    });
                }
                else {
                    res.json({
                        "updateUserProcessResult": {
                            "processStatus": "User not authorized for access.",

                            "success": false
                        }
                    })
                }

            })

            .catch(function (error) {
                console.log(error);
                res.json({ status: 500, success: false, message: 'Something wrong' });
            })

    }



});

router.get('/', function (req, res, next) {

    if (!req.session.user) {
        res.json({
            "updateUserResult": {
                "processStatus": "User not authorized for access.",

                "success": false
            }
        })
    }
    else {
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

                    return user.findOne({ "_id": req.session.user._id }, ("firstName emailId lastName address mobileNo street state country city pincode profile_image")).exec()
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
                        tempresult.pincode = ""
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
                        "updateUserResult":{
                        "processStatus": "User Detail",
                        "user_data": tempresult,
                        "success": true
                        }
                    })


                }
                else {
                    res.json({
                        "updateUserResult": {
                            "processStatus": "User not authorized for access.",

                            "success": false
                        }
                    })

                }
            })
    }


});

router.post('/edituser', function (req, res, next) {
    var token = req.body.token;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            msg = "token id is incorrect";
            return false;
        }
        else {
            if (decoded.is_admin == 1) {
                return user.find({ "emailId": req.body.emailId }).exec()
                    .then(function (isEmail) {
                        if (req.body.purchasecredit !== "") {
                            var increasecredit = req.body.purchasecredit
                        }
                        else {
                            var increasecredit = 0;
                        }
                        if (isEmail !== false) {
                            var login_user_id = req.body._id;            //change req.session.userid
                            if (isEmail.length < 2) {
                                if (isEmail.length === 1) {
                                    console.log(isEmail);
                                    console.log("isEmail[0]", isEmail[0]._id);

                                    console.log("req.body._id", req.body._id)
                                    if (isEmail[0]._id == req.body._id) {  //change req.session.userid
                                        console.log('result');
                                        var updateData = {
                                            'firstName': req.body.firstName,
                                            'lastName': req.body.lastName,
                                            'emailId': req.body.emailId,
                                            'password': req.body.password,
                                            'address': req.body.address,
                                            'creditprice': req.body.creditprice,
                                            'mobileNo': req.body.mobileNo,
                                            'street': req.body.street,
                                            'allowed_no_of_login': req.body.allowed_login,
                                            $inc: { "credit_detail.current_balance": increasecredit }

                                        };
                                        console.log('updateData', updateData);
                                        return user.findByIdAndUpdate(login_user_id, updateData, { new: true }).exec()
                                            .then(function (result) {
                                                console.log('result', result);

                                                res.json({
                                                    "updateUserProcessResult": {
                                                        "processStatus": "User Updated Succesfully.",
                                                        "resultData": req.body._id,    //change req.session.userid
                                                        "is_admin": true,
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
                                                "is_admin": true,
                                                "success": false
                                            }
                                        });
                                    }
                                }
                                else {

                                    var updateData = {
                                        'firstName': req.body.firstName,
                                        'lastName': req.body.lastName,
                                        'emailId': req.body.emailId,
                                        'password': req.body.password,
                                        'address': req.body.address,
                                        'creditprice': req.body.creditprice,
                                        'mobileNo': parseFloat(req.body.mobileNo),
                                        'street': req.body.street,
                                        'allowed_no_of_login': req.body.allowed_login,
                                        $inc: { "credit_detail.current_balance": increasecredit }


                                    };

                                    user.findByIdAndUpdate(login_user_id, updateData, { new: true }).exec()
                                        .then(function (result) {
                                            console.log('result', result);

                                            res.json({
                                                "updateUserProcessResult": {
                                                    "processStatus": "User Updated Succesfully.",
                                                    "resultData": req.body._id,           //change req.session
                                                    "is_admin": true,
                                                    "success": true
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
                                        "is_admin": true,
                                        "success": false
                                    }
                                });
                            }
                        }
                        else if (req.body.userData.firstName == "" || req.body.userData.lastName == "" || req.body.userData.emailId == "" || req.body.userData.password == "") {
                            res.json({
                                "updateUserProcessResult": {
                                    "processStatus": "Some of the required fields are empty",
                                    "resultData": "",
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }
                        else {
                            res.json({
                                "updateUserProcessResult": {
                                    "processStatus": msg,
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }


                    })

                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "updateUserProcessResult": {
                                "processStatus": msg,
                                "is_admin": true,
                                "success": false
                            }
                        });
                    })
            }
            else {
                msg = "User is not authorized";
                res.json({
                    "updateUserProcessResult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })





})


router.post('/upload_profile_pic', upload.any(), function (req, res, next) {
    var filesdetail = req.files
    user.findById(req.session.user._id, ["profile_image"]).exec()
        .then((profilepath) => {
            if (profilepath && profilepath.profile_image !== null) {
                var filePathand = root_path + '/public/images/assets/profile_images/' + profilepath.profile_image;
                if (fs.existsSync(filePathand)) { fs.unlinkSync(filePathand); }
            }

            console.log("filesdetail", filesdetail[0].filename)
            var updateData = {
                "profile_image": filesdetail[0].filename


            };
            return user.findByIdAndUpdate(req.session.user._id, updateData, { new: true }).exec()
        })
        .then((filesdetailtemp) => {

            res.json({ status: 200, success: true, filesdetail: filesdetail[0].filename, message: 'upload succefully' });
        })



})


//delete a user from admin userlist
router.post('/deletuser', function (req, res, next) {
    console.log(req.body)
    var userId = req.body.id;
    var token = req.body.token;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            msg = "token id is incorrect";
            res.json({
                "UserDeleteresult": {
                    "processStatus": "token id is incorrect",

                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                user.findByIdAndRemove(userId, function (err, result) {
                    if (err) {
                        res.json({
                            "UserDeleteresult": {
                                "processStatus": "User not deleted",
                                "is_admin": true,
                                "success": false
                            }
                        });
                    }
                    else {
                        console.log('assetbundle deleted');
                        res.json({
                            "UserDeleteresult": {
                                "processStatus": "User deleted",
                                "is_admin": true,
                                "success": true
                            }
                        });
                    }
                })
            }
            else {
                res.json({
                    "UserDeleteresult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })

})

//password change
router.post('/password_change', function (req, res, next) {
    console.log("req.body", req.body);
    if (!req.session.user) {
        res.json({
            "EditPassword": {
                "processStatus": "User not authorized for access.",

                "success": false
            }
        })
    }
    else {
        var flag = false;
        var authrized_user = true;
        user.findOne({ "emailId": req.session.user.emailId }, ["login_tokenid", "allowed_no_of_login"])
            .then((user_detail) => {
                console.log("user_detail", user_detail);
                // user_detail.login_tokenid.forEach((value, index) => {
                //     if (req.session.user.login_tokenid[0].token_id == value.token_id) {
                //         flag = true;

                //     }

                // });
                if (user_detail) {
                    if (req.body.oldpassword == "" || req.body.password == "") {
                        return false;

                    }
                    else {
                        var findemail = { $and: [{ "password": req.body.oldpassword }, { 'emailId': req.body.emailId.toLowerCase() }] };
                        return user.findOne(findemail, ["emailId"]).exec()
                    }


                }
                else {
                    authrized_user = false
                    return false;
                }
            })
            .then(function (isEmail) {
                if (isEmail) {
                    var updateData = {
                        "password": req.body.password
                    }
                    user.update({ "emailId": isEmail.emailId }, updateData, { new: true })
                        .then((userupdate) => {
                            if (userupdate) {
                                console.log(userupdate);
                                res.json({
                                    "EditPassword": {
                                        "processStatus": "Password changed successfully",

                                        "success": true
                                    }
                                })
                            }
                            else {
                                res.json({
                                    "EditPassword": {
                                        "processStatus": "Password does not change",

                                        "success": false
                                    }
                                })
                            }


                        })

                }
                else if (authrized_user == true && (req.body.oldpassword == "" || req.body.password == "")) {
                    res.json({
                        "EditPassword": {
                            "processStatus": "Password cannot be field is empty",

                            "success": false
                        }
                    })
                }
                else if (authrized_user == true) {
                    res.json({
                        "EditPassword": {
                            "processStatus": "Your current password is not correct",

                            "success": false
                        }
                    })
                }
                else {
                    res.json({
                        "EditPassword": {
                            "processStatus": "User not authorized for access.",

                            "success": false
                        }
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
                res.json({ "EditPassword": { status: 500, success: false, message: 'Something wrong' } });
            })
    }


})


module.exports = router;