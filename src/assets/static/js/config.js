/**
 * Created by libo on 2017/5/31.
 */

/*var serviceBase = "http://test.new.mtedu.com";
var imghost = "http://cdn.img.mtedu.com";
var loginUrl = "http://test.pass.mtedu.com:8080/mobile/login?backurl=";//"http://test.pass.mtedu.com:8080/mobile/login?backurl="
var courseUrl = "http://test.live.mtedu.com/assignmentnew/v2/";
var uploadService = "http://upload.image.mtedu.com";
var appApiBase = "http://test.app.api.mtedu.com/v1";*/

var passUrl = 'http://pass.mtedu.com';
var baseUrl = 'http://test.pass.mtedu.com';
var urlConfig = {
    getCode:passUrl+'/register.vcode',          //获取验证码
    login:passUrl+'/v3/user/login_web',         //登录
}