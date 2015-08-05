var express = require('express');
var data = express.Router();
var pdfmetadata = require('../handlers/file/readPDF');

data.get('/catelog', function (req, res) {
    var catelog = pdfmetadata.catelog;
    res.write(JSON.parse(catelog));
    console.log(catelog)
});

module.exports = data;


