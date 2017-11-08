var express = require('express');
var router = express.Router();
var fs = require('fs');
var md5 = require("apache-md5");
var path = require('path');

var htpasswdPath = path.join(__dirname, '..', 'htpasswd', 'htpasswd');
//var htpasswdPath = '/home/bele/htpasswd/htpasswd';


/* GET home page. */
router.get('/', function (req, res, next) {
    var entryNames = [];
    try {
        var data = fs.readFileSync(htpasswdPath, 'utf8');
        var lines = data.toString().split("\n");
        for (var i = 0; i < lines.length; i++) {
            var entry = lines[i] + "";
            var entryName = entry.split(":")[0];
            if (entryName !== null && entryName.length > 0) {
                entryNames.push({name: entryName});
            }
        }
    } catch (e) {
        console.log(e);
    }
    res.render('index', {title: 'Express', users: entryNames});
});

router.get('/?createuser=success', function (req, res, next) {
    // TODO implement me
    res.render('index', {title: 'Express'});
});

router.get('/?createuser=fail', function (req, res, next) {
    // TODO implement me
    res.render('index', {title: 'Express'});
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

    try {
        var data = fs.readFileSync(htpasswdPath, 'utf8');
        var lines = data.toString().split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i] + "";
            if (line.startsWith(name)) {
                res.redirect(failURL + '&' + 'reason=Username already exists.');
                return;
            }
        }
        var newUserEntry = name + ":" + md5(password) + "\n";
        fs.appendFileSync(htpasswdPath, newUserEntry);
        res.redirect(successURL);
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

router.post('/delete', function (req, res) {
    var successURL = '/?deleteuser=success';
    var failURL = '/?deleteuser=fail';

    var name = req.body['name'];
    var name = name + "";
    if(name === 'admin'){
        console.log("do not delete admin")
        res.redirect(failURL);
        return;
    }
    try {
        var data = fs.readFileSync(htpasswdPath, 'utf8');
        var lines = data.toString().split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i] + "";
            if (line.startsWith(name)) {
                lines.splice(i, 1);
                var newEntries = lines.join('\n');
                fs.writeFileSync(htpasswdPath, newEntries, 'utf8');
                res.redirect(successURL);
                return;
            }
        }
        console.log("not found")
    } catch (e) {
        console.log(e);
    }
    res.redirect(failURL);
});

module.exports = router;
