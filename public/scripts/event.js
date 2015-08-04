/**
 * Created by joe on 15-8-3.
 */
//这里存放get/post请求
/**
 * 登录验证
 */
$('#submit').on('click', function (event) {
    $.post("/verify/query", $('#form').serialize(), function (text, status) {
        alert(JSON.stringify(text));
        //一共会有3种成功响应   请填写帐号/密码 帐号或密码错误 登录成功
    })
    event.preventDefault();//阻止默认行为
})
