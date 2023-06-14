<template>
  <div class="show">
  <el-form ref="user" :model="user" label-width="80px" :rules="rules">
    <el-form-item label="用户昵称" prop="username">
      <el-input v-model="user.username" placeholder="给自己取一个酷炫的名字吧~"></el-input>
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="女" value="女"></el-radio>
        <el-radio label="男" value="男"></el-radio>
        <el-radio label="不明" value="不明"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="个性简介" prop="jianjie">
      <el-input type="textarea" v-model="user.jianjie" placeholder="介绍一下你自己吧~"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('user')">修改</el-button>
      <el-button @click="resetForm('user')">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  data() {
    return {
      user: {
        username: '',
        id:'',
        password:'',
        sex: '',
        jianjie: ''
      },
      rules:{
        username: [
          { required: true, message: '人人都要有名字哦！', trigger: 'blur'}
        ],
        jianjie: [
          { max: 40, message: '长度不能超过40字符哦！', trigger: 'blur' }
        ]
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
          this.user.password=resp.password;
          this.user.sex=resp.sex;
          this.user.jianjie=resp.jianjie;
        }else{
          this.$message.error("查看信息失败！");
        }

      }).catch(err => {
        console.log(err);
      });
    },

    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 执行异步请求，修改数据
          const params = new URLSearchParams();
          params.append("id", this.user.id);
          params.append("username", this.user.username);
          params.append("password", this.user.password);
          params.append("sex", this.user.sex);
          params.append("jianjie", this.user.jianjie);

          getRequest("/user/UserSpaceInfo", params).then(resp =>{
            if(resp){
              console.log(resp);
              this.$message.success("修改成功！");
            }else{
              this.$message.error("修改失败！");
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
  height: 320px;
  border: 5px solid #47515d;
  transition: all 0.9s;
  border-radius: 10px;

}

.show:hover{
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
  margin-top: 90px;
}
</style>