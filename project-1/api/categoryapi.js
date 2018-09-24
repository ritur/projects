
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var category = require('./../schema/category');


router.post('/category_create', function (req, res, next) {

    var token = req.body.token;
    var msg = "";
    var decoded_data = {};
    var category_name = req.body.categoryname;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            msg = "token id does not match";

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



                return category.findOne({ "name": category_name }).exec()

                    .then((categoryfind) => {
                        if (categoryfind || decoded_data.is_admin !== 1) {
                            return false;
                        }
                        else {
                            var categorydata = new category({
                                'name': category_name,
                            });
                            return categorydata.save()
                        }
                    })
                    .then(function (category) {

                        if (category) {
                            res.json({
                                "categoryresult": {
                                    "processStatus": "succefully insert",
                                    "is_admin": true,
                                    "success": true
                                }
                            });

                        }

                        else {
                            res.json({
                                "categoryresult": {
                                    "processStatus": "Category already exist",
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "categoryresult": {
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

router.get('/category_list/:token', function (req, res, next) {


    var token = req.params.token;
    var msg = "Category already exist";

    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            msg = "token id does not match";

            res.json({
                "categoryresult": {
                    "processStatus": "token id does not match",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {

            if (decoded.is_admin == 1) {

                return category.find().exec()
                    .then(function (category) {

                        if (category) {
                            res.json({
                                "categoryresult": {
                                    "processStatus": "succefully insert",
                                    "category_list": category,
                                    "is_admin": true,
                                    "success": true
                                }
                            });

                        }
                        else {
                            res.json({
                                "categoryresult": {
                                    "processStatus": "something happend wrong",
                                    "category_list": [],
                                    "is_admin": true,
                                    "success": false
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        res.json({
                            "categoryresult": {
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


//delete a user from admin userlist
router.post('/deletecategory', function (req, res, next) {
    console.log(req.body)
    var categoryId = req.body.id
    var token = req.body.token;

    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "CategoryDeleteresult": {
                    "processStatus": "token id is not applicable",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {

            if (decoded.is_admin == 1) {

                category.findOneAndRemove({ $and: [{ "_id": categoryId }, { "assosiate_number": 0 }] }, function (err, result) {
                    console.log("result", result)
                    if (err) {
                        res.json({
                            "CategoryDeleteresult": {
                                "processStatus": "Category not deleted",
                                "is_admin": true,
                                "success": false
                            }
                        });
                    }
                    else {
                        if (result) {
                            console.log('assetbundle deleted');
                            res.json({
                                "CategoryDeleteresult": {
                                    "processStatus": "Category deleted",
                                    "is_admin": true,
                                    "success": true
                                }
                            });
                        }
                        else {
                            res.json({
                                "CategoryDeleteresult": {
                                    "processStatus": "Category is used in assetBundle cannot be deleted",
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
                    "CategoryDeleteresult": {
                        "processStatus": "User is not authorized",
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    })


})


router.get('/singlecategory/:token', function (req, res, next) {

    var token = req.params.token;
    var categoryId = req.query.category_id;
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "Categoryresult": {
                    "processStatus": "token id is not applicable",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                category.findById(categoryId, function (err, result) {
                    if (err) {
                        res.json({
                            "Categoryresult": {
                                "processStatus": "Category data not fetched",
                                "category": {},
                                "is_admin": true,
                                "success": false
                            }
                        });
                    }
                    else {
                        console.log('assetbundle fetched');
                        res.json({
                            "Categoryresult": {
                                "processStatus": "Category data fetched",
                                "category": result,
                                "is_admin": true,
                                "success": true
                            }
                        });
                    }
                })
            }
            else {
                res.json({
                    "Categoryresult": {
                        "processStatus": "User is not authorized",
                        "category": {},
                        "is_admin": false,
                        "success": false
                    }
                });
            }
        }
    });


})



router.post('/singlecategory', function (req, res, next) {

    var token = req.body.token;
    
    jwt.verify(token, 'sshhsecret', function (err, decoded) {
        if (err) {

            res.json({
                "Categoryupdateresult": {
                    "processStatus": "token id is not applicable",
                    "is_admin": false,
                    "success": false
                }
            });
        }
        else {
            if (decoded.is_admin == 1) {
                var msg = "";
                var categoryname = req.body.categoryName;
                var categoryId = req.body.id;
                category.find({ "name": categoryname }).exec()
                    .then(function (result) {
                        console.log("Result",result)
                        if (result.length > 0) {
                            if (result.length == 1) {
                                if (result[0]._id == categoryId) {

                                    return category.findByIdAndUpdate(categoryId, { "name": categoryname }).exec()
                                }
                                else {
                                    msg = "Category already exist"
                                    return false
                                }
                            }
                            else {
                                msg = "Category already exist"
                                return false
                            }
                        }
                        else {
                            return category.findByIdAndUpdate(categoryId, { "name": categoryname }).exec()
                        }
                    }).then((categorysavedata) => {
                        if (categorysavedata) {
                            console.log('assetbundle updated');
                            res.json({
                                "Categoryupdateresult": {
                                    "processStatus": "Category successfully saved",

                                    "is_admin": true,
                                    "success": true
                                }
                            });
                        }
                        else {
                            res.json({
                                "Categoryupdateresult": {
                                    "processStatus": msg,

                                    "is_admin": true,
                                    "success": false

                                }
                            });
                        }

                    }).catch(function (error) {

                        res.json({
                            "Categoryupdateresult": {
                                "processStatus": "Something happened wrong",

                                "is_admin": true,
                                "success": false
                            }
                        });
                    })
            }
            else {
                res.json({
                    "Categoryupdateresult": {
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
