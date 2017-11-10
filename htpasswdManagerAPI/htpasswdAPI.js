"use strict";
var md5 = require("apache-md5");
var fs = require('fs');

module.exports.createUser = (htpasswdPath, username, password) =>
{
    var newUserEntry = username + ":" + md5(password) + "\n";
    fs.appendFileSync(htpasswdPath, newUserEntry);
};

module.exports.getAllUsernames = (htpasswdPath) =>
{
    var data = fs.readFileSync(htpasswdPath, 'utf8');
    var entryNames = [];
    var lines = data.toString().split("\n");
    for (var i = 0; i < lines.length; i++) {
        var entry = lines[i] + "";
        var entryName = entry.split(":")[0];
        if (entryName !== null && entryName.length > 0) {
            entryNames.push({name: entryName});
        }
    }
    return entryNames;
};

module.exports.containsUsername = (htpasswdPath, username) =>
{
    var data = fs.readFileSync(htpasswdPath, 'utf8');
    var lines = data.toString().split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i] + "";
        if (line.startsWith(username)) {
            return true;
        }
    }
    return false;
};

module.exports.updatePassword = (htpasswdPath, username, password) =>
{
    var data = fs.readFileSync(htpasswdPath, 'utf8');
    var lines = data.toString().split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i] + "";
        if (line.startsWith(username)) {
            lines.splice(i, 1);
            var newUserEntry = username + ":" + md5(password) + "\n";
            lines.push(newUserEntry);
            var newEntries = lines.join('\n');
            fs.writeFileSync(htpasswdPath, newEntries, 'utf8');
            return true;
        }
    }
    return false;
};

module.exports.deleteUser = (htpasswdPath, username) =>
{
    var data = fs.readFileSync(htpasswdPath, 'utf8');
    var lines = data.toString().split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i] + "";
        if (line.startsWith(username)) {
            lines.splice(i, 1);
            var newEntries = lines.join('\n');
            fs.writeFileSync(htpasswdPath, newEntries, 'utf8');
            return;
        }
    }
};