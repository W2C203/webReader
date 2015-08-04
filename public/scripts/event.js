/**
 * Created by joe on 15-8-3.
 */
//这里存放get/post请求
/**
 * 登录验证
 */
$('#submit').on('click',function(event){
    $.post("/query",{user_name:$('#nameId').val(),password:$('#passId').val()},function(text, status){
        console.log('响应内容：'+JSON.stringify(text)+'状态：'+status);
        //一共会有3种成功响应   请填写帐号/密码 帐号或密码错误 登录成功
    })
    event.preventDefault();//阻止默认行为
})
