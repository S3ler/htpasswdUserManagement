var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var htpasswdAPIPath = path.join(__dirname, '..', 'htpasswdManagerAPI', 'htpasswdAPI');
var htpasswdInterface = require(htpasswdAPIPath);

var userHtpasswdPath = path.join(__dirname, '..', 'htpasswd', 'users', 'htpasswd');
var adminHtpasswdPath = path.join(__dirname, '..', 'htpasswd', 'admin', 'htpasswd');


router.get('/', function (req, res, next) {
    let entryNames = [];
    try {
        entryNames = htpasswdInterface.getAllUsernames(userHtpasswdPath);
    } catch (e) {
        console.log(e);
    }
    res.render('indexuser', {title: 'Express', users: entryNames});
});

router.get('/admin', function (req, res, next) {
    let entryNames = [];
    try {
        entryNames = htpasswdInterface.getAllUsernames(adminHtpasswdPath);
    } catch (e) {
        console.log(e);
    }
    res.render('indexadmin', {title: 'Express', users: entryNames});
});

router.post('/createuser', function (req, res) {

    let successURL = '/?createuser=success';
    let failURL = '/?createuser=fail';

    let name = req.body['name'];
    let password = req.body['password'];
    let passwordrepeat = req.body['passwordrepeat'];

    let adminuser = req.body['adminuser'];
    let adminpassword = req.body['adminpassword'];

    if (!htpasswdInterface.containsUsername(adminHtpasswdPath, adminuser)) {
        res.redirect(failURL + '&' + 'reason=Admin does not exist');
        return;
    }
    if (!htpasswdInterface.matchPassword(adminHtpasswdPath, adminuser, adminpassword)) {
        res.redirect(failURL + '&' + 'reason=Admin password wrong.');
        return;
    }

    /*
    console.log(name);
    console.log(password);
    console.log(passwordrepeat);
    console.log(adminuser);
    console.log(adminpassword);
    */

    if (name.length === 0) {
        res.redirect(failURL + '&' + 'reason=Username is empty.');
        return;
    }

    if (password.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password is empty.');
        return;
    }

    if (passwordrepeat.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password repeat is empty.');
        return;
    }

    if (name.length < 1) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 1 characters.');
        return;
    }

    if (/[^a-zA-Z]/.test(name)) {
        res.redirect(failURL + '&' + 'reason=User contains non valid characters.');
        return;
    }

    if (password.length < 1) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 1 characters.');
        return;
    }

    if(password != passwordrepeat){
        res.redirect(failURL + '&' + 'reason=Password and Passwordrepeat do not match.');
        return;
    }


    // TODO: escape name string and passwords
    // TODO: check password values
    // TODO: max length is 40 character name

    try {
        if (htpasswdInterface.containsUsername(userHtpasswdPath, name)) {
            res.redirect(failURL + '&' + 'reason=Username already exists.');
            return;
        }
        htpasswdInterface.createUser(userHtpasswdPath, name, password);
        res.redirect(successURL);
        return;
    } catch (e) {
        console.log(e);
    }
    res.redirect(failURL);
});

router.get('/?createuser=success', function (req, res, next) {
    // TODO implement me
    res.render('indexuser', {title: 'Express'});
});

router.get('/?createuser=fail', function (req, res, next) {
    // TODO implement me
    res.render('indexuser', {title: 'Express'});
});


router.post('/updatepassword', function (req, res, next) {

    var successURL = '/?updatepassword=success';
    var failURL = '/?updatepassword=fail';

    var name = req.body['name'];
    var password = req.body['password'];
    var passwordrepeat = req.body['passwordrepeat'];

    let adminuser = req.body['adminuser'];
    let adminpassword = req.body['adminpassword'];

    if (!htpasswdInterface.containsUsername(adminHtpasswdPath, adminuser)) {
        res.redirect(failURL + '&' + 'reason=Admin does not exist');
        return;
    }
    if (!htpasswdInterface.matchPassword(adminHtpasswdPath, adminuser, adminpassword)) {
        res.redirect(failURL + '&' + 'reason=Admin password wrong.');
        return;
    }

    if (name.length === 0) {
        res.redirect(failURL + '&' + 'reason=Username is empty.');
        return;
    }
    if (password.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password is empty.');
        return;
    }
    if (passwordrepeat.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password repeat is empty.');
        return;
    }

    if (name.length < 1) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 1 characters.');
        return;
    }

    if (password.length < 1) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 1 characters.');
        return;
    }

    if(password != passwordrepeat){
        res.redirect(failURL + '&' + 'reason=Password and Passwordrepeat do not match.');
        return;
    }

    try {
        if (!htpasswdInterface.containsUsername(userHtpasswdPath, name)) {
            res.redirect(failURL + '&' + 'reason=User does not exist.');
            return;
        }
        if (!htpasswdInterface.updatePassword(userHtpasswdPath, name, password)) {
            res.redirect(failURL);
            return;
        }
        res.redirect(successURL);
        return;
    } catch (e) {
        console.log(e);
    }
    res.redirect(failURL);
});

router.get('/?updatepassword=success', function (req, res, next) {
    // TODO implement me
    res.render('indexuser', {title: 'Express'});
});

router.get('/?updatepassword=fail', function (req, res, next) {
    // TODO implement me
    res.render('indexuser', {title: 'Express'});
});


router.post('/delete', function (req, res) {
    console.log(res.body);

    var successURL = '/?deleteuser=success';
    var failURL = '/?deleteuser=fail';

    var name = req.body['name'];
    var name = name + "";

    try {
        if (htpasswdInterface.containsUsername(userHtpasswdPath, name)) {
            htpasswdInterface.deleteUser(userHtpasswdPath, name);
            res.redirect(successURL);
            return;
        }
        res.redirect(failURL + '&' + 'reason=User does not exist.');
        return;
    } catch (e) {
        console.log(e);
    }

    res.redirect(failURL);
});

router.get('/?deleteuser=success', function (req, res, next) {
    // TODO implement me
    res.render('indexuser', {title: 'Express'});
});

router.get('/?deleteuser=fail', function (req, res, next) {
    // TODO implement me
    res.render('indexuser', {title: 'Express'});
});

module.exports = router;
