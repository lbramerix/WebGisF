<template>
  <div>
    <div class="show">
      <p style="margin-left:6%;margin-top: 5%">昵称:<span style="margin-left: 3%;line-height:40px">{{user.username}}</span></p>
      <p style="margin-left:6%;margin-top: 5%">id:<span style="margin-left: 3%;line-height:40px">{{user.id}}</span></p>
      <p style="margin-left:6%;margin-top: 5%">性别:<span style="margin-left: 3%;line-height:40px">{{user.sex}}</span></p>
      <p style="margin-left:6%;margin-top: 5%">简介:<span style="margin-left: 3%;line-height:40px">{{user.jianjie}}</span></p>
    </div>
  </div>
</template>

<script>
//还是等跳转到这里的时候再来加载数据好一点
import {getRequest} from "@/utils/api";

export default {
  name: "spaceInfo",
  data(){
    return{
      user: {
        username: "",
        sex: "",
        id: "",
        jianjie: ""
      }
    }
  },

  created() {
    // 获取数据
    this.fetchData();
  },
  methods: {
    fetchData() {
      // 执行异步请求，获取数据
      const params = new URLSearchParams();
      const storeId = this.$store.state.id;
      params.append("id", storeId);

      getRequest("/user/UserGetInfo", params).then(resp => {
        if(resp){
          console.log(resp);
          this.user.username=resp.username;
          this.user.id=resp.id;
          this.user.sex=resp.sex;
          this.user.jianjie=resp.jianjie;
          console.log("个人信息："+this.user.username);
        }else{
          this.$message.error("查看信息失败！");
        }

      }).catch(err => {
        console.log(err);
      });
    }
  }

}
</script>

<style scoped>
.show{
  margin: 100px auto;
  width: 70%;
  height: 400px;
  border: 5px solid #47515d;
  transition: all 0.9s;
  border-radius: 10px;

}

.show:hover{
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
  margin-top: 90px;
}
</style>

