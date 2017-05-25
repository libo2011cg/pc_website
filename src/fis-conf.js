/*
*配置发布规则
*/
fis.set("project.charset", "utf8");
//资源不想被构建
fis.set("project.ignore", [
  "/fis3_release.bat",
  "/fis-conf.js",
  "/README.md",
  "/说明.txt",
  "/assets/lib/fonts/fonts/demo.css",
  "/assets/lib/fonts/fonts/demo_fontclass.html",
  "/assets/lib/fonts/fonts/iconfont.css",
  "/assets/lib/fonts/fonts/iconfont.js",
  "/assets/lib/angular/**",
  "/assets/lib/moment/**",
  "/config/**",
  "/assets/static/css/**",
  "/assets/static/js/ctrl/**",

]);
fis.match("::package", {
    postpackager: fis.plugin("loader"),
    spriter: fis.plugin("csssprites")
});
//第三方类库引用
fis.match("{/assets/lib/bootstrap/css/bootstrap.min.css,/assets/lib/angular/angular-loading-bar/loading-bar.min.css,/assets/lib/fonts/css/fonts.css,/assets/lib/angular/toaster/toaster.min.css}", {
    packTo: "/assets/lib/lib.css",
    optimizer: null
});
fis.match("{/assets/lib/angular/angular.min.js,/assets/lib/angular/i18n/angular-locale_zh-cn.js,/assets/lib/angular/angular-animate.min.js,/assets/lib/angular/angular-sanitize.min.js,/assets/lib/angular/angular-cookies.min.js,/assets/lib/angular/ng-infinite-scroll.min.js,/assets/lib/angular/toaster/toaster.min.js,/assets/lib/angular/angular-loading-bar/loading-bar.min.js,/assets/lib/angular/ng-file-upload/ng-file-upload.min.js,/assets/lib/moment/moment.min.js,/assets/lib/moment/zh-cn.js,/assets/lib/angular/ui-bootstrap-tpls-2.1.3.min.js}", {
    packTo: "/assets/lib/lib.js",
    optimizer: null,
});

////排序CSS
fis.match("/assets/lib/bootstrap/css/bootstrap.min.css", {
    packOrder: -500
});
fis.match("/assets/lib/angular/angular-loading-bar/loading-bar.min.css", {
    packOrder: -490
});
fis.match("/assets/lib/fonts/css/fonts.css", {
    packOrder: -480
});
fis.match("/assets/lib/angular/toaster/toaster.min.css", {
    packOrder: -470
});



////排序JS
fis.match("/assets/lib/angular/angular.min.js", {
    packOrder: -1200
});
fis.match("/assets/lib/angular/i18n/angular-locale_zh-cn.js", {
    packOrder: -1100
});
fis.match("/assets/lib/angular/angular-animate.min.js", {
    packOrder: -1000
});
fis.match("/assets/lib/angular/angular-sanitize.min.js", {
    packOrder: -900
});
fis.match("/assets/lib/angular/angular-cookies.min.js", {
    packOrder: -800
});
fis.match("/assets/lib/angular/ng-infinite-scroll.min.js", {
    packOrder: -700
});
fis.match("/assets/lib/angular/toaster/toaster.min.js", {
    packOrder: -600
});
fis.match("/assets/lib/angular/angular-loading-bar/loading-bar.min.js", {
    packOrder: -500
});
fis.match("/assets/lib/angular/ng-file-upload/ng-file-upload.min.js", {
    packOrder: -400
});

fis.match("/assets/lib/moment/moment.min.js", {
    packOrder: -300
});
fis.match("/assets/lib/moment/zh-cn.js", {
    packOrder: -200
});
fis.match("/assets/lib/angular/ui-bootstrap-tpls-2.1.3.min.js", {
    packOrder: -100
});


////开发样式和JS
fis.match("/assets/static/css/**.css", {
    useSprite: true,
    packTo: "/assets/static/all.css",
    optimizer: fis.plugin("clean-css"),
    
});
fis.match("/assets/static/js/**.js", {
    optimizer: fis.plugin("uglify-js"),
    packTo: "/assets/static/all.js",
});
fis.match("/assets/static/all.{css,js}", {
    useHash: true    
});
//fis.match('**.html', {
//    //invoke fis-optimizer-html-compress
//    optimizer: fis.plugin('html-compress')
//});
fis.match('**.html', {
    //invoke fis-optimizer-html-minifier
    optimizer: fis.plugin('html-minifier', { removeComments: true })
});
fis.match("**.png", {    
    optimizer: fis.plugin("png-compressor")
});

//调整先后顺序
fis.match("/assets/static/js/function.js", {
    packOrder: -200
});

fis.match("/assets/static/js/common.js", {
    packOrder: -100
});
fis.match("/assets/static/css/style.css", {
    packOrder: -100
});


//直接执行fis3 release后，不用指定路径，自动发布到指定目录
fis.match('**', {
    deploy: [
        fis.plugin("skip-packed"),
        fis.plugin('local-deliver', {
            to: '../dist'
        })
    ]
});