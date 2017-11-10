var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var htpasswdAPIPath = path.join(__dirname, '..', 'htpasswdManagerAPI', 'htpasswdAPI');
var htpasswdInterface = require(htpasswdAPIPath);

var htpasswdPath = path.join(__dirname, '..', 'htpasswd', 'users', 'htpasswd');

router.get('/', function (req, res, next) {
    var entryNames = [];
    try {
        entryNames = htpasswdInterface.getAllUsernames(htpasswdPath);
    } catch (e) {
        console.log(e);
    }
    res.render('index', {title: 'Express', users: entryNames});
});


router.post('/createuser', function (req, res) {

    var successURL = '/?createuser=success';
    var failURL = '/?createuser=fail';

    var name = req.body['name'];
    var password = req.body['password'];
    var passwordrepeat = req.body['passwordrepeat'];

    if (name.length === 0) {
        res.redirect(failURL + '&' + 'reason=Username is empty.');
        return;
    }
    if (name.length < 5) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 5 characters.');
        return;
    }
    if (password.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password is empty.');
        return;
    }
    if (password.length < 6) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 6 characters.');
        return;
    }
    if (passwordrepeat.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password repeat is empty.');
        return;
    }
    //if(password.equals(passwordrepeat) == false){
    //    res.redirect(failURL + '&' + 'reason=Password and Password repeat do not match.');
    //}
    // TODO: escape name string and passwords
    // TODO: check password values
    // TODO: max length is 40 character name
    try {
        if (htpasswdInterface.containsUsername(htpasswdPath, name)) {
            res.redirect(failURL + '&' + 'reason=Username already exists.');
            return;
        }
        htpasswdInterface.createUser(htpasswdPath, name, password);
        res.redirect(successURL);
        return;
    } catch (e) {
        console.log(e);
    }
    res.redirect(failURL);
});

router.get('/?createuser=success', function (req, res, next) {
    // TODO implement me
    res.render('index', {title: 'Express'});
});

router.get('/?createuser=fail', function (req, res, next) {
    // TODO implement me
    res.render('index', {title: 'Express'});
});


router.post('/updatepassword', function (req, res, next) {
    console.log(req.body);
    var successURL = '/?updatepassword=success';
    var failURL = '/?updatepassword=fail';

    var name = req.body['name'];
    var password = req.body['password'];
    var passwordrepeat = req.body['passwordrepeat'];

    if (name.length === 0) {
        res.redirect(failURL + '&' + 'reason=Username is empty.');
        return;
    }
    if (name.length < 5) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 5 characters.');
        return;
    }
    if (password.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password is empty.');
        return;
    }
    if (password.length < 6) {
        res.redirect(failURL + '&' + 'reason=Username is too short. Must be at least 6 characters.');
        return;
    }
    if (passwordrepeat.length === 0) {
        res.redirect(failURL + '&' + 'reason=Password repeat is empty.');
        return;
    }
    //TODO check more
    try {
        if (!htpasswdInterface.containsUsername(htpasswdPath, name)) {
            res.redirect(failURL + '&' + 'reason=User does not exist.');
            return;
        }
        if (!htpasswdInterface.updatePassword(htpasswdPath, name, password)) {
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
    res.render('index', {title: 'Express'});
});

router.get('/?updatepassword=fail', function (req, res, next) {
    // TODO implement me
    res.render('index', {title: 'Express'});
});


router.post('/delete', function (req, res) {
    var successURL = '/?deleteuser=success';
    var failURL = '/?deleteuser=fail';

    var name = req.body['name'];
    var name = name + "";

    try {
        if (htpasswdInterface.containsUsername(htpasswdPath, name)) {
            htpasswdInterface.deleteUser(htpasswdPath, name);
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
    res.render('index', {title: 'Express'});
});

router.get('/?deleteuser=fail', function (req, res, next) {
    // TODO implement me
    res.render('index', {title: 'Express'});
});

module.exports = router;
