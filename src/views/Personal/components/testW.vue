<template>
  <div>
    <div class="show">
<!--      <el-input-->
<!--          placeholder="输入城市"-->
<!--          suffix-icon="el-icon-cloudy"-->
<!--          v-model="city">-->
<!--      </el-input>-->
      <el-button type="primary" @click="dialogVisible = true">查询</el-button>
    </div>
    <el-dialog title="null" :visible.sync="dialogVisible">
      <template #title>
        <el-input v-model="city" placeholder="请输入城市" clearable size="medium" :style="{ width: '300px' }">
          <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
        </el-input>
      </template>
      <el-table :data="WeatherData" max-height="320px">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="celsiusHigh" label="最高温度" width="120"></el-table-column>
        <el-table-column property="celsiusLow" label="最低温度" width="120"></el-table-column>
        <el-table-column property="condition" label="天气情况" width="150">
<!--          <i id="my-icon" :class="WeatherData.condition"></i>-->
          <template slot-scope="scope">
            <i id="my-icon" :class="scope.row.condition"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  data(){
    return{
      dialogVisible: false,
      city: '',
      WeatherData: []
    }
  },

  methods: {
    doSearch(){
      // 执行异步请求，获取数据
      const params = new URLSearchParams();
      params.append("CityName", this.city);

      getRequest("/cityVisual/getWeather", params).then(resp => {
        if(resp){
          console.log(resp);
          this.WeatherData=resp;

          // const count=0;
          //
          // while(count<this.WeatherData.length){
          //   const icon = document.getElementById("my-icon")[0];
          //   icon.classList.add(this.WeatherData[0].condition);
          //   console.log("类名："+icon.className);
          //   this.count++;
          // }

        }else{
          this.$message.error("天气查询失败！");
        }

      }).catch(err => {
        console.log(err);
      });
    },
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

