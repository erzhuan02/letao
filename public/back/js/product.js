$(function () {
    // 保存当前页
    var currentPage = 1
    var pageSize = 5
    // 存储图片地址
    var picArr = []

    // 功能1：动态加载数据
    render(); //先调用一次
    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            dataType: 'json',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            success: function (info) {
                // console.log(info)
                // 绑定模板与数据，显示到页面
                $('tbody').html(template('productTmp', info))
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
        console.log(picArr)
        // 显示模态框
        $('#productModal').modal('show')
        // 请求二级分类名称, 渲染下拉菜单
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            dataType: 'json',
            data: {
                page: currentPage,
                pageSize: 100, //比后台分类总数大即可
            },
            success: function (info) {
                // console.log(info)
                // 绑定模板与数据，显示到页面
                $('.dropdown-menu').html(template('dropdownTpl', info))
            }
        })
    })

    // 2.通过注册委托事件, 给一级分类下的a添加点击事件
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取a的内容
        var category = $(this).text()
        // 保存id
        var id = $(this).data("id");
        // 将值赋值给按钮
        $('#dropdownText').text(category)
        // id赋值给隐藏域，用于提交
        $('input[name="brandId"]').val(id);

        // 手动重置校验状态
        $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID")
    })

    // 3.配置图片上传
    $("#fileupload").fileupload({
        // 指定数据类型为 json
        dataType: "json",
        // done, 当图片上传完成, 响应回来时调用
        done: function (e, data) {
            console.log(data.result,111)
            //e：事件对象
            //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
            var picObj = data.result
            var picAddr = picObj.picAddr
            // 新得到的图片对象, 应该推到数组的最前面    push pop shift unshift
            picArr.unshift(picObj);
            // 获取图片路径，赋值给img的src
            $('#imgBox').prepend('<img src="' + picAddr + '" style="width: 100px;">')
            // 将图片地址存在隐藏域中
            $('[name="brandLogo"]').val(picAddr);
            // 判断如果图片超过三张,就要删除掉数组中最后一个,同时也移除图片展示
            if (picArr.length > 3) {
                picArr.pop(picObj)
                $('#imgBox img:last-of-type').remove()
            }

            // 手动重置校验状态
            if (picArr.length == 3){
                $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
            }
        }
    });

    // 4.表单校验
    $('#form').bootstrapValidator({
        // 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
        excluded: [],

        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        // 校验字段
        fields: { // input框中需要配置 name
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    }
                },
                //正则校验
                regexp: {
                    regexp: /^[1-9]\d*$/,
                    message: '商品库存格式, 必须是非零开头的数字'
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    }
                },
                //正则校验
                regexp: {
                    regexp: /^\d{2}-\d{2}$/,
                    message: '尺码格式, 必须是数字 xx-xx'
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品现价"
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });

    // 5.表单校验成功后,阻止默认提交,通过ajax.隐藏模态框/重新渲染/重置表单
    $('#form').on('success.form.bv', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 表单提交得到的参数字符串
        var params = $('#form').serialize();
        console.log(picArr)
        // 需要在参数的基础上拼接上这些参数
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
        params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
        // console.log(params);

        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            dataType: 'json',
            data: params,
            success: function (info) {
                console.log(info)
                if (info.success) {
                    // 重新渲染页面, 渲染第一页
                    currentPage = 1;
                    render();
                    // 模态框隐藏
                    $('#productModal').modal('hide')
                    // 重置表单的内容 和 状态
                    // resetForm( true ); 表示内容和状态都重置
                    // resetForm();   表示只重置状态
                    $('#form').data("bootstrapValidator").resetForm(true)
                    // 下拉菜单重置
                    $('#dropdownText').text('请选择二级分类')
                    // 图片重置
                    $('#imgBox img').remove()
                    //数组重置
                    picArr = [];
                }
            }
        })
    })



})