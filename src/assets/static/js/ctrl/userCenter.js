/**
 * Created by libo on 2017/6/2.
 */
$(function () {
   toggleCourse();  //免费课程和已购课程的显示切换
});


/*免费课程和已购课程的显示切换*/
function toggleCourse() {
    $('.course-tab li').on('click', function () {
        var i = $(this).index();//下标第一种写法
        $(this).addClass('active').siblings().removeClass('active');
        $('#course_dv .course-list').eq(i).show().siblings().hide();
    })
}