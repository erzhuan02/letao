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
$(function (){
    // 1.侧边栏二级菜单切换
})
// $(function () {

//     // 公共的功能:
//     // 1. 左侧二级菜单切换
//     $('.category').click(function () {
//         $(this).next().stop().slideToggle();
//     })


//     // 2. 左侧侧边栏切换
//     $('.icon_left').click(function () {
//         $('.lt_aside').toggleClass("hidemenu");
//         $('.lt_main').toggleClass("hidemenu");
//         $('.lt_topbar').toggleClass("hidemenu");
//     })


//     // 3. 退出功能
//     // (1) 点击右侧按钮, 显示模态框
//     $('.icon_right').click(function () {
//         $('#logoutModal').modal("show");
//     })

//     // (2) 点击退出模态框的退出按钮, 完成退出功能
//     $('#logoutBtn').click(function () {

//         // 发送ajax请求, 让后台销毁当前用户的登录状态
//         $.ajax({
//             type: "get",
//             url: "/employee/employeeLogout",
//             dataType: "json",
//             success: function (info) {
//                 console.log(info);
//                 if (info.success) {
//                     // 退出成功了, 跳转登录页
//                     location.href = "login.html";
//                 }
//             }
//         })
//     })

// })