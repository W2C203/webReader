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
    if ($(window).width() < screen.width * 0.8) {
        $('#icon').attr("title") != "show" ? iconHide() : 1;
    }
}
//var clickInSecond = 0;
//var toStop = null;
//为选中书添加额外样式
$('#books').on('click', 'div', function () {
//    if (clickInSecond != 0) {
//        return;
//    }
//    toStop = setInterval(forNotFast, 1000);
    $(this).siblings().removeClass('ribbon-selected');
    $(this).addClass('ribbon-selected');
});
//function forNotFast(){  //3秒内只能点1本书  暂时这样 想到更好策略再改。 貌似不大靠谱 其他地方不好改。
//    clickInSecond++;
//    if (clickInSecond == 3) {
//        clickInSecond = 0;
//        clearInterval(toStop);
//    }
//}
/**
 * 下面是为了实现按下canvas拖动的效果
 */
var prevY = 0,
    nowY = 0;
upOrdown = 0; //每次只能上或者下 1为up 2为down
var timeOut = null;
$('#viewer-container').on('mousedown', 'canvas', function (event) {
    $(this).addClass('canvas-grabbing');
    nowY = prevY = event.pageY;
    upOrdown = 0;
    timeOut = setInterval(function () {//用周期检测减少刷新次数
        if (nowY - prevY < 0 && (upOrdown == 0 || upOrdown == 2)) {//Down
            upOrdown = 2;
            changeScroll(nowY - prevY);
        }
        if (nowY - prevY > 0 && (upOrdown == 0 || upOrdown == 1)) {//Up
            upOrdown = 1;
            changeScroll(nowY - prevY);
        }
        prevY = nowY;
    }, 20);
    $(this).on('mousemove', function (event) {
        console.log('keep listening mousemove');
        nowY = event.pageY;
    })
});
//当鼠标松开或者离开了canvas取消mousedown/move事件监听
$('#viewer-container').on('mouseleave', 'canvas', clearMove);
$('#viewer-container').on('mouseup', 'canvas', clearMove);
function clearMove() {
    clearInterval(timeOut);
    $(this).off();
    $(this).removeClass('canvas-grabbing');
}
function changeScroll(changeY) { //滚动条改变
    $(document).scrollTop($(document).scrollTop() - changeY);
}