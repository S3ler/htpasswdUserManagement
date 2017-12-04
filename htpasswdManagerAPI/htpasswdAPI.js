"use strict";
var md5 = require("apache-md5");
var fs = require('fs');

module.exports.createUser = (htpasswdPath, username, password) => {
    let newUserEntry = username + ":" + md5(password) + "\n";
    fs.appendFileSync(htpasswdPath, newUserEntry);
};

module.exports.getAllUsernames = (htpasswdPath) => {
    let data = fs.readFileSync(htpasswdPath, 'utf8');
    let entryNames = [];
    let lines = data.toString().split("\n");
    for (let i = 0; i < lines.length; i++) {
        let entry = lines[i] + "";
        let entryName = entry.split(':')[0];
        if (entryName !== null && entryName.length > 0) {
            entryNames.push({name: entryName});
        }
    }
    return entryNames;
};

module.exports.containsUsername = (htpasswdPath, username) => {
    let data = fs.readFileSync(htpasswdPath, 'utf8');
    let lines = data.toString().split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i] + "";
        let entryName = line.split(':')[0];
        if (username == entryName) {
            return true;
        }
    }
    return false;
};

module.exports.matchPassword = (htpasswdPath, username, password) => {
    let data = fs.readFileSync(htpasswdPath, 'utf8');
    let lines = data.toString().split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i] + "";
        let entryName = line.split(':')[0];
        if (username == entryName) {
            let entryPassword = line.split(':')[1];
            if(md5(password, entryPassword) == entryPassword){
                return true;
            }
            return false;
        }
    }
    return false;
};

module.exports.updatePassword = (htpasswdPath, username, password) => {
    let data = fs.readFileSync(htpasswdPath, 'utf8');
    let lines = data.toString().split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i] + "";
        if (line.startsWith(username)) {
            lines.splice(i, 1);
            let newUserEntry = username + ":" + md5(password) + "\n";
            lines.push(newUserEntry);
            let newEntries = lines.join('\n');
            fs.writeFileSync(htpasswdPath, newEntries, 'utf8');
            return true;
        }
    }
    return false;
};

module.exports.deleteUser = (htpasswdPath, username) => {
    let data = fs.readFileSync(htpasswdPath, 'utf8');
    let lines = data.toString().split("\n");
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i] + "";
        if (line.startsWith(username)) {
            lines.splice(i, 1);
            let newEntries = lines.join('\n');
            fs.writeFileSync(htpasswdPath, newEntries, 'utf8');
            return;
        }
    }
};