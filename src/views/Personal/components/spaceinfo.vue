<template>
  <div>
    <div class="show">
      <p style="margin-left:6%;margin-top: 5%">昵称:<span style="margin-left: 3%;line-height:40px">{{userinfo.username}}</span></p>
      <p style="margin-left:6%;margin-top: 5%">性别:<span style="margin-left: 3%;line-height:40px">{{userinfo.usersex}}</span></p>
      <p style="margin-left:6%;margin-top: 5%">邮箱:<span style="margin-left: 3%;line-height:40px">{{userinfo.useremail}}</span></p>
      <p style="margin-left:6%;margin-top: 5%">简介:<span style="margin-left: 3%;line-height:40px">{{userinfo.userjianjie}}</span></p>
    </div>
  </div>
</template>

<script>
//还是等跳转到这里的时候再来加载数据好一点
//import {userinfo} from "../../userinfo/userinfo"
export default {

  name: "spaceinfo",
  data(){
    return{
      userinfo: {
        username: "hhh",
        usersex: "女",
        useremail: "12345678@qq.com",
        userjianjie: "没有下一个"
      }

    }
  }
}
</script>

<style scoped>
.show{
  margin: 100px auto;
  width: 80%;
  height: 450px;
  border: 5px solid lightcyan;
  transition: all 0.9s;
  border-radius: 10px;

}

.show:hover{
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
  margin-top: 90px;
}
</style>

