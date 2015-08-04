/**
 * Created by joe on 15-8-3.
 */
//这里存放get/post请求
/**
 * 登录验证
 */
$('#submit1').on('click', function (event) {
    var data = $('#form1').serialize();
    if (data.indexOf("=&") != -1 || data[data.length - 1] == '=') { //如果没填帐号或者密码 直接返回
        alert("帐号或密码不能为空");
        return;
    }
    $.post("/verify/query", data, function (text, status) {
        alert(JSON.stringify(text));
        //一共会有3种成功响应   请填写帐号/密码(这个正常是不会有的) 帐号或密码错误 登录成功
    })
    event.preventDefault();//阻止默认行为
})

/**
 * 查询已购买书籍测试
 */
$('#submit2').on('click', function (event) {
    var data = $('#form2').serialize();
    if (data[data.length - 1] == '=') {//没输入帐号 直接返回
        alert("输入帐号。");
        return;
    }
    $.post("/verify/queryBuy", data, function (text, status) {
        if(typeof text == 'string'){
            alert(text);
            return;
        }
        console.log('购买的数目如下：');
        for(var i in text){
            console.log(text[i].goods_name);
        }
        alert("数目在终端显示\n（注：feiyue用户有本书叫 45  没有出错！）");
    })
    event.preventDefault();//阻止默认行为
})