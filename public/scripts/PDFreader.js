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
        scale = 1,// pdf视窗比例
        canvas = document.getElementById('content'),
        ctx = canvas.getContext('2d');

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
            canvas.height = viewport.height;
            canvas.width = viewport.width;

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
        });

        // Update page counters
//        document.getElementById('page_num').textContent = pageNum;
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
        queueRenderPage(pageNum);
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
        queueRenderPage(pageNum);
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
//        document.getElementById('page_count').textContent = pdfDoc.numPages;

        // 初始化渲染，首次渲染为第一页
        renderPage(pageNum);
    });

    /**
     * 目录请求读取
     */
    $.get('metadata.json', function (req, res) {
        console.log(req);
    });
};
