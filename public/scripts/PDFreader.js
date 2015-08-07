/**
 *
 * Created by hywilliam on 8/3/15.
 */
window.onload = function () {
    var url = 'weather.pdf';

    var pdfDoc = null,// pdf文档，未加载时为null对象
        pageNum = 1,// pdf页码，默认为第一页
        pageRendering = false,
        pageNumPending = null,
        scale = 2,// pdf视窗比例
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
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.setAttribute('id', 'page' + num);

            // 把当前页渲染进canvas上下文环境
            var renderContext = {
                canvasContext: ctx,
                viewport     : viewport
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

            viewer.appendChild(canvas);
        });

    }

    /**
     * 如果进程中有其他的页面在进行渲染，则等待渲染完成，否则立即渲染当前页面
     */
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    /**
     * 上一页
     */
    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
//        queueRenderPage(pageNum);
    }

    document.getElementById('prev').addEventListener('click', onPrevPage);

    /**
     * 下一页
     */
    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
//        queueRenderPage(pageNum);
    }

    document.getElementById('next').addEventListener('click', onNextPage);

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
        // 从第一页开始渲染，page索引是从1开始的
        for (var i = 1; i < pdfDoc.numPages; i++) {
            renderPage(i);
        }
    });

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
            $a.attr("href","javascript:alert("+req.catelog[i].pageNum+");")
                .attr("onclick","queueRenderPage("+req.catelog[i].pageNum+")")
                .attr("target","_self")
                .text("第"+(i+1)+"章 "+req.catelog[i].title);

            $a.appendTo($li);
            $li.appendTo($cateUL);
            //再加个ul>li>a层
            for (var j = 0; j < req.catelog[i].subItems.length; j++) {
                var $lij = $("<li>");
                var $aj = $("<a>");
                $aj.attr("href","javascript:alert("+req.catelog[i].subItems[j].pageNum+");")
                    .attr("onclick","queueRenderPage("+req.catelog[i].subItems[j].pageNum+")")
                    .attr("target","_self")
                    .text("»第"+(j+1)+"节 "+req.catelog[i].subItems[j].title);

                $aj.appendTo($lij);
                $lij.appendTo($ul);
            }
            $ul.appendTo($li);
        }
        for (var i = 0; i < req.catelog.length; i++) {
            var $a = $("<a>");
            var $ul = $("<ul>");
            var $li = $("<li>");
            $a.attr("href",req.catelog[i].pageNum).attr("target","_self")
                .text("第"+(i+1)+"章 "+req.catelog[i].title);

            $a.appendTo($li);
            $li.appendTo($cateUL);
            //再加个ul>li>a层
            for (var j = 0; j < req.catelog[i].subItems.length; j++) {
                var $lij = $("<li>");
                var $aj = $("<a>");
                $aj.attr("href",req.catelog[i].subItems[j].pageNum).attr("target","_self")
                    .text("»第"+(j+1)+"节 "+req.catelog[i].subItems[j].title);

                $aj.appendTo($lij);
                $lij.appendTo($ul);
            }
            $ul.appendTo($li);
        }
        console.log(req);
//        console.log(req.catelog.length);
    });
};