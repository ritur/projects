var express = require('express');
var session = require('express-session');
var router = express.Router();

var user = require('./../schema/users');


var crypto = require('crypto');




//global variable for bcrypt
const saltRounds = 10;



//send mail for  password reset succefull
router.post('/reset/:token', function (req, res, next) {
    user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, users) {
        if (!users) {
            res.json({ success: false, message: 'Password reset token is invalid or has expired' });

        }
        else {

            users.password = req.body.password;

            users.resetPasswordToken = undefined;
            users.resetPasswordExpires = undefined;


            users.save(function (err, users_detail) {
                if (err) {
                    res.json({ success: false, message: 'Some error occured' });
                }
                else {
                    var mailOptions = {
                        to: users_detail.emailId,
                        subject: 'Reset Password',
                        user: { // data to view template, you can access as - user.name
                            name: users_detail.firstName + " " + users_detail.lastName,
                            email: users_detail.emailId
                        }
                    }

                    // Send email.
                    res.mailer.send('reset_email', mailOptions, function (err, message) {
                        if (err) {
                            res.json({ success: false, message: 'Some error occured' });
                        }
                        else {
                            res.json({ success: true, message: 'Password succefully change' });
                        }

                    });
                }

            });
        }
    });

});



//To send mail for reset password
router.get('/sendemail', function (req, res, next) {
    var useremail = req.query.email_forgot_password;
    var token;
    var user_email;
    //create a token for the user
    console.log('token getting..');
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');

    });

    console.log("toketn get");
    user.findOne({ 'emailId': useremail }, function (err, users) {              //
        console.log("users Detail", users)
        if (!users) {
            res.json({ success: false, message: 'No account with that email address exists' });

        }
        else {
            //   var user_ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            users.resetPasswordToken = token;
            //   users.ip=user_ip;
            user_email -= users.emailId;
            users.resetPasswordExpires = Date.now() + 300000; // 5 min
            console.log("data in user");
            users.save(function (err, users) {
                console.log("perfectly save");
                // Setup email data.
                var mailOptions = {
                    to: users.emailId,
                    subject: 'Reset Password',
                    user: { // data to view template, you can access as - user.name
                        name: users.firstName + " " + users.lastName,
                        url: 'http://livefurnish.com:3000/reset_password?token=' + token
                    }
                }

                // Send email.
                res.mailer.send('email', mailOptions, function (err, message) {
                    console.log("message", message)
                    if (err) {
                        console.log(err);

                        res.json({ success: false, message: 'There was an error sending the email' });

                    }
                    else {
                        res.json({ success: true, message: 'An e-mail has been sent to ' + users.emailId + ' with further instructions.' });
                    }

                });
            });
        }

    });
});



module.exports = router;