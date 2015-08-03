/**
 *
 * Created by hywilliam on 8/3/15.
 */
window.onload = function(){
//    alert(1)
    PDFJS.getDocument('///').then(function(pdf){
        pdf.getPage(1).then(function(page){
            var scale = 1.5;
            var viewport = page.getViewport(scale);


            var canvas = document.getElementById('content');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);
        });
    });
};
