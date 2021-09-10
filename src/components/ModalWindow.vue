<template>
  <!-- 背景部分 -->
  <div class="modal-overlay" @click="removeWindow">
    <!-- コンテンツ -->
    <div class="modal-content" @click.stop>
      <section class="modal-content__container">
        <!-- タイトル -->
        <h1 class="modal-content__title">{{ title[slotName] }}</h1>
        <!-- slotで表示するコンテンツを切り替える -->
        <slot
          class="modal-content__content"
          name="deleteAccount"
          v-if="slotName === 'deleteAccount'"
        ></slot>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slotName: String,
  },
  data() {
    return {
      title: {
        deleteAccount: "アカウントを閉鎖する",
      },
    };
  },
  methods: {
    // モーダルウィンドウを閉じる
    removeWindow() {
      this.$emit("close");
    },
  },
};
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

.modal-content__container {
  margin: 20px;
}

.modal-content__title {
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 20px;
  background: rgb(52, 52, 80);
  color: #fff;
}
</style>
