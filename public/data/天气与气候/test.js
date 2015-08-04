/**
 *
 * Created by hywilliam on 8/4/15.
 */
var pdf2table = require('pdf2table');
var fs = require('fs');

fs.readFile('目录.pdf', function (err, buffer) {
    if (err) return console.log(err);

    pdf2table.parse(buffer, function (err, rows, rowsdebug) {
        if(err) return console.log(err);

        console.log(rows);
    });
});
