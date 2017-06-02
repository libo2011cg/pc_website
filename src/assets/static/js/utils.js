/**
 * Created by libo on 2017/5/31.
 */
(function(window){
    var base64 = {};
    base64.map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    base64.decode = function(s){
        s += '';
        var len = s.length;
        if((len === 0) || (len % 4 !== 0)){
            return s;
        }

        var pads = 0;
        if(s.charAt(len - 1) === base64.map[64]){
            pads++;
            if(s.charAt(len - 2) === base64.map[64]){
                pads++;
            }
            len -= 4;
        }

        var i, b, map = base64.map, x = [];
        for(i = 0; i < len; i += 4){
            b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i + 1)) << 12) | (map.indexOf(s.charAt(i + 2)) << 6) | map.indexOf(s.charAt(i + 3));
            x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff, b & 0xff));
        }

        switch(pads){
            case 1:
                b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12) | (map.indexOf(s.charAt(i)) << 6);
                x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff));
                break;
            case 2:
                b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12);
                x.push(String.fromCharCode(b >> 16));
                break;
        }
        return unescape(x.join(''));
    };

    base64.encode = function(s){
        if(!s){
            return;
        }

        s += '';
        if(s.length === 0){
            return s;
        }
        s = escape(s);

        var i, b, x = [], map = base64.map, padchar = map[64];
        var len = s.length - s.length % 3;

        for(i = 0; i < len; i += 3){
            b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i+1) << 8) | s.charCodeAt(i+2);
            x.push(map.charAt(b >> 18));
            x.push(map.charAt((b >> 12) & 0x3f));
            x.push(map.charAt((b >> 6) & 0x3f));
            x.push(map.charAt(b & 0x3f));
        }

        switch(s.length - len){
            case 1:
                b = s.charCodeAt(i) << 16;
                x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + padchar + padchar);
                break;
            case 2:
                b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8);
                x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + map.charAt((b >> 6) & 0x3f) + padchar);
                break;
        }
        return x.join('');
    };
    window.base64 = base64;

    var config = {}
    /*获取url参数*/
    config.getQueryString = function(key){
        var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
        var result = window.location.search.substr(1).match(reg);
        return result?decodeURIComponent(result[2]):null;
    }
    /*生成头部部分*/
    config.renderHeader = function (user) {
        var nickname = '';
        if(user){   //如果已登录
            var user = JSON.parse(base64.decode(user));
            nickname = user.nickname;
            $('#user_info').text(base64.decode(user))
            var loginDvClass = 'none';
            var userDvClass = '';
        }else {
            var loginDvClass = '';
            var userDvClass = 'none';
        }
        /*用户信息*/
        var topHtml =   '<div class="top-logo">'+
                            '<a href="/views/index.html" ></a>'+
                        '</div>'+
                        '<div class="top-title">#向所有人学习#</div>'+
                        '<div class="top-login">'+
                            '<div id="login_dv" class="'+loginDvClass+'">'+
                                '<a id="to_regist" href="javascript:;">注册</a>'+
                                '<span class="vertical-line">|</span>'+
                                '<a id="to_login" href="javascript:;">登录</a>'+
                            '</div>'+
                            '<div id="user_dv" class="'+userDvClass+'">'+
                                '<a id="user_info" class="user-name" href="javascript:;">'+nickname+'</a>'+
                                '<div class="user_info">' +
                                    '<div class="user-headimg">'+
                                        '<img src="/assets/static/images/qr-code.png" alt="">'+
                                    '</div>'+
                                    '<ul class="user-info-list none">'+
                                        '<div class="padding bgc-green"></div>'+
                                        '<li><a href="/views/user-center.html" id="top_nickname">'+nickname+'</a></li>'+
                                        '<li><a href="javascript:;">修改资料</a></li>'+
                                        '<li><a href="javascript:;">修改密码</a></li>'+
                                        '<li><a href="javascript:;" id="logout">退出</a></li>'+
                                    '</ul>'+
                                '</div>'
                            '</div>'+
                        '</div>';
        $('#user_box').html(topHtml);

        /*注册弹窗*/
         var registWindowHtml = '<div>'+
                                    '<h3>注 册</h3>'+
                                    '<span class="close fa fa-times-circle"></span>'+
                                '</div>'+
                                '<form class="info">'+
                                    '<div class="info-item">'+
                                        '<label for=""><span class="required">*</span>账号:</label>'+
                                        '<input type="text" id="regist_phone" class="w200" placeholder="请输入手机号">'+
                                        '<span class="yes c-green">√</span>'+
                                        '<span class="error-msg">请输入正确的手机号</span>'+
                                    '</div>'+
                                    '<div class="info-item">'+
                                        '<label for=""><span class="required">*</span>验证码:</label>'+
                                        '<input type="text" id="regist_code" class="w120">'+
                                        '<img id="code_img" src="/assets/static/images/verify-code.jpg" onclick="changeCode(this);">'+
                                        '<span class="yes c-green">√</span>'+
                                        '<span class="error-msg">验证码错误</span>'+
                                    '</div>'+
                                    '<div class="info-item">'+
                                        '<label for=""><span class="required">*</span>手机验证码:</label>'+
                                        '<input type="text" id="regist_phone_code" class="w120">'+
                                        '<input type="button" id="get_code_btn" value="获取" class="get-code-btn" style="cursor:pointer;">'+
                                        '<span class="yes c-green">√</span>'+
                                        '<span class="error-msg">手机验证码错误</span>'+
                                    '</div>'+
                                    '<div class="info-item">'+
                                        '<label for=""><span class="required">*</span>密码:</label>'+
                                        '<input type="password" id="regist_pwd" class="w200" placeholder="6-16位数字或字母，区分大小写">'+
                                        '<span class="yes c-green">√</span>'+
                                        '<span class="error-msg">6-16位数字或字母，区分大小写</span>'+
                                    '</div>'+
                                    '<div class="info-item">'+
                                        '<input type="button" id="regist_btn" class="regist-btn bgc-green" value="立即注册">'+
                                        '</div>'+
                                        '<div class="info-item code">'+
                                        '<p class="no-get-code"><a href="javascript:;" class="c-green">收不到验证码？</a></p>'+
                                        '<p class="login">已有账号 <a href="javascript:;" id="to_login_window" class="c-green">直接登录>></a></p>'+
                                    '</div>'+
                                    '<div class="wechat-login">'+
                                        '<img src="/assets/static/images/wechat-icon.png" alt="" />'+
                                        '<a href="javascript:;">用微信一键登录</a>'+
                                    '</div>'+
                                '</form>';
         $('#regist_window').html(registWindowHtml);

         /*登录弹窗*/
        var loginWindowHtml =   '<div>'+
                                '<h3>登 录</h3>'+
                                '<span class="close fa fa-times-circle"></span>'+
                                '</div>'+
                                '<form class="info">'+
                                '<div class="info-item">'+
                                '<label for="">账号:</label>'+
                                '<input type="text" id="login_username" class="w200" placeholder="请输入邮箱/手机号">'+
                                '<span class="yes c-green">√</span>'+
                                '<span class="error-msg">请输入正确的手机号</span>'+
                                '</div>'+
                                '<div class="info-item">'+
                                '<label for="">密码:</label>'+
                                '<input type="password" id="login_pwd" class="w200" placeholder="请输入密码">'+
                                '<span class="yes c-green">√</span>'+
                                '<span class="error-msg">6-16位数字或字母，区分大小写</span>'+
                                '</div>'+
                                '<div class="info-item code" style="width:300px;margin-left: 45px;height: 20px;">'+
                                '<p class="no-get-code">'+
                                '<input type="checkbox" checked id="rember"> <label for="rember">记住密码</label>'+
                                '</p>'+
                                '<p class="login"><a href="javascript:;" class="c-black">找回密码</a></p>'+
                                '</div>'+
                                '<div class="info-item">'+
                                '<input type="button" id="login_btn" class="regist-btn bgc-green" value="登 录">'+
                                '</div>'+
                                '<div class="info-item code" style="margin-left: 160px;">'+
                                '<p>还没有账号 <a href="javascript:;" id="to_regist_window" class="c-green">先去注册>></a></p>'+
                                '</div>'+
                                '<div class="wechat-login">'+
                                '<img src="/assets/static/images/wechat-icon.png" alt="" style="margin-left: 160px;">'+
                                '<a href="javascript:;">用微信一键登录</a>'+
                                '</div>'+
                                '</form>';
        $('#login_window').html(loginWindowHtml);

        /*下载弹窗*/
        var downloadWindow =
                            '<div class="pc-download">'+
                                '<div class="download-window-top">'+
                                    '<span class="fa fa-times-circle" id="close_download"></span>'+
                                '</div>'+
                                '<div class="iphone-code">'+
                                    '<img src="/assets/static/images/iphone-logo.png" alt="">'+
                                    '<p>iPhone用户请扫这里</p>'+
                                    '<div class="qr-code-dv">'+
                                        '<img src="/assets/static/images/pc-download-qr-code.png">'+
                                    '</div>'+
                                    '<span>*支持iOS10.1以上系统</span>'+
                                '</div>'+
                                '<div class="android-code">'+
                                    '<img src="/assets/static/images/android-logo.png" alt="">'+
                                    '<p>Android用户请扫这里</p>'+
                                    '<div class="qr-code-dv">'+
                                        '<img src="/assets/static/images/pc-download-qr-code.png">'+
                                    '</div>'+
                                    '<span>*支持Android7.0以上系统</span>'+
                                '</div>'+
                            '</div>';
        $('#download_window').html(downloadWindow);
    }
    
    window.config = config;
})(window);