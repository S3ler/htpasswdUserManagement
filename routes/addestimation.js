var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    console.log(req.body.title);
    console.log(req.body.description);
    res.send('Post page');
});

module.exports = router;
