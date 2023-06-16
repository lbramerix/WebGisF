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
