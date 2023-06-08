$(function(){
    const form = layui.form
    const layer = layui.layer

    form.verify({
        nickname:function(value){
            if (value.length > 6) return '用户昵称只能在1~6字符之间'
           
        }
    })
    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
      $.ajax({
        type:'get',
        url:'/my/userinfo',
        success:function(res){
            if(res.status !==0){
                return layer.msg('获取用户信息失败!')
            }
            console.log(res);
           form.val('formUserInfo',res.data)

        }
      })
    }
      // 重置表单的数据
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserInfo()
    })
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            type:'post',
            url: '/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) return layer.msg('更新用户信息失败！')
                layer.msg('更新用户信息成功！')
                initUserInfo()
                window.parent.getUserInfo()
               
            }
        })
    })
})