"use strict";
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function getByteLength(str) {
    return str.replace(/[^\x00-\xff]/g, "**").length;
}
function formValidate(form) {
    var errors = [];
    var requireds = form.$error.required;
    var patterns = form.$error.pattern;
    var parses = form.$error.parse;
    var mins = form.$error.minlength;
    var maxs = form.$error.maxlength;
    if (requireds) {
        for (var i = 0; i < requireds.length; i++) {
            var obj = requireds[i];
            var errmsg = document.getElementsByName(obj.$name)[0].getAttribute("errormsg");
            errors.push({ msg: errmsg });
        }
    }
    if (patterns) {
        for (var i = 0; i < patterns.length; i++) {
            var obj = patterns[i];
            var errmsg = document.getElementsByName(obj.$name)[0].getAttribute("errormsg");
            errors.push({ msg: errmsg });
        }
    }
    if (parses) {
        for (var i = 0; i < parses.length; i++) {
            var obj = parses[i];
            var errmsg = document.getElementsByName(obj.$name)[0].getAttribute("errormsg");
            errors.push({ msg: errmsg });
        }
    }
    if (mins) {
        for (var i = 0; i < mins.length; i++) {
            var obj = mins[i];
            var errmsg = document.getElementsByName(obj.$name)[0].getAttribute("errormsg");
            errors.push({ msg: errmsg });
        }
    }
    if (maxs) {
        for (var i = 0; i < maxs.length; i++) {
            var obj = maxs[i];
            var errmsg = document.getElementsByName(obj.$name)[0].getAttribute("errormsg");
            errors.push({ msg: errmsg });
        }
    }
    return errors;
}
(function (window) {
    var base64 = {};
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    function encode(str) {
        str = escape(str);
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
    function decode(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c1 == -1);
            if (c1 == -1)
                break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c2 == -1);
            if (c2 == -1)
                break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return unescape(out);
                c3 = base64DecodeChars[c3];
            }
            while (i < len && c3 == -1);
            if (c3 == -1)
                break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return unescape(out);
                c4 = base64DecodeChars[c4];
            }
            while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return unescape(out);
    }
    base64.encode = encode;
    base64.decode = decode;
    window.base64 = base64;
})(window);

//把json对象转为get参数形式
function toUrlQuery(obj) {
    var s = [],
		add = function (key, value) {
		    s[s.length] = encodeURIComponent(key) + "=" +
				encodeURIComponent(value == null ? "" : value);
		};
    for (var p in obj) { // 方法 
        add(p, obj[p]);
    }
    return s.join("&");
}
//构建表单并提交
function postForm(formList, action) {
    var body = document.querySelector("body");
    var turnForm = document.createElement("form");
    turnForm.setAttribute("method", "post");
    turnForm.setAttribute("action", action);
    turnForm.setAttribute("style", "display:none");   
    for (var i = 0, len = formList.length; i < len; i++) {
        var element = document.createElement("input");
        element.setAttribute("name", formList[i].name);
        element.setAttribute("value", formList[i].value);
        turnForm.appendChild(element);
    }
    body.appendChild(turnForm);
    turnForm.submit();
}
//是否是微信客户端
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

//是否是App客户端
function isApp() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/mteduApp/i) == "mteduapp") {
        return true;
    } else {
        return false;
    }
}
function appVersion() {
    var ua = navigator.userAgent.toLowerCase();
    var match = ua.match(/mteduApp\/(\d+.\d+)(.\d+)/i);
    if (match&&match[1]) {
        return match[1];
    }
    return false;
}
function isIos() {
    var ua = navigator.userAgent.toLowerCase();
    return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i); //ios终端
}
function isAndroid() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/Android/i) == "android") {
        return true;
    } else {
        return false;
    }
}

//ios能用注册方法
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe)
    }, 0);
}

function appJump(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('appJump', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.appJump(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}
function appLogin(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('showLogin', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.showLogin(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}
function appCallTel(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('callTel', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.callTel(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}
function appHideShareButton(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('hideShareButton', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.hideShareButton(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}

function appDoShare(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('doShare', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.doShare(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}

function appIsWXAppInstalled(jsonData,callback) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('isWXAppInstalled', jsonData, function (res) { 
                if(callback){
                 callback(res);
               }
            });
        });
    } else {
        try {
            var json = androidApp.isWXAppInstalled(JSON.stringify(jsonData));
            callback(json);
        } catch (ex) { }
    }
}

function appCallWXPay(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('callWXPay', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.callWXPay(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}

function appClose(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('close', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.close(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}
function appSetTitle(jsonData) {
    if (isIos()) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler('setTitle', jsonData, function (res) { });
        });
    } else {
        try {
            androidApp.setTitle(JSON.stringify(jsonData));
        } catch (ex) { }
    }
}
