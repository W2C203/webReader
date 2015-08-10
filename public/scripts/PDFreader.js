/**
 *
 * Created by hywilliam on 8/3/15.
 */
window.onload = function () {
    var url = 'weather.pdf';
//    var url = 'http://192.168.69.17:3306/data/files/store_3/goods_171/201508072126118049.pdf';
    var CHUNK = 3;
    var pageLoaded = 1;

    //change23
    var currPage = 2;
    var averHeight = 0;
    var pdfDoc = null,// pdf文档，未加载时为null对象
        pageRendering = false,
        pageNumPending = null,
        viewer = document.getElementById('viewer-container');

    function viewerWidth(viewer) {
        // viewer is a DOM element
        return viewer.clientWidth;
    }

    /**
     * 从pdf文档中得到页面信息，根据页面的视窗比例来调整canvas，然后渲染当前页，
     * @param num 页码
     */
    function renderPage(num) {
        // 开始渲染page，pageRendering标识
        pageRendering = true;
        // 用promise来从pdf文档中抓页面，本身就是异步的
        pdfDoc.getPage(num).then(function (page) {
            var scale = viewerWidth(viewer) / page.getViewport(1.0).width;//当前屏幕的缩放比例
            var viewport = page.getViewport(scale);
            var canvas = document.getElementById('page' + num);
            var ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            averHeight = canvas.height;
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


    /**
     * 执行入口在此
     * 通过promise异步下载pdf
     */
    PDFJS.getDocument(url).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        console.log(pdfDoc);
        //for 滚动 begin
//        myTime = setInterval(updateFlashHeight, 100);
//        myCanvas = setInterval(makeCanvas, 100);
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
     * (换成3个canvas之前不用管,换成后考虑用当前页码除以总页码计算进度)
     */
//    window.onscroll = function () {
////        var canvasHeight = averHeight;
////        console.log(canvasHeight/100);
////        var scrollTop = $(window).scrollTop();
////        var num = Math.floor(100 * scrollTop / (pdfDoc.numPages * canvasHeight / 100));
////        console.log(scrollTop);
//        var num = pdfDoc.numPages ? currPage / pdfDoc.numPages : 0;
//        $("#pro").attr("aria-valuenow", num * 100).attr("style", "width:" + (num * 100) + "%");
//    };

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
            $a.attr("page", req.catelog[i].pageNum)
                .attr("href", "#")
                .attr("target", "_self")
                .text("第" + (i + 1) + "章 " + req.catelog[i].title);

            $a.appendTo($li);
            $li.appendTo($cateUL);
            //再加个ul>li>a层
            for (var j = 0; j < req.catelog[i].subItems.length; j++) {
                var $lij = $("<li>");
                var $aj = $("<a>");
                $aj.attr("page", req.catelog[i].subItems[j].pageNum)
                    .attr("href", "#")
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


    $("#menuList").on('click', 'ul>li a', function () {
        var newPage = $(this).attr('page');
        var $newCanvas;
        if(newPage == 1) {
            $("#viewer-container :eq(0)").attr("id", "page" + (Number(newPage)));
            $("#viewer-container :eq(1)").attr("id", "page" + (Number(newPage) + 1));
            $("#viewer-container :eq(2)").attr("id", "page" + (Number(newPage) + 2));
            renderPage(Number(newPage));
            renderPage(Number(newPage) + 1);
            renderPage(Number(newPage) + 2);
        } else if (newPage > 1 && newPage < pdfDoc.numPages) {
            $("#viewer-container :eq(0)").attr("id", "page" + (Number(newPage) - 1));
            $("#viewer-container :eq(1)").attr("id", "page" + (Number(newPage)));
            $("#viewer-container :eq(2)").attr("id", "page" + (Number(newPage) + 1));
            renderPage(Number(newPage) - 1);
            renderPage(Number(newPage));
            renderPage(Number(newPage) + 1);
        } else if (newPage == pdfDoc.numPages) {
            $("#viewer-container :eq(0)").attr("id", "page" + (Number(newPage) - 2));
            $("#viewer-container :eq(1)").attr("id", "page" + (Number(newPage) - 1));
            $("#viewer-container :eq(2)").attr("id", "page" + (Number(newPage)));
            renderPage(Number(newPage) - 2);
            renderPage(Number(newPage) - 1);
            renderPage(Number(newPage));
        }
        currPage = Number(newPage);
        console.log('now:'+currPage);
        console.log("page on: " + currPage);
//        console.log($("#viewer-container :eq(0)").attr("id"));
        $(this).attr("href", "#page" + currPage);
        pageLoaded = currPage + 2;
        var num = pdfDoc.numPages ? currPage / pdfDoc.numPages : 0;
        $("#pro").attr("aria-valuenow", num * 100).attr("style", "width:" + (num * 100) + "%");
    });

    //监听两个翻页按钮
    document.getElementById('prev').addEventListener('click', function () {
        if (document.body.scrollTop >= 300) {
            document.body.scrollTop -= 300;
        }
    });
    document.getElementById('next').addEventListener('click', function () {
        document.body.scrollTop += 300;
    });

    //滚动监听
    window.addEventListener('scroll', function () {
        if (checkScrollDown()) {//滚动条向下的情况
            if (pageLoaded > pdfDoc.numPages) { //加载完了
                return;
            }
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'page' + pageLoaded);
            viewer.appendChild(canvas);
            renderPage(pageLoaded++);
            currPage++;
            console.log('now:'+currPage)

            viewer.firstChild.remove();
            document.body.scrollTop -= averHeight;//删完记得让页面滚回去1页
            //alert('down 等待渲染'+ pageLoaded)
            return;// 提高健壮性 有向下 就不向上
        }
        if (checkScrollUp()) {//滚动条向上的情况
            if (pageLoaded <= CHUNK + 1) { //开始的情况不会补页
                return;
            }
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'page' + (pageLoaded - CHUNK - 1)); //注意ID的分配
            viewer.insertBefore(canvas, viewer.childNodes[0]);
            renderPage(pageLoaded-- - CHUNK - 1);
            currPage--;
            console.log('now:'+currPage)

            viewer.lastChild.remove();
            document.body.scrollTop += averHeight;//删完记得让页面滚下去1页
            //alert('up 等待渲染'+ pageLoaded)
        }
        var num = pdfDoc.numPages ? currPage / pdfDoc.numPages : 0;
        $("#pro").attr("aria-valuenow", num * 100).attr("style", "width:" + (num * 100) + "%");
    });

    function checkScrollDown() {
        var scrollTop = document.body.scrollTop;       //滚动高度
        if (scrollTop > averHeight * 1.8) {
            return true;
        }
    }

    function checkScrollUp() {
        var scrollTop = document.body.scrollTop;       //滚动高度
        if (scrollTop < averHeight * 0.8) {
            return true;
        }
    }


};
