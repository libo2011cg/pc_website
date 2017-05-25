$(function () {
    topVideo(); //播放顶部视频
    masterSlide();  //互联网大咖轮播图
    playMasterVideo();
    videoWindow();  //视频播放弹窗的打开与关闭
    appDownload();  //点击APP下载，弹窗
});


/*顶部视频*/
function topVideo() {
    /*获取到视频对象*/
    var video = document.querySelector('.top-video');
    /*1.当能播放的时候  显示播放器，知道视频的总时长，设置播放总时长*/
    video.oncanplay = function(){
        /*显示播放器*/
        video.style.display = "block";
    }
}

/*互联网大咖轮播图*/
function masterSlide() {
    var mySwiper = new Swiper ('.swiper-container', {
        nextButton: '.swiper-button-next',      //下一张按钮
        prevButton: '.swiper-button-prev',      //上一张按钮
        pagination: '.swiper-pagination',       //分页器
        effect : 'slide',                       //切换效果
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: 5000,                         //播放间隔
        autoplayDisableOnInteraction: false,
        loop:true
    });
    $(".swiper-container").animate({
        "display" : "block"
    },3000);
    //鼠标经过，禁止滑动
    $('.swiper-container').mouseenter(function () {
        mySwiper.stopAutoplay();
    }).mouseleave(function () {
        mySwiper.startAutoplay();
    });
}

/*视频播放弹窗的打开与关闭*/
function videoWindow() {
    /*点击弹窗播放视频-互联网大咖和线上线下部分*/
    var video = document.getElementById('video_box').querySelector('video');
    $('.master-video, .story-ideo').click(function () {
        video.src = $(this).data('video');
        $('#myshade').height($(document).height()+'px');
        $('#myshade').show();
        $('#video_box').show();
        //播放视频
        video.play();
        $('#video_box .switch').toggleClass('fa-pause');
    });
    /*关闭视频播放弹窗*/
    $('#close_video').click(function () {
        video.pause();
        video.onended();
        $('#myshade').hide();
        $('#video_box').hide();
    });
}

/*点击APP下载，弹窗*/
function appDownload() {
    $('#app_download').click(function () {
        $('#myshade').height($(document).height()+'px');
        $('#myshade').show();
        $('#download_window').show();
        /*关闭弹窗*/
        $('#download_window').click(function () {
            $('#myshade').hide();
            $('#download_window').hide();
        });
    });
}
        
/*播放互联网大咖视频*/
function playMasterVideo() {
    /*获取到视频对象*/
    var video = document.getElementById('video_box').querySelector('video');
    /*获取到一系列操作dom*/
    var $btn = $('#video_box .switch');
    var $full = $('#video_box .expand');
    var $bar = $('#video_box .bar');
    var $line = $('#video_box .line');
    var $currTime = $('#video_box .current');
    var $countTime = $('#video_box .total');

    /*格式化时间*/
    var getFormatTime = function(time){
        var time = time || 0;/*00:00:00*/
        var h = Math.floor(time/3600);
        var m = Math.floor(time%3600/60);
        var s = Math.floor(time%60);

        return (h<10?'0'+h:h)+':'+(m<10?'0'+m:m)+':'+(s<10?'0'+s:s);
    };

    /*1.当能播放的时候  显示播放器，知道视频的总时长，设置播放总时长*/
    video.oncanplay = function(){
        /*显示播放器*/
        video.style.display = "block";
        /*设置播放总时长*/
        $countTime.html(getFormatTime(video.duration));
    }

    /*2.播放*//*3.暂停*/
    $btn.on('click',function(){
        /*判断视频的播放状态*/
        if(video.paused){
            video.play();
        }else{
            video.pause();
        }
        /*把按钮变成暂停*/
        $btn.toggleClass('fa-pause');
    });

    /*4.显示播放进度*/
    video.ontimeupdate = function(){
        /*当前时间除以总时长 百分比的格式*/
        var pre = video.currentTime/video.duration * 100 +'%';
        /*设置进度条的宽度*/
        $line.css('width',pre);
        /*显示当前播放的时间*/
        $currTime.html(getFormatTime(video.currentTime));
    }

    /*5.全屏*/
    $full.on('click',function(){
        /*使元素全屏的api*/
        video.webkitRequestFullScreen();
    });

    /*6.跃进播放*/
    $bar.on('click',function(e) {
        /*比例*/
        var scale = e.offsetX / $bar.width();
        /*需要去的时间*/
        var currTime = scale * video.duration;
        /*设置*/
        video.currentTime = currTime;
    });

    /*7.播放结束重置视频*/
    video.onended = function(){
        /*重置按钮*/
        $btn.removeClass('fa-pause');
        /*进度条*/
        $line.css('width','0px');
        /*当前时间*/
        $currTime.html(getFormatTime());/*00:00:00*/
        /*回到起始的画面*/
        video.currentTime = 0;
    }
}

