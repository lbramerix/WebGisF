/* 引入本地文件 */
import hyJson from "@/assets/area/330424.json";
/* 引入ol方法 */
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import { LinearRing, Point } from "ol/geom";
import Feature from "ol/Feature";
import { Style, Icon, Fill, Stroke, Text } from "ol/style";
import { fromExtent } from "ol/geom/Polygon";
import Cluster from "ol/source/Cluster";
import VectorImageLayer from "ol/layer/VectorImage";
import Vector from "ol/source/Vector";
export const mapjs = {
	data() {
		return {
			converLayer: null, //遮罩矢量图层
			regionLayers: [], //手动保存起来的边界线矢量图层
			layers: [], //全部的矢量图层
		};
	},
	methods: {
		/* 绘出边界线 */
		addRegion() {
			let that = this;
			const vectorSource = new VectorSource({
				features: new GeoJSON().readFeatures(hyJson),
			});
			const vectorLayer = new VectorLayer({
				source: vectorSource,
				style: new Style({
					stroke: new Stroke({
						color: "#10defd",
						width: 2,
						lineDash: [1.5, 5, 15, 5],
					}),
				}),
			});
			that.map.addLayer(vectorLayer);
			that.regionLayers.push(vectorLayer);
		},
		/* 制作矢量图层 */
		addModal() {
			let that = this;
			that.converLayer = new VectorLayer({
				name: "modal",
				zIndex: 89,
				source: new VectorSource(),
				style: new Style({
					fill: new Fill({
						color: "rgba( 8, 14, 50, 0.7)",
					}),
					stroke: new Stroke({
						color: "#10defd",
						width: 2,
						lineDash: [1.5, 5, 15, 5],
					}),
				}),
			});
			that.map.addLayer(that.converLayer);
			that.regionLayers.push(that.converLayer);
			/* 添加遮罩 */
			// const fts = new GeoJSON().readFeatures(hyJson);
			// const ft = fts[0];
			// const converGeom = that.erase(ft.getGeometry());
			// const convertFt = new Feature({
			// 	geometry: converGeom,
			// });
			// that.converLayer.getSource().addFeature(convertFt);
		},
		//擦除操作，生产遮罩范围
		erase(geom) {
			const extent = [-180, -90, 180, 90];
			const polygonRing = fromExtent(extent);
			const coords = geom.getCoordinates();
			coords.forEach((coord) => {
				const linearRing = new LinearRing(coord[0]);
				polygonRing.appendLinearRing(linearRing);
			});
			return polygonRing;
		},
		/* 单击地图点击要素触发 */
		/* 选中要素 */
		selectFeature(feature) {
			this.unSelect();
			if (feature) {
				let featureInfo = feature.getProperties().attribute;
				if (!featureInfo) {
					if (feature.getProperties().features) {
						featureInfo = feature.getProperties().features[0].values_.attribute;
					}
				}
				if (featureInfo) {
					this.addFeatureInfo(featureInfo, feature);
				}
			}
		},
		/* 未选中要素 */
		unSelect() {
			if (this.selectedFeature != null) {
				this.selectedFeature.setStyle(null);
				this.selectedFeature.changed();
			}
			this.overlay.setPosition(undefined);
		},
		/* 动态获取要素信息 */
		/* 动态获取图标详细内容 */
		addFeatureInfo(featureInfo, feature) {
			let that = this;
			var content = document.getElementById("popup-content");
			content.innerHTML = "";

			if (featureInfo.type == "hycl") {
				let popup = document.getElementById("popup-content");
				popup.setAttribute("style", "width:530px");
				content.innerHTML =
					'<div class="hy-cl tfText ">' +
					'<div class="header">' +
					featureInfo.name +
					"</div>" +
					'<div class="hy-body">' +
					'<div style="padding-top:2rem" class="body-foot">' +
					"<p>车辆轴数: " +
					"<p class='p-left'>" +
					featureInfo.a1 +
					"</p > " +
					"</p>" +
					"<p>运输证有效期止: " +
					"<p class='p-left'>" +
					featureInfo.b1 +
					"</p > " +
					"</p>" +
					"<p>联系电话: " +
					"<p class='p-left'>" +
					featureInfo.c1 +
					"</p > " +
					"</p>" +
					"<p>定位地址: " +
					"<p class='p-left'>" +
					featureInfo.d1 +
					"</p > " +
					"</div>" +
					'<div style="padding-top:2rem" class="body-foot">' +
					"<p>道路运输证: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.a2 +
					"</p > " +
					"<p>定位时间: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.b2 +
					"</p > " +
					"<p>车辆所有人: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.c2 +
					"</p > " +
					"</div>" +
					"<div class='body-img'>" +
					'<img src="' +
					featureInfo.img +
					'" />' +
					"</div" +
					"</div > " +
					'<span class="span-left-top"></span>' +
					'<span class="span-left-bottom"></span>' +
					'<span class="span-right-bottom"></span>' +
					'<span class="span-right-top"></span>' +
					"</div>";
			}
			if (featureInfo.type == "hyytdw") {
				let popup = document.getElementById("popup-content");
				popup.setAttribute("style", "width:530px");
				content.innerHTML =
					'<div class="hy-dw tfText ">' +
					'<div class="header">' +
					featureInfo.name +
					"</div>" +
					'<div class="hy-body">' +
					'<div style="padding-top:2rem" class="body-foot">' +
					"<p>所属街道: " +
					"<p class='p-left'>" +
					featureInfo.a1 +
					"</p > " +
					"</p>" +
					"<p>今日过车数: " +
					"<p class='p-left'>" +
					featureInfo.b1 +
					"</p > " +
					"</p>" +
					"<p>联系人: " +
					"<p class='p-left'>" +
					featureInfo.c1 +
					"</p > " +
					"</p>" +
					"</div>" +
					'<div style="padding-top:2rem" class="body-foot">' +
					"<p>监管单位: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.a2 +
					"</p > " +
					"<p>自查自纠数: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.b2 +
					"</p > " +
					"<p>联系电话: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.c2 +
					"</p > " +
					"</div>" +
					"<div class='body-img'>" +
					'<img src="' +
					featureInfo.img +
					'" />' +
					"<p class='address'>" + '单位地址：' +
					featureInfo.d1 + "</p>" +
					"</div>" +
					"</div > " +
					'<span class="span-left-top"></span>' +
					'<span class="span-left-bottom"></span>' +
					'<span class="span-right-bottom"></span>' +
					'<span class="span-right-top"></span>' +
					"</div>";
			}

			that.overlay.setPosition([featureInfo.lon, featureInfo.lat]);
			that.selectedFeature = feature;
		},
		/* 拿到数据往地图上渲染 */
		setMap(data, type) {
			const markData = data;
			const features = new Array(markData.length);
			markData.forEach(function(item, index) {
				let attr = {};
				attr = {
					lon: item.lon,
					lat: item.lat,
					name: item.name,
					type: type,
					a1: item.a1,
					b1: item.b1,
					c1: item.c1,
					d1: item.d1,
					a2: item.a2,
					b2: item.b2,
					c2: item.c2,
					d2: item.d2,
					img: item.img,
				};
				features[index] = new Feature({
					geometry: new Point([item.lon, item.lat]),
					attribute: attr,
				});
			});
			let vectorLayer;
			let iconSrc;
			let iconList = [{
					type: "hyytdw",
					iconSrc: require("@/assets/images/map_hyytdw.png"),
					iconSrc_point: require("@/assets/images/map_point_hyytdw.png"),
				},
				{
					type: "hycl",
					iconSrc: require("@/assets/images/map_hycl.png"),
					iconSrc_point: require("@/assets/images/map_point_hycl.png"),
				},
			];
			let iconY;
			let iconX;
			let scale;
			iconY = 35;
			iconX = 0.5;
			scale = 1;
			let iconYUnits = "pixels";
			if (data.length > 1) {
				const clusterSource = new Cluster({
					distance: 40,
					source: new Vector({
						features: features,
					}),
				});
				const styleCache = {};
				vectorLayer = new VectorImageLayer({
					name: type,
					zIndex: 99,
					source: clusterSource,
					style: function(feature) {
						var size = feature.get("features").length;
						var style = styleCache[size];
						if (!style) {
							iconSrc = iconList.filter((item) => item.type == type);
							if (size > 1) {
								iconSrc = iconList.filter((item) => item.type == type);
								style = [
									new Style({
										image: new Icon(
											/** @type {olx.style.IconOptions} */
											({
												anchor: [iconX, iconY],
												anchorOrigin: "top-right",
												anchorXUnits: "fraction",
												anchorYUnits: iconYUnits,
												offsetOrigin: "top-right",
												offset: [0, 0], // 偏移量设置
												scale, // 图标缩放比例
												opacity: 1, // 透明度
												src: iconSrc[0].iconSrc_point, // 图标的url
											})
										),
										text: new Text({
											font: "normal 12px 微软雅黑",
											text: size.toString(),
											offsetX: 12,
											offsetY: 0,
											fill: new Fill({
												color: "#fff",
											}),
											stroke: new Stroke({
												color: "#666666",
												width: 3,
											}),
										}),
									}),
								];
								styleCache[size] = style;
							} else {
								style = [
									new Style({
										image: new Icon(
											/** @type {olx.style.IconOptions} */
											({
												anchor: [iconX, iconY],
												anchorOrigin: "top-right",
												anchorXUnits: "fraction",
												anchorYUnits: iconYUnits,
												offsetOrigin: "top-right",
												offset: [0, 0], // 偏移量设置
												scale, // 图标缩放比例
												opacity: 1, // 透明度
												src: iconSrc[0].iconSrc, // 图标的url
											})
										),
									}),
								];
								styleCache[size] = style;
							}
						}
						return style;
					},
				});
			} else {
				iconSrc = iconList.filter((item) => item.type == type);
				vectorLayer = new VectorImageLayer({
					name: type,
					zIndex: 99,
					source: new Vector({
						wrapX: false,
						features: features,
					}),
					style: [
						new Style({
							image: new Icon(
								/** @type {olx.style.IconOptions} */
								({
									anchor: [iconX, iconY],
									anchorOrigin: "top-right",
									anchorXUnits: "fraction",
									anchorYUnits: iconYUnits,
									offsetOrigin: "top-right",
									offset: [0, 0], // 偏移量设置
									scale, // 图标缩放比例
									opacity: 1, // 透明度
									src: iconSrc[0].iconSrc, // 图标的url
								})
							),
						}),
					],
				});
			}
			this.layers.push(vectorLayer);
			this.map.addLayer(vectorLayer);
		},
	},
};
