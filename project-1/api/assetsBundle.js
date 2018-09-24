var multer = require("multer");
var express = require('express');
var router = express.Router();
var user = require('./../schema/users');
var assetsbunddle = require('./../schema/assetsbunddle');
var category = require('./../schema/category');
var path = require('path')
var Promise = require("bluebird");
var fs = require('fs');
var fstream = require('fstream')
var root_path = require('app-root-path');
var buildfile = require('./../schema/builds');
var jwt = require('jsonwebtoken');
var searchtag = require('./../schema/searchtag');


//For storing image files
var storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, './public/images/assets/images'); // set the destination
    },
    filename: function (req, file, callback) {
        // callback(null, Date.now() + '.png'); // set the file name and extension
        callback(null, Date.now() + path.extname(file.originalname)
        );
    }
});
var upload = multer({ storage: storage });

router.get('/listassests/:token', function (req, res, next) {
    var assetslistdatatemp = [];
    var token = req.params.token;

    var msg = "";
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            msg = "token id is incorrect";
            res.json({
                "assetslist": {
                    "processStatus": "token id does not match",

                    "success": false
                }
            });

        }
        else {
            if (decoded.is_admin == 1) {
                return assetsbunddle.find({}, ("assetsName version windowsAssetbundle macAssetbundle androidAssetbundle webglAssetbundle iosAssetbundle category thumbnail")).exec()
                    .then(function (assetslistdata) {

                        if (assetslistdata) {
                            var promiseasset = Promise.each(assetslistdata, (value, index) => {
                                let tempasset = {}

                                tempasset._id = value._id;
                                tempasset.assetsName = value.assetsName;
                                tempasset.thumbnail = value.thumbnail;
                                tempasset.version = value.version;
                                console.log(typeof value.windowsAssetbundle);
                                if (typeof value.windowsAssetbundle)
                                    console.log(value.windowsAssetbundle)
                                if (typeof value.macAssetbundle !== "undefined" && typeof value.macAssetbundle.title !== "undefined") {
                                    tempasset.macAssetbundle = value.macAssetbundle.title;
                                }
                                else {
                                    tempasset.macAssetbundle = "";
                                }
                                if (typeof value.iosAssetbundle !== "undefined" && typeof value.iosAssetbundle.title !== "undefined") {
                                    tempasset.iosAssetbundle = value.iosAssetbundle.title;
                                }
                                else {
                                    tempasset.iosAssetbundle = "";
                                }
                                if (typeof value.windowsAssetbundle !== "undefined" && typeof value.windowsAssetbundle.title !== "undefined") {
                                    tempasset.windowsAssetbundle = value.windowsAssetbundle.title;
                                }
                                else {
                                    tempasset.windowsAssetbundle = "";
                                }
                                if (typeof value.androidAssetbundle !== "undefined" && typeof value.androidAssetbundle.title !== "undefined") {
                                    tempasset.androidAssetbundle = value.androidAssetbundle.title;
                                }
                                else {
                                    tempasset.androidAssetbundle = "";
                                }
                                if (typeof value.webglAssetbundle !== "undefined" && typeof value.webglAssetbundle.title !== "undefined") {
                                    tempasset.webglAssetbundle = value.webglAssetbundle.title;
                                }
                                else {
                                    tempasset.webglAssetbundle = "";
                                }




                                var category_name = "";
                                var condition = { '_id': { $in: value.category } };
                                return category.find(condition)
                                    .then((categoryname) => {
                                        if (categoryname) {
                                            categoryname.forEach((valuecat, indexcat) => {
                                                category_name = category_name + " " + valuecat.name
                                            })
                                        }
                                        tempasset.category = category_name;
                                        assetslistdatatemp.push(tempasset);
                                    })



                                // return assetslistdatatemp;
                            });

                            Promise.all(promiseasset).then(function (results) {
                                // console.log("results", results);
                                // console.log("assetslistdatatemp", assetslistdatatemp)
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
                                    "processStatus": msg,
                                    "data": [],
                                    "success": false
                                }
                            });
                        }
                    })



                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "assetslist": {
                                "processStatus": "token id does not match",

                                "success": false
                            }
                        });
                    })
            }
            else {
                msg = "User is not authorized";
                res.json({
                    "assetslist": {
                        "processStatus": "User is not authorized",

                        "success": false
                    }
                });
            }
        }
    })



})

router.get('/:token', function (req, res, next) {
    var usersdata = [];
    var token = req.params.token;
    var msg = ""
    tempcategorylistdata = [];
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            msg = "token id is incorrect"
            res.json({
                "assetsBundleData": {
                    "processStatus": "token id is incorrect",

                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                return user.find({ "is_admin": 0 }, ("emailId")).exec()
                    .then(function (userlist) {
                        if (userlist) {
                            usersdata.push({ 'name': "All User", "value": "all" })
                            userlist.forEach((value, index) => {
                                usersdata.push({ 'name': value.emailId, "value": value._id })
                            });
                            return category.find({}).exec();
                        }
                        else {
                            msg = "Something wrong happen"
                            return false;
                        }
                    })

                    .then((categorylistdata) => {
                        tempcategorylistdata = categorylistdata;
                        return searchtag.find({}).exec()

                    })
                    .then((serchtaglistdata) => {
                        if (tempcategorylistdata.length > 0) {
                            res.json({
                                "assetsBundleData": {
                                    "processStatus": "Succefully fetched",
                                    "data": { "categorylistdata": tempcategorylistdata, "searchtaglistdata": serchtaglistdata, "user_list": usersdata },
                                    "success": true
                                }
                            });
                        }
                        else if (usersdata.length > 0) {
                            res.json({
                                "assetsBundleData": {
                                    "processStatus": "Something happened",
                                    "data": { "categorylistdata": [], "searchtaglistdata": serchtaglistdata, "user_list": usersdata },
                                    "success": false
                                }
                            });
                        }
                        else {
                            res.json({
                                "assetsBundleData": {
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
                msg = "User is not authorized";
                res.json({
                    "assetsBundleData": {
                        "processStatus": "User is not authorized",

                        "success": false
                    }
                });
            }
        }
    })






})

router.get('/single_assests/:token', function (req, res, next) {
    var temp_assetslistdata = {};
    var token = req.params.token;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            res.json({
                "Creditdeduction": {
                    "processStatus": "token id does not match",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                return assetsbunddle.findById({ "_id": req.body.query._id }).exec()
                    .then(function (assetslistdata) {
                        if (assetslistdata) {
                            temp_assetslistdata = assetslistdata;
                            return category.find({}).exec()
                        }
                        else {
                            return false
                        }
                    })
                    .then(function (categorylistdata) {
                        if (categorylistdata) {
                            temp_categorylistdata = categorylistdata;

                            return searchtag.find({}).exec()
                        }
                        else {
                            return false
                        }
                    })
                    .then(function (searchtaglistdata) {
                        console.log("searchtaglistdata", searchtaglistdata)
                        if (searchtaglistdata) {
                            res.json({
                                "assetslist": {
                                    "processStatus": "Succefully fetched",
                                    "data": temp_assetslistdata,
                                    "success": true,
                                    "is_admin": true
                                }
                            });
                        }
                        else {
                            res.json({
                                "assetslist": {
                                    "processStatus": "something happen wrong",
                                    "data": {},
                                    "success": false,
                                    "is_admin": true
                                }
                            });
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "assetslist": {
                                "processStatus": "Something happened wrong",
                                "status": 500,
                                "success": false
                            }
                        });
                    })
            }
            else {
                res.json({
                    "assetslist": {
                        "processStatus": "User is not authorized",
                        "status": 500,
                        "success": false
                    }
                });
            }
        }
    })





})

router.post('/create', upload.any(), function (req, res, next) {
    next();
})


//Create the asset bundle from admin 
router.post('/create', function (req, res, next) {
    var token = JSON.parse(req.body.token);
    var msg = "";
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            msg = "token id is incorrect"
            res.json({
                "assetresult": {
                    "processStatus": msg,
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {

            if (decoded.is_admin == 1) {
                console.log(req.body)
                var files = req.files;
                console.log(" files files files files", files)
                var assetname = JSON.parse(req.body.assetName);
                var assetsbundd = new assetsbunddle({
                    'assetsName': assetname,
                    'thumbnail': files[0].filename,
                    'version': JSON.parse(req.body.version),
                    'windowsAssetbundle': JSON.parse(req.body.window),
                    'macAssetbundle': JSON.parse(req.body.mac),
                    'iosAssetbundle': JSON.parse(req.body.ios),
                    'androidAssetbundle': JSON.parse(req.body.android),
                    'webglAssetbundle': JSON.parse(req.body.webgl),
                    'userpermission': JSON.parse(req.body.myControl),
                    'searchtag': JSON.parse(req.body.searchtages),
                    'category': JSON.parse(req.body.categories),
                    'predefinedAngles': JSON.parse(req.body.itemRows),


                });
                console.log(assetsbundd)
                return assetsbundd.save()
                    .then(function (assetsbunddleData) {

                        if (assetsbunddleData) {
                            var condition_category = { "_id": { $in: JSON.parse(req.body.categories) } };
                            var update_category = { $inc: { "assosiate_number": 1 } };
                            return category.update(condition_category, update_category, { multi: true }).exec()
                                .then((updadtedata) => {
                                    var condition_searchtag = { "_id": { $in: JSON.parse(req.body.searchtages) } };
                                    var update_searchtag = { $inc: { "assosiate_number": 1 } };
                                    return searchtag.update(condition_searchtag, update_searchtag, { multi: true }).exec()
                                })
                                .then((searchtagupdadtedata) => {
                                    console.log("updadtedata", searchtagupdadtedata);
                                    res.json({
                                        "assetresult": {
                                            "processStatus": "succefully insert",
                                            "is_admin": true,
                                            "success": true
                                        }
                                    });
                                })


                        }

                        else {
                            res.json({
                                "assetresult": {
                                    "processStatus": "Something happened wrong",
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }



                    })
            }
            else {
                msg = "User is not authorized"
                res.json({
                    "assetresult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })
})



router.post('/editAsset', upload.any(), function (req, res, next) {
    next();
})


router.post('/editAsset', function (req, res, next) {
    console.log(req.body);
    var decoded_data = {};
    var old_assetsBundleData = {};
    var token = JSON.parse(req.body.token);
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {
            res.json({
                "categoryresult": {
                    "processStatus": "token id does not match",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            decoded_data = decoded;
            if (decoded.is_admin == 1) {

                return assetsbunddle.findById(JSON.parse(req.body.id)).exec()
                    .then((assetsBundleData) => {

                        var files = req.files;
                        var windowfile = JSON.parse(req.body.window);
                        var iosfile = JSON.parse(req.body.ios);
                        var androidfile = JSON.parse(req.body.android);
                        var webglfile = JSON.parse(req.body.webgl);
                        var macfile = JSON.parse(req.body.mac);
                        var assetname = JSON.parse(req.body.assetName);
                        if (assetsBundleData) {
                            console.log("assetsBundleData", assetsBundleData)
                            old_assetsBundleData = assetsBundleData
                            if (typeof assetsBundleData.iosAssetbundle !== "undefined"
                                && typeof assetsBundleData.iosAssetbundle.title !== "undefined" && typeof iosfile.title !== "undefined") {
                                if (assetsBundleData.iosAssetbundle.name !== iosfile.name) {
                                    var filePathios = root_path + '/public/images/assets/images/' + assetsBundleData.iosAssetbundle.name;
                                    if (fs.existsSync(filePathios)) {
                                        console.log(fs.existsSync(filePathios))
                                        fs.unlinkSync(filePathios);
                                    }
                                }
                            }
                            if (typeof assetsBundleData.windowsAssetbundle !== "undefined"
                                && typeof assetsBundleData.windowsAssetbundle.title !== "undefined" && typeof windowfile.title !== "undefined") {
                                if (assetsBundleData.windowsAssetbundle.name !== windowfile.name) {
                                    var filePathwin = root_path + '/public/images/assets/images/' + assetsBundleData.windowsAssetbundle.name;
                                    if (fs.existsSync(filePathwin))
                                        fs.unlinkSync(filePathwin);
                                }
                            }
                            if (typeof assetsBundleData.macAssetbundle !== "undefined"
                                && typeof assetsBundleData.macAssetbundle.title !== "undefined" && typeof macfiletitle !== "undefined") {
                                if (assetsBundleData.macAssetbundle.name !== macfile.name) {
                                    var filePathmac = root_path + '/public/images/assets/images/' + assetsBundleData.macAssetbundle.name;
                                    if (fs.existsSync(filePathmac))
                                        fs.unlinkSync(filePathmac);
                                }
                            }
                            if (typeof assetsBundleData.androidAssetbundle !== "undefined"
                                && typeof assetsBundleData.androidAssetbundle.title !== "undefined" && typeof androidfile.title !== "undefined") {
                                if (assetsBundleData.androidAssetbundle.name !== androidfile.name) {
                                    var filePathand = root_path + '/public/images/assets/images/' + assetsBundleData.androidAssetbundle.name;
                                    if (fs.existsSync(filePathand))
                                        fs.unlinkSync(filePathand);
                                }
                            } if (typeof assetsBundleData.webglAssetbundle !== "undefined"
                                && typeof assetsBundleData.webglAssetbundle.title !== "undefined" && typeof webglfile.title !== "undefined") {
                                if (assetsBundleData.webglAssetbundle.name !== webglfile.name) {
                                    var filePathweb = root_path + '/public/images/assets/images/' + assetsBundleData.webglAssetbundle.name;
                                    if (fs.existsSync(filePathweb))
                                        fs.unlinkSync(filePathweb);
                                }
                            }
                            var thumbnailname;
                            if (files.length > 0 && typeof files[0].originalname !== "undefined") {
                                thumbnailname = files[0].filename;
                            }
                            else {
                                thumbnailname = assetsBundleData.thumbnail;
                            }
                            console.log("assetname", assetname)
                            var assetsbundd = {
                                'assetsName': assetname,
                                'thumbnail': thumbnailname,
                                'version': JSON.parse(req.body.version),
                                'windowsAssetbundle': JSON.parse(req.body.window),
                                'macAssetbundle': JSON.parse(req.body.mac),
                                'iosAssetbundle': JSON.parse(req.body.ios),
                                'androidAssetbundle': JSON.parse(req.body.android),
                                'webglAssetbundle': JSON.parse(req.body.webgl),
                                'userpermission': JSON.parse(req.body.myControl),
                                'searchtag': JSON.parse(req.body.searchtages),
                                'category': JSON.parse(req.body.categories),
                                'predefinedAngles': JSON.parse(req.body.itemRows)


                            };
                            console.log(assetsbundd)
                            return assetsbunddle.updateOne({ "_id": JSON.parse(req.body.id) }, assetsbundd, { new: true }).exec()
                        }
                        else {
                            return false;

                        }

                    })

                    .then(function (assetsbunddleData) {

                        if (assetsbunddleData) {
                            var condition_category = { "_id": { $in: old_assetsBundleData.category } };
                            var update_category = { $inc: { "assosiate_number": -1 } };
                            var condition_searchtag = { "_id": { $in: old_assetsBundleData.searchtag } };
                            var update_searchtag = { $inc: { "assosiate_number": -1 } };
                            return category.update(condition_category, update_category, { multi: true }).exec()
                                .then((updatecategory) => {
                                    if (updatecategory) {
                                        var condition_category_sec = { "_id": { $in: JSON.parse(req.body.categories) } };
                                        var update_category_sec = { $inc: { "assosiate_number": 1 } };
                                        return searchtag.update(condition_searchtag, update_searchtag, { multi: true }).exec()
                                    }
                                    else {
                                        return false;
                                    }
                                })
                                .then((updatesearchtag) => {
                                    if (updatesearchtag) {
                                        var condition_category_sec = { "_id": { $in: JSON.parse(req.body.categories) } };
                                        var update_category_sec = { $inc: { "assosiate_number": 1 } };
                                        return category.update(condition_category_sec, update_category_sec, { multi: true }).exec()
                                    }
                                    else {
                                        return false;
                                    }
                                })
                                .then((ctegoryfinal) => {
                                    if (ctegoryfinal) {
                                        var condition_searchtag_sec = { "_id": { $in: JSON.parse(req.body.searchtages) } };
                                        var update_searchtag_sec = { $inc: { "assosiate_number": 1 } };
                                        return searchtag.update(condition_searchtag_sec, update_searchtag_sec, { multi: true }).exec()
                                    }
                                    else {
                                        return false;
                                    }
                                })
                                .then((searchtagfinal) => {

                                    if (searchtagfinal) {
                                        res.json({
                                            "categoryresult": {
                                                "processStatus": "succefully Updated",
                                                "is_admin": true,
                                                "success": true
                                            }
                                        });
                                    }
                                    else {
                                        res.json({
                                            "categoryresult": {
                                                "processStatus": "Something happened wrong",
                                                "is_admin": true,
                                                "success": false
                                            }
                                        });
                                    }
                                })


                        }

                        else {
                            res.json({
                                "categoryresult": {
                                    "processStatus": "Not updated",
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.json({ "categoryresult": { "status": 500, "is_admin": true, "success": false, "processStatus": 'Something wrong' } });
                    })
            }
            else {
                res.json({
                    "categoryresult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })




})




//Deleting assetbundle api
router.post('/deleteasset', function (req, res, next) {
    var token = req.body.token;
    var id = req.body.id;
    var assetdetailstemp = {};
    var msg = "assetbundle not deleted";
    var decoded_data = {}
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            msg = "token id does not match";
            res.json({
                "Assetdeletionresult": {
                    "processStatus": "token id does not match",

                    "success": false
                }
            });
        }
        else {
            decoded_data = decoded;
            if (decoded.is_admin == 1) {

                // var category_name = req.body.categoryname;
                // var categorydata = new category({
                //     'name': category_name,
                // });
                return assetsbunddle.findById(id, ("category searchtag")).exec()
                    .then(function (assetdetails) {

                        if (assetdetails) {
                            console.log("assetdetails", assetdetails)
                            assetdetailstemp = assetdetails;
                            return assetsbunddle.findByIdAndRemove(id).exec();

                        }
                        else {
                            return false
                        }
                    })
                    .then(function (assetdelete) {
                        if (assetdelete) {
                            console.log('assetbundle assetdelete', assetdelete);
                            var condition_category = { "_id": { $in: assetdetailstemp.category } };
                            var update_category = {
                                $inc: { "assosiate_number": -1 }

                            };
                            return category.update(condition_category, update_category, { multi: true }).exec()
                        }
                        else {
                            return false
                        }
                    })
                    .then(function (categprydecrease) {
                        if (categprydecrease) {
                            console.log('assetbundle assetdelete', categprydecrease);
                            var condition_searchtag = { "_id": { $in: assetdetailstemp.searchtag } };
                            var update_searchtag = {
                                $inc: { "assosiate_number": -1 }

                            };
                            return searchtag.update(condition_searchtag, update_searchtag, { multi: true }).exec()
                        }
                        else {
                            return false
                        }
                    })
                    .then(function (assetdeletesuccess) {

                        if (assetdetailstemp) {
                            console.log('assetbundle deleted', assetdeletesuccess);
                            res.json({
                                "Assetdeletionresult": {
                                    "processStatus": "assetbundle deleted",

                                    "success": true
                                }
                            });
                        }
                        else {
                            res.json({
                                "Assetdeletionresult": {
                                    "processStatus": "something happen wrong",

                                    "success": false
                                }
                            });
                        }

                    })
            }
            else {
                msg = "User is not authorized";
                res.json({
                    "Assetdeletionresult": {
                        "processStatus": "User is not authorized",

                        "success": false
                    }
                });
            }
        }
    })




})

router.get('/editasset/:token', function (req, res, next) {

    var id = req.query.id;
    var usersdata = [];
    var categorylistdata = [];
    var searchlistdata = [];
    var decoded_data = {};
    var msg = "";
    var token = req.params.token
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            msg = "token id does not match";

            res.json({
                "AssetEditresult": {
                    "processStatus": msg,
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            decoded_data = decoded;
            if (decoded.is_admin == 1) {


                return user.find({ "is_admin": 0 }, ("emailId")).exec()
                    .then(function (userlist) {
                        if (userlist) {
                            usersdata.push({ 'name': "All User", "value": "all" })
                            userlist.forEach((value, index) => {
                                usersdata.push({ 'name': value.emailId, "value": value._id })
                            });
                            return category.find({}).exec();
                        }
                        else {
                            return false;
                        }
                    })
                    .then((categorylist) => {
                        console.log("assetslist", categorylist)
                        if (categorylist.length > 0 && usersdata.length > 0) {

                            categorylistdata = categorylist;

                            return searchtag.find({}).exec();
                        }
                        else {
                            return false
                        }
                    })
                    .then((searchtaglist) => {
                        console.log("assetslist", searchtaglist)
                        if (categorylistdata.length > 0 && usersdata.length > 0) {

                            searchlistdata = searchtaglist;

                            return assetsbunddle.findById(id);
                        }
                        else {
                            return false
                        }
                    })

                    .then(function (assetsdata) {
                        if (assetsdata) {

                            console.log('assetbundle edit list ', assetsdata);
                            console.log('usersdata edit list ', usersdata);
                            console.log('categorylistdata edit list ', categorylistdata);
                            res.json({
                                "AssetEditresult": {
                                    "processStatus": "assetbundle detail",
                                    "assetsdata": assetsdata,
                                    "category": categorylistdata,
                                    "searchtag": searchlistdata,
                                    "userList": usersdata,
                                    "success": true,
                                    "is_admin": true
                                }
                            });
                        }
                        else {
                            res.json({
                                "AssetEditresult": {
                                    "processStatus": "Something happen wrong",
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "AssetEditresult": {
                                status: 500, success: false,
                                "assetsdata": [],
                                "category": [],
                                "is_admin": true,
                                "searchtag": [],
                                "userList": [], message: 'Something wrong'
                            }
                        });
                    })
            }
            else {
                msg = "User is not authorized";
                res.json({
                    "AssetEditresult": {
                        "processStatus": msg,
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })






})
router.post('/upload_single_file', upload.any(), function (req, res, next) {

    var filesdetail = req.files

    res.json({ status: 200, success: true, filesdetail: filesdetail, message: 'upload succefully' });

})


// router.post('/upload_single_file_edit', upload.any(), function (req, res, next) {
//     var queryfile = req.query.filename;
//     var id = req.query.id;

//     var filesdetail = req.files

//     res.json({ status: 200, success: true, filesdetail: filesdetail, message: 'upload succefully' });

// })


var filenamevalue;
var storagebuild = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, __dirname + '/../../html/wp-content/uploads/2018/builds/'); // set the destination
    },
    filename: function (req, file, callback) {
        filenamevalue = "" + Date.now() + path.extname(file.originalname)
        // callback(null, Date.now() + '.png'); // set the file name and extension
        callback(null, filenamevalue
        );
    }
});
var uploadbuild = multer({ storage: storagebuild }).any();




router.post('/upload_build', function (req, res, next) {

    var namebuild = req.query.name
    console.log(namebuild);
    req.on("close", function (err) {
        console.log("req.file", req.files)
        console.log("filenamevalue", filenamevalue)
        // fstream.end();fs.unlinkSync(
        if (fs.existsSync(__dirname + '/../../html/wp-content/uploads/2018/builds/' + filenamevalue)) {
            fs.unlinkSync(__dirname + '/../../html/wp-content/uploads/2018/builds/' + filenamevalue);
            console.log(__dirname + '/../../html/wp-content/uploads/2018/builds/')
        }
        console.log("req close by client");
    });
    req.on("abort", function (err) {
        console.log("req.file", req.files)
        console.log("filenamevalue", filenamevalue)
        // fstream.end();fs.unlinkSync(
        if (fs.existsSync(__dirname + '/../../html/wp-content/uploads/2018/builds/' + filenamevalue)) {
            fs.unlinkSync(__dirname + '/../../html/wp-content/uploads/2018/builds/' + filenamevalue);
            console.log(__dirname + '/../../html/wp-content/uploads/2018/builds/')
        }
        console.log("req aborted by client");
    });

    uploadbuild(req, res, (err) => {

        if (err) {
            console.log(err)
            return res.json({ status: 500, success: false, filesdetail: [], message: 'Some error occured' });
        }
        else {
            buildfile.findOne({}, (err, buildata) => {

                console.log(buildata);

                var filesdetail = req.files
                console.log("filesdetail", filesdetail)
                if (namebuild === "mac") {
                    var updatedata = {
                        $set: {
                            "newmacBuild": {
                                "name": filesdetail[0].filename,
                                "title": filesdetail[0].originalname
                            }
                        }
                    }
                    console.log(updatedata);
                    buildfile.update({}, updatedata, { upsert: true }, (err, upda) => {
                        console.log(upda);
                        if (err) {
                            res.json({ status: 500, success: true, filesdetail: [], message: 'upload failed' });
                        }
                        else {
                            var filePathmacbuild = __dirname + '/../../html/wp-content/uploads/2018/builds/' + buildata.newmacBuild.name
                            console.log("(filePathmacbuild)", filePathmacbuild);
                            if (fs.existsSync(filePathmacbuild)) {
                                console.log(filePathmacbuild);
                                fs.unlinkSync(filePathmacbuild);
                            }

                            res.json({ status: 200, success: true, filesdetail: filesdetail, message: 'upload succefully' });
                        }
                    })
                }
                else if (namebuild === "window") {
                    var updatedata = {
                        $set: {
                            "newwindowsBuild": {
                                "name": filesdetail[0].filename,
                                "title": filesdetail[0].originalname
                            }
                        }
                    }
                    console.log(updatedata);
                    buildfile.update({}, updatedata, { upsert: true }, (err, upda) => {
                        if (err) {
                            res.json({ status: 500, success: true, filesdetail: [], message: 'upload failed' });
                        }
                        else {
                            var filePathwinbuild = __dirname + '/../../html/wp-content/uploads/2018/builds/' + buildata.newwindowsBuild.name
                            console.log("(filePathmacbuild)", filePathwinbuild);
                            if (fs.existsSync(filePathwinbuild)) {
                                console.log("(filePathmacbuild)", filePathwinbuild);
                                fs.unlinkSync(filePathwinbuild);
                            }

                            res.json({ status: 200, success: true, filesdetail: filesdetail, message: 'upload succefully' });
                        }
                    })
                }


            })

        }


    });

}
)

module.exports = router;