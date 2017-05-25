/**
 * Created by libo on 2017/5/25.
 */
$(function () {
    courseSlide();  //顶部课程轮播图
})

/*顶部课程轮播图*/
function courseSlide() {
    var mySwiper = new Swiper ('.swiper-container', {
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
    document.getElementsByClassName('swiper-slide').style.width = '1000px'
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