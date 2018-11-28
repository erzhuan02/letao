// NProgress.start()
// NProgress.set(0.4)
// 进度条功能
// 用jq中ajax全局事件
$(document).ajaxStart(function () {
    // 开启进度条
    NProgress.start()
})
$(document).ajaxStop(function () {
    // 模拟网络延迟
    setTimeout(function () {
        // 关闭进度条
        NProgress.done()
    }, 500)
})

// 公共功能
$(function () {
    // 1.侧边栏二级菜单切换
    $('.category').click(function () {
        $(this).next().stop().slideToggle()
    })
    // 2.左侧侧边栏切换
    $('.icon_menu').click(function () {
        $('.aside').toggleClass('move')
        $('.main').toggleClass('move')
        $('.topbar').toggleClass('move')
    })
    // 3. 退出功能
    $('.icon_logout').click(function () {
        $('#myModal').modal('show')
    })
    $('.logout').click(function () {
        // 发送ajax请求的，销毁登录数据
        $.ajax({
            url: "/employee/employeeLogout",
            type: 'get',
            dataType: 'json',
            success: function (info) {
                // console.log(info)
                if (info.success) {
                    location.href = "login.html"
                }

            }
        })
    })
})