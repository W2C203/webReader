/**
 * Created by seanlee on 15-8-4.
 */
$(document).ready(function () {
    $(function () {
        //            $('#main [data-toggle="tooltip"]').tooltip();
        $("#menuList").hide();
        $("#leftSide>div").addClass('wai');
    });
});
$("#menuBtn").on('mouseover', function () {
    $(this).addClass('selected');
    $("#menuList").show();
});
$("#menuList").on('mouseout', function () {
    $('#menuBtn').removeClass('selected');
    $("#menuList").hide();
});
$("body *").not("#menuList").on('click',function(){
    $('#menuBtn').removeClass('selected');
    $("#menuList").hide();
})
$("#icon").on('click', function () {
    if ($(this).attr("title") == "hide") {
        $(this).attr("title", "show");
        $(this).addClass('selected');
        $(this).animate({left: '0'}, 1000);        //小按钮移动
        $("#leftSide div").animate({left: '-19%'}, 1000); //左边拉取框移动
    } else {
        $(this).attr("title", "hide");
        $(this).removeClass('selected');
        $(this).animate({left: '19%'}, 1000);
        $("#leftSide div").animate({left: '0'}, 1000);
    }
});
$("button[title^='p']").on('click', function () {
    alert("prev");
});
$("button[title^='n']").on('click', function () {
    alert("next");
});
