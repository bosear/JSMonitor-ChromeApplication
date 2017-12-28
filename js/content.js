
var code = '', script = null,
    arrMsg = [], msg = null;

functions = {
    write: true,
    setTimeout: true,
    setInterval: true,
    createElement: true,
    eval: true
};

code = constructCode(functions);
script = document.createElement('script');
script.textContent = code;

document.documentElement.appendChild(script);

document.addEventListener('extension', function (event) {
    var data = event.detail;
    msg = {
        funcName: data.funcName,
        code: data.code,
        type: 'nirs'
    };
    arrMsg.push(msg);
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    sendResponse(arrMsg);
});

function constructCode(functions) {
    var code = "\n";

    if (functions.eval)
        code += "window.old_eval = window.eval;\n" +
            "eval = function (code) {\n" +
            "   logCall('eval', '' + code); \n" +
            "   window.old_eval(code);\n" +
            "}\n" +
            "\n";

    if (functions.write)
        code += "document.old_write = document.write;\n" +
            "document.write = function (code) {\n" +
            "   logCall('write', '' + code);\n" +
            "   document.old_write(code);\n" +
            "}\n" +
            "\n";

    if (functions.setTimeout)
        code += "window.old_setTimeout = window.setTimeout;\n" +
            "window.setTimeout = function (code, time) {\n" +
            "   logCall('setTimeout', '' + code + time);\n" +
            "   window.old_setTimeout(code, time);\n" +
            "}\n" +
            "\n";

    if (functions.setInterval)
        code += "window.old_setInterval = window.setInterval;\n" +
            "window.setInterval = function (code, time) {\n" +
            "   logCall('setInterval', '' + code + time);\n" +
            "   window.old_setInterval(code, time);\n" +
            "}\n" +
            "\n";

    if (functions.createElement)
        code += "document.old_createElement = document.createElement;\n" +
            "document.createElement = function (code) {\n" +
            "   logCall('createElement', '' + code);\n" +
            "   return document.old_createElement(code);\n" +
            "}\n" +
            "\n";

    code += "function logCall(funcName, code) {\n" +
        "   var data = {\n" +
        "       funcName: funcName,\n" +
        "       code: code\n" +
        "   };\n" +
        "   document.dispatchEvent(new CustomEvent('extension', {detail: data}));\n" +
        "};\n";

    return code;
}

