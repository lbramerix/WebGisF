<template>
  <div class="home-container">
    <!-- loading -->
    <div class="loading" v-if="isLoading">
      <dv-loading>Loading...</dv-loading>
    </div>
    <!-- 头部 -->
    <header>
      <div class="header-back">
        <div>
          <img class="img" src="@/assets/home_back.png" alt="">
        </div>
        <img class="full-img" @click="showFullScreen" src="@/assets/fullscreen.png" alt="">
      </div>
      <div class="header-city" @click="getTest">

        <p>全国演唱会统计分析大屏区域： {{testCityname}}</p>
        <dv-decoration-5 style="width:600px;height:40px;" />
      </div>
      <div class="right">
        <div>
          <p :class="{'active': active === 2}" @click="handleChangeType(2)">演唱会信息</p>
          <p :class="{'active': active === 1}" @click="handleChangeType(1)">艺人统计</p>
        </div>
<!--        <dv-decoration-3 style="width:250px;height:30px;" />-->
        <!-- 地图工具组件 -->
        <button @click="addInteraction('Point')">绘制点</button>
        <button @click="addInteraction('LineString')">绘制线</button>
        <button @click="addInteraction('Polygon')">绘制多边形</button>
        <button @click="clearMap()">清除</button>
        <button @click="exportMapPNG">导出</button>
        <button @click="downloadGeoJSON">导出json</button>

      </div>
    </header>
    <dv-decoration-10 style="width:100%;height:5px;" />

    <section ref="sectionRef">
      <!-- 地图 -->
      <!--      <div id="userMap" style="height: 100%"></div>-->
      <div
          id="userMap"
          class="map-bg"
          style="height: 100%">
        <div
            ref="map"
            style="background: rgb(0, 25, 46); position: absolute"
            id="map"
        >
          <div id="mouse-position"/>
<!--          <div id="scale" class="ol-scale-bar"/>-->
          <div id="scale-bar"></div>
          <div id="popup" class="ol-popup">
            <a
                href="#"
                id="popup-closer"
                class="ol-popup-closer"
                @click="overlay.setPosition(undefined)"
            ></a>
            <div id="popup-content" class="popup-content"></div>
          </div>
        </div>
      </div>
      <!-- 全国用户数据 -->
      <div class="data-info">
        <ul>
          <li v-for="item in cityInfoList" :key="item.id"
              :class="[{'u-iotdoor': item.id === 'u-iotdoor'}, {'u-city': item.id === 'u-city'}, {'u-community': item.id === 'u-community'}]">
            <div>
              <span :class="[{'flop-figure': !isNaN(ls)}, {'flop-comma': isNaN(ls)}]" v-for="(ls, index) in item.valueArr" :key="item.id + index">
                <i v-if="!isNaN(ls)">0123456789</i>
                <span v-else>{{ls}}</span>
              </span>
              <div class="percentage">
                <img :src="item.type === 0 ? riseImage : declineImage" alt="">
                <span class="span" :class="{'decline': item.type === 1}">{{item.percentage}}</span>
              </div>
            </div>
            <div>{{item.name}}</div>
          </li>
        </ul>
      </div>
      <keep-alive>
        <div>
          <UserDataPreview
              ref="user"
              :height="height"
              :fullscreen="fullscreen"
              v-if="active === 2"
              :riseImage="riseImage"
              :declineImage="declineImage"
          ></UserDataPreview>
          <DeviceDataPreview
              v-if="active === 1"
              :height="height"
              :fullscreen="fullscreen"
              :riseImage="riseImage"
              :declineImage="declineImage"
          ></DeviceDataPreview>
        </div>

      </keep-alive>

    </section>
    <!-- 气泡详情 -->
    <div ref="popover" class="city-popover">
      <p class="popover-title">区域： {{bubbleData.cityName}}</p>
      <div>
        <div>
          <canvas id="cityPopover" width="120px" height="120px"></canvas>
        </div>
        <div>
          <p>演唱会总数 &nbsp; {{bubbleData.openUserCount}}</p>
          <!--          <p>设备总数 &nbsp; {{bubbleData.iotDoorControlCount}}</p>-->
          <!--          <p>小区总数 &nbsp; {{bubbleData.communityCount}}</p>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Scene, PointLayer, Popup } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
import UserDataPreview from './components/UserDataPreview'
import DeviceDataPreview from './components/DeviceDataPreview'
import { cityData } from '../../utils/jsonData'

/* 从openlayers 引入方法 */
import * as Coordinate from "ol/coordinate"
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import * as Control from "ol/control";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Snap from 'ol/interaction/Snap';
import domtoimage from 'dom-to-image';
import { defaults as defaultInteractions } from "ol/interaction";
import Overlay from "ol/Overlay";
import { GeoJSON } from 'ol/format';
import jsPDF from 'jspdf';

/* 引入混合文件 */
import { mapjs } from "../../utils/map";
// import {getRequest} from "@/utils/api";

import { mapState, mapMutations } from "vuex";
export default {
  name: 'DataPreview',
  mixins: [mapjs],
  components: { UserDataPreview, DeviceDataPreview },
  computed: {
    ...mapState(["isFull"]),
  },
  data () {
    return {
      testCityname:'',
      active: 2,
      isLoading: false,
      fullscreen: false,
      height: '',
      cityInfoList: [],
      updateTime: '',
      riseImage: require('@/assets/rise.png'),
      declineImage: require('@/assets/decline.png'),
      bubbleData: {
        cityCode: '',
        cityName: '',
        proportion: '',
        communityCount: '',
        openUserCount: '',
        iotDoorControlCount: ''
      },
      map: null,
      //实例化鼠标位置控件（MousePosition）
      mousePositionControl: null,
      //实例化比例尺控件（ScaleLine）
      scaleLineControl: null,

      defaultList: [], //需要一直展示的图层
      overlay: null, //overlay信息
      selectedFeature: null, //选中的要素
      buttons: [
        { img: require("@/assets/images/buttons2.png") },
        { img: require("@/assets/images/buttons1.png") },
      ], //control buttons icons
      buttonsIndex: -1, //control buttons index
      /* 制造假数据 */
      fakePointData2: [
        {
          lon: 120.95,
          lat: 30.53,
          name: "浙F62785",
          a1: "6轴",
          b1: "2023-12-10",
          c1: "13514892915",
          a2: "货3403222104447",
          b2: "2022-07-09 10:09:39",
          c2: "海盐县百顺建材有限公司",
          d1: "浙江省嘉兴市海盐县秦山街道丰山村小牌洋",
          img: require("@/assets/images/fake_car.png"),
        },
        {
          lon: 120.9,
          lat: 30.43,
          name: "浙F33820",
          a1: "6轴",
          b1: "2023-8-19",
          c1: "13878239402",
          a2: "货340290458872",
          b2: "2022-07-020 12:49:38",
          c2: "海盐县百顺建材有限公司",
          d1: "浙江省嘉兴市海盐县秦山街道丰山村小牌洋",
          img: require("@/assets/images/fake_car.png"),
        },
      ],
      fakePointData1: [
        {
          lon: 120.777771,
          lat: 30.537012,
          name: "嘉兴征宇混凝土制品有限公司", // 企业名称
          a1: "百步镇", // 所属街道
          b1: "13辆", // 进入过车数
          c1: "何群丽", // 联系人
          a2: "散装办", // 监管单位
          b2: "2辆", // 自查自纠数
          c2: "13758385003", // 联系电话
          d1: "海盐县百步镇龙潭屿666号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.77,
          lat: 30.53,
          name: "嘉兴超盛建材股份有限公司",
          a1: "百步镇", // 所属街道
          b1: "0辆", // 进入过车数
          c1: "沈张林", // 联系人
          a2: "县经信局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13606733698", // 联系电话
          d1: "海盐县百步镇白联村", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.91,
          lat: 30.38,
          name: "浙江林龙港口有限公司",
          a1: "澉浦镇", // 所属街道
          b1: "0辆", // 今日过车数
          c1: "吴叶芳", // 联系人
          a2: "嘉兴市港务局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13605731922", // 联系电话
          d1: "海盐县澉浦镇澉南村", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 121.02193,
          lat: 30.57006,
          name: "嘉兴港海盐码头有限公司",
          a1: "西塘桥街道", // 所属街道
          b1: "0辆", // 今日过车数
          c1: "吉永祥", // 联系人
          a2: "嘉兴市港务管理局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13511399016", // 联系电话
          d1: "西塘桥街道海港大道18号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 121.02,
          lat: 30.56,
          name: "浙江协和港务有限公司",
          a1: "西塘桥街道", // 所属街道
          b1: "12辆", // 今日过车数
          c1: "黄斌", // 联系人
          a2: "嘉兴市港务管理局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "0573-86588085", // 联系电话
          d1: "海港大道18号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 121.01,
          lat: 30.6,
          name: "浙江山鹰纸业有限公司",
          a1: "西塘桥街道", // 所属街道
          b1: "0辆", // 今日过车数
          c1: "陈光", // 联系人
          a2: "经济发展办公室", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "0573-86861243", // 联系电话
          d1: "海港大道2009号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 121.00422,
          lat: 30.55871,
          name: "浙江协和首信钢业有限公司",
          a1: "西塘桥街道", // 所属街道
          b1: "0辆", // 今日过车数
          c1: "邵益华", // 联系人
          a2: "县经信局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "18257366666", // 联系电话
          d1: "海盐县西塘桥街道杭州湾大道3889号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.927879,
          lat: 30.457932,
          name: "海盐秦山南方水泥有限公司",
          a1: "秦山街道", // 所属街道
          b1: "5辆", // 今日过车数
          c1: "沈元明", // 联系人
          a2: "县经信局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13819736711", // 联系电话
          d1: "海盐县秦山街道何家桥综合物流园区", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.834206,
          lat: 30.572267,
          name: "海盐海潮水泥制管股份有限公司",
          a1: "沈荡镇", // 所属街道
          b1: "0辆", // 进入过车数
          c1: "林加生", // 联系人
          a2: "海盐县住建局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "15990330813", // 联系电话
          d1: "沈荡大洋路", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.815781,
          lat: 30.590014,
          name: "海盐沈荡南方混凝土有限公司",
          a1: "沈荡镇", // 所属街道
          b1: "0辆", // 今日过车数
          c1: "权森", // 联系人
          a2: "县住建局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "86722365", // 联系电话
          d1: "海盐县沈荡镇横泾村", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.844139,
          lat: 30.578161,
          name: "嘉兴创奇环保材料有限公司",
          a1: "沈荡镇", // 所属街道
          b1: "0辆", // 今日过车数
          c1: "巢生", // 联系人
          a2: "经信局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13901703913", // 联系电话
          d1: "海盐县沈荡镇中钱村", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        /* {
					lon: 120.864444,
					lat: 30.486563,
					name: '嘉兴广益建材股份有限公司',
					img: require('@/assets/images/fake_dw.png')
				}, */
        {
          lon: 120.844398,
          lat: 30.451412,
          name: "海盐南方水泥有限公司",
          a1: "通元镇", // 所属街道
          b1: "16辆", // 今日过车数
          c1: "沈元明", // 联系人
          a2: "县经信局", // 监管单位
          b2: "2辆", // 自查自纠数
          c2: "13819736712", // 联系电话
          d1: "海盐县通元镇石泉集镇", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.864246,
          lat: 30.487808,
          name: "浙江兆弟桩业有限公司",
          a1: "海盐县经济和信息化局", // 所属街道
          b1: "0辆", // 进入过车数
          c1: "朱建红", // 联系人
          a2: "散装办", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "0573-86610123", // 联系电话
          d1: "通元滕泾金星组", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.927719,
          lat: 30.55002,
          name: "中天浦发（海盐）线材制造有限公司",
          a1: "望海街道", // 所属街道
          b1: "6辆", // 进入过车数
          c1: "杨忠明", // 联系人
          a2: "海盐县港行管理处", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13706838859", // 联系电话
          d1: "盐沈线升界桥东", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.959214,
          lat: 30.565627,
          name: "浙江百纳仓储管理有限公司",
          a1: "望海街道", // 所属街道
          b1: "0辆", // 今日过车数
          c1: "王明为", // 联系人
          a2: "县交通运输局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13906834589", // 联系电话
          d1: "海盐县望海街道盐东区静工路18号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.89,
          lat: 30.52,
          name: "海盐汇强桩业股份有限公司",
          a1: "于城镇", // 所属街道
          b1: "8辆", // 今日过车数
          c1: "薛丁飞", // 联系人
          a2: "住建局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "0573-89051225", // 联系电话
          d1: "盐湖公路813号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.889351,
          lat: 30.51731,
          name: "海盐县秦山混凝土股份有限公司",
          a1: "于城镇", // 所属街道
          b1: "0辆", // 进入过车数
          c1: "刘建红", // 联系人
          a2: "散装办", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13586494117", // 联系电话
          d1: "盐湖公路813号", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.89,
          lat: 30.54,
          name: "浙江祥龙物流有限公司",
          a1: "于城镇", // 所属街道
          b1: "0辆", // 进入过车数
          c1: "陶海翔", // 联系人
          a2: "县交通运输局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "13857329882", // 联系电话
          d1: "海盐县于城镇八字村", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
        {
          lon: 120.857851,
          lat: 30.480465,
          name: "嘉兴广益建材股份有限公司",
          a1: "通元镇", // 所属街道
          b1: "0辆", // 进入过车数
          c1: "金雪峰", // 联系人
          a2: "经信局", // 监管单位
          b2: "0辆", // 自查自纠数
          c2: "-", // 联系电话
          d1: "嘉南线滕泾村西", // 单位地址
          img: require("@/assets/images/fake_dw.png"),
        },
      ],
    }
  },
  mounted () {
    // this.initUserMap()

    /* 初始化地图生成方法 */
    this.mapInit();
    setTimeout(() => {
      this.map.updateSize();
    }, 0);
    this.showLoading()
    this.setElementHeight()
    window.addEventListener('resize', this.setElementHeight)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.setElementHeight)
    })
  },
  methods: {
    getTest(){
      //初始化新闻总数

      // getRequest('/citycount/testCity').then(resp => {
      //   if (resp) {
      //     this.testCityname=resp;
      //     console.log(this.testCityname);
      //   }
      // })

    },
    ...mapMutations(["setFull"]),

    // 获取数据

    /* 初始化地图 */
    mapInit() {
      this.vectorSource = new VectorSource({
        features: [],
      });
      const vectorLayer = new VectorLayer({
        source: this.vectorSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33',
            }),
          }),
        }),
      });
      const topResolution = 360.0 / 512;
      const resolutions = [];
      for (let zoom = 0; zoom < 22; zoom++) {
        resolutions.push(topResolution / Math.pow(2, zoom));
      }
      let mapUrl = new TileLayer({
        source: new XYZ({
          crossOrigin: 'anonymous',
          url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
        }),
      });
      //实例化鼠标位置控件（MousePosition）
      this.mousePositionControl = new Control.MousePosition({
        //坐标格式
        coordinateFormat: Coordinate.createStringXY(4),
        //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
        projection: 'EPSG:4326',
        //坐标信息显示样式类名，默认是'ol-mouse-position'
        className: 'custom-mouse-position',
        //显示鼠标位置信息的目标容器
        target: document.getElementById('mouse-position'),
        //未定义坐标的标记
        undefinedHTML: '&nbsp;'
      });
      //实例化比例尺控件（ScaleLine）
      this.scaleLineControl = new Control.ScaleLine({
        //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
        units: "metric",
        //bar: true,
        target: document.getElementById('scale-bar'),
        className: 'ol-scale-line'
      });

      this.map = new Map({
        target: "map", // 指向对象
        layers: [mapUrl,vectorLayer],
        view: new View({
          center: [120.93, 30.46],
          padding: [100, 100, 100, 100],
          zoom: 9.8,
          projection: "EPSG:4326",
          resolutions: resolutions,
          // maxZoom: 20,
          // minZoom: 6,
        }),
        controls: new Control.defaults({
          attribution: false,
          zoom: false,
          rotate: false,
        }).extend([this.scaleLineControl]).extend([this.mousePositionControl]),
        interactions: defaultInteractions({
          doubleClickZoom: false, //是否需要双击缩放
        }),
      });
      // let that = this;
      const popup = document.getElementById("popup");
      this.overlay = new Overlay({
        autoPan: true,
        element: popup,
      });
      this.map.addOverlay(this.overlay);
      //地图缩放触发
      this.map.getView().on("change:resolution", () => {
        let that = this;
        if (that.map.getView().getZoom() >= 1) {
          that.regionLayers.map((item) => {
            that.map.removeLayer(item);
          });
          that.addRegion();
        } else {
          that.regionLayers.map((item) => {
            that.map.removeLayer(item);
          });
          that.addModal();
        }
      });
      /* 地图单击事件 */
      this.map.on("singleclick", function(evt) {
        let content = document.getElementById("popup-content");
        content.innerHTML = "";
        this.overlay.setPosition(undefined);
        //判断当前单击处是否有要素，捕获到要素时弹出popup
        this.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
          if (
              feature &&
              !this.clickClose &&
              (feature.values_.attribute || (feature.values_ && feature.values_.features && feature.values_.features.length > 0))
          ) {
            this.selectFeature(feature);
          } else {
            this.unSelect();
          }
        }.bind(this));
      }.bind(this));

      // this.map.on("singleclick", (evt) => {
      //   let content = document.getElementById("popup-content");
      //   content.innerHTML = "";
      //   that.overlay.setPosition(undefined);
      //   //判断当前单击处是否有要素，捕获到要素时弹出popup
      //   that.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      //     if (
      //         feature &&
      //         !that.clickClose &&
      //         (feature.values_.attribute || feature.values_.features.length > 0)
      //     ) {
      //       that.selectFeature(feature);
      //     } else {
      //       that.unSelect();
      //     }
      //   });
      // });
      /* 添加矢量遮罩图层 */
      this.addModal();
      /* 模拟假数据打点 */
      this.setMap(this.fakePointData1, "hyytdw");
      this.setMap(this.fakePointData2, "hycl");
    },
    addInteraction(type) {
      this.clearMap();

      const draw = new Draw({
        source: this.vectorSource,
        type,
      });

      this.map.addInteraction(draw);

      this.draw = draw;

      const modify = new Modify({
        source: this.vectorSource,
      });

      this.map.addInteraction(modify);

      this.modify = modify;

      const snap = new Snap({
        source: this.vectorSource,
      });

      this.map.addInteraction(snap);

      this.snap = snap;
    },
    clearMap() {
      if (this.draw) {
        this.map.removeInteraction(this.draw);
      }

      if (this.modify) {
        this.map.removeInteraction(this.modify);
      }

      if (this.snap) {
        this.map.removeInteraction(this.snap);
      }

      this.vectorSource.clear();

      this.measurementResult = null;
    },
    /**导出地图PNG格式*/
    exportMapPNG() {
      // 获取地图容器元素
      const mapElement = document.getElementById('map');
      // 将地图容器转换成图片并下载
      domtoimage.toPng(mapElement)
          .then(function (dataUrl) {
            // 创建一个 <a> 标签下载
            const link = document.createElement('a');
            link.download = 'map.png';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(function (error) {
            console.error('导出地图失败:', error);
          });
    },
    /**导出地图JPG格式*/
    exportMapJPG() {
      // 获取地图容器元素
      const mapElement = document.getElementById('map');
      domtoimage.toJpeg(mapElement, { quality: 0.95 })
          .then(function (dataUrl) {
            // 创建一个 <a> 标签下载
            const link = document.createElement('a');
            link.download = 'map.jpg';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(function (error) {
            console.error('导出地图失败:', error);
          });
    },
    /**导出地图PDF格式*/
    exportMapPDF() {
      // 获取地图容器元素
      const mapElement = document.getElementById('map');
      // 将地图容器转换为图像并导出为 PDF
      domtoimage.toPng(mapElement)
          .then(function (dataUrl) {
            // 创建新的 PDF 实例
            const pdf = new jsPDF('l', 'mm', [297, 210]);

            // 将图像添加到 PDF 文档中
            pdf.addImage(dataUrl, 'PNG', 10, 10, 277, 190);

            // 下载生成的 PDF 文件
            pdf.save('map.pdf');
          })
          .catch(function (error) {
            console.error('导出地图失败:', error);
          });
    },
    /**导出地图JSON格式*/
    downloadGeoJSON() {
      const features = [];
      this.map.getLayers().forEach(layer => {
        if (layer instanceof VectorLayer) {
          layer.getSource().getFeatures().forEach(feature => {
            features.push(feature);
          });
        }
      });

      const geojsonFormat = new GeoJSON();
      const geojsonObject = geojsonFormat.writeFeaturesObject(features);
      const geojsonStr = JSON.stringify(geojsonObject);

      const filename = 'map.json';
      const data = JSON.stringify(geojsonStr, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // 使用 XMLHttpRequest 对象下载文件
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.responseType = 'blob';

      xhr.onload = function () {
        const blob = new Blob([xhr.response], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      };

      xhr.send();
    },
    /* getCheck获取右下角checkllist */
    getCheck(checkList) {
      /* 若有弹窗关闭掉 */
      this.unSelect();
      this.checkedListArr = checkList; //把获取到的数据缓存起来
      const layerNames = [];
      //不能让默认的图层被隐藏
      let allList = checkList.concat(this.defaultList);
      this.checkedList = allList;
      this.layers.map((item) => {
        if (allList.indexOf(item.getProperties().name) === -1) {
          item.setVisible(false);
        } else {
          item.setVisible(true);
        }
        layerNames.push(item.getProperties().name);
      });
    },
    /* click control buttons index */
    clickButtons(index) {
      if (this.buttonsIndex == index) {
        this.buttonsIndex = -1;
      } else {
        this.buttonsIndex = index;
      }
      if (index == 0) {
        /* 全屏与否动态重新设置层级大小 */
        if (this.isFull) {
          this.map.getView().setZoom(9.5);
        } else {
          this.map.getView().setZoom(10.8);
        }
        this.setFull(!this.isFull);
        /* 做些什么 */
        setTimeout(() => {
          this.map.updateSize();
        }, 0);
      }
    },
    // 用户地图
    initUserMap () {
      const scene = new Scene({
        id: 'userMap',
        map: new GaodeMap({
          pitch: 0,
          style: 'dark',
          mapStyle: 'amap://styles/darkblue',
          center: [ 113.631419, 34.753439 ],
          zoom: 5,
          token: 'ced0d726cd96553ba8b5b3521671aaf4'
        })
      });
      scene.on('loaded', () => {
        if (cityData.code !== 0) return
        this.allCommunityCount = cityData.data.communityCount
        this.cityInfoList = []
        this.cityInfoList.push(
            //     {
            //   id: 'u-iotdoor',
            //   name: '全国社区设备总量',
            //   value: this.formatter(cityData.data.iotdoorControlCount),
            //   valueArr: this.formatter(cityData.data.iotdoorControlCount).split(''),
            //   type: cityData.data.iotdoorControlCountUpType,
            //   percentage: `${(cityData.data.iotdoorControlCountPercentage * 100).toFixed(1)} %`
            // },
            {
              id: 'u-community',
              name: '全国演唱会总量',
              value: "233",
              // value: this.formatter(cityData.data.cityCount),
              valueArr: this.formatter(cityData.data.cityCount).split(''),
              type: cityData.data.cityCountUpType,
              percentage: `${(cityData.data.cityCountPercentage * 100).toFixed(1)}%`
            }
            // , {
            //   id: 'u-city',
            //   name: '全国住宅社区',
            //   value: this.formatter(cityData.data.communityCount),
            //   valueArr: this.formatter(cityData.data.communityCount).split(''),
            //   type: cityData.data.communityCountUpType,
            //   percentage: `${(cityData.data.communityCountPercentage * 100).toFixed(1)}%`
            // }
        )
        this.timedRefresh(this.cityInfoList, 'city')
        cityData.data.cityList.sort((a, b) => {
          return a.communityCount - b.communityCount
        })
        cityData.data.cityList.forEach((t, index) => {
          if (t.communityCount === 1) {
            t.count = 100
          } else {
            t.count = 101 + index * 0.1
          }
        })
        const pointLayer = new PointLayer({ zIndex: 1 })
            .source(cityData.data.cityList, {
              parser: {
                type: 'json',
                x: 'longitude',
                y: 'latitude'
              }
            })
            .shape('circle')
            .animate(true)
            .size('count', [ 0, 45 ])
            .color('count', [
              '#3CA0FF',
              '#3CA0FF',
              '#3CA0FF',
            ])
            .active(true)
            .style({
              opacity: 0.5,
              strokeWidth: 0
            });
        pointLayer.on('mousemove', e => {
          clearTimeout(this.pointTimer)
          this.pointTimer = setTimeout(() => {
            const iotPercentage = (e.feature.iotDoorControlCount / cityData.data.iotdoorControlCount).toFixed(2) > 0.001 ? (e.feature.iotDoorControlCount / cityData.data.iotdoorControlCount).toFixed(2) : 0.001
            const openPercentage = (e.feature.openUserCount / cityData.data.userCommunity).toFixed(2) > 0.001 ? (e.feature.openUserCount / cityData.data.userCommunity).toFixed(2) : 0.001
            const communityPercentage = (e.feature.communityCount / cityData.data.communityCount).toFixed(2) > 0.001 ? (e.feature.communityCount / cityData.data.communityCount).toFixed(2) : 0.001
            const ringData = [{
              id: 'open',
              radius: 45,
              value: openPercentage,
              percentageData: [{color: '#3aacf3', value: openPercentage}, {color: 'rgba(183, 226, 255, 0.3)', value: 1 - openPercentage}]
            }, {
              id: 'iot',
              radius: 30,
              value: iotPercentage,
              percentageData: [{color: '#5ad8a6', value: iotPercentage}, {color: 'rgba(183, 226, 255, 0.3)', value: 1 - iotPercentage}]
            }, {
              id: 'community',
              radius: 15,
              value: communityPercentage,
              percentageData: [{color: '#ff6a00', value: communityPercentage}, {color: 'rgba(183, 226, 255, 0.3)', value: 1 - communityPercentage}]
            }]
            this.bubbleData = {
              cityCode: e.feature.cityCode,
              cityName: e.feature.cityName,
              proportion: `${((e.feature.communityCount / this.allCommunityCount) * 100).toFixed(2)}%`,
              communityCount: this.formatter(e.feature.communityCount),
              openUserCount: this.formatter(e.feature.openUserCount),
              iotDoorControlCount: this.formatter(e.feature.iotDoorControlCount)
            }
            const popup = new Popup({
              offsets: [ 0, 0 ],
              className: 'city-popup',
              closeButton: false
            })
                .setLnglat(e.lngLat)
                .setDOMContent(this.$refs.popover)
            scene.addPopup(popup);
            this.initUserPopover(ringData)
          }, 100)
        });
        scene.addLayer(pointLayer);
      });
    },
    // 用户城市气泡
    initUserPopover (arrList) {
      let canvas = document.getElementById('cityPopover');
      let ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
      //填充画布
      ctx.lineWidth = 8
      let beginDeg = Math.PI * 1.5
      let endDeg = Math.PI * 1.5
      arrList.forEach((t, index) => {
        t.percentageData.forEach((l) => {
          endDeg = beginDeg + (2 * Math.PI * l.value);
          ctx.beginPath()
          ctx.strokeStyle = l.color
          ctx.arc(60, 60, t.radius, beginDeg, endDeg, false);
          ctx.stroke();
          beginDeg = endDeg
          ctx.closePath();

          ctx.moveTo(0,0);//移动笔触到原点
          ctx.fillStyle = 'white';//文本颜色
          ctx.font='12px normal ';
          ctx.textAlign = 'right';
          ctx.fillText(`${(t.value * 100).toFixed(1)}%`,55, (index + 1) * 16);
        })
      })
    },
    // 视图切换
    handleChangeType (val) {
      if (this.active === val) return
      this.active = val
      this.showLoading()
    },
    // 关闭延时器
    showLoading () {
      this.isLoading = true
      this.timer = setTimeout(() => {
        this.isLoading = false
        window.clearTimeout(this.timer)
      }, 1500)
    },
    // 全屏
    showFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 数字3位数加分隔符
    formatter (str) {
      let reg =/(?=(?!\b)(\d{3})+$)/g
      return str.toString().replace(reg, ',')
    },
    // 设置DOM高度
    setElementHeight () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.showLoading()
        this.height = `${(this.$refs.sectionRef.offsetHeight - 30) / 3}px`
      }, 100)
    },
    // 设置文字滚动
    setNumberTransform (item) {
      const numberItems = document.querySelectorAll(`.${item.id}  i`)
      // const numberItems = this.$refs[`${item.id}`]
      const numberArr = item.valueArr.filter(item => !isNaN(item))
      numberItems.forEach((t) => {
        t.style.transition = 'transform 0s ease-in-out'
        t.style.transform = `translateY(-0%)`
      })
      setTimeout(() => {
        numberItems.forEach((ls, index) => {
          ls.style.transition = 'transform 0.8s ease-in-out'
          ls.style.transform = `translateY(-${numberArr[index] * 10}%)`
        })
      }, 15)
    },
    // 定时
    initInterval (targetList, time) {
      const { setNumberTransform } = this
      return setInterval((function fn(){
        targetList.forEach(t => {
          setTimeout(() => {
            setNumberTransform(t)
          }, 50)
        })
        return fn
      })(), time)
    },
    // 定时刷新数字翻牌器
    timedRefresh (targetList, type) {
      let cityTimer;
      let userTimer;
      let deviceTimer;
      if (type === 'city') {
        cityTimer = this.initInterval(targetList, 8000)
      } else if (type === 'user') {
        userTimer = this.initInterval(targetList, 10000)
      } else if (type === 'device') {
        deviceTimer = this.initInterval(targetList, 8000)
      }
      this.$once('hook:beforeDestroy', () => {
        clearInterval(cityTimer)
        clearInterval(userTimer)
        clearInterval(deviceTimer)
        userTimer = null
        cityTimer = null
        deviceTimer = null
      })
    },

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./index.styl"
</style>

<style lang="scss" scoped>
.map-bg {
  width: 100%;
  position: relative;
  #map {
    width: 100%;
    height: 100%;
    .control-buttons {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      z-index: 10;
      display: flex;
      width: 8rem;
      div {
        flex: 1;
        cursor: pointer;
      }
    }
  }
  /* 鼠标位置控件层样式设置 */
  #mouse-position {
    float: left;
    color: rgb(255, 255, 255);
    position: absolute;
    bottom: 5px;
    width: 200px;
    height: 20px;
    /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
    z-index: 2000;
  }
  /* 鼠标位置信息自定义样式设置 */
  .custom-mouse-position {
    color: rgb(255, 255, 255);
    font-size: 16px;
    font-family: "微软雅黑";
  }
}

.ol-popup {
  position: absolute;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  // border-radius: 10px;
  border: 1px solid #036d77;
  bottom: 40px;
  left: -50px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: rgba(10, 28, 53, 0.86);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: rgba(10, 28, 53, 0.86);
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 8px;
  right: 12px;
}
.ol-popup-closer:after {
  content: "✖";
  color: #00eaff;
}
//.ol-scale-bar {
//  float: left;
//  color: rgb(255, 255, 255);
//  position: absolute;
//  bottom: 35px;
//  width: 200px;
//  height: 20px;
//  /*在地图容器中的层，要设置z-index的值让其显示在地图上层*/
//  z-index: 2000;
//}
#scale-bar {
  float:left;
  color: rgb(255, 255, 255);
  position: absolute;
  bottom:32px;
  z-index:2000;
}


</style>
