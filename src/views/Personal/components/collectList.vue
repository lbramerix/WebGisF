<template>
  <div class="show">
    <el-table
        :data="tableData"
        style="width: 100%"
        max-height="460px">
      <el-table-column
          fixed
          prop="actors"
          label="艺人"
          width="120">
      </el-table-column>
      <el-table-column
          prop="cityname"
          label="城市"
          width="100">
      </el-table-column>
      <el-table-column
          prop="venue"
          label="地点"
          width="120">
      </el-table-column>
      <el-table-column
          prop="price"
          label="最低票价"
          sortable
          width="100">
      </el-table-column>
      <el-table-column
          prop="pricehigh"
          label="最高票价"
          sortable
          width="100">
      </el-table-column>
      <el-table-column
          prop="showtime"
          label="时间"
          width="140">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          width="300">
      </el-table-column>
      <el-table-column
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData:[{
        cityname: "合肥",
        price: "180",
        venue: "合肥体育中心体育场",
        actors: "张杰",
        showtime: "2023.07.01 周六",
        pricehigh: "1680",
        name: "2023张杰未·LIVE —「曜·北斗」巡回演唱会 合肥站"
      },{
        cityname: "合肥",
        price: "380",
        venue: "合肥体育中心体育场",
        actors: "张杰",
        showtime: "2023.07.01 周六",
        pricehigh: "1580",
        name: "2023张杰未·LIVE —「曜·北斗」巡回演唱会 合肥站"
      },{
        cityname: "合肥",
        price: "380",
        venue: "合肥体育中心体育场",
        actors: "张杰",
        showtime: "2023.07.01 周六",
        pricehigh: "1680",
        name: "2023张杰未·LIVE —「曜·北斗」巡回演唱会 合肥站"
      },{
        cityname: "合肥",
        price: "280",
        venue: "合肥体育中心体育场",
        actors: "张杰",
        showtime: "2023.07.01 周六",
        pricehigh: "1680",
        name: "2023张杰未·LIVE —「曜·北斗」巡回演唱会 合肥站"
      },{
        cityname: "合肥",
        price: "380",
        venue: "合肥体育中心体育场",
        actors: "张杰",
        showtime: "2023.07.01 周六",
        pricehigh: "1480",
        name: "2023张杰未·LIVE —「曜·北斗」巡回演唱会 合肥站"
      },{
        cityname: "合肥",
        price: "380",
        venue: "合肥体育中心体育场",
        actors: "张杰",
        showtime: "2023.07.01 周六",
        pricehigh: "1280",
        name: "2023张杰未·LIVE —「曜·北斗」巡回演唱会 合肥站"
      },]
    }
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.show{
  margin: 100px auto;
  padding: 30px;
  width: 80%;
  height: 480px;
  border: 5px solid #47515d;
  transition: all 0.9s;
  border-radius: 10px;

}

.show:hover{
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.4);
  margin-top: 90px;
}
</style>