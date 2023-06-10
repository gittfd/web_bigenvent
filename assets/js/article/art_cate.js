$(function(){
    const layer = layui.layer
    const form = layui.form
    initArtCateList()
  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
           const newStr =res.data.map(function(item){
               return `     
               <tr>
                    <td>${item.name}</td>
                    <td>${item.alias}</td>
                    <td>
                    <button type="button" class="layui-btn layui-btn-xs form-edit dataid" data-id="${item.id}">编辑</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${item.id}">删除</button>
                    </td>
                </tr>`
            }).join('')
            $('tbody').html(newStr)
        }
      })
    }
    // 为添加类别按钮绑定点击事件
    let indexAdd= null
    $('#btnAddCate').on('click',function(){
       indexAdd =  layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: `
            <form class="layui-form" id="form-add">
                <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                </div>
                </div>
                <div class="layui-form-item">
                <label class="layui-form-label">分类别名</label>
                <div class="layui-input-block">
                    <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                </div>
                </div>
                <div class="layui-form-item">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
                </div>
            </form>
            `
          })

    })
      // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            type:'post',
            url: '/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0)return layer.msg('添加文章分类失败！')
                initArtCateList()
                layer.msg('添加文章分类成功！')
                layer.close(indexAdd)
            }
        })
    })
    
  // 通过代理的形式，为 btn-edit 按钮绑定点击事件
  let indexEdit= null
    $('body').on('click','.form-edit',function(e){
           // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
        type: 1,
        area: ['500px', '250px'],
        title: '修改文章分类',
        content: `
            <form class="layui-form" id="form-edit" lay-filter="form-edit">
                    <input type="hidden" name="id">
                    <div class="layui-form-item">
                    <label class="layui-form-label">分类名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                    </div>
                    </div>
                    <div class="layui-form-item">
                    <label class="layui-form-label">分类别名</label>
                    <div class="layui-input-block">
                        <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                    </div>
                    </div>
                    <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn" lay-submit lay-filter="formDemo">确认修改</button>
                       
                    </div>
                    </div>
            </form>
        `
      })
      const id =e.target.dataset.id
   
      $.ajax({
        type:'get',
        url: '/my/article/cates/' + id,
        success: function(res) {
            form.val('form-edit', res.data)
          }
      })


    })
      // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit','#form-edit',function(e){
            e.preventDefault()
            $.ajax({
                type:'post',
                url: '/my/article/updatecate',
                data:$(this).serialize(),
                success:function(res){
                    if (res.statsu !== 0) {
                        return layer.msg('更新分类数据失败！')
                      } 
                      layer.close(indexEdit)
                      layer.msg('更新分类数据成功！')
                      initArtCateList()
                     
                }
            })
      })

     $('body').on('click','.btn-delete',function(e){
        const id = e.target.dataset.id
        layer.confirm('确认删除该分类?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                  if (res.status !== 0) {
                    return layer.msg('删除分类失败！')
                  }
                  layer.msg('删除分类成功！')
                  layer.close(index)
                  initArtCateList()
                }
              })
          });
         
     })

})