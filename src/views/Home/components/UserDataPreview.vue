<template>
  <!-- 全国用户详情 -->
  <div class="user-data-preview">
    <!-- 左侧数据预览 -->
    <div class="data-overview left-layout">
      <dv-border-box-8 class="channel-proportion" :style="{'height': height}">
        <p class="content-title" style="padding-top: 10px">演唱会数量排名前十城市占比</p>
        <div class="content">
          <div id="channelCanvas" style="width: 100%; height: 225px"></div>
        </div>
      </dv-border-box-8>
      <div class="city-ranking">
        <p class="content-title">演唱会数量城市排行</p>
        <ScrollRankingBoard class="ranking" :config="rankingConfig"></ScrollRankingBoard>
      </div>
    </div>
    <!-- 右侧状态 -->
    <div class="live-status right-layout">
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
          <p class="content-title">未来十五天天气查询</p>
          <div style="padding-left: 20px;padding-top: 10px;">
            <el-button type="primary" @click="searchWeather">天气查询</el-button>
          </div>
        </div>

      </dv-border-box-10>

      <dv-border-box-10 style="height: 450px;position: relative;margin-top: 20px">
        <p class="content-title">搜索演唱会</p>

        <div style="position: absolute; top: 30px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">按日期搜索</p>
          <div style="padding-left: 20px;padding-top: 10px;display: flex;">
            <el-date-picker
                style="flex-grow: 1;"
                v-model="date"
                type="date"
                placeholder="选择日期"
                ref="picker"
                @change="calculateWidths">
            </el-date-picker>
            <el-button type="primary" style="margin-left: 15px" @click="dateSearch">查询</el-button>

          </div>
        </div>

        <div style="position: absolute; top: 120px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">按艺人搜索</p>
          <div style="padding-left: 20px;padding-top: 10px;display: flex;">
            <el-input style="flex-grow: 1;"
                      placeholder="请输入内容"
                      v-model="actorName"
                      clearable>
            </el-input>
            <el-button type="primary" style="margin-left: 15px" @click="actorSearch">查询</el-button>

          </div>
        </div>

        <div style="position: absolute; top: 200px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">按城市名搜索</p>
          <div style="padding-left: 20px;padding-top: 10px;display: flex;">
            <el-select v-model="selectedCity" filterable placeholder="请选择城市" style="flex-grow: 1;">
              <el-option
                  v-for="(city, index) in cities"
                  :key="index"
                  :label="city"
                  :value="index"
              />
            </el-select>
            <el-button type="primary" style="margin-left: 15px" @click="citynameSearch">查询</el-button>
          </div>
        </div>

        <div style="position: absolute; top: 280px; left: 20px;display: flex; flex-direction: column;">
          <p class="content-title">按价格范围搜索</p>
          <div style="padding-left: 20px; padding-top: 10px; display: flex; flex-direction: row;">
            <el-input
                placeholder="最低价"
                v-model.number="inputNumber1"
                type="number"
                clearable
                :style="{ width: inputWidth1 + 'px', marginRight: '10px' }">
            </el-input>

            <el-input
                placeholder="最高价"
                v-model.number="inputNumber2"
                type="number"
                clearable
                :style="{ width: inputWidth2 + 'px' }">
            </el-input>
            <el-button type="primary" style="margin-left: 15px" @click="priceSearch">查询</el-button>
          </div>
        </div>
        <div style="position: absolute; top: 370px; left: 25px;display: flex; flex-direction: column;">
          <div style="padding-top: 10px;">
            <el-button type="primary" style="margin-left: 15px" @click="showAll">展示所有演唱会数据</el-button>
          </div>
        </div>
      </dv-border-box-10>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { previewData, userRankingData, userStates, userPortraitData, userChannelData } from '../../../utils/jsonData'
// 自定义排名轮播
import ScrollRankingBoard from '@/components/ScrollRankingBoard/src/index'
import {getRequest} from "@/utils/api";
import { ElInput } from "element-ui"; // 引入 el-input 组件
const axios = require("axios");


export default {
  name: 'UserDataPreview',
  components: { ScrollRankingBoard },
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
      searchText: "", // 定义搜索框的数据模型
      timer: null,
      numTimer: null,
      pointTimer: null,
      applyRate: 0,
      faceRate: 0,
      applyTotal: 0,
      faceTotal: 0,
      manRate: 0,
      womanRate: 0,
      userData: [],
      allUserNumCount: '',
      allCommunityCount: '',
      cityInfoList: [],
      CityCount:[],
      CityCount2:[],
      pieid:[],
      piedata:[],
      allConcertCity:[{
        name:'',
        count:0
      }],
      rankingConfig: {
        data: [],
        formatter: true
      },
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
      date:'',
      actorName:"",
      selectedCity: "",
      cities: [],
      inputNumber1: "",
      inputNumber2: "",
      inputWidth1: null,
      inputWidth2: null,
    }
  },
  mounted () {
    // 获取全用户数据
    setTimeout(() => {
      // this.initUserMap()
      // this.initUserDataPreview()
       this.initUserRanking()
      // this.initUserStates()
      // this.initUserPortrait()
      // this.initUserChannelCanvas()
      this.getTopTen()
    }, 1000)
    axios.get('/citycount/getConcertCity')
        .then(response => {
          this.cities = response.data;
        })
        .catch(error => {
          console.log('获取城市名数据失败：', error);
        });
    // 初始时计算 input 的宽度
    this.calculateWidths();
    this.$emit('showAll');

  },
  methods: {
    calculateWidths() {
      // 获取 date-picker 的宽度
      const pickerWidth = this.$refs.picker.$el.clientWidth;

      // 计算两个 input 需要的宽度
      const inputsWidth = pickerWidth - 10; // 减去容器 padding 和两个 input 的 margin-right
      const inputWidth = inputsWidth / 2;

      // 更新 input 的宽度
      this.inputWidth1 = inputWidth;
      this.inputWidth2 = inputWidth;
    },
    search() {
      // 触发自定义事件，将搜索关键词传递给父级组件
      this.$emit('search', this.searchText);
    },
    addInteractionPoint(){
      this.$emit('addInteractionPoint');
    },
    handleSelectAddInteraction(value) {
      console.log('选中的值为：', value);
      if(value=="point"){
        this.$emit('addInteractionPoint');
      }else if(value=="line"){
        this.$emit('addInteractionLine');
      }else if(value=="polygon"){
        this.$emit('addInteractionPolygon');
      }else{
        this.$emit('clear');
      }
    },
    handleSelectMeasureInteraction(value){
      if(value=="line"){
        this.$emit('measureInteractionLine');
      }else if(value=="polygon"){
        this.$emit('measureInteractionPolygon');
      }else{
        this.$emit('clear');
      }
    },
    exportMap(value){
      if(value=="png"){
        this.$emit('exportMapPNG');
      }else if(value=="jpg"){
        this.$emit('exportMapJPG');
      }else if(value=="pdf"){
        this.$emit('exportMapPDF');
      }else{
        this.$emit('exportMapJSON');
      }
    },
    dateSearch(){
      this.$emit('dateSearch',this.date);
    },
    actorSearch(){
      this.$emit('actorSearch',this.actorName);
    },
    citynameSearch(){
      this.$emit('citynameSearch',this.cities[this.selectedCity]);
    },
    priceSearch(){
      this.$emit('priceSearch',this.inputNumber1,this.inputNumber2);
    },
    showAll(){
      this.$emit('showAll');
    },
    searchWeather(){
      this.$emit('searchWeather');
    },
    getTopTen(){
      let myChart = echarts.init(document.getElementById('channelCanvas'))
      getRequest("/citycount/getConcertNumByCity").then(resp => {
        if (resp) {
          let obj=new Object();
          this.CityCount2=resp;
          for(let i=0;i<10;i++){
            obj={name:this.CityCount2[i].name,value:parseInt(this.CityCount2[i].count)};
            this.piedata[i]=obj;
            this.pieid[i]=this.CityCount2[i].name;
          }

          // 指定图表的配置项和数据
          let option = {
            //标题
            title: {
              text: '',
              x: 'center',              //标题位置

            },
            // stillShowZeroSum: true,
            //鼠标划过时饼状图上显示的数据
            tooltip: {
              trigger: 'item',
              formatter: '{a}<br/>{b}:{c} ({d}%)'
            },
            //图例
            // legend: {//图例  标注各种颜色代表的模块
            //   // orient: 'vertical',//图例的显示方式  默认横向显示
            //   bottom: 10,//控制图例出现的距离  默认左上角
            //   left: 'center',//控制图例的位置
            //   // itemWidth: 16,//图例颜色块的宽度和高度
            //   // itemHeight: 12,
            //   textStyle: {//图例中文字的样式
            //     color: '#000',
            //     fontSize: 16
            //   },
            //   // data:this.pieid //图例上显示的饼图各模块上的名字
            //   //data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            //   data: this.pieid,
            // },
            // //饼图中各模块的颜色
            color: ['#5AD8A6', '#5D7092', '#F6BD16', '#E8684A', '#6DC8EC', '#9270CA'],
            // 饼图数据
            series: {
              name: '演出',
              type: 'pie',             //echarts图的类型   pie代表饼图
              radius: '70%',           //饼图中饼状部分的大小所占整个父元素的百分比
              center: ['50%', '50%'],  //整个饼图在整个父元素中的位置
              // data: [
              //   {value: 335, name: '直接访问'},
              //   {value: 310, name: '邮件营销'},
              //   {value: 234, name: '联盟广告'},
              //   {value: 135, name: '视频广告'},
              //   {value: 1548, name: '搜索引擎'}],
              data:this.piedata,
              // data:''               //饼图数据
              // data: [                  //每个模块的名字和值
              //   {name: this.City, value: 10},
              //   {name: '北京', value: 30},
              //   {name: '成都', value: 50}
              // ],
              itemStyle: {
                normal: {
                  label: {
                    show: true,//饼图上是否出现标注文字 标注各模块代表什么  默认是true
                    // position: 'inner',//控制饼图上标注文字相对于饼图的位置  默认位置在饼图外
                  },
                  labelLine: {
                    show: true//官网demo里外部标注上的小细线的显示隐藏    默认显示
                  }
                }
              },
            }
          }
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option)

          //console.log(this.pieid)
          // console.log(this.CityCount);
        }
      })
    },
    handleAddInteraction() {
      this.$emit('add-interaction', 'Point');
    },
    // 演唱会数量
    initUserRanking () {
      if (userRankingData.code !== 0) return
      let list = []
      getRequest('/citycount/getConcertNumByCity').then(resp => {
        if (resp) {
          this.allConcertCity=resp;
         // console.log(this.allConcertCity);
          for(let index of this.allConcertCity){
           // console.log(index)
            list.push({
              name:index.name,
              value:index.count
            })
          }
          this.rankingConfig = {
            data: list,
            formatter: true
          }
        }
      })

    },
    // 处理输入事件
    handleInput() {
      // 可以加上一些自定义逻辑，例如输入实时搜索等
    },

    // 处理搜索事件
    handleSearch() {
      // 触发 search 事件，并将搜索关键词作为参数传递给父组件
      this.$emit("search", this.keyword);
    },
    // 用户实时状态
    initUserStates () {
      if (userStates.code !== 0) return
      let applyData = [
        {value: userStates.data.openDoorApprovedCount, name: '申请通过'},
        {value: userStates.data.openDoorApplyCount - userStates.data.openDoorApprovedCount, name: '申请不通过'}
      ]
      let faceData = [
        {value: userStates.data.userFaceNumCount, name: '用户人脸数'},
        {value: userStates.data.userNumCount - userStates.data.userFaceNumCount, name: '非用户人脸数'}
      ]
      this.applyRate = `${((userStates.data.openDoorApprovedCount / userStates.data.openDoorApplyCount) * 100).toFixed(2)}%`
      this.faceRate = `${((userStates.data.userFaceNumCount / userStates.data.userNumCount) * 100).toFixed(2)}%`
      this.applyTotal = this.$parent.formatter(userStates.data.userAllNum)
      this.faceTotal = this.$parent.formatter(userStates.data.userFaceNumCount)
      this.initUserApply(applyData)
      this.initUserFaceRate(faceData)
    },
    // 用户通过率
    initUserApply (data) {
      let myChart = this.$echarts.init(document.getElementById('passRate'))
      myChart.setOption({
        series: [
          {
            name: '实时状态',
            type: 'pie',
            radius: ['45%', '70%'],
            legendHoverLink: false,
            hoverAnimation: false,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            itemStyle:{
              borderWidth:2,
              borderColor:'rgba(16,16,21,0.4)',
            },
            color: ['#41A5FF', '#536382'],
            data: data
          }
        ]
      })
    },
    // 用户人脸开通率
    initUserFaceRate (data) {
      let myChart = this.$echarts.init(document.getElementById('faceRate'))
      myChart.setOption({
        series: [{
          name: '实时状态',
          type: 'pie',
          radius: ['45%', '70%'],
          legendHoverLink: false,
          hoverAnimation: false,
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          itemStyle:{
            borderWidth:2,
            borderColor:'rgba(16,16,21,0.4)',
          },
          color: ['#41A5FF', '#536382'],
          data: data
        }]
      })
    },
    // 用户人群画像
    initUserPortrait () {
      if (userPortraitData.code !== 0) return
      this.manRate = `${((userPortraitData.data.manNumCount / (userPortraitData.data.manNumCount + userPortraitData.data.womanNumCount)) * 100).toFixed(2)}%`
      this.womanRate = `${((userPortraitData.data.womanNumCount / (userPortraitData.data.manNumCount + userPortraitData.data.womanNumCount)) * 100).toFixed(2)}%`
      let optionData = [
        {value: userPortraitData.data.ownerCount || 0, name: '业主'},
        {value: userPortraitData.data.familyCount || 0, name: '家属'},
        {value: userPortraitData.data.tenantCount || 0, name: '租客'},
        {value: userPortraitData.data.visitorCount || 0, name: '访客'},
        {value: userPortraitData.data.ortherCount || 0, name: '其他'}
      ]
      let myChart = this.$echarts.init(document.getElementById('crowdCanvas'))
      myChart.clear()
      let option = {
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          backgroundColor: 'rgba(74, 144, 226, 0.84)',
          formatter: (params) => {
            return `<div>${params.seriesName} <br> ${params.data.name}：${this.$parent.formatter(params.data.value)} (${params.percent}%)</div>`
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          bottom: 20,
          textStyle: {
            color: '#999',
            padding: [3, 0, 0, 3]
          },
          itemWidth: 10,
          itemHeight: 10,
          selectedMode: false,
          icon: 'circle',
          data: ['业主', '家属', '租客', '访客', '其他']
        },
        series: [
          {
            name: '用户人群画像',
            type: 'pie',
            radius: '55%',
            left: '-20%',
            top: -70,
            center: ['50%', '60%'],
            itemStyle:{
              borderWidth:2,
              borderColor:'rgba(16,16,21,0.4)',
              normal : {
                label : {
                  show : false
                },
                labelLine : {
                  show : false
                }
              }
            },
            color: ['#61AECF', '#E8684A', '#F6BD16', '#5D7092', '#5AD8A6'],
            data: optionData,
          }
        ]
      }
      myChart.setOption(option)
      this.$LoopShowTooltip(myChart, option, {loopSeries: true, interval: 4000})
    },
    // 用户开门渠道占比
    initUserChannelCanvas () {
      if (userChannelData.code !== 0) return
      let optionData = [
        {value: userChannelData.data.wxMiniOpenCount || 0, name: '小程序开门'},
        {value: userChannelData.data.userFaceOpenCount || 0, name: '人脸开门用户'},
        {value: userChannelData.data.appOpenCount || 0, name: 'App开门'},
        {value: userChannelData.data.aliPayOpenCount || 0, name: '支付宝开门'},
        {value: userChannelData.data.otherOpenCount || 0, name: '其他'}
      ]
      let myChart = this.$echarts.init(document.getElementById('channelCanvas'))
      let option = {
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(74, 144, 226, 0.84)',
          formatter: (params) => {
            return `<div>${params.seriesName} <br> ${params.data.name}：${this.$parent.formatter(params.data.value)} (${params.percent}%)</div>`
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          bottom: 20,
          textStyle: {
            color: '#999',
            padding: [2, 0, 0, 3]
          },
          itemWidth: 10,
          itemHeight: 10,
          icon: 'circle',
          selectedMode: false,
          data: ['小程序开门', '人脸开门用户', 'App开门', '支付宝开门', '其他']
        },

        series: [
          {
            name: '开门渠道占比',
            type: 'pie',
            left: '-22%',
            top: '3%',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: true
            },
            itemStyle:{
              borderWidth:2,
              borderColor:'rgba(16,16,21,0.4)',
            },
            emphasis: {
              label: {
                color: '#4a90e2',
                show: true,
                fontSize: '14',
                lineHeight: 22,
                formatter: '{d}% \n {b}'
              },
            },
            color: ['#60ADCD', '#517EDA', '#C95C45', '#F6BD16', '#51BC93', '#536382'],
            data: optionData
          }
        ]
      }
      myChart.setOption(option)
      this.$LoopShowTooltip(myChart, option, {loopSeries: true, interval: 4000})
    }
  }
}
</script>
<style>

.centered-button {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.transparent-button {
  opacity: 1;
  background-color: transparent;
  color: white;
}

</style>
