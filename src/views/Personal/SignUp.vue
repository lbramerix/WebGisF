<template>
  <div class="login-wrap">
    <el-form class="login-container" ref="form" :model="form" :rules="rules">
      <h1 class="title">用户注册：</h1>
      <el-form-item prop="id">
        <el-input type="text" placeholder="用户账号" v-model="form.id" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password placeholder="用户密码" v-model="form.password" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item prop="password1">
        <el-input show-password placeholder="确认密码" v-model="form.password1" autocomplete="off" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="doRegister('form')" style="width: 48%;">注册</el-button>
        <el-button type="primary" @click="toLogin" style="width: 48%;">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: 'SignUp',
  data: function() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if( value.length>10 || value.length<6) {
        callback(new Error('密码长度应在6-10个字符之间！'));
      } else {
        if (this.form.confirmPwd !== '') {
          this.$refs.form.validateField('confirmPwd');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        id: '',
        password: '',
        password1: '',
      },
      rules:{
        id: [
          { required: true, message: '请输入ID!'},
          { min: 3, max: 8, message: '长度应在3-8个字符之间！', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        password1: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    doRegister(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = new URLSearchParams();
          params.append("id", this.form.id);
          params.append("password", this.form.password)

          if(this.form.password!==this.form.password1){
            this.$message.error("两次输入密码不一致!");
          } else {
            getRequest("/user/UserSignUp", params).then(resp => {
              if (resp) {
                console.log(resp);
                this.$message.success("注册成功！");
              } else {
                this.$message.error("注册失败！");
              }

            }).catch(err => {
              console.log(err);
            });
          }
        } else {
          this.$message.error("请输入格式正确的数据！");
          console.log('error submit!!');
        }
      });

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
