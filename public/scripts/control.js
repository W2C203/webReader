/**
 * Created by seanlee on 15-8-4.
 */
$(document).ready(function(){
    $(function () {
        //            $('#main [data-toggle="tooltip"]').tooltip();
        $("#menuList").hide();
        $("#leftSide>div").hide();
    });
});
$("#menuBtn").on('mouseover', function () {
    $(this).addClass('selected');
    $("#menuList").show();
});
$("#menuBtn").on('mouseout', function () {
    $(this).removeClass('selected');
    $("#menuList").hide();
});
$("#icon").on('click', function () {
    if($(this).attr("title") == "hide"){
        $(this).attr("title","show");
        $(this).addClass('selected');
    } else if($(this).attr("title") == "show"){
        $(this).attr("title","hide");
        $(this).removeClass('selected');
    }
    $("#leftSide div").toggle();
});
//$("button[title^='p']").on('click', function () {
//    alert("prev");
//});
//$("button[title^='n']").on('click', function () {
//    alert("next");
//});
