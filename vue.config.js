/*与建立8081接口*/
let proxyObj={}
proxyObj['/']={
  //websocket
  ws:false,
  //目标地址
  target:'http://localhost:8081',
//发送请求头host会被设置为target
  changeOrigin:true,
//不重写请求地址
  pathRewrite:{
    '^/':'/'
  }
}


const { defineConfig } = require('@vue/cli-service')
const webpack = require("webpack");
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports={
  lintOnSave: false, //关闭eslint
  devServer:{
    host:'localhost',
    port:8080,
    proxy:proxyObj
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jquery: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
      }),
    ],

  },
}


const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    config.module
        .rule('ts')
        .test(/\.ts$/)
        .use('ts-loader')
        .loader('ts-loader')
        .options({
          appendTsSuffixTo: [/\.vue$/],
          configFile: path.resolve(__dirname, 'tsconfig.json'), // 指定 tsconfig.json 路径
        });
  },
};
