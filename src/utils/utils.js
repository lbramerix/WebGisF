export const getBase64 = (img, text) => {
  var body = document.getElementsByTagName("div")[0];
  var canvas = document.createElement("canvas");
  var width = 64;
  var imgWidth = 48;
  var imgLeft = (width - imgWidth) / 2;
  canvas.width = width;
  canvas.height = width;
  body.appendChild(canvas);

  var cxt = canvas.getContext("2d");

  // 画图
  cxt.drawImage(img, imgLeft, imgLeft, imgWidth, imgWidth);
  // 设置字体大小
  cxt.font = "14px Microsoft YaHei";
  // 设置文本的水平垂直对齐方式
  cxt.textBaseline = "top";
  cxt.textAlign = "center";
  // 文字颜色
  cxt.fillStyle = "#000";
  // 填充文字
  cxt.fillText(text, width / 2, 0);

  // 转成base64
  var dataUrl = canvas.toDataURL("image/png");
  // 移除canvas节点
  //   body.removeChild(canvas);

  return dataUrl;
};

/**
 * 解析日期
 */
export function getBirth(value) {
  if (value == null || value == "") return "";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + "-" + month + "-" + day;
}

/**
 * 表格时间格式化
 */
export function formatDate(cellValue) {
  if (cellValue == null || cellValue == "") return "";
  const date = new Date(cellValue);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}
