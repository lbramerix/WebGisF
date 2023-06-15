/* 引入本地文件 */
import hyJson from "@/assets/area/中华人民共和国.json";
/* 引入ol方法 */
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import {LinearRing, LineString, Point} from "ol/geom";
import Feature from "ol/Feature";
import {Style, Icon, Fill, Stroke, Text, RegularShape} from "ol/style";
import { fromExtent } from "ol/geom/Polygon";
import Cluster from "ol/source/Cluster";
import VectorImageLayer from "ol/layer/VectorImage";
import Vector from "ol/source/Vector";
import Overlay from "ol/Overlay";
import Circle from "ant-design-vue/lib/progress/circle";
import FeatureAnimation from 'ol-ext/featureanimation/FeatureAnimation.js';
import {Heatmap} from "ol/layer";

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
			const fts = new GeoJSON().readFeatures(hyJson);
			const ft = fts[0];
			const converGeom = that.erase(ft.getGeometry());
			const convertFt = new Feature({
				geometry: converGeom,
			});
			that.converLayer.getSource().addFeature(convertFt);
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

			if (featureInfo.type == "hyytdw") {
				let popup = document.getElementById("popup-content");
				popup.setAttribute("style", "width:530px");
				content.innerHTML =
					'<div class="hy-dw tfText ">' +
					'<div class="header">' +
					"演唱会信息" +
					"</div>" +
					'<div class="hy-body">' +
					'<div style="padding-top:2rem" class="body-foot">' +
					"<p>演唱会名称: " +
					"<p class='p-left'>" +
					featureInfo.name +
					"</p > " +
					"</p>" +
					"<p>演出时间: " +
					"<p class='p-left'>" +
					featureInfo.showtime +
					"</p > " +
					"</p>" +
					"<p>艺人: " +
					"<p class='p-left'>" +
					(featureInfo.actors ? featureInfo.actors.replace("艺人：", "") : "暂无信息") +
					"</p > " +
					"</p>" +
					"</div>" +
					'<div style="padding-top:2rem" class="body-foot">' +
					"<p>票价区间: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.pricestr +
					"</p > " +
					"<p>演出城市: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.cityname +
					"</p > " +
					"<p>演出具体地点: " +
					"</p>" +
					"<p class='p-left'>" +
					featureInfo.venue +
					"</p > " +
					"</div>" +
					"<div class='body-img'>" +
					'<img src="' +
					featureInfo.verticalpic +
					'" />' +
					"</div>" +
					"</div > " +
					'<span class="span-left-top"></span>' +
					'<span class="span-left-bottom"></span>' +
					'<span class="span-right-bottom"></span>' +
					'<span class="span-right-top"></span>' +
					"</div>";
			}

			that.overlay.setPosition([ parseFloat(featureInfo.longutide),  parseFloat(featureInfo.lat)]);
			that.selectedFeature = feature;
		},
		/* 拿到数据往地图上渲染 */
		setMap(data, type) {
			console.log("cccccccccccccccccc");
			console.log(data);
			const markData = data;
			const features = new Array(markData.length);
			markData.forEach(function(item, index) {
				let attr = {};
				attr = {
					longutide:  parseFloat(item.longutide),
					lat:  parseFloat(item.lat),
					name: item.name,
					type: type,
					showtime: item.showtime,
					pricestr: item.pricestr,
					cityname: item.cityname,
					venue: item.venue,
					actors: item.actors,
					b2: item.b2,
					c2: item.c2,
					d2: item.d2,
					verticalpic: item.verticalpic,
				};
				features[index] = new Feature({
					geometry: new Point([ parseFloat(item.longutide),  parseFloat(item.lat)]),
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

		// drawRoute(data) {
		// 	// 从数据中提取经纬度信息，创建一个包含所有点坐标的数组
		// 	const coordinates = data.map(item => [parseFloat(item.longutide), parseFloat(item.lat)]);
		// 	// 创建线几何对象
		// 	const lineGeometry = new LineString(coordinates);
		// 	//创建线特征对象
		// 	const lineFeature = new Feature({
		// 		geometry: lineGeometry,
		// 	});
		// 	// 创建线样式
		// 	const lineStyle = new Style({
		// 		stroke: new Stroke({
		// 			color: 'red',
		// 			width: 2,
		// 		}),
		// 	});
		// 	// 创建路线图层并添加到地图中
		// 	const lineLayer = new VectorLayer({
		// 		source: new VectorSource({
		// 			features: [lineFeature],
		// 		}),
		// 		style: lineStyle,
		// 		name:"lineLayer",
		// 	});
		// 	this.map.addLayer(lineLayer);
		// }
		drawRoute(data) {
			const lineSource = new VectorSource();
			for (let i = 0; i < data.length - 1; i++) {
				const startCoord = [parseFloat(data[i].longutide), parseFloat(data[i].lat)];
				const endCoord = [parseFloat(data[i + 1].longutide), parseFloat(data[i + 1].lat)];
				const lineGeometry = new LineString([startCoord, endCoord]);
				const lineFeature = new Feature({
					geometry: lineGeometry,
				});

				// 计算箭头位置
				const dx = endCoord[0] - startCoord[0];
				const dy = endCoord[1] - startCoord[1];
				const rotation = Math.atan2(dy, dx);
				const arrowPosition = lineGeometry.getCoordinateAt(0.5); // 将箭头放置在线段中间

				const lineStyle = new Style({
					stroke: new Stroke({
						color: 'rgba(0, 255, 0, 1)',
						width: 4,
						lineCap: 'round',
						lineJoin: 'round',
					}),
				});
				const arrowStyle = new Style({
					stroke: new Stroke({
						color: 'rgba(0, 255, 0, 1)',
						width: 2,
					}),
					fill: new Fill({
						color: 'rgba(0, 255, 0, 1)',
					}),
					geometry: new Point(arrowPosition),
					image: new RegularShape({
						fill: new Fill({
							color: 'rgba(0, 255, 0, 1)',
						}),
						stroke: new Stroke({
							color: 'rgba(0, 255, 0, 1)',
							width: 2,
						}),
						points: 3,
						radius: 10,
						rotation: -rotation,
						angle: Math.PI / 2,
					}),
				});
				lineFeature.setStyle([lineStyle, arrowStyle]);
				lineSource.addFeature(lineFeature);
			}
			const lineLayer = new VectorLayer({
				source: lineSource,
				name: 'lineLayer',
			});
			this.map.addLayer(lineLayer);
		},
		createHeatmapLayer(data) {
			// 将数据转换成热力图需要的格式
			const heatmapSource = new VectorSource({
				features: data.map(item => {
					return new Feature({
						geometry: new Point([item.longutide, item.lat]),
						weight: item.weight
					});
				})
			});

			// 创建热力图层
			const heatmapLayer = new Heatmap({
				source: heatmapSource,
				blur: 30,
				radius: 10,
				opacity: 0.8,
				name:"heatmapLayer",
			});

			// 将热力图层添加到地图中
			this.map.addLayer(heatmapLayer);
		}


	},
};
