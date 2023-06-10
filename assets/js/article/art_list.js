$(function(){
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    var q = {
      pagenum: 1, // 页码值，默认请求第一页的数据
      pagesize: 2, // 每页显示几条数据，默认每页显示2条
      cate_id: '', // 文章分类的 Id
      state: '' // 文章的发布状态
    }
    initTable()
        // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
        type:'get',
        url: '/my/article/list',
        data: q,
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败！')
         
        }
    const newStr = res.data.map(function(item){
        return `
        <tr>
           
            <td>${item.title}</td>
            <td>${item.name}</td>
            <td>${getTime(item.pub_date)}</td>
            <td>${item.state}</td>
            <td>
                <button type="button" class="layui-btn layui-btn-xs">编辑</button>
                <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${item.Id}">删除</button>
            </td>
        </tr> 
        `
      }).join('')
      $('tbody').html(newStr)
      // console.log(res.total.all);
      renderPage(res.total)
    }
    })
  }
function getTime(time){
    const dt =new Date(time)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
}
function padZero(n){
    return n > 9 ? n : '0' + n
}
initCate()
  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
       const htmlStr =res.data.map(function(item){
        return `
        <option value="${item.id}">${item.name}</option>
        `
       }).join('')
        
        const newStr2 = '<option value="">所有分类</option>' + htmlStr
        $('[name=cate_id]').html(newStr2)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }
  $('#form-search').on('submit',function(e){
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    console.log(cate_id);
    var state = $('[name=state]').val()
    q.cate_id=cate_id
    q.state=state
    initTable()

  })
  function renderPage(total){
        //开启location.hash的记录
          //执行一个laypage实例
  laypage.render({
    elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
    ,count: total.total, // 总数据条数
    limit: q.pagesize, // 每页显示几条数据
    curr: q.pagenum, // 设置默认被选中的分页
    limits:[2,4,6,8],
    layout:['count','limit','prev', 'page', 'next','skip'],
    jump: function(obj,first){
      //obj包含了当前分页的所有参数，比如：
     q.pagenum = obj.curr
     q.pagesize =obj.limit


       // 根据最新的 q 获取对应的数据列表，并渲染表格
        if(!first){
          initTable()
        }
      }
     
  });
  
  }
  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('body').on('click','.btn-delete',function(e){
    //eg1
    const id = e.target.dataset.id
    const len  = $('.btn-delete').length
    console.log(len);

     layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
          $.ajax({
            type:'get',
             url: '/my/article/delete/' + id,
             success:function(res){
                  if(res.status !==0)return layer.msg('删除失败')
                  layer.msg('删除成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
         if(len === 1){
          q.pagenum =q.pagenumm === 1 ? 1 :q.pagenum -1
         }
                  //发起请求获取列表数据
                  initTable()

             }
          })
  
  layer.close(index);
});
  })
})