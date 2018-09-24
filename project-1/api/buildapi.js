var multer = require("multer");
var express = require('express');
var router = express.Router();

var path = require('path')
var Promise = require("bluebird");
var fs = require('fs');
var root_path = require('app-root-path');
var buildfile = require('./../schema/builds');

var fstream = require('fstream')


var jwt = require('jsonwebtoken');
//For storing image files

router.get('/buildfiledownload', function (req, res, next) {



    buildfile.findOne({}).exec()


        .then(function (databuild) {
            if (databuild) {
                console.log('user is credit price is  updated', databuild.macBuild.name);
                res.json({

                    "processStatus": "succefully fetched",
                    "maclink": databuild.macBuild.name,
                    "macfilename": databuild.macBuild.title,
                    "windowfilename": databuild.windowsBuild.title,
                    "windowlink": databuild.windowsBuild.name,
                    "success": true

                });
            }
            else {
                res.json({

                    "processStatus": "succefully not fetched",
                    "maclink": "",
                    "windowlink": "",
                    "macfilename": "",
                    "windowfilename": "",
                    "success": false

                });
            }
        })
        .catch(function (error) {
            console.log(error);
            res.json({ status: 500, success: false, message: 'Something wrong' });
        })

})

router.post('/savebuild', function (req, res, next) {
    var token = req.body.token;
    var build_name = req.body.build_name;
    console.log("token",token)
    console.log(req.body)
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            res.json({
                "buildupdate": {
                    "processStatus": "token id does not match",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            var filePathmacbuild;
            var filePathwinbuild;
            if (decoded.is_admin == 1) {
                buildfile.findOne({}).exec()
                    .then((buildata) => {

                        console.log(buildata);

                        var updatedata;
                        if (build_name === "mac") {
                            updatedata = {
                                $set: {
                                    "macBuild": req.body.build_detail,
                                    "newmacBuild":{}
                                }
                            }
                            filePathmacbuild = __dirname + '/../../html/wp-content/uploads/2018/builds/' + buildata.macBuild.name
                        }
                        else if (build_name === "window") {
                            updatedata = {
                                $set: {
                                    "windowsBuild": req.body.build_detail,
                                    "newwindowsBuild":{}
                                }
                            }
                            filePathwinbuild = __dirname + '/../../html/wp-content/uploads/2018/builds/' + buildata.windowsBuild.name
                        }

                        return buildfile.update({}, updatedata, { upsert: true }).exec()
                    })
                    .then((upda) => {
                        console.log(upda);
                        if (upda) {

                            if (build_name === "mac" && fs.existsSync(filePathmacbuild)) {
                                fs.unlinkSync(filePathmacbuild);
                            }
                            else if (build_name === "window" && fs.existsSync(filePathwinbuild)) {
                                fs.unlinkSync(filePathwinbuild);
                            }

                            res.json({
                                "buildupdate": {
                                    buildname:build_name,
                                    success: true, message: 'upload succefully'
                                }
                            });
                        }
                        else {
                            res.json({
                                "buildupdate":
                                    { success: false, message: 'upload not succefully' }
                            });
                        }
                    })
            }
            else {
                res.json({
                    "buildupdate": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })
})

module.exports = router;
