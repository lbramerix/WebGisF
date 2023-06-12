<template>
  <div class="PopBox">
    <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
// import { Modal } from 'ant-design-vue'

export default defineComponent({
  components: {
    // Modal
  },
  setup() {
    const visible = ref(false)

    const showModal = () => {
      visible.value = true
    }

    const handleOk = (e) => {
      console.log(e)
      visible.value = false
    }

    return {
      visible,
      showModal,
      handleOk
    }
  }
})
</script>

<style lang='scss' scoped>
</style>
