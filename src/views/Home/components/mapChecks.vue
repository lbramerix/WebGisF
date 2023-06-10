<template>
  <transition name="fade">
    <div class="bg">
      <el-checkbox-group v-model="checkList">
        <el-checkbox class="check-box-item" label="hyytdw"
          ><img
            width="25px"
            height="30px"
            style="vertical-align: middle; margin-right: 5px"
            src="@/assets/images/tl_hyytdw.png"
          />
          货运源头单位</el-checkbox
        >
        <el-checkbox class="check-box-item" label="hycl"
          ><img
            width="25px"
            height="30px"
            style="vertical-align: middle; margin-right: 5px"
            src="@/assets/images/tl_hycl.png"
          />
          货运车辆</el-checkbox
        >
      </el-checkbox-group>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      /* 勾选框的值 */
      checkList: ["hyytdw", "hycl"],
    };
  },
  watch: {
    /* 监听值并回调方法 */
    checkList: {
      handler(val) {
        this.$emit("setCheck", val);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  position: absolute;
  bottom: 4.3rem;
  z-index: 99;
  right: 0.3rem;
  background: #050d24;
  width: 15.5rem;
  padding: 1rem 0 0.5rem 2rem;
  line-height: 2.2rem;
  color: #fff;
  height: 8.2rem;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fff;
}
.check-box-item {
  margin: 0.5rem 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
