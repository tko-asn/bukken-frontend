<template>
  <div class="app">
    <!-- ヘッダー -->
    <Header />

    <!-- メイン -->
    <router-view class="area_main" />
  </div>
</template>

<script>
import Header from './components/Header';

export default {
  components: {
    Header,
  }
};
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #eeeeee;
}
</style>
