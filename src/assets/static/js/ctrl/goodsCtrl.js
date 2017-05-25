//商品详情页
App.controller("goodsCtrl", [
    "$scope",
    "apiService",
    "toaster",
    "authService",
    "$interval",
    "wxShare",
    "$cookies",
    "moreDatas",
    "$uibModal",
    "$rootScope",
    function ($scope, apiService, toaster, authService, $interval, wxShare,$cookies,moreDatas,$uibModal,$rootScope) {

        //设置初始值
        $scope.goodsModel = {};
        $scope.goodsSales = [];
        $scope.courseInfo = [];
      
        $scope.goodsId = getQueryString("id");
        $scope.channel_code = getQueryString("f");
        $scope.isApp = isApp();
        //在app内不显示我的订单头部
           if (isApp()) {
            $scope.isHead = false;
           }else{
            $scope.isHead = true;
           }
        //获取商品详情
        $scope.getGoodsDetail = function () {
            apiService.get('/goods/detail', { goods_id: $scope.goodsId }).then(function (res) {
                angular.element(document.querySelectorAll(".ngCloak")).removeClass("ngCloak");
                if (res.success) {
                    if (res.data.code==404) {
                            $scope.msg = res.data.message;
                            var modalInstance = $uibModal.open({
                            templateUrl: '/course-info.html',
                            size: 800,
                            backdrop :"static",
                            controller: ["$scope","$uibModalInstance","msg",function ($scope,$uibModalInstance,msg) {
                                $scope.msg = msg;
                                $scope.close = function () {
                                    if (isApp()) {
                                        appClose({});
                                    }else{
                                        $uibModalInstance.dismiss();
                                    }
                                   
                                };
                            }],
                            resolve: {
                                msg:function(){
                                    return $scope.msg;
                                }
                            } 
                        });
                        return;
                    }
                    if (isApp()) {
                        appSetTitle({title:res.data.goods.name});
                    }
                    $scope.goodsModel = res.data.goods;
                    $scope.orderNo = $scope.goodsModel.order_no;
                    $scope.goodsOldSales = $scope.goodsModel.goods_old_sales_info;
                    $scope.goodsSales = $scope.goodsModel.goods_sales_info;
                    $scope.user = $scope.goodsModel.user_info;
                    $scope.courseInfo = $scope.goodsModel.course_info;
                    $scope.goodsModel.ori_real_price = $scope.goodsModel.real_price;
                    //拼团信息
                    $scope.group_buy_info = $scope.goodsModel.group_buy_info;
                    //模板页
                    //if ($scope.goodsModel.real_price == 0 && $scope.goodsModel.template_type == 1) {
                    //    window.location.href = "/views/goods-template.html?goods_id=" + $scope.goodsId + "&course_id=" + $scope.goodsModel.course_info[0].id + "channel_code=" + ($scope.channel_code ? $scope.channel_code : "");
                    //    return;
                    //}
                    //微信分享
                    var shareTitle = $scope.goodsModel.share_title;
                    var shareImg = $rootScope.getImg($scope.goodsModel.share_img);
                    var shareDesc = '明明可以靠颜值吃饭，可我还在馒头学习。沉迷学习，日渐升值（职）';
                    var shareLink = window.location.href;
                    if (isApp()) {
                        window.getShareInfo = function () {
                            if (isAndroid()) {
                                return {
                                    "shareTitle": shareTitle,
                                    "shareContent": shareDesc,
                                    "shareUrl": shareLink,
                                    "shareImg": shareImg
                                };
                            }
                            else {
                                return JSON.stringify({
                                    "shareTitle": shareTitle,
                                    "shareContent": shareDesc,
                                    "shareUrl": shareLink,
                                    "shareImg": shareImg
                                });
                            }
                        };
                    }
                    if (shareTitle == "") {
                        shareTitle = $scope.goodsModel.name;
                    }
                    if (shareImg == "") {
                        shareImg = $scope.goodsModel.goods_cover;
                    }

                    wxShare.init(shareTitle, shareLink, shareImg, shareDesc);
                    if ($scope.goodsSales) {
                        //计算折扣扣的最低价
                        if ($scope.goodsSales.discount_type == 1) {
                            $scope.salePrice = $scope.goodsModel.real_price - ($scope.goodsModel.real_price * $scope.goodsSales.value / 10);
                            $scope.goodsModel.real_price = $scope.goodsModel.real_price * $scope.goodsSales.value / 10;
                        }
                        if ($scope.goodsSales.discount_type == 2) {
                            $scope.salePrice = $scope.goodsSales.value;
                            $scope.goodsModel.real_price = $scope.goodsModel.real_price - $scope.goodsSales.value;
                        }
                        if ($scope.goodsModel.real_price < 0) { $scope.goodsModel.real_price = 0 }

                        //促销倒计时
                        var timer = $interval(function run() {
                            var end_time = moment($scope.goodsSales.end_time);
                            var now = moment();
                            var seconds = end_time.diff(now, "seconds");
                            if (seconds <= 0) {
                                $interval.cancel(timer);
                            }
                            $scope.countdownTimer = calculateTime(seconds);
                        }, 1000);
                    };
                }

                if (res.data && res.data.assignments) {
                    $scope.assignments = res.data.assignments.assignments;
                    $scope.signUp = res.data.assignments.signUp;
                    $scope.signUserInfo = $scope.assignments.signUserInfo;
                    var assignmentEndTime = $scope.assignments.endTime;
                    var now = moment().format('X');
                    if (assignmentEndTime < now) {
                        //已结束
                        $scope.isEnd = true;
                    }else{
                        $scope.isEnd = false;
                    }
                    // console.log(assignmentEndTime.format('HH:mm:ss'));                   
                    // console.log(now);
                }

            })
        };
         function calculateTime(seconds) {
            var day = parseInt(seconds / (24 * 60 * 60));
            var hour = parseInt((seconds % (24 * 60 * 60)) / (60*60));
            var minute = parseInt(((seconds % (24 * 60 * 60)) % (60 * 60)) / 60);
            var second = ((seconds % (24 * 60 * 60)) % (60 * 60)) % 60;
            if (day <= 0 && hour <= 0 && minute <= 0 && second <= 0) {
                return "00:00:00";
            } else {
                if (minute < 10) { minute = "0" + minute; }
                if (second < 10) { second = "0" + second; }
                return '还剩'+(day > 0 ? day + "天" : "") + hour + "时" + minute + "分" + (day>0?'':second+'秒');
            }
        };
        //开关闭咨询
        $scope.openQr = function () {
            $scope.maskOpened = { display: "block" };
            $scope.qrLayerClass = "fadeIn in";
        };
        $scope.closeQr = function () {
            $scope.maskOpened = { display: "none" };
            $scope.qrLayerClass = "fadeOut";
        };
        //tel
        $scope.tel = function (phone) {
            if (isApp()) {
                appCallTel({ "tel": phone });
            } else {
                window.location.href = "tel:" + phone;
            }
        }
        //老会员说明
        $scope.openOldMember = function(event){
            event.stopPropagation();
            var modalInstance = $uibModal.open({
                templateUrl: '/old-member-remark.html',
                controller: ["$scope", function ($scope) {
                }],
                windowClass: "coupon-remark",
                resolve: {
                }
            });
        };
        //查看课程
        $scope.lookCourse = function(){
            var len = $scope.courseInfo.length;
            if (isApp()) {
                var jsonData = {};
                if (len==1) {
                    var assignmentId = $scope.courseInfo[0].id;
                    jsonData = {
                        "type": "assignmentCourse",
                        "params": {
                            "assignmentId": assignmentId
                        }
                    };
                }else if (len > 1) {
                    jsonData = {
                        "type": "buyCourse",
                    };
                }
                appJump(jsonData);
            }else{
                if (len > 1) {
                    window.location.href = "/views/sign-success.html?order_no="+$scope.orderNo;
                }else if (len==1) {
                    window.location.href = courseUrl+$scope.courseInfo[0].id;
                }
               
            }
        };
        //确认购买
        $scope.gotoBuy = function () {
            //未登录时去登录,登录过跳到付费详情页
            if (!$rootScope.logined) {
                $rootScope.gotoLogin();
            } else {
                var timestamp = moment().valueOf();
                var orderData = {
                    type: 1,
                    channel_code: $scope.channel_code ? $scope.channel_code : "",
                    goods_id: $scope.goodsModel.id,
                    goods_name:$scope.goodsModel.name,
                    real_price: $scope.goodsModel.real_price,//减过优惠
                    original_price: $scope.goodsModel.original_price,
                    ori_real_price: $scope.goodsModel.ori_real_price,//未减过优惠
                    sale_price: $scope.salePrice,
                    course_info: $scope.courseInfo,
                    goods_sales_info: $scope.goodsSales,
                    ori_group_buy:$scope.group_buy_info,
                    timestamp: timestamp
                };
                //加密并在sessionStorage中存储订单数据
                var params = JSON.stringify(orderData);
                window.sessionStorage.setItem("orderData", base64.encode(params));
                window.location.href = "/pay.php";
                //window.location.href = "/views/order.html?ts=" + timestamp;
                
            }
        };
        //优惠券
        $scope.couponid =  parseInt(getQueryString('id'));
        //领取优惠券列表
        $scope.getCouponList = function(){
            $scope.couponQuery = {
                pagesize: 6,
                method: "POST",
                goods_id:$scope.goodsId,
                real_amount:$scope.goodsModel.real_price,
            };
            if (!$scope.couponListMoreDatas) {
                $scope.couponListMoreDatas = new moreDatas("/coupon/search", $scope.couponQuery);
                $scope.couponListMoreDatas.nextPage();
            }
            
            };
        //领取须知
        //打开优惠券详情
        $scope.openCouponInfo = function (item, $event) {
            $event.stopPropagation();
            var modalInstance = $uibModal.open({
                templateUrl: '/coupon-remark.html',
                controller: ["$scope", "coupon", function ($scope, coupon) {
                    $scope.remark = coupon.remark.replace(/\n+/ig, "<br/>");
                }],
                windowClass: "coupon-remark",
                resolve: {
                    coupon: function () {
                        return item;
                    }
                }
            });
        };
        //打开优惠券
        $scope.openCoupon = function(){
            $scope.getCouponList();
            $scope.maskOpened = { display: "block" };            
            $scope.couponLayerClass = "slideInUp";
        };
        //关闭优惠券
        $scope.closeCoupon = function(){
            $scope.maskOpened = { display: "none" };            
            $scope.couponLayerClass = "slideInDown";
        }
        //领取优惠券按钮
        $scope.getCoupon = function(item){
             if (!$rootScope.logined) {
                $rootScope.gotoLogin();
            } else {
                apiService.get('/user/receive-coupon',{coupon_id:item.id}).then(function(res){
                    if (res.success) {
                        toaster.pop('info', "", res.data.message);
                        item.hasCoupon=1;
                        window.location.reload();
                    }
                })
            }
        };


        //模板页部分
        //展开更多
        //$scope.ellipsis = 'ellipsis-multi';
        $scope.open = function (open) {
            if (open) {
               // $scope.ellipsis = '';
                $scope.opened = true;
            } else {
                //$scope.ellipsis = 'ellipsis-multi';
                $scope.opened = false;
            }
        };
        //计算video时间
        $scope.calculateVideoTime = function (seconds) {

            var hour = parseInt((seconds % (24 * 60 * 60)) / (60 * 60));
            var minute = parseInt(((seconds % (24 * 60 * 60)) % (60 * 60)) / 60);
            var second = ((seconds % (24 * 60 * 60)) % (60 * 60)) % 60;
            if (hour <= 0 && minute <= 0 && second <= 0) {
                return "00:00:00";
            } else {
                if (minute < 10) { minute = "0" + minute; }
                if (second < 10) { second = "0" + second; }
                return (hour > 0 ? hour + ":" : "") + minute + ":" + second;
            }
        };
        //立即报名
        $scope.gotoSign = function () {
            if (!$rootScope.logined) {
                $rootScope.gotoLogin();
            } else {
                var submitOrder = {};
                //订单提交数据
                submitOrder.type = 1;
                submitOrder.channel_code = $scope.channel_code;
                submitOrder.goods_id = $scope.goodsModel.id;
                apiService.post("/order/add", submitOrder).then(function (res) {
                    if (res.success) {
                        //0元订单
                        var order_no = res.data.order_no;
                        if (res.data.free == 1) {
                            window.location.href = "http://" + window.location.host + "/views/return-url.html?group_buy=0&order_no=" + order_no;
                        }
                    };
                })
            };
        };
        $scope.getNumer = function (index) {
            return index < 10 ? '0' + (index + 1) : (index + 1);
        }
    }
]);
