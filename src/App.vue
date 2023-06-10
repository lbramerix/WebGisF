<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="stylus">
* {
  padding 0
  margin 0
  list-style none
}
html, body, #app
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  min-width: 1360px;

* {
  margin: 0;
  padding: 0;
}
/*滚动条样式*/
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}

::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px #fff;
  background: rgba(0, 0, 0, 0.075);
}

::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px #0a55d0;
  border-radius: 0;
  background: #0a55d0;
}

.hy-cl {
  background: rgb(10, 28, 53, 0.86);
  z-index: 101;
  width: 530px;
  height: 300px;
  border: 1px solid #253960;
  .header {
    background: url('~@/assets/images/title_head.png');
    width: 260px;
    height: 32px;
    background-size: 100% 100%;
    margin-left: 130px;
    margin-top: -15px;
    text-align: center;
    color: #fff;
    line-height: 32px;
    font-size: 15px;
  }
  .hy-body {
    display: flex;
    .body-img {
      text-align: center;
      width: 170px;
      padding-top: 20px;
      img {
        width: 170px;
        margin: 20px 0;
        object-fit: cover;
      }
    }
    .body-foot {
      color: #fff;
      font-size: 14px;
      line-height: 25px;
      margin: 0px 10px;
      width: 155px;
      .p-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .p-left {
        margin-left: 20px;
      }
    }
  }
  .close-button {
    position: absolute;
    top: 5px;
    right: 10px;
    zoom: 120%;
    color: #00eaff;
    cursor: pointer;
  }
}
.hy-dw {
  background: rgb(10, 28, 53, 0.86);
  z-index: 101;
  width: 530px;
  height: 220px;
  border: 1px solid #253960;
  .header {
    background: url('~@/assets/images/title_head.png');
    width: 260px;
    height: 32px;
    background-size: 100% 100%;
    margin-left: 130px;
    margin-top: -15px;
    text-align: center;
    color: #fff;
    line-height: 32px;
    font-size: 15px;
  }
  .hy-body {
    display: flex;
    .body-img {
      text-align: center;
      width: 170px;
      // padding-top: 20px;
      img {
        width: 170px;
        margin: 20px 0 10px 0;
        object-fit: cover;
      }
      .address {
        color: #fff;
        font-size: 15px;
        text-align: left;
      }
    }
    .body-foot {
      color: #fff;
      font-size: 14px;
      line-height: 25px;
      margin: 0px 10px;
      width: 155px;
      .p-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .p-left {
        margin-left: 20px;
      }
    }
  }
  .close-button {
    position: absolute;
    top: 5px;
    right: 10px;
    zoom: 120%;
    color: #00eaff;
    cursor: pointer;
  }
}
.span-left-top {
  position: absolute;
  background: url('~@/assets/images/pic_hom_lt.png');
  width: 14px;
  height: 15px;
  top: -1px;
  left: -1px;
  background-size: 100% 100%;
}
.span-left-bottom {
  position: absolute;
  background: url('~@/assets/images/pic_hom_lf.png');
  width: 14px;
  height: 15px;
  bottom: -1px;
  left: -1px;
  background-size: 100% 100%;
}
.span-right-bottom {
  position: absolute;
  background: url('~@/assets/images/pic_hom_rf.png');
  width: 14px;
  height: 15px;
  bottom: -1px;
  right: -1px;
  background-size: 100% 100%;
}
.span-right-top {
  position: absolute;
  background: url('~@/assets/images/pic_hom_rt.png');
  width: 14px;
  height: 15px;
  top: -1px;
  right: -1px;
  background-size: 100% 100%;
}
</style>
