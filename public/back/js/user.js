$(function () {
    // 保存当前页
    var currentPage = 1
    var pageSize = 5

    // 保存id和状态
    var currentId
    var isDelete

    // 功能1：动态加载数据
    render(); //先调用一次
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            dataType: 'json',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            success: function (info) {
                // console.log(info)
                // 绑定模板与数据，显示到页面
                $('tbody').html(template('userTmp', info))
                // 功能2 分页插件实现分页功能 
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3, //默认是2,如是3版本,这个参数必填
                    currentPage: info.page, //当前页
                    totalPages: Math.ceil(info.total / info.size), //总页数
                    // size: "small", //设置控件的大小，mini, small, normal,large
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page
                        // 重新渲染
                        render()
                    }
                });
            }
        })
    }
    // 功能2 分页插件实现分页功能 嵌套在功能1中

    // 功能3 点击禁用或启用按钮，显示模态框，再点击确定修改状态
    // 1.获取元素注册点击事件,用事件委托,动态创建的.
    $('tbody').on('click', '.btn', function () {
        // 显示模态框
        $('#userModal').modal('show')
        // 保存id
        currentId = $(this).parent().data('id')
        // 获取状态
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;

    })

    // 2.点击模态框中确定后发送ajax请求,传递数据,修改状态，模态框隐藏
    $('.confirm').click(function () {
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/user/updateUser',
            dataType: 'json',
            data: {
                id: currentId,
                isDelete: isDelete,
            },
            success: function (info) {
                // console.log(info)
                if (info.success) {
                    // 重新渲染页面
                    render()
                    // 模态框隐藏
                    $('#userModal').modal('hide')
                }
            }
        })

    })







})