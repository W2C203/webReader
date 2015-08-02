/**
 * Created by joe on 15-8-1.
 */
var now = 1;
$.get('../data/1.txt',function(data){   //一开始显示第一页
    $('textarea').val(data);
})
$('#Backward').on("click",function(){
    if(now == 1 ){
        alert("第一页了。");
        return;
    }
    $.get('../data/'+ --now + '.txt',function(data){
        $('textarea').val(data);
    })
})
$('#Forward').on("click",function(){
    if(now == 8){
        alert("最后一页了。");
        return;
    }
    $.get('../data/'+ ++now + '.txt',function(data){
        $('textarea').val(data);
    })
})