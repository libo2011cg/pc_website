/**
 * Created by libo on 2017/5/28.
 */
$(function () {
    appDownloadWindow();  //点击APP下载，弹窗
    registWindow(); //点击注册，弹窗
    loginWindow();  //点击登录，弹窗
    regist();       //点击注册按钮，注册
    login();        //点击登录按钮，登录
    getUserInfo();  //获取用户登录信息
    switchoverWindow();     //登录窗口和注册窗口的切换
    changeCode();   //更新验证码
    logout();       //点击退出按钮，退出账户
});

/*点击APP下载，弹窗*/
function appDownloadWindow() {
    $('#app_download').on('click', function () {
        $('#myshade').height($(document).height()+'px');
        $('#myshade').show();
        $('#download_window').show();
        /*关闭弹窗*/
        $('#download_window').on('click', '#close_download', function () {
            $('#myshade').hide();
            $('#download_window').hide();
        });
    });
}

/*点击注册，弹窗*/
function registWindow() {
    $('#user_box').on('click', '#to_regist', function () {
        $('#myshade').height($(document).height()+'px');
        $('#login_window').hide();
        $('#myshade').show();
        $('#regist_window').show();
        changeCode();   //更新验证码

        /*点击获取手机验证码*/
        $('#get_code_btn').click(function () {

        });

        /*关闭弹窗*/
        $('#regist_window .close').click(function () {
            $('#myshade').hide();
            $('#regist_window').hide();
        });
    });
}

/*点击登录，弹窗*/
function loginWindow() {
    $('#user_box').on('click', '#to_login', function () {
        $('#myshade').height($(document).height()+'px');
        $('#regist_window').hide();
        $('#myshade').show();
        $('#login_window').show();
        /*关闭弹窗*/
        $('#login_window .close').click(function () {
            $('#myshade').hide();
            $('#login_window').hide();
        });
    });
}

/*点击注册按钮，注册*/
function regist() {
    /*离开焦点*/
    $('#regist_window').on('blur', '#regist_phone', function () {
        checkPhone($('#regist_phone')); //校验手机号
    });
    $('#regist_window').on('blur', '#regist_pwd', function () {
        checkPwd($('#regist_pwd')); //校验密码
    });

    /*点击注册按钮*/
    $('#regist_window').on('click', '#regist_btn', function () {
        var flag1 = checkPhone($('#regist_phone')); //校验手机号
        var flag2 = checkPwd($('#regist_pwd')); //校验密码
        if(flag1 && flag2){
            alert('success')
        }
    });
}

/*点击登录按钮，登录*/
function login() {
    /*离开焦点*/
    $('#login_window').on('blur', '#login_username', function () {
        checkPhone($('#login_username')); //校验手机号
    });
    $('#login_window').on('blur', '#login_pwd', function () {
        checkPwd($('#login_pwd')); //校验密码
    });

    $('#login_window').on('click', '#login_btn', function () {
        var flag1 = checkPhone($('#login_username')); //校验手机号
        var flag2 = checkPwd($('#login_pwd')); //校验密码
        if(flag1 && flag2){
            var username = $.trim($('#login_username').val());
            var pwd = $.trim($('#login_pwd').val());
            var isRember = $('#rember').prop('checked');
            var user = JSON.stringify({
                nickname: '懒馒头111',
                phone:'15071062103'
            })
            $.cookie('user',base64.encode(user));
            if(true) {  //如果登录成功
                // var backurl = config.getQueryString('backurl');
                var backurl = window.location.href;
                if(backurl){
                    window.location.href = backurl;
                }else{
                    window.location.href = 'index.html';
                }
            }
        }
    })
}

/*获取用户登录信息*/
function getUserInfo() {
    var loginDvClass = '';
    var userDvClass = '';
    var user = $.cookie('user');
    config.renderHeader(user);
}

/*登录窗口和注册窗口的切换*/
function switchoverWindow() {
    $('#regist_window').on('click', '#to_login_window', function () {   //显示登录窗口
        $('#login_window').show();
        $('#regist_window').hide();
    });

    $('#login_window').on('click', '#to_regist_window', function () {   //显示注册窗口
        $('#login_window').hide();
        $('#regist_window').show();
    });
}

/*更新验证码*/
function changeCode() {
    $('#code_img').attr('src',urlConfig.getCode+'?r='+Math.random());
}

/*点击退出按钮，退出账户*/
function logout() {
    $('#user_box').on('click', '#logout', function () {
        $.cookie('user', '', { expires: -1 }); // 删除 cookie
        // window.location.reload()
        config.renderHeader();
    });
}

/*校验手机号*/
function checkPhone(_this) {
    var phoneRegex  = new RegExp('^1[3|4|5|7|8][0-9]{9}$');
    var value = _this.val();
    var flag = true;
    if(phoneRegex.test(value)){ //校验通过
        _this.siblings('.yes').show();
        _this.siblings('.error-msg').hide();
        flag = true;
    }else{
        _this.siblings('.yes').hide();
        _this.siblings('.error-msg').show();
        flag = false;
    }
    return flag;
}

/*校验密码*/
function checkPwd(_this) {
    var pwdRegex  = new RegExp('^[\\w!@#$%^&*?.]{6,16}$');
    var value = _this.val();
    var flag = true;
    if(pwdRegex.test(value)){ //校验通过
        _this.siblings('.yes').show();
        _this.siblings('.error-msg').hide();
        flag = true;
    }else{
        _this.siblings('.yes').hide();
        _this.siblings('.error-msg').show();
        flag = false;
    }
    return flag;
}
