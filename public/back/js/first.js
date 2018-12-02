$(function () {
    // 保存当前页
    var currentPage = 1
    var pageSize = 5

    // 功能1：动态加载数据
    render(); //先调用一次
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            dataType: 'json',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            success: function (info) {
                console.log(info)
                // 绑定模板与数据，显示到页面
                $('tbody').html(template('firstTmp', info))
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

    // 功能3 点击添加分类，显示模态框，表单校验，点击添加按钮添加
    // 1.获取元素注册点击事件,用事件委托,动态创建的.
    $('.container-fluid .add').on('click', function () {
        // 显示模态框
        $('#firstModal').modal('show')
    })

    // 2. 进行表单校验
    $('#form').bootstrapValidator({
        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        // 校验字段
        fields: { // input框中需要配置 name
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类名称"
                    }
                }
            }
        }
    });

    // 3.注册表单校验成功事件,阻止默认的提交.通过ajax提交传递数据,添加分类，模态框隐藏
    $('#form').on('success.form.bv', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            dataType: 'json',
            data: $('#form').serialize(),
            success: function (info) {
                console.log(info)
                if (info.success) {
                    // 重新渲染页面, 渲染第一页
                    currentPage = 1;
                    render();
                    // 模态框隐藏
                    $('#firstModal').modal('hide')
                    // 重置表单的内容 和 状态
                    // resetForm( true ); 表示内容和状态都重置
                    // resetForm();   表示只重置状态
                    $('#form').data("bootstrapValidator").resetForm(true)
                }
            }
        })
    })



})