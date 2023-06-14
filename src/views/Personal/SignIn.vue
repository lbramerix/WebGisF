<template>
  <div class="login-wrap">
    <el-form class="login-container" ref="form" :model="form" :rules="rules" >
      <h1 class="title">用户登录：</h1>
      <el-form-item prop="id">
        <el-input type="text" placeholder="用户账号" v-model="form.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="用户密码" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doLogin('form')" style="width: 100%;">登录</el-button>
      </el-form-item>
      <el-row style="text-align: center;margin-top: -10px;">
        <el-link type="primary" @click="toRegister">用户注册</el-link>
        <el-link type="primary">忘记密码</el-link>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";
import store from "@/store/index";

export default {
  name: 'SignIn',
  data: function() {
    return {
      form: {
        id: '',
        password: '',
        username: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入密码！', trigger: 'blur'}
        ],
        id: [
          { required: true, message: '请输入ID！', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    doLogin:function(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = new URLSearchParams();
          params.append("id", this.form.id);
          params.append("password", this.form.password)

          getRequest("/user/UserSignIn", params).then(resp =>{
            if(resp){
              console.log(resp);
              //this.user=resp.data;
              const id2 = resp.id;
              this.form.username=resp.username;
              console.log("用户名称："+this.form.username);
              if(id2 === this.form.id){
                // 将用户信息保存到状态管理器中
                this.$store.commit('setId', this.form.id);
                this.$store.commit('setUsername', this.form.username);

                // 获取ID
                const userId = this.$store.state.id;
                console.log(this.$store.state);
                console.log("取出来的id："+userId);

                this.$message.success("登录成功！");
                this.$router.push('/personal');
              }
            }else{
              this.$message.error("登录失败！");
            }

          }).catch(err => {
            console.log(err);
          });

          console.log("id=%s,password=%s",this.form.id,this.form.password);
        } else {
          this.$message.error("请输入格式正确的数据！");
          console.log('error submit!!');
        }
      });

    },

    toRegister:function(){
      this.$router.push('/sign-up');
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
