//初始化应用
var App = angular.module("App", [
    "angular-loading-bar",
    "ngAnimate",
    "ngSanitize",
    "ngCookies",
    "ui.bootstrap",    
    'infinite-scroll',
    "toaster",
    "ngFileUpload",
]);
//配置应用
App.config([
    "cfpLoadingBarProvider",
    "$httpProvider",
    function (cfpLoadingBarProvider, $httpProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.includeBar = true;
        $httpProvider.interceptors.push("authInterceptorService");
    }
]);

//定义常量
App.constant("ngSettings", {
    apiServiceBaseUri: serviceBase,
    authorizationData: encodeURIComponent(base64.encode("mantoumemberAuthorizationData")),
    loginUrl: loginUrl,// + encodeURIComponent("http://" + window.location.host + "/views/login.html"),
    homeUrl: "/",
    appApiBase:appApiBase,
    //clientUserTag: "mt_member"
});
//运行初始化
App.run([
    "authService",
    "ngSettings",
    "$rootScope",
    "$cookies",
    function (authService, ngSettings, $rootScope, $cookies) {
        //第一次进入清除老的登录cookie;
        var isNewFirst = $cookies.get("is_new_first");
        if (!isNewFirst) {
            var date = new Date();
            date.setTime(date.getTime() - 10000);
            var options = {
                path: "/",
                domain: "mtedu.com",
                expires: date.toGMTString()
            };
            $cookies.remove("mt_info", options);
            $cookies.remove("mt_needbind", options);
            $cookies.remove("mt_passport_backurl", options);
            $cookies.remove("mt_sess_v3", options);
            $cookies.remove("mt_uid", options);
            $cookies.remove("mt_uname", options);
            var newTime = new Date();
            newTime.setTime(newTime.getTime() + 42000000000);
            var putoptions = {
                path: "/",
                domain: "mtedu.com",
                expires: newTime.toGMTString()
            };
            $cookies.put("is_new_first", 1, putoptions);
        }
        
        authService.fillAuthData();
        //拼接图片地址，imghost在/config/main.js配置        
        $rootScope.getImg = function (url) {         
            if(!url||url==""){
                return "";
            }
            var reg = /^(http:\/\/|https:\/\/)/;
            if (reg.test(url)) {
                return url;
            } else {
                return imghost + url;
            }
            
        };
        //格式化日期
        $rootScope.formatDate = function (str, format) {
            if (!format || format == "") {
                format = "YYYY-MM-DD";
            }
            str = moment(str).format(format);
            if (str == "Invalid date") str = "";
            return str;
        };
        //跳到登录
        $rootScope.gotoLogin = function (change) {
            //if (isWeixin() && change != "changeaccount") {
            //    window.location.href = wxloginUrl + encodeURIComponent(window.location.href);
            //} else {
                if (isApp()) {
                    appLogin({});
                } else {
                    window.location.href = ngSettings.loginUrl + encodeURIComponent(window.location.href);
                }
            //}
        };
        //跳到我的订单
        $rootScope.gotoMyOrder = function () {
            window.location.href = '/views/my-order.html';
        };
        // $rootScope.gotoInvoice = function () {
        //     window.location.href = invoiceUrl;
        // };
        //是否登录,用于显示我的订单或登录的切换
        if (authService.authentication && authService.authentication.mt_uid) {
            $rootScope.logined = true;
        } else {
            $rootScope.logined = false;
        };
        //toast消息全局配置
        $rootScope.toasterOptions = { "limit": 1, "time-out": 3000, "position-class": "toast-center", "icon-class": "", "newest-on-top": true, "body-output-type": "trustedHtml" };
    }
]);
//统一对api请求注入Authorization信息
App.factory("authInterceptorService", [
    "$q",
    "ngSettings",
    "$cookies",
    function ($q, ngSettings, $cookies) {
        var localStorageKey = ngSettings.authorizationData;
        var authInterceptorServiceFactory = {};
        var _request = function (config) {
            config.headers = config.headers || {};
            //var authData = null;
            //var encodeData = window.localStorage.getItem(localStorageKey);
            //if (encodeData) {
            //    authData = JSON.parse(base64.decode(encodeData));
            //}
            var mt_uid = $cookies.get("mt_uid");
            var mt_uname = $cookies.get("mt_uname");
            if (mt_uid) {
                config.headers.Authorization = "Bearer " + mt_uid;
            }
            return config;
        }
        var _responseError = function (rejection) {
            return $q.reject(rejection);
        }
        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;
        return authInterceptorServiceFactory;
    }
]);
App.filter('showInt',function(){
    return function(input){
        var intValue = parseInt(input);
       
        return intValue;
    }
});
App.factory("authService", [
    "$http",
    "$q",
    "ngSettings",
    "$uibModal",
    "$cookies",
    function ($http, $q, ngSettings, $uibModal, $cookies) {
        //var localStorageKey = ngSettings.authorizationData;
        //var serviceBase = ngSettings.apiServiceBaseUri;
        var authServiceFactory = {};
        var _authentication = {
            mt_uid: "",
            mt_uname: ""
        };
        var _fillAuthData = function () {
            var mt_uid = $cookies.get("mt_uid");
            var mt_uname = $cookies.get("mt_uname");            
            if (mt_uid) {
                _authentication.mt_uid = mt_uid;
                _authentication.mt_uname = mt_uname;
            } else {
                var html = document.getElementsByTagName("html")[0];
                if (html.getAttribute("no-auth") != "true") {
                    //if (isWeixin()) {
                    //    window.location.href = wxloginUrl + encodeURIComponent(window.location.href);
                    //} else {
                        if (isApp()) {
                            appLogin({});
                        } else {
                            window.location.href = ngSettings.loginUrl + encodeURIComponent(window.location.href);
                        }
                    //}
                }
            }

        };

        //authServiceFactory.login = _login;
        //authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        //authServiceFactory.logOutFromServer = _logOutFromServer;    
        return authServiceFactory;
    }
]);
//api请求
App.factory("apiService", [
    "$http",
    "$q",
    "ngSettings",
    "authService",
    "modalService",    
    "Upload",
    function ($http, $q, ngSettings, authService, modalService,Upload) {
        var serviceBase = ngSettings.apiServiceBaseUri;
        var apiServiceFactory = {};
        function changeApi(api) {
            var url = api;
            var reg = /^(http:\/\/|https:\/\/)/;
            if (reg.test(api)) {
                url = api;
            } else {
                url = serviceBase + api;
            }
            return url;
        }
        var _post = function (api, postData) {
            api += (/\?/.test(api) ? "&" : "?") + "ran=" + Math.random();
            var deferred = $q.defer();
            var url = changeApi(api);
            $http.post(url, postData).success(function (response) {
                _errAuth(response);
                deferred.resolve(response);
            }).error(function (data, status) {
                //请求出错
            });
            return deferred.promise;
        };
        var _get = function (api, params) {
            if (params) {
                api += (/\?/.test(api) ? "&" : "?") + toUrlQuery(params);
            }
            api += (/\?/.test(api) ? "&" : "?") + "ran=" + Math.random();
            var deferred = $q.defer();
            var url = changeApi(api);
            $http.get(url).success(function (response) {
                _errAuth(response);
                deferred.resolve(response);
            }).error(function (data, status) {
                //请求出错
            });
            return deferred.promise;
        }
        /*
        * 参数apis是一个对象数组
        * var apis = [
        *        {method:"GET",url:"api/adminGroup/groupType"},
        *       {method:"POST",url:"api/adminGroup/query",postData:{}}
        *    ];
        */
        var _getAll = function (apis) {
            var promises = [];
            angular.forEach(apis, function (api) {
                if (api.method.toUpperCase() == "GET") {
                    promises.push(_get(api.url));
                } else if (api.method.toUpperCase() == "POST") {
                    promises.push(_post(api.url, api.postData));
                } else if (api.method.toUpperCase() == "PUT") {
                    promises.push(_put(api.url, api.postData));
                } else if (api.method.toUpperCase() == "DELETE") {
                    promises.push(_delete(api.url));
                }
            });
            return $q.all(promises);
        }
        var _put = function (api, postData) {
            api += (/\?/.test(api) ? "&" : "?") + "ran=" + Math.random();
            var deferred = $q.defer();
            var url = changeApi(api);
            $http.put(url, postData, { "headers": { "Content-Type": "text/plain;charset=UTF-8" } }).success(function (response) {
                _errAuth(response);
                deferred.resolve(response);
            }).error(function (data, status) {
                //请求出错
            });
            return deferred.promise;
        }
        var _delete = function (api) {
            api += (/\?/.test(api) ? "&" : "?") + "ran=" + Math.random();
            var deferred = $q.defer();
            var url = changeApi(api);
            $http.delete(url).success(function (response) {
                _errAuth(response);
                deferred.resolve(response);
            }).error(function (data, status) {
                //请求出错
            });
            return deferred.promise;
        }
        var _upload = function (files) {
            var promises = [];
            var deferred = $q.defer();
            angular.forEach(files, function (file) {
                promises.push(Upload.upload({
                    url: uploadService + '/sale-upload',
                    data: {
                        image: file
                    }
                }));                
            });
            deferred.resolve(promises);
            return deferred.promise;
        }   
        var _errAuth = function (response) {
            if (!response.success && (response.code == 401)) {
                modalService.openMsgDialog(["身份验证失败", "请重新登录"], function () {
                 //   authService.logOut();                    
                    //if (isWeixin()) {
                    //    window.location.href = wxloginUrl + encodeURIComponent(window.location.href);
                    //} else {
                        if (isApp()) {
                            appLogin({});
                        } else {
                            window.location.href = ngSettings.loginUrl + encodeURIComponent(window.location.href);
                        }
                    //}
                });
            } else if (!response.success) {
                var msg = response.message;
                if (!msg) {
                    msg = "未知错误";
                }
                modalService.openMsgDialog(msg);
            }
        }
       
        apiServiceFactory.post = _post;
        apiServiceFactory.get = _get;
        apiServiceFactory.put = _put;
        apiServiceFactory.delete = _delete;
        apiServiceFactory.getAll = _getAll;   
        apiServiceFactory.upload = _upload;
        return apiServiceFactory;
    }
]);
////公用弹窗
App.factory("modalService", [
    "$uibModal",
    function ($uibModal) {
        return {
            openMsgDialog: function (msg, ok, close) {
                $uibModal.open({
                    templateUrl: '/modal-alert.html',
                    controller: ["$scope", function ($scope) {
                        $scope.showOkBtn = false;
                        if (ok) {
                            $scope.showOkBtn = true;
                        }
                        $scope.messages = [];
                        if (angular.isArray(msg)) {
                            $scope.messages = msg;
                        } else if (angular.isObject(msg)) {
                            angular.forEach(msg, function (val, key) {
                                if (angular.isArray(val)) {
                                    angular.forEach(val, function (v, k) {
                                        $scope.messages.push(v);
                                    });
                                }
                            });
                        } else {
                            $scope.messages = [msg];
                        }
                        $scope.ok = function () {
                            if (ok) {
                                ok();
                            }
                            $scope.$dismiss();
                        }
                    }]
                });
            },
        };
    }
]);
//下拉加载更多
App.factory('moreDatas', [
    "apiService",
    "$timeout",
    function (apiService, $timeout) {
        var moreDatas = function (url, jsonParas) {
            this.items = [];
            this.busy = false;
            this.pageindex = 1;
            this.loadcomplete = false;
            this.url = url;
            this.jsonParas = jsonParas;
            this.handlers = [];
            this.first = true;
            this.totalCount = 0;
        };
        moreDatas.prototype = {
            constructor: moreDatas,//手动指定constructor为EventTarget  
            addHandler: function (type, handler) {//添加一个事件处理器  
                if (typeof this.handlers[type] == "undefined") {
                    this.handlers[type] = [];
                }
                this.handlers[type].push(handler);
            },
            fire: function (event) {//触发事件  
                if (!event.target) {
                    event.target = this;
                }
                if (this.handlers[event.type] instanceof Array) {
                    var handlers = this.handlers[event.type];
                    for (var i = 0, len = handlers.length; i < len; i++) {
                        handlers[i](event);
                    }
                }
            },
            removeHandler: function (type, handler) {//删除事件处理器  
                if (this.handlers[type] instanceof Array) {
                    var handlers = this.handlers[type];
                    for (var i = 0, len = handlers.length; i < len; i++) {
                        if (handlers[i] === handler) {
                            break;
                        }
                    }
                    handlers.splice(i, 1);//删除指定的handler处理器  
                }
            },
            nextPage: function () {
                if (this.loadcomplete) return;
                if (this.busy) return;
                this.busy = true;
                this.jsonParas.page = this.pageindex;
                
                if (this.jsonParas.method == "POST") {
                    var postData = angular.copy(this.jsonParas);
                    delete postData.method;
                    apiService.post(this.url, this.jsonParas).then(function (result) {
                        if (result.success) {
                            this.totalCount = result.data.totalCount;
                            
                            setData.bind(this)(result.data.list, this.totalCount);
                        } else {
                            this.loadcomplete = true;
                            this.first = false;
                        }
                    }.bind(this));
                } else {
                    apiService.get(this.url, this.jsonParas).then(function (result) {
                        if (result.success) {
                            this.totalCount = result.data.totalCount;
                            setData.bind(this)(result.data.list, this.totalCount);
                        } else {
                            this.loadcomplete = true;
                            this.first = false;
                            //$timeout(function () {
                            //    this.busy = false;
                            //}.bind(this), 8000);
                        }
                        //$scope.$apply();
                    }.bind(this));
                }
                function setData(list, totalCount) {                    
                    var totalPage = 1;
                    var pagesize = 6;
                    if (totalCount % pagesize > 0) {
                        totalPage = parseInt(totalCount / pagesize) + 1;
                    } else {
                        totalPage = parseInt(totalCount / pagesize);
                    }
                    if (list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            this.items.push(list[i]);
                            this.fire({ type: "itemschange", args: list[i] });
                        }
                        this.pageindex++;
                        if (this.pageindex > totalPage) {
                            this.loadcomplete = true;
                        }
                    } else {
                        this.loadcomplete = true;
                    }
                    this.fire({ type: 'listLoadComplete', data: this });
                    this.busy = false;
                    this.first = false;
                }
            },
            refreshPage: function () {
                if (this.busy) return;
                this.busy = true;
                var jsonParas = angular.copy(this.jsonParas);
                if (this.pageindex > 1) {
                    jsonParas.page = this.pageindex - 1;
                }
                else {
                    jsonParas.page = 1;
                }
                if (this.jsonParas.method == "POST") {
                    apiService.post(this.url, jsonParas).then(function (result) {
                        if (result.success) {
                            this.totalCount = result.data.totalCount;
                            checkData.bind(this)(result.data.list, this.totalCount);
                        }
                    }.bind(this));
                } else {
                    apiService.get(this.url, jsonParas).then(function (result) {
                        if (result.success) {
                            this.totalCount = result.data.totalCount;
                            checkData.bind(this)(result.data.list, this.totalCount);
                        }
                    }.bind(this));
                }
                function checkData(list, totalPage) {
                    if (list.length > 0) {
                        var item = list[list.length - 1];
                        var isExist = false;
                        for (var i = 0; i < this.items.length; i++) {
                            if (this.items[i].id == item.id) {
                                isExist = true;
                                break;
                            }
                        }
                        if (!isExist) {
                            this.items.push(item);
                        }
                    }
                    this.busy = false;
                    this.first = false;
                }
            }
        };


        return moreDatas;
    }]);
App.run([
      '$templateCache',
      function ($templateCache) {
          $templateCache.put('/modal-alert.html', '<div class="modal-body"><p class="modal-msg" ng-repeat="msg in messages">{{msg}}</p></div><div class="modal-footer clearfix" ng-if="showOkBtn"><span ng-click="ok()" class="confirm-common-btn" ng-if="showOkBtn">确定</span><span ng-if="showOkBtn" class="close-common-btn" ng-click="$dismiss()" style="width:50%">关闭</span></div><div class="modal-footer clearfix" ng-if="!showOkBtn" style="height:60px"><span class="close-common-btn" ng-click="$dismiss()" style="width:100%">关闭</span></div>');
      }
]);
App.filter('trustHtml', ['$sce',function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
}]);
//微信分享
App.factory('wxShare', [
    'apiService',
    '$timeout',
    function (apiService, $timeout) {
        var shareTitle, shareLink, shareImg, shareDesc, shareSignUrl;
        var wxShare= {};
        function _config() {
            var url = shareLink;
            if (shareSignUrl) {
                url = shareSignUrl;
            } 
            if (!url) {
                url = window.location.href;
            }
            apiService.get("/adaptation/wx-config", { url: url }).then(function (res) {
                if (res.success) {
                    wx.config({
                        debug: false,
                        appId: res.data.appId,
                        timestamp: res.data.timestamp,
                        nonceStr: res.data.nonceStr,
                        signature: res.data.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'hideOptionMenu','showAllNonBaseMenuItem']
                    });
                }
            });
        }
        function _ready() {
            wx.ready(function () {
                wx.showAllNonBaseMenuItem();
                //分享到朋友圈
                wx.onMenuShareTimeline({
                    title: shareTitle,
                    link: shareLink,
                    imgUrl: shareImg,
                    success: function () { },
                    cancel: function () { }
                });
                //分享组朋友
                wx.onMenuShareAppMessage({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: shareLink, // 分享链接
                    imgUrl: shareImg, // 分享图标                               
                    success: function () { },
                    cancel: function () { }
                });
                //分享到QQ
                wx.onMenuShareQQ({
                    title: shareTitle, // 分享标题
                    desc: shareDesc, // 分享描述
                    link: shareLink, // 分享链接
                    imgUrl: shareImg, // 分享图标
                    success: function () { },
                    cancel: function () { }
                });
            });
        }
        function _init(title, link, img, desc, signUrl) {
            shareTitle = title;
            shareLink = link;
            shareImg = img;
            shareDesc = desc;
            shareSignUrl = signUrl;
            _ready();
            _config();
        }    
        function _hideOptionMenu() {
            wx.ready(function () {
                //隐藏微信右上角菜单
                wx.hideOptionMenu();
            });
        }        
        wxShare.init = _init;
        wxShare.config = _config;
        wxShare.hideOptionMenu = _hideOptionMenu;
        return wxShare;
        
}]);