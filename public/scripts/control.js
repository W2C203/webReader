/**
 * Created by seanlee on 15-8-4.
 */
$(document).ready(function () {
    $(function () {
        //            $('#main [pdf-toggle="tooltip"]').tooltip();
//        $("#menuList").hide();
//        $("#leftSide>div").addClass('wai');
        $("#menuList").hide();//初始化隐藏目录
    });
});
$("#menuBtn").on('mouseover', function () {//当鼠标划过目录按钮时显示目录
    $(this).addClass('selected');
    $("#menuList").show(100);
});
$("#menuList").on('mouseleave', function () {//当鼠标从目录移开时隐藏目录
    $('#menuBtn').removeClass('selected');
//    $("#menuList").hide(800);
    $("#menuList").slideUp(500);
});
//$("body *").not("#menuList").on('click','a',function(event){//当鼠标点击目录以外的范围时隐藏目录
//    $('#menuBtn').removeClass('selected');
//    $("#menuList").hide();
//});
$("body *").not("#menuList").on('click', function () {//当鼠标点击目录以外的范围时隐藏目录
    $('#menuBtn').removeClass('selected');
//    $("#menuList").hide(800);
    $("#menuList").slideUp(500);
});
$("#icon").on('click', function () {//左侧栏移入移出
    $(this).attr("title") == "show" ? iconShow() : iconHide();
    //最开始是显示的 title为hide 即title是点击后的效果
});
function iconShow() {
    var myThis = $('#icon');
    myThis.attr("title", "hide");
    myThis.addClass('selected');
    myThis.animate({left: '235px'}, 1000);         //小按钮移动
    $("#leftSide").animate({left: '0'}, 1000);     //左边拉取框移动
}
function iconHide() {
    var myThis = $('#icon');
    myThis.attr("title", "show");
    myThis.removeClass('selected');
    myThis.animate({left: '-5px'}, 1000);        //小按钮
    $("#leftSide").animate({left: '-240px'}, 1000);//拉去框
}
//$("button[title^='p']").on('click', function () {
//    alert("prev");
//});
//$("button[title^='n']").on('click', function () {
//    alert("next");
//});
function keyDown(e) {
    var currKey = 0, e = e || event;
    currKey = e.which || e.charCode || e.keyCode;
    var realKey = String.fromCharCode(e.which);
//    alert('按键码: ' + currKey + ' 字符: ' + realKey);
    if (currKey === 37) {
        $("#prev").trigger('click');
    } else if (currKey === 39) {
        $("#next").trigger('click');
    }
}
document.onkeydown = keyDown;

/**
 * 窗体变小 触发左部功能隐藏事件
 */
window.onresize = function () { //jquery 写法
    $('#icon').attr("title") != "show" ? iconHide() : 1;
}

