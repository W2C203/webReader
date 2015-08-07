/**
 * Created by joe on 15-8-2.
 */
// 实现与MySQL交互
var mysql = require('mysql');
var url = require('url')
var crypto = require('crypto');
var $conf = require('../db/conf');             //ridiculous!!!
var $sql = {               //数据库的操作
    queryByNamePassword: 'select * from ecm_member where user_name=? and password=? ',
    queryOrderByUserName: 'select order_id from ecm_order where buyer_name = ?',
    queryGoodsByUserName:' select goods_name from ecm_order_goods  inner join ecm_order\
    on ecm_order_goods.order_id=ecm_order.order_id and  ecm_order.buyer_name=? group by goods_name'
}
// 使用连接池，提升性能
var pool = mysql.createPool($conf.mysql);
function md5(text) {                                   //md5加密
    return crypto.createHash('md5').update(text).digest('hex');
    // Encode each byte as two hexadecimal characters
}
module.exports = {
    verifyByNamePassword: function (req, res, next) {
        var query = url.parse('?' + req.toString(), true).query;
        var user_name = query.user_name;
        var password = query.password;
        if (user_name == '' || password == '') {
            res.end('请填写帐号/密码');
            return;
        }
        password = md5(password);
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryByNamePassword, [user_name, password], function (err, result) {
                if (result.length == 0) {
                    res.end('帐号或密码错误');
                } else {
                    res.end('登录成功');
                }
                connection.release();
            });
        });
    },
    queryBuy: function (req, res, next) {
        var user_name = req.toString();
        //console.log(user_name);
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryOrderByUserName, user_name, function (err, result) {
                if (result.length == 0) {
                    res.end('无购买记录');
                    return;
                }
                connection.query($sql.queryGoodsByUserName,user_name,function(err,result){
                   res.json(result);
                });
                connection.release();
            });
        })
    }
};

