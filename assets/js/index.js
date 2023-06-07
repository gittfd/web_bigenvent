//立即执行
$(function(){
    getUserInfo()
    const layer = layui.layer
    $('#btnLogout').on('click',function(res){
       //提示用户是否退出
      layer.confirm('确认退出', {icon: 3, title:'提示'}, function(index){
              // 1. 清空本地存储中的 token
              localStorage.removeItem('token')
                  // 2. 重新跳转到登录页面
              location.href = '/login.html'
          layer.close(index);
  });
    })
})
function getUserInfo(){
    $.ajax({
        type:'get',
        url:'/my/userinfo',
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res){
         if(res.status !==0) return layui.layer.msg('获取用户信息请求失败')
           console.log(res);
           // 调用 renderAvatar 渲染用户的头像
           renderAvatar(res.data)
        },
       

    })
}
// 渲染用户的头像
function renderAvatar(user) {
    const name = user.nickname || user.username
    document.querySelector('#welcome').innerHTML = '欢迎&nbsp;&nbsp;' + name
    if(user.user_pic){
        $('.layui-nav-img').src = user.user_pic
        document.querySelector('.layui-side .text-avatar').style.display ='none'
        document.querySelector('.userinfo .text-avatar').style.display ='none'
    }else{
           // 3.2 渲染文本头像
    $('.layui-nav-img').hide()
    var first = name.substring(0,1).toUpperCase()
    $('.text-avatar')
      .html(first)
      .show()
    }
}