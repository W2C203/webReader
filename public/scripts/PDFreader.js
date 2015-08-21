function showBook(url,first) {
    if (first) {//第一次点一本书需要移除的一些东西
        $('#firstDiv').remove();
        $('#wait').removeClass('hide');
        $('#menuBtn').removeClass('hide');
        $('#prev').removeClass('hide');
        $('#next').removeClass('hide');
    }
    $('#viewer-container *').remove();
    var CHUNK = 3;
    //change23
    var currPage = 2;
    var averHeight = 0;
    var pdfDoc = null,// pdf文档，未加载时为null对象
        outline = null,//pdf.js读出来的目录，正版书有，否则为null
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
        //pdfDoc.myDestory();
        console.log(pdfDoc);
        pdfDoc.getOutline().then(function (Outline) {
            outline = Outline == null ? Outline : Outline[0];
            drawCatalog();
        });
        (function () {
            for (var i = 1; i < CHUNK + 1; ++i) {
                var canvas = document.createElement('canvas');
                canvas.setAttribute('id', 'page' + i);
                viewer.appendChild(canvas);
                renderPage(i);
            }
        })();
    });

    function drawCatalog() {
        if (outline) {
            var req = makeCatalog(outline);
            //console.log(req);
            $("#menuList *").remove();
//        添加书名
            var $list = $("#menuList");
            var bookName = req.bookTitle;
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
                    .text(req.catelog[i].title);

                $a.appendTo($li);
                $li.appendTo($cateUL);
                //再加个ul>li>a层
                for (var j = 0; j < req.catelog[i].subItems.length; j++) {
                    var $lij = $("<li>");
                    var $aj = $("<a>");
                    var $ulj = $("<ul>");
                    $aj.attr("page", req.catelog[i].subItems[j].pageNum)
                        .attr("href", "#")
                        .attr("target", "_self")
                        .text(req.catelog[i].subItems[j].title);
                    //再再来个ul>li>a层
                    for (var k = 0; k < req.catelog[i].subItems[j].innerItems.length; k++) {
                        var $lik = $("<li>");
                        var $ak = $("<a>");
                        var $ulk = $("<ul>");
                        $ak.attr("page", req.catelog[i].subItems[j].innerItems[k].pageNum)
                            .attr("href", "#")
                            .attr("target", "_self")
                            .text(req.catelog[i].subItems[j].innerItems[k].title);
                        //再再再来个ul>li>a层
                        for (var l = 0; l < req.catelog[i].subItems[j].innerItems[k].lastItems.length; l++) {
                            var $lil = $("<li>");
                            var $al = $("<a>");
                            $al.attr("page", req.catelog[i].subItems[j].innerItems[k].lastItems[l].pageNum)
                                .attr("href", "#")
                                .attr("target", "_self")
                                .text(req.catelog[i].subItems[j].innerItems[k].lastItems[l].title);

                            $al.appendTo($lil);
                            $lil.appendTo($ulk);
                        }
                        $ak.appendTo($lik);
                        $ulk.appendTo($lik);
                        $lik.appendTo($ulj);
                    }
                    $aj.appendTo($lij);
                    $ulj.appendTo($lij);
                    $lij.appendTo($ul);
                }
                $ul.appendTo($li);
            }
        } else {
            /**
             * 目录请求读取
             */
            $.get('metadata.json', function (req, res) {
                //req.title书名
                // req.catelog[i].title章节名称 .pageNum所在页码 .level所在层数
                // req.catelog[i].subItem[j].title文章名称 .pageNum所在页码 .level所在层数
                $("#menuList *").remove();
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
                //console.log(req);
            });
        }
    }

    function makeCatalog(outline) {
        var book = {
            "bookTitle": outline.title,
            "catelog": []
        };
        function Items() {
            var o = {
                "level": 1,
                "pageNum": null,
                "subItems": [],
                "title": null
            };
            return o;
        }
//        var items = {
//            "level": 1,
//            "pageNum": null,
//            "subItems": [],
//            "title": null
//        };
        function SubItems() {
            var o = {
                "level": 2,
                "pageNum": null,
                "innerItems": [],
                "title": null
            };
            return o;
        }
//        var subItem = {
//            "level": 2,
//            "pageNum": null,
//            "innerItems": [],
//            "title": null
//        };
        function InnerItems() {
            var o = {
                "level": 3,
                "pageNum": null,
                "lastItems": [],
                "title": null
            };
            return o;
        }
//        var innerItem = {
//            "level": 3,
//            "pageNum": null,
//            "lastItems": [],
//            "title": null
//        };
        function LastItems() {
            var o = {
                "level": 4,
                "pageNum": null,
                "title": null
            };
            return o;
        }
//        var lastItem = {
//            "level": 4,
//            "pageNum": null,
//            "title": null
//        };
        for (var i = 0; i < outline.items.length; i++) {
            var items = new Items();
            items.title = outline.items[i].title;//作者简介，目录概览层
            for (var j = 0; j < outline.items[i].items.length; j++) {
                var subItem = new SubItems();
                subItem.title = outline.items[i].items[j].title;//第j章名称
                for (var k = 0; k < outline.items[i].items[j].items.length; k++) {
                    var innerItem = new InnerItems();
                    innerItem.title = outline.items[i].items[j].items[k].title;//第j.k节名称
                    for (var l = 0; l < outline.items[i].items[j].items[k].items.length; l++) {
                        var lastItem = new LastItems();
                        lastItem.title = outline.items[i].items[j].items[k].items[l].title;//j.k.l小节
                        innerItem.lastItems.push(lastItem);
                    }
                    subItem.innerItems.push(innerItem);
                }
                items.subItems.push(subItem);
            }
            book.catelog.push(items);
        }
        return book;
    }

    $("#menuList").on('click', 'ul>li a', function () {
        var newPage = $(this).attr('page');
        if (newPage == 1) {
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
        $(this).attr("href", "#page" + currPage);
        changePro(currPage);
    });

    //监听两个翻页按钮
    document.getElementById('prev').addEventListener('click', function () {
        var nowID = $("#page" + currPage).attr("id");
        if (nowID) {
            nowID = +nowID.substr(4);
            location.href = "#page" + (nowID - 1);
        } //不用else是因为滚动的时候会自动渲染,所以只要是翻页就一定能找到ID
    });
    document.getElementById('next').addEventListener('click', function () {
        var nowID = $("#page" + currPage).attr("id");
        if (nowID) {
            nowID = +nowID.substr(4);
            location.href = "#page" + (nowID + 1);
        } //不用else理由同上翻页
    });

    //滚动监听
    window.addEventListener('scroll', function () {
        if (checkLast()) {  //到最后的情况
            changePro(pdfDoc.numPages);
        }

        if (checkScrollDown()) {//滚动条向下的情况
            if (currPage >= pdfDoc.numPages - 1) { //加载完了
                return;
            }
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'page' + (Number(currPage) + (CHUNK-1)));
            viewer.appendChild(canvas);
            renderPage(Number(currPage) + (CHUNK-1));
            currPage++;
            changePro(currPage);
            viewer.firstChild.remove();
            document.body.scrollTop = averHeight * (CHUNK-2);//删完记得让页面滚回去
            return;// 提高健壮性 有向下 就不向上
        }
        if (checkScrollUp()) {//滚动条向上的情况
            if (currPage < CHUNK) { //开始的情况不会补页
                return;
            }
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'page' + (Number(currPage) - 2)); //注意ID的分配
            viewer.insertBefore(canvas, viewer.childNodes[0]);
            renderPage(Number(currPage) - 2);
            currPage--;
            changePro(currPage);
            viewer.lastChild.remove();
            document.body.scrollTop += averHeight;//删完记得让页面滚下去1页
        }
    });

    function checkScrollDown() {
        var scrollTop = document.body.scrollTop;       //滚动高度
        if (scrollTop > averHeight * (CHUNK-1)) {
            return true;
        }
    }

    function checkScrollUp() {
        var scrollTop = document.body.scrollTop;       //滚动高度
        if (scrollTop < averHeight * 0.8) {
            return true;
        }
    }

    function checkLast() {
        return document.body.scrollTop > averHeight * (CHUNK-0.2);
    }

    function changePro(currPage) {
        var num = pdfDoc.numPages ? currPage / pdfDoc.numPages : 0;
        $("#pro").attr("aria-valuenow", num * 100).attr("style", "width:" + (num * 100) + "%");
    }
}