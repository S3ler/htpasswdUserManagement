var express = require('express');
var router = express.Router();

/* POST create users listing. */
router.post('/createUser', function (req, res, next) {
    // res.render('index', {title: 'Express'});
    res.redirect("/");
});

module.exports = router;
