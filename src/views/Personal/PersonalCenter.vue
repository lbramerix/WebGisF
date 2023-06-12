<template>
  <div style="background-color: white">

    <el-container style="height: 800px; border: 1px solid #eee;">

      <el-aside width="200px" style="margin-top: 1%" >
        <div style="width: 190px;background-color: white;padding: 5px;margin: auto">
          <img src="@/assets/momo.jpg" width="150px" height="150px" style="border-radius: 300px;margin-left: 8%">
          <br>
          <br>
          <p style="margin:0 auto;text-align: center" >{{user.username}}</p>
        </div>

        <br>
        <br>
        <el-menu :default-openeds="['1','2']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>用户中心</template>
            <el-menu-item-group>

              <router-link class="alink" to="/personal/spaceinfo"><el-menu-item index="1-1">个人信息</el-menu-item></router-link>
              <router-link class="alink" to="/personal/changepic"><el-menu-item index="1-2">修改头像</el-menu-item></router-link>
              <router-link class="alink" to="/personal/changeinfo"><el-menu-item index="1-3">修改信息</el-menu-item></router-link>
            </el-menu-item-group>

          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>博客管理</template>
            <el-menu-item-group>
              <router-link class="alink" to="/personal/bokelist"><el-menu-item index="2-1">我的收藏</el-menu-item></router-link>
            </el-menu-item-group>

          </el-submenu>


        </el-menu>
      </el-aside>


      <el-container style="background-color: white">
        <el-main>
          <router-view/>
        </el-main>
      </el-container>


    </el-container>

  </div>
</template>

<script>

export default {
  name: "PersonalCenter",
  beforeRouteEnter: (to, from, next) => {
    console.log("准备进入个人信息页");
    let islogin = sessionStorage.getItem("isLogin")
    if(islogin){
      next({path:'/login'});
    }
    next();
  },
  data() {

    return {
      user:{
        userpic :"@/assets/momo.jpg",
        username: 'momo'
      }
    }
  },

}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.alink{

  text-decoration: none;
}
</style>

