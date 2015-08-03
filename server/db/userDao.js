/**
 * Created by joe on 15-8-2.
 */
// 实现与MySQL交互
var mysql = require('mysql');
var crypto = require('crypto');
var $conf = require('../db/conf');             //ridiculous!!!
var $sql = {               //数据库的操作
    queryByNamePassword: 'select * from ecm_member where user_name=? and password=? '
};
// 使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);
function md5(text) {                                   //md5加密
    return crypto.createHash('md5').update(text).digest('hex');
    // Encode each byte as two hexadecimal characters
}
module.exports = {
    verifyByNamePassword: function (req, res, next) {
        var user_name = req.query.user_name;
        var password = md5(req.query.password);
        console.log('加密后的密码：' + password);
        if (user_name == null || password == null) {
            res.json({
                msg: '参数不足'
            });
            return;
        }
        //var name = req.query.name;
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryByNamePassword, [user_name, password], function (err, result) {
                if (result.length == 0) {

                    res.end("中文")
//                    res.json({
//                        msg: '帐号或密码错误。'
//                    });
                } else {
                    //console.log(JSON.stringify(result));
                    res.json({
                        msg: '登录成功。'
                    });
                }
                connection.release();
            });
        });
    }
};

