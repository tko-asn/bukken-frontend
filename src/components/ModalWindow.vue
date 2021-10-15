<template>
  <!-- 背景部分 -->
  <div class="modal-overlay" @click="closeWindow">
    <!-- コンテンツ -->
    <div class="modal-content" @click.stop v-if="haveContent">
      <section class="modal-content__container">
        <!-- タイトル -->
        <h1 class="modal-content__title">{{ title }}</h1>
        <!-- slotで表示するコンテンツを切り替える -->
        <slot class="modal-content__content" />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    closeWindow: {
      type: Function,
      default: () => () => {},
    },
    haveContent: {
      type: Boolean,
      default: true,
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
  width: 60%;
  height: 70%;
  overflow: hidden;
  overflow-y: scroll;
  border-radius: 15px;
  background: #fff;
  animation: slide 0.2s ease forwards;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(219, 218, 219, 0.795);
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

@keyframes slide {
  from {
    transform: translate(-50%, -1000px);
  }
  to {
    transform: translate(-50%, -50%);
  }
}

@media screen and (max-width: 1024px) {
  .modal-content__title {
    padding-left: 5px;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
