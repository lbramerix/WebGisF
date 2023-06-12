<template>
  <div class="login-wrap">
    <el-form class="login-container">
      <h1 class="title">用户注册：</h1>
      <el-form-item>
        <el-input type="text" placeholder="用户账号" v-model="username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="用户密码" v-model="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" placeholder="确认密码" v-model="password1" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doRegister" style="width: 48%;">注册</el-button>
        <el-button type="primary" @click="toLogin" style="width: 48%;">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  data: function() {
    return {
      username: '',
      password: '',
      password1:''
    }
  },
  methods: {
    doRegister:function(){

    },
    toLogin:function(){
      this.$router.push('/sign-in');
    }
  }
}
</script>

<style>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 10%;
  background-image: url("@/assets/kuxuan.png");
  /* background-color: #112346; */
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
