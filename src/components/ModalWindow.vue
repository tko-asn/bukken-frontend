<template>
  <div @click="removeWindow">
    <!-- 背景部分 -->
    <div class="modal-overlay">
      <!-- コンテンツ -->
      <div class="modal-content" @click.stop>
        <div class="container">
          <!-- slotで表示するコンテンツを切り替える -->
          <slot name="deleteAccount" v-if="slotName === 'deleteAccount'">
            aaaa
          </slot>

          <slot name="oioioi" v-else-if="slotName === 'oioioi'">
            bbbb
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slotName: String,
  },
  methods: {
    // モーダルウィンドウを閉じる
    removeWindow() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.75);
}

.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -50%);
  width: 80%;
  border-radius: 15px;
  background: #fff;
}

.container {
  margin: 20px;
}
</style>
