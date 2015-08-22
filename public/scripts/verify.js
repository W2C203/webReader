/**
 * Created by joe on 15-8-3.
 */
$().ready(function () {
//这里存放get/post请求
    var first = 1;//标志是否第一次点一本书
    var saveInformation = null; //存储当前用户 在ecm_order_goods表中的相关信息
    /**
     * 登录验证
     */
    $('#submit').on('click', function (event) {
        var event = event || window.event;
        var data = $('#form').serialize();
        if (data.indexOf("=&") != -1 || data[data.length - 1] == '=') { //如果没填帐号或者密码 直接返回
            alert("帐号或密码不能为空");
            return;
        }
        $.post("/verify/query", data, function (text, status) {
            //一共会有3种成功响应   请填写帐号/密码(这个正常是不会有的) 帐号或密码错误 登录成功
            if (JSON.stringify(text) == '"登录成功"') {
                var name = data.split('&')[0].split('=');
                //例： user_name=admin&password=admin  抽取用户名 这里的策略有待修改
                name = name[name.length - 1];             //这个是抽取的用户名 到时找个地方放
                document.cookie = 'name=' + name;           // 加入cookie 以后再考虑加密。。
                changeInformation(name);
                showOrderBooks(name);
            } else {
                alert(JSON.stringify(text));
            }
        })
        //event.preventDefault();//阻止默认行为
    })


    /**
     * 登录后左侧显示已购买书目
     * @param name 用户名
     */
    function showOrderBooks(name) {
        $.post("/verify/queryBuy", name, function (text, status) {
            if (typeof text == 'string') {
                $('#pBeforeBooks').html(text);
            } else {
                saveInformation = text;
                $('#pBeforeBooks').html('购买的数目如下：');
                $('#books *').remove();//避免多次登录刷N份
                var j = 0;
                for (var i in text) {
                    var newDiv = $('<div>');
                    var cutGoodName = text[i].goods_name;  //为了防止书名太长
                    if (cutGoodName.length > 11) {
                        cutGoodName = subStrForChinese(cutGoodName, 11) + '..'
                    }
                    $('<span>').html(cutGoodName).appendTo(newDiv);
                    newDiv.addClass('ribbon ribbon-orange');
                    newDiv.on('click', function (i) {
//                        if (clickInSecond != 0) {
//                            return;
//                        }
                        return function () {//闭包
                            var infor = text[i];
                            var str = '';
                            switch (infor.fac) {
                                case '按次数':
                                    str += '可看总次数：' + infor.fcs * infor.quantity + ';';
                                    if (infor.fcs * infor.quantity == infor.fview) {
                                        alert(str += '您的使用次数已耗尽，请重新购买！');
                                    } else {
                                        str += '当前还可以看' + (infor.fcs * infor.quantity - infor.fview++) + '次';
                                        //infor.fview = infor.fview -1 ;
                                    }
                                    break;
                                case '按时间':
                                    str += '可看天数：' + infor.fcs * infor.quantity;
                                    break;
                                case '无限制':
                                    str += '这本书可以任何阅读限制！';
                                    break;
                                default :
                                    str += '该书数据库信息缺失（可能为测试数据）';
                            }
                            //返回文件地址
                            $.post("/verify/queryFile", '' + infor.goods_id, function (text, status) {
                                str += '\n' + '文件地址：';
                                for (var x in text) {
                                    if (text[x].file_path) {
                                        str += '\n' + text[x].file_path;
                                        pdfDoc = new ShowBook(text[x].file_path, first);
                                        first = 0;
                                        //console.log('文件地址：' + text[x].file_path);
                                    }
                                }
                                //alert(str);
                            })
                        }
                    }(i));
                    newDiv.appendTo($('#books'));
                }
                $('#books').addClass('ribbons');
            }
        })
        event.preventDefault();//阻止默认行为
    }

    /**
     * 用于跳转到已登录效果
     */
    function changeInformation(name) {
        $('#information').html('welcome');
        $('#user_name').addClass('hide');
        $('#password').addClass('hide');

        $('#show_name').html(name).removeClass('hide');

        $('#submit').addClass('hide');
        $('#logout').removeClass('hide');
    }

    /**
     * 退出登录
     */
    $('#logout').on('click', function () {
        //左边的信息处理
        $('#information').html('登录');


        $('#user_name').val('').removeClass('hide');
        $('#password').val('').removeClass('hide');

        $('#show_name').addClass('hide');

        $('#submit').removeClass('hide');
        $('#logout').addClass('hide');

        $('#pBeforeBooks').html('登录后查看购买书目');
        $('#books').removeClass('ribbons');
        $('#books *').remove();
        //删除cookie
        var date = new Date();
        date.setTime(date.getTime() - 10);
        document.cookie = 'name=abc;expires=' + date.toGMTString();

        //中间的图片 和右边的按钮处理
        first = 1;
        $('#viewer-container *').remove();
        var newDiv = $('<div>').attr('id','firstDiv');
        $('<img>').attr('id','firstPicture').attr('src','./images/wait.gif').appendTo(newDiv);
        newDiv.appendTo($('#viewer-container'));
        $('#wait').addClass('hide');
        $('#menuBtn').addClass('hide');
        $('#prev').addClass('hide');
        $('#next').addClass('hide');

    })
    $('#mall').on('click', function () {
        window.open('http://192.168.69.17:8080/mall', '_self');
    })
    var alreadyLogin = document.cookie;
    if (alreadyLogin.indexOf('name') != -1) {
        var name = alreadyLogin.split('=')[1];
        changeInformation(name);
        showOrderBooks(name);
    }

    /**
     * 截取一个含有中文的字符串
     * @param str 字符串
     * @param len 截取长度
     * @returns {string} 返回截取结果
     */
    function subStrForChinese(str, len) {
        if (!str || !len) {
            return '';
        }
        //预期计数：中文2字节，英文1字节
        var a = 0;      //循环计数
        var i = 0;      //临时字串
        var temp = '';
        for (i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {             //按照预期计数增加2
                a += 2;
            }
            else {
                a++;
            }         //如果增加计数后长度大于限定长度，就直接返回临时字符串
            if (a > len) {
                return temp;
            }          //将当前内容加到临时字符串
            temp += str.charAt(i);
        }     //如果全部是单字节字符，就直接返回源字符串
        return str;
    }
})