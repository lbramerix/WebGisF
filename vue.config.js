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
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports={
  devServer:{
    host:'localhost',
    port:8080,
    proxy:proxyObj
  }
}



