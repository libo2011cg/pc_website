/**
 * Created by libo on 2017/5/25.
 */
$(function () {
    courseSlide();  //顶部课程轮播图
    getCourseList(1);    //查询课程列表数据
})

/*顶部课程轮播图*/
function courseSlide() {
    var mySwiper = new Swiper ('.swiper-container', {
        freeMode:true,
        width: 1100,
        nextButton: '.swiper-button-next',      //下一张按钮
        prevButton: '.swiper-button-prev',      //上一张按钮
        pagination: '.swiper-pagination',       //分页器
        effect : 'slide',                       //切换效果
        slidesPerView:1,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 3000,                         //播放间隔
        autoplayDisableOnInteraction: false,
        loop:true
    });
    $('.swiper-slide').css('width','1000px');
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


/*查询课程列表数据-调用后台接口*/
function getCourseList(currentPage) {
    $.ajax({
        url:'course.json',
        type:'get',
        dataType:'json',
        data:{},
        success:function (res) {
            var courseList = res.data.slice((currentPage-1)*10,currentPage*10)
            var totalPage = res.totalPage;
            var html = ''
            for(var i =0;i<courseList.length; i++){
                var item = courseList[i]
                html += '<tr><td>'+item.name+'</td><td>'+item.age+'</td></tr>';
                $('#data').html(html)
            }

            //修改部分参数
            $('#page').createPage(function(currentPage){
                getCourseListByPage(currentPage)
            },{
                pageCount:totalPage,//总页码,默认10
                showPrev:true,//是否显示上一页按钮
                showNext:true,//是否显示下一页按钮
                showTurn:false,//是否显示跳转,默认可以
                showNear:2,//显示当前页码前多少页和后多少页，默认2
                showSumNum:false//是否显示总页码
            },{
                "color":"#656565",//字体颜色
                "borderColor":"transparent",//边线颜色
                "currentColor":"#44C08C",//当前页码的字体颜色
                "disableBackColor":"transparent"//不可点击按钮的背景色
            });
        }
    })
}


function getCourseListByPage(currentPage) {
    $.ajax({
        url:'course.json',
        type:'get',
        dataType:'json',
        data:{},
        success:function (res) {
            var courseList = res.data.slice((currentPage-1)*10,currentPage*10)
            var totalPage = res.totalPage;
            var html = ''
            for(var i =0;i<courseList.length; i++){
                var item = courseList[i]
                html += '<tr><td>'+item.name+'</td><td>'+item.age+'</td></tr>';
                $('#data').html(html)
            }
        }
    })

}