<template>
  <div>
    <div class="show">
      <p align="center" style="line-height:80px">确认退出登录？</p>
      <p align="center" style="line-height:40px"><el-button type="primary" @click="onLogout">确认</el-button></p>
    </div>
  </div>
</template>

<script>
//还是等跳转到这里的时候再来加载数据好一点
//import {userinfo} from "../../userinfo/userinfo"
export default {
  data(){
    return{
      userinfo: {
        username: "hhh",
        usersex: "女",
        useremail: "12345678@qq.com",
        userjianjie: "没有下一个"
      }

    }
  },

  methods: {
    onLogout() {
      // 清空用户信息
      this.$store.commit('setId', '');
      this.$store.commit('setUsername', '');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.show{
  margin: 100px auto;

  width: 30%;
  padding: 40px;
  height: 140px;
  border: 5px solid #47515d;
  transition: all 0.9s;
  border-radius: 10px;

}

.show:hover{
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
  margin-top: 90px;
}
</style>

