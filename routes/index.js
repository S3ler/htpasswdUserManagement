let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');

let htpasswdAPIPath = path.join(__dirname, '..', 'htpasswdManagerAPI', 'htpasswdAPI');
let htpasswdInterface = require(htpasswdAPIPath);

let userHtpasswdPath = path.join(__dirname, '..', 'htpasswd', 'users', 'htpasswd');
let adminHtpasswdPath = path.join(__dirname, '..', 'htpasswd', 'admin', 'htpasswd');


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

    if (password != passwordrepeat) {
        res.redirect(failURL + '&' + 'reason=Password and Passwordrepeat do not match.');
        return;
    }

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
    res.render('indexuser', {title: 'Express'});
});

router.get('/?createuser=fail', function (req, res, next) {
    res.render('indexuser', {title: 'Express'});
});


router.post('/updatepassword', function (req, res, next) {

    let successURL = '/?updatepassword=success';
    let failURL = '/?updatepassword=fail';

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

    if (password != passwordrepeat) {
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
    res.render('indexuser', {title: 'Express'});
});

router.get('/?updatepassword=fail', function (req, res, next) {
    res.render('indexuser', {title: 'Express'});
});


router.post('/delete', function (req, res) {

    let successURL = '/?deleteuser=success';
    let failURL = '/?deleteuser=fail';

    let name = req.body['name'] + "";
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
    res.render('indexuser', {title: 'Express'});
});

router.get('/?deleteuser=fail', function (req, res, next) {
    res.render('indexuser', {title: 'Express'});
});

module.exports = router;
