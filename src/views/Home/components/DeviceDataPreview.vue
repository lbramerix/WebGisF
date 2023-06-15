<template>
  <!-- 全国门禁详情 -->
  <div class="user-data-preview">
    <!-- 左侧全国设备状态 -->
    <div class="data-overview left-layout">
      <!-- 数量排行 -->
<!--      <div ref="scrollTable" class="quantity-ranking">-->
<!--        <p class="content-title">即将开演艺人</p>-->
<!--        <ScrollTable class="scroll-table" />-->
<!--      </div>-->

      <div class="quantity-ranking" >
        <p class="content-title">艺人演唱会信息</p>
        <ScrollTable v-if="isShow" class="scroll-table" :config="deviceWarningConfig" style="padding-left: 10px;padding-top: 10px"/>
      </div>

      <dv-border-box-7 style="height: 350px;top: 10px">
        <p class="content-title">艺人演唱会时间戳</p>
        <div class="timeline-container" style="padding-top: 20px;padding-left: 20px">
          <el-timeline class="timeline-wrapper" style="height: 300px;">
            <el-timeline-item
                v-for="(activity, index) in actorConcert"
                :key="index"
                :timestamp="activity.showtime"
                class="timeline-item"
            >
              <span class="venue">{{activity.venue}}</span>
            </el-timeline-item>
          </el-timeline>
        </div>
      </dv-border-box-7>

    </div>
    <!-- 右侧设备占比 -->
    <div class="live-status right-layout">
      <dv-border-box-10 style="height: 150px;position: relative">
        <p class="content-title">选择艺人展示相关数据</p>
        <p class="content-title" style="padding-top: 10px">当前展示艺人为：{{actor}}</p>
        <div style="padding-left: 20px;padding-top: 20px;display: flex;padding-right: 50px;">
          <el-input style="flex-grow: 1;"
                    placeholder="请输入需查看艺人姓名"
                    v-model="actor"
                    clearable>
          </el-input>
          <el-button type="primary" style="margin-left: 15px" @click="actorSearchRoutine">查询</el-button>

        </div>

      </dv-border-box-10>

      <dv-border-box-10 style="height: 380px;position: relative;top: 10px">
        <p class="content-title">菜单栏</p>
        <div style="position: absolute; top: 30px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">绘制工具选择</p>
          <div style="padding-left: 20px;padding-top: 10px;">
            <!--            <el-button type="primary" @click="addInteractionPoint">绘制点</el-button>-->
            <el-select v-model="value" clearable placeholder="绘制选择" @change="handleSelectAddInteraction">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>

        <div style="position: absolute; top: 110px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">测量工具选择</p>
          <div style="padding-left: 20px;padding-top: 10px;">
            <el-select v-model="value2" clearable placeholder="测量选择" @change="handleSelectMeasureInteraction">
              <el-option
                  v-for="item in options2"
                  :key="item.value2"
                  :label="item.label2"
                  :value="item.value2">
              </el-option>
            </el-select>
          </div>
        </div>

        <div style="position: absolute; top: 190px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">地图导出工具</p>
          <div style="padding-left: 20px;padding-top: 10px;">
            <el-select v-model="value3" clearable placeholder="格式选择" @change="exportMap">
              <el-option
                  v-for="item in options3"
                  :key="item.value3"
                  :label="item.label3"
                  :value="item.value3">
              </el-option>
            </el-select>
          </div>
        </div>

        <div style="position: absolute; top: 270px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">其他</p>
          <div style="padding-left: 20px;padding-top: 10px;">
            <el-button type="primary" @click="searchWeather">天气查询</el-button>
            <el-button type="primary" @click="showHeat" >热力图展示</el-button>

          </div>
        </div>

      </dv-border-box-10>
    </div>
  </div>
</template>

<script>
import { deviceStateData, deviceSortData, deviceWarningData, deviceTypeData, deviceAdvertiseModelData } from '../../../utils/jsonData'
// 自定义排名轮播
import ScrollTable from '@/components/ScrollTable/src/index'
const axios = require("axios");

export default {
  name: 'DeviceDataPreview',
  components: { ScrollTable },
  props: {
    riseImage: {
      type: String,
    },
    declineImage: {
      type: String,
    },
    height: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      timer: null,
      onlineTimer: null,
      isShow: true,
      pointTimer: true,
      allUserNumCount: '',
      onLineDoorControl: '',
      offLineDoorControl: '',
      bubbleData: {
        cityCode: '',
        cityName: '',
        proportion: '',
        communityCount: '',
        onlineCount: '',
        offlineCount: ''
      },
      doorStates: [],
      cityInfoList: [],
      deviceSateConfig: {},
      deviceConfig: {},
      deviceWarningConfig: {},
      options: [{
        value: 'point',
        label: '绘制点'
      }, {
        value: 'line',
        label: '绘制线'
      }, {
        value: 'polygon',
        label: '绘制多边形'
      }, {
        value: 'clear',
        label: '清除'
      }],
      value: '',
      options2: [ {
        value2: 'line',
        label2: '测量距离'
      }, {
        value2: 'polygon',
        label2: '测量面积'
      }, {
        value2: 'clear',
        label2: '清除'
      }],
      value2: '',
      options3: [ {
        value3: 'png',
        label3: 'PNG格式'
      }, {
        value3: 'jpg',
        label3: 'JPG格式'
      }, {
        value3: 'pdf',
        label3: 'PDF格式'
      },
        {
          value3: 'json',
          label3: 'JSON格式'
        }],
      value3: '',
      actor:'薛之谦',
      actorConcert:[],
    }
  },
  watch: {
    height () {
      this.initActorConcert()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init() {
      this.$emit('actorSearchRoutine', this.actor);
      axios.get('/concert/getActorRoutine?actor=' + this.actor)
          .then(response => {
            this.actorConcert = response.data;
            this.initActorConcert();
          })
          .catch(error => {
            console.log('获取演唱会数据失败：', error);
          });
    },
    handleSelectAddInteraction(value) {
      console.log('选中的值为：', value);
      if (value == "point") {
        this.$emit('addInteractionPoint');
      } else if (value == "line") {
        this.$emit('addInteractionLine');
      } else if (value == "polygon") {
        this.$emit('addInteractionPolygon');
      } else {
        this.$emit('clear');
      }
    },
    handleSelectMeasureInteraction(value) {
      if (value == "line") {
        this.$emit('measureInteractionLine');
      } else if (value == "polygon") {
        this.$emit('measureInteractionPolygon');
      } else {
        this.$emit('clear');
      }
    },
    exportMap(value) {
      if (value == "png") {
        this.$emit('exportMapPNG');
      } else if (value == "jpg") {
        this.$emit('exportMapJPG');
      } else if (value == "pdf") {
        this.$emit('exportMapPDF');
      } else {
        this.$emit('exportMapJSON');
      }
    },
    actorSearchRoutine() {
      this.$emit('actorSearchRoutine', this.actor);
      this.initActorConcert()
      axios.get('/concert/getActorRoutine?actor=' + this.actor)
          .then(response => {
            this.actorConcert = response.data;
            ;
          })
          .catch(error => {
            console.log('获取演唱会数据失败：', error);
          });
    },
    searchWeather(){
      this.$emit('searchWeather');
    },
    showHeat(){
      this.$emit('showHeat');
    },

    // 艺人演唱会
    initActorConcert() {
      axios.get('/concert/getActorRoutine?actor=' + this.actor)
          .then(response => {
            this.actorConcert = response.data;
            ;
          })
          .catch(error => {
            console.log('获取演唱会数据失败：', error);
          });
      let deviceWarningConfigData = []
      this.actorConcert.forEach((t, index) => {
        deviceWarningConfigData.push(
            [`<span style="color: #DA3924">${t.cityname}</span>`, `<span style="color:#4A90E2;">${t.venue}</span>`,
              `<span style="color:#ccc;">${t.showtime} </span>`]
        )
      })

      this.deviceWarningConfig = {
        header: ['城市名', '场地', '时间'],
        data: deviceWarningConfigData,
        rowNum: 4,
        waitTime: 2000,
        indexHeader: '排行',
        headerBGC: 'rgba(0,0,0,0)',
        columnWidth: [100, 250, 140],
        Height: 60,
      }
      this.$forceUpdate();
    },
  }
}
</script>
<style>
.timeline-container {
  height: 300px; /* 滚动区域的高度 */
  overflow-y: scroll; /* 显示纵向滚动条 */
}

.timeline-wrapper {
  height: auto !important; /* 取消 timeline 组件的默认高度限制 */
}

.timeline-item {
  color: #fff; /* 字体颜色设置为白色 */
}

.venue {
  color: #b5dbff;
  font-weight: bold; /* 加粗 */
}
</style>
