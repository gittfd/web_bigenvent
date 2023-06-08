$(function(){
    const form  = layui.form
    const layer  = layui.layer
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
          samePwd:function(value){
            if(value === $('[name=oldPwd]').val()) return '原密码不能和新密码一样'
          },
          rePwd:function(value){
            if(value !== $('[name=newPwd]').val()) return '两次密码不一致'
          }
    })
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            type:'post',
            url: '/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('原密码错误')
                }
                layer.msg('密码更新成功！')
                document.querySelector('.layui-form').reset()
            }
        })
    })
})