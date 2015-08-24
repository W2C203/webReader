var express = require('express');
var app = express.Router();

app.get('/', function (req, res) {
    console.log('someone is visiting the index.html');
    res.render('index');
})

module.exports = app;