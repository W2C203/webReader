/**
 * Created by seanlee on 15-8-4.
 */
$(document).ready(function () {
    $(function () {
<<<<<<< HEAD
        //            $('#main [pdf-toggle="tooltip"]').tooltip();
        $("#menuList").hide();
        $("#leftSide>div").addClass('wai');
=======
        $("#menuList").hide();//初始化隐藏目录
>>>>>>> ae7075c56912fe9bacf0c7e87e62236f15300788
    });
});
$("#menuBtn").on('mouseover', function () {//当鼠标划过目录按钮时显示目录
    $(this).addClass('selected');
    console.log("sdw");
    $("#menuList").show();
});
$("#menuList").on('mouseout', function () {//当鼠标从目录移开时隐藏目录
    $('#menuBtn').removeClass('selected');
    $("#menuList").hide();
});
$("body *").not("#menuList").on('click',function(){//当鼠标点击目录以外的范围时隐藏目录
    $('#menuBtn').removeClass('selected');
    $("#menuList").hide();
});
$("#icon").on('click', function () {//左侧栏移入移出
    if ($(this).attr("title") == "show") {
        $(this).attr("title", "hide");
        $(this).addClass('selected');
        $(this).animate({left: '16%'}, 1000);        //小按钮移动
        $("#leftSide").animate({left: '0'}, 1000); //左边拉取框移动
    } else {
        $(this).attr("title", "show");
        $(this).removeClass('selected');
        $(this).animate({left: '0'}, 1000);
        $("#leftSide").animate({left: '-16%'}, 1000);
    }
});
//$("button[title^='p']").on('click', function () {
//    alert("prev");
//});
//$("button[title^='n']").on('click', function () {
//    alert("next");
//});
