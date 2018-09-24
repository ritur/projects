
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var searchtag = require('./../schema/searchtag');


router.post('/searchtag_create', function (req, res, next) {

    var token = req.body.token;
    var msg = "";
    var decoded_data = {};
    var searchtag_name = req.body.searchtagname;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            msg = "token id does not match";

            res.json({
                "searchtagresult": {
                    "processStatus": "token id does not match",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            decoded_data = decoded;
            if (decoded.is_admin == 1) {



                return searchtag.findOne({ "name": searchtag_name }).exec()

                    .then((searchtagfind) => {
                        if (searchtagfind || decoded_data.is_admin !== 1) {
                            return false;
                        }
                        else {
                            var searchtagdata = new searchtag({
                                'name': searchtag_name,
                            });
                            return searchtagdata.save()
                        }
                    })
                    .then(function (searchtag) {

                        if (searchtag) {
                            res.json({
                                "searchtagresult": {
                                    "processStatus": "succefully insert",
                                    "is_admin": true,
                                    "success": true
                                }
                            });

                        }

                        else {
                            res.json({
                                "searchtagresult": {
                                    "processStatus": "searchtag already exist",
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "searchtagresult": {
                                "processStatus": "Not insert",
                                "is_admin": true,
                                "success": false
                            }
                        });
                    })
            }
            else {
                msg = "User is not authorized";
                res.json({
                    "searchtagresult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })




})

router.get('/searchtag_list/:token', function (req, res, next) {


    var token = req.params.token;
    var msg = "searchtag already exist";

    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            msg = "token id does not match";

            res.json({
                "searchtagresult": {
                    "processStatus": "token id does not match",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {

            if (decoded.is_admin == 1) {

                return searchtag.find().exec()
                    .then(function (searchtag) {

                        if (searchtag) {
                            res.json({
                                "searchtagresult": {
                                    "processStatus": "succefully insert",
                                    "searchtag_list": searchtag,
                                    "is_admin": true,
                                    "success": true
                                }
                            });

                        }
                        else {
                            res.json({
                                "searchtagresult": {
                                    "processStatus": "something happend wrong",
                                    "searchtag_list": [],
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "searchtagresult": {
                                "processStatus": "Not insert",
                                "is_admin": true,
                                "success": false
                            }
                        });
                    })
            }
            else {
                msg = "User is not authorized";
                res.json({
                    "searchtagresult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })




})


//delete a user from admin userlist
router.post('/deletesearchtag', function (req, res, next) {
    console.log(req.body)
    var searchtagId = req.body.id
    var token = req.body.token;

    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "searchtagDeleteresult": {
                    "processStatus": "token id is not applicable",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {

            if (decoded.is_admin == 1) {

                searchtag.findOneAndRemove({ $and: [{ "_id": searchtagId }, { "assosiate_number": 0 }] }, function (err, result) {
                    console.log("result", result)
                    if (err) {
                        res.json({
                            "searchtagDeleteresult": {
                                "processStatus": "searchtag not deleted",
                                "is_admin": true,
                                "success": false
                            }
                        });
                    }
                    else {
                        if (result) {
                            console.log('assetbundle deleted');
                            res.json({
                                "searchtagDeleteresult": {
                                    "processStatus": "searchtag deleted",
                                    "is_admin": true,
                                    "success": true
                                }
                            });
                        }
                        else {
                            res.json({
                                "searchtagDeleteresult": {
                                    "processStatus": "searchtag is used in assetBundle cannot be deleted",
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }
                    }
                })
            }
            else {

                res.json({
                    "searchtagDeleteresult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })


})


router.get('/singlesearchtag/:token', function (req, res, next) {

    var token = req.params.token;
    var searchtagId = req.query.searchtag_id;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "searchtagresult": {
                    "processStatus": "token id is not applicable",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                searchtag.findById(searchtagId, function (err, result) {
                    if (err) {
                        res.json({
                            "searchtagresult": {
                                "processStatus": "searchtag data not fetched",
                                "searchtag": {},
                                "is_admin": true,
                                "success": false
                            }
                        });
                    }
                    else {
                        console.log('assetbundle fetched');
                        res.json({
                            "searchtagresult": {
                                "processStatus": "searchtag data fetched",
                                "searchtag": result,
                                "is_admin": true,
                                "success": true
                            }
                        });
                    }
                })
            }
            else {
                res.json({
                    "searchtagresult": {
                        "processStatus": "User is not authorized",
                        "searchtag": {},
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    });


})



router.post('/singlesearchtag', function (req, res, next) {

    var token = req.body.token;
    
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "searchtagupdateresult": {
                    "processStatus": "token id is not applicable",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                var msg = "";
                var searchtagname = req.body.searchtagName;
                var searchtagId = req.body.id;
                searchtag.find({ "name": searchtagname }).exec()
                    .then(function (result) {
                        console.log("Result",result)
                        if (result.length > 0) {
                            if (result.length == 1) {
                                if (result[0]._id == searchtagId) {

                                    return searchtag.findByIdAndUpdate(searchtagId, { "name": searchtagname }).exec()
                                }
                                else {
                                    msg = "searchtag already exist"
                                    return false
                                }
                            }
                            else {
                                msg = "searchtag already exist"
                                return false
                            }
                        }
                        else {
                            return searchtag.findByIdAndUpdate(searchtagId, { "name": searchtagname }).exec()
                        }
                    }).then((searchtagsavedata) => {
                        if (searchtagsavedata) {
                            console.log('assetbundle updated');
                            res.json({
                                "searchtagupdateresult": {
                                    "processStatus": "searchtag successfully saved",

                                    "is_admin": true,
                                    "success": true
                                }
                            });
                        }
                        else {
                            res.json({
                                "searchtagupdateresult": {
                                    "processStatus": msg,

                                    "is_admin": true,
                                    "success": false

                                }
                            });
                        }

                    }).catch(function (error) {

                        res.json({
                            "searchtagupdateresult": {
                                "processStatus": "Something happened wrong",

                                "is_admin": true,
                                "success": false
                            }
                        });
                    })
            }
            else {
                res.json({
                    "searchtagupdateresult": {
                        "processStatus": "User is not authorized",

                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    });


})


module.exports = router;
