/**
 * Created by libo on 2017/5/28.
 */
$(function () {
    appDownload();  //点击APP下载，弹窗
});

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