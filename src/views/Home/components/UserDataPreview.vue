<template>
  <!-- 全国用户详情 -->
  <div class="user-data-preview">
    <!-- 左侧数据预览 -->
    <div class="data-overview left-layout">
<!--      <div class="user-details">-->
<!--        <p class="content-title">累计数据概览</p>-->
<!--        <ul>-->
<!--          <li v-for="(item, index) in userData" :key="index" :class="[{'allUser': item.id === 'allUser'}, {'allUserOpen': item.id === 'allUserOpen'},-->
<!--              {'allOpen': item.id === 'allOpen'}, {'allUserFace': item.id === 'allUserFace'}]">-->
<!--            <div class="user-flop-box">-->
<!--              <div>-->
<!--                <span :class="[{'flop-figure': !isNaN(ls)}, {'flop-comma': isNaN(ls)}]"  v-for="(ls, index) in item.valueArr" :key="item.id + index">-->
<!--                  <i v-if="!isNaN(ls)">0123456789</i>-->
<!--                  <span v-else>{{ls}}</span>-->
<!--                </span>-->
<!--              </div>-->
<!--              <div>-->
<!--                <img :src="item.type === 0 ? riseImage : declineImage" alt="">-->
<!--                <span :class="{'decline': item.type === 1}">{{item.typeValue}}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div>{{item.name}}</div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
      <div class="city-ranking">
        <p class="content-title">演唱会数量城市排行</p>
        <ScrollRankingBoard class="ranking" :config="rankingConfig"></ScrollRankingBoard>
      </div>
    </div>
    <!-- 右侧状态 -->
    <div class="live-status right-layout">
<!--      <dv-border-box-8 class="status-details" :style="{'height': height}">-->
<!--        <p class="content-title">实时状态</p>-->
<!--        <div class="content">-->
<!--          <ul>-->
<!--            <li>-->
<!--              <div id="passRate" style="width: 120px;height: 120px"></div>-->
<!--              <p>审核通过率 {{applyRate}}</p>-->
<!--              <p>{{applyTotal}}</p>-->
<!--              <p>累计注册用户</p>-->
<!--            </li>-->
<!--            <li>-->
<!--              <div id="faceRate" style="width: 120px;height: 120px"></div>-->
<!--              <p>人脸开通率 {{faceRate}}</p>-->
<!--              <p>{{faceTotal}}</p>-->
<!--              <p>录入人脸图像(张)</p>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
<!--      </dv-border-box-8>-->
<!--      <dv-border-box-8 class="portrait-crowd" :style="{'height': height}">-->
<!--        <p class="content-title">用户人群画像</p>-->
<!--        <div class="content">-->
<!--          <div class="portrait">-->
<!--            <div>-->
<!--              <img src="@/assets/boy.png" alt="">-->
<!--              <p>男</p>-->
<!--              <p>{{manRate}}</p>-->
<!--            </div>-->
<!--            <div>-->
<!--              <img src="@/assets/girl.png" alt="">-->
<!--              <p>女</p>-->
<!--              <p>{{womanRate}}</p>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div id="crowdCanvas"></div>-->
<!--        </div>-->
<!--      </dv-border-box-8>-->
      <dv-border-box-8 class="channel-proportion" :style="{'height': height}">
        <p class="content-title">演唱会数量排名前十城市占比</p>
        <div class="content">
          <div id="channelCanvas" style="width: 100%; height: 225px"></div>
        </div>
      </dv-border-box-8>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { previewData, userRankingData, userStates, userPortraitData, userChannelData } from '../../../utils/jsonData'
// 自定义排名轮播
import ScrollRankingBoard from '@/components/ScrollRankingBoard/src/index'
import {getRequest} from "@/utils/api";
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
      }
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
  },
  methods: {
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
            color: ['#265170', '#b6a2de', '#5ab1ef','#53bbf5'],
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
    // 用户数据概览
    initUserDataPreview () {
      if (previewData.code !== 0) return
      this.allUserNumCount = previewData.data.allUserNumCount
      this.userData = []
      this.userData.push({
        id: 'allUser',
        name: '累计注册用户',
        value: this.$parent.formatter(previewData.data.allUserNumCount),
        valueArr: this.$parent.formatter(previewData.data.allUserNumCount).split(''),
        type: previewData.data.allUserNumUpType,
        typeValue: `${(+previewData.data.allUserNumPercentage * 100).toFixed(1)}%`
      }, {
        id: 'allUserOpen',
        name: '累计开门人数',
        value: this.$parent.formatter(previewData.data.allUserOpenNumCount),
        valueArr: this.$parent.formatter(previewData.data.allUserOpenNumCount).split(''),
        type: previewData.data.allUserOpenNumUpType,
        typeValue: `${(+previewData.data.allUserOpenNumPercentage * 100).toFixed(1)}%`
      }, {
        id: 'allOpen',
        name: '累计开门次数',
        value: this.$parent.formatter(previewData.data.allOpenNumCount),
        valueArr: this.$parent.formatter(previewData.data.allOpenNumCount).split(''),
        type: previewData.data.allOpenNumUpType,
        typeValue: `${(+previewData.data.allOpenNumCountPercentage * 100).toFixed(1)}%`
      }, {
        id: 'allUserFace',
        name: '累计人脸开门次数',
        value: this.$parent.formatter(previewData.data.allUserFaceOpenNumCount),
        valueArr: this.$parent.formatter(previewData.data.allUserFaceOpenNumCount).split(''),
        type: previewData.data.allUserFaceOpenNumCountUpType,
        typeValue: `${(+previewData.data.allUserFaceOpenNumCountPercentage * 100).toFixed(1)}%`
      })
      setTimeout(() => {
        this.$parent.timedRefresh(this.userData, 'user')
      }, 1000)
    },
    // 用户开门用户城市排行
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

