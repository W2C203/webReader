/**
 *
 * Created by hywilliam on 8/1/15.
 */
window.onload = function () {
    var contentArea = document.getElementById('content'),
        prev = document.getElementById('prev'),
        next = document.getElementById('next');

    /**
     * Ajax获取纯文本
     * @param url
     */
//    function requestText(url) {
//        var request = new XMLHttpRequest();
//        request.open('GET', url);
//        request.onreadystatechange = function () {
//            if (request.readyState === 4 && request.status === 200) {
//                return request.responseText;
//            }
//        };
//        request.send(null);
//    }
//
    next.addEventListener('click', function () {
//        contentArea.innerHTML = requestText('/data/p01');
        alert(1)
    });
};

