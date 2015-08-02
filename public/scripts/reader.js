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
    function requestText(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var type = request.getResponseHeader('Content-Type');
                if(type === 'application/json') {
                    displayData(JSON.parse(request.responseText));
                }
                return request.responseText;
            }
        };
        request.send(null);
    }

    function displayData(data) {
//        contentArea.innerHTML = data['formImage']['Pages'][0]['Texts'][0]['R'][0]['T'];
//        console.log(data['formImage']['Pages'][0]['Texts'][0]['R'][0]['T']);
        console.log(data);
    }
    next.addEventListener('click', function () {
//        contentArea.innerHTML = requestText('/data/p01');
//        alert(1)
        requestText('data/test2.json');
//        console.log(res);
    });
};

