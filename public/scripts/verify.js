/**
 * Created by joe on 15-8-3.
 */
//这里存放get/post请求
/**
 * 登录验证
 */
$('#submit').on('click', function (event) {
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
            changeInformation(name);
            showOrderBooks(name);
        } else {
            alert(JSON.stringify(text));
        }
    })
    event.preventDefault();//阻止默认行为
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
            $('#pBeforeBooks').html('购买的数目如下：');
            for (var i in text) {
                var newDiv = $('<div>');
                var cutGoodName = text[i].goods_name;  //为了防止书名太长
                if (cutGoodName.length > 9) {
                    cutGoodName = cutGoodName.substring(0, 9) + '..';
                }
                $('<span>').html(cutGoodName).appendTo(newDiv);
                newDiv.addClass('ribbon ribbon-orange');
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
function changeInformation(name){
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
    $('#information').html('登录');


    $('#user_name').val('').removeClass('hide');
    $('#password').val('').removeClass('hide');

    $('#show_name').addClass('hide');

    $('#submit').removeClass('hide');
    $('#logout').addClass('hide');

    $('#pBeforeBooks').html('登录后查看购买书目');
    $('#books').removeClass('ribbons');
    $('#books *').remove();

})
$('#mall').on('click', function () {
    window.open('http://192.168.69.17:8080/mall','_self');
})