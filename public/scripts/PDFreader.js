/**
 *
 * Created by hywilliam on 8/3/15.
 */
window.onload = function () {
    var url = '';
//    var url = 'http://192.168.69.17:3306/data/files/store_3/goods_171/201508072126118049.pdf';
    // 每次渲染的页数
    var CHUNK = 10;
    // 当前已加载的页
    //for 滚动 begin
    var wholeHeight = 0;
    //表示加载的页总高度
    var tempHeight = 0;
    //表示新加载的页总高度 即每个CHUNK页的总高度
    var sentry = 0;
    //哨兵变量 为了避免异步造成  tempHeight计算错误
    var myTime = null;
    //定时器 监督哨兵变量
    var flashHeight = 10000;
    //表示需要再取页面的高度 为了避免开始未更新这个值 先设大一些
    var FLASHPAGE = 7;
    //表示每到这个页数刷新一次
    var finished = 0 ;
    //for 滚动 end
    var pageLoaded = 1;

    var pdfDoc = null,// pdf文档，未加载时为null对象
        pageRendering = false,
        pageNumPending = null,
        scale = 1.8,// pdf视窗比例
        viewer = document.getElementById('viewer-container');

    /**
     * 从pdf文档中得到页面信息，根据页面的视窗比例来调整canvas，然后渲染当前页，
     * @param num 页码
     */
    function renderPage(num) {
        // 开始渲染page，pageRendering标识
        pageRendering = true;
        // 用promise来从pdf文档中抓页面，本身就是异步的
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport(scale);
            var canvas = document.getElementById('page' + num);
            var ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            tempHeight += viewport.height;    //把高度存起来
            sentry++;                       //哨兵变量加1
            canvas.width = viewport.width;

            // 把当前页渲染进canvas上下文环境
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            // 渲染任务也是一个promise进程
            renderTask.promise.then(function () {
                // 完成page渲染，pageRendering标识
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });

    }

//    /**
//     * 如果进程中有其他的页面在进行渲染，则等待渲染完成，否则立即渲染当前页面
//     */
//    function queueRenderPage(num) {
//        if (pageRendering) {
//            pageNumPending = num;
//        } else {
//            renderPage(num);
//        }
//    }
//
//    /**
//     * 上一页
//     */
//    function onPrevPage() {
//        if (pageNum <= 1) {
//            return;
//        }
//        pageNum--;
////        queueRenderPage(pageNum);
//    }
//
//    document.getElementById('prev').addEventListener('click', onPrevPage);
//
//    /**
//     * 下一页
//     */
//    function onNextPage() {
//        if (pageNum >= pdfDoc.numPages) {
//            return;
//        }
//        pageNum++;
////        queueRenderPage(pageNum);
//    }
//
//    document.getElementById('next').addEventListener('click', onNextPage);

    /**
     * 显示目录
     */
    function displayOutline() {
        pdfDoc.getOutline().then(function (outline) {
//            var tableOfContent = outline[0].items;
//            console.log(tableOfContent)
            console.log(outline);
        });
    }

    document.getElementById('menuBtn').addEventListener('click', displayOutline);

    /**
     * 执行入口在此
     * 通过promise异步下载pdf
     */
    PDFJS.getDocument(url).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        console.log(pdfDoc);
        //for 滚动 begin
        myTime = setInterval(updateFlashHeight, 100);
        //for 滚动 end
        (function () {
            for (; pageLoaded < CHUNK + 1; ++pageLoaded) {
                var canvas = document.createElement('canvas');
                canvas.setAttribute('id', 'page' + pageLoaded);
                viewer.appendChild(canvas);
                renderPage(pageLoaded);
            }
        })();

    });

    /**
     * 进度条监听滚动事件
     */
    window.onscroll = function () {
        var canvasHeight = $("#viewer-container #page1").height();
//        console.log(canvasHeight/100);
        var scrollTop = $(window).scrollTop();
        var num = Math.floor(100*scrollTop/(pdfDoc.numPages*canvasHeight/100));
//        console.log(scrollTop);
        $("#pro").attr("aria-valuenow",num/100).attr("style","width:"+(num/100)+"%")
    };

    /**
     * 目录请求读取
     */
    $.get('metadata.json', function (req, res) {
        //req.title书名
        // req.catelog[i].title章节名称 .pageNum所在页码 .level所在层数
        // req.catelog[i].subItem[j].title文章名称 .pageNum所在页码 .level所在层数
//        添加书名
        var $list = $("#menuList");
        var bookName = req.title;
        $("<hr>").appendTo($list);
        $("<h2>").text(bookName).appendTo($list);
        $("<hr>").appendTo($list);
        var $cateUL = $("<ul>").appendTo($list);
//        添加目录
        for (var i = 0; i < req.catelog.length; i++) {
            var $a = $("<a>");
            var $ul = $("<ul>");
            var $li = $("<li>");
            $a.attr("href", "#page" + req.catelog[i].pageNum)
                .attr("target", "_self")
                .text("第" + (i + 1) + "章 " + req.catelog[i].title);

            $a.appendTo($li);
            $li.appendTo($cateUL);
            //再加个ul>li>a层
            for (var j = 0; j < req.catelog[i].subItems.length; j++) {
                var $lij = $("<li>");
                var $aj = $("<a>");
                $aj.attr("href", "#page" + req.catelog[i].subItems[j].pageNum)
                    .attr("target", "_self")
                    .text("»第" + (j + 1) + "节 " + req.catelog[i].subItems[j].title);

                $aj.appendTo($lij);
                $lij.appendTo($ul);
            }
            $ul.appendTo($li);
        }
        console.log(req);
//        console.log(req.catelog.length);
    });

    //滚动监听
    window.addEventListener('scroll', function () {
        if (checkScrollSlide()) {
            if(finished){
                console.log('后面已经没了。');
                return;
            }
            console.log('加10页。');
            myTime = setInterval(updateFlashHeight, 100);
            for (var i = 1; i < CHUNK + 1; ++i, pageLoaded++) {//i只是循环 pageLoaded才是页码
                if(pageLoaded>pdfDoc.numPages){ //加载完了
                    finished=1;
                    return;
                }
                var canvas = document.createElement('canvas');
                canvas.setAttribute('id', 'page' + pageLoaded);
                viewer.appendChild(canvas);
                renderPage(pageLoaded);
            }
        }
    });
    function updateFlashHeight() {
        if (sentry == CHUNK) {//当哨兵变量到CHUNK 那么表示flashHeight可以计算了
            flashHeight = wholeHeight;
            flashHeight += tempHeight * FLASHPAGE / CHUNK;
            wholeHeight += tempHeight;   //把当前加载的 加到全部加载高度
            tempHeight = 0;
            sentry = 0; //哨兵归零
            clearInterval(myTime);
        }
        //这里应该是类似一个promise then/done 但是用不了promise不知道为啥
    }

    function checkScrollSlide() {
        var scrollTop = document.body.scrollTop;       //滚动高度
        //console.log('滚动高度：' + scrollTop)
        //console.log('超过这个高度刷新：', flashHeight)
        return (flashHeight <= scrollTop) ? true : false;
    }
};

