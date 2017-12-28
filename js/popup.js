var number = 0;
var arrMsg = [];
currentFunctions = {};

document.addEventListener('DOMContentLoaded', function () {

    setTimeout(function func() {

        var promise = new Promise(function (resolve) {

            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

                chrome.tabs.sendMessage(tabs[0].id, {}, function (currentArrMsg) {

                    if (arrMsg.length !== currentArrMsg.length) {
                        drawCall(extract(arrMsg, currentArrMsg));
                        arrMsg = currentArrMsg;
                    }
                    resolve();
                });
            })
        });

        promise.then(function () {
            setTimeout(func, 100);
        });
    }, 100);
});

function extract(firstArr, secondArr) {
    if (secondArr.length > firstArr.length)
        return secondArr.slice(firstArr.length);
    else
        return firstArr.slice(secondArr.length);
}

function drawCall(arrMsg) {
    var firstRow, firstCol, secondRow,
        secondCol, table, pre, code;

    arrMsg.forEach(function (msg) {
        if (msg.type !== 'nirs' || !currentFunctions[msg.funcName])
            return;

        ++number;

        pre = document.createElement('pre');
        code = document.createElement('code');
        code.innerHTML = js_beautify(msg.code, {indent_size: 2});
        code.setAttribute('class', 'language-js');
        Prism.highlightElement(code);
        pre.appendChild(code);

        table = document.getElementById('logTable');

        if (!table) {
            var card = document.createElement('div');
            card.setAttribute('class', 'card');

            table = document.createElement('table');
            table.setAttribute('class', 'table table-bordered');
            table.setAttribute('id', 'logTable');

            firstRow = document.createElement('tr');

            firstCol = document.createElement('th');
            firstCol.innerText = '#';

            secondCol = document.createElement('th');
            secondCol.innerText = 'Название функции';

            firstRow.appendChild(firstCol);
            firstRow.appendChild(secondCol);

            table.appendChild(firstRow);
            card.appendChild(table);

            var element = document.getElementById('nav-home');
            element.innerHTML = '';
            element.appendChild(card);
        }

        firstRow = document.createElement('tr');

        firstCol = document.createElement('th');
        firstCol.innerText = number;
        firstCol.setAttribute('rowspan', '2');

        secondCol = document.createElement('th');
        secondCol.innerText = msg.funcName;

        firstRow.appendChild(firstCol);
        firstRow.appendChild(secondCol);

        secondRow = document.createElement('tr');
        secondCol = document.createElement('td');
        secondCol.appendChild(pre);

        secondRow.appendChild(secondCol);

        table.appendChild(firstRow);
        table.appendChild(secondRow);
    });
}

document.addEventListener('DOMContentLoaded', function () {

    createListeners();

    chrome.storage.local.get('functions', function (data) {

        if (!data.functions) {
            data.functions = {
                write: true,
                setTimeout: true,
                setInterval: true,
                createElement: true,
                eval: true
            };
            chrome.storage.local.set({functions: data.functions});
        }

        currentFunctions = data.functions;
        data = data.functions;

        var write = jQuery("input[data-func=write]");
        write.prop('checked', data.write);

        var time = jQuery("input[data-func=setTimeout]");
        time.prop('checked', data.setTimeout);

        var interval = jQuery("input[data-func=setInterval]");
        interval.prop('checked', data.setInterval);

        var createEl = jQuery("input[data-func=createElement]");
        createEl.prop('checked', data.createElement);

        var ev = jQuery("input[data-func=eval]");
        ev.prop('checked', data.eval);
    });
});

function setFunction(eventObj) {
    chrome.storage.local.get('functions', function (data) {
        data.functions[eventObj.data.func] = !data.functions[eventObj.data.func];
        currentFunctions[eventObj.data.func] = data.functions[eventObj.data.func];
        chrome.storage.local.set({functions: data.functions});
    });
}

function createListeners() {
    var write = jQuery("input[data-func=write]");
    write.click({func: 'write'}, setFunction);

    var time = jQuery("input[data-func=setTimeout]");
    time.click({func: 'setTimeout'}, setFunction);

    var interval = jQuery("input[data-func=setInterval]");
    interval.click({func: 'setInterval'}, setFunction);

    var createEl = jQuery("input[data-func=createElement]");
    createEl.click({func: 'createElement'}, setFunction);

    var ev = jQuery("input[data-func=eval]");
    ev.click({func: 'eval'}, setFunction);
}
