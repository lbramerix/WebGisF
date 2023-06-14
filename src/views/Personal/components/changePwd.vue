<template>
  <div class="show">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input type="password" v-model="form.oldPwd" placeholder="请输入原始密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input type="password" v-model="form.confirmPwd" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">确认</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  data() {
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
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      rules:{
        oldPwd: [
          { required: true, message: '请输入旧密码'}
        ],
        newPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 执行异步请求，修改数据
          const params = new URLSearchParams();
          params.append("id", this.$store.state.id);
          params.append("newPwd", this.form.newPwd);
          params.append("oldPwd", this.form.oldPwd);

          getRequest("/user/UserChangePwd", params).then(resp =>{
            if(resp){
              console.log(resp);
              this.$message.success("修改密码成功！");
            }else{
              this.$message.error("原始密码输入错误！");
            }

          }).catch(err => {
            console.log(err);
          });
        } else {
          this.$message.error("请输入格式正确的数据！");
          console.log('error submit!!');
        }
      });

    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.show{
  margin: 100px auto;
  padding: 50px;
  width: 55%;
  height: 270px;
  border: 5px solid #47515d;
  transition: all 0.9s;
  border-radius: 10px;

}

.show:hover{
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
  margin-top: 90px;
}
</style>