<template>
  <div class="app">
    <!-- ヘッダー -->
    <Header v-show="!searchRoutes.includes($route.name)" />

    <!-- メイン -->
    <router-view />
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  components: {
    Header,
  },
  data() {
    return {
      searchRoutes: ["home", "userPosts"],
    };
  },
};
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #eeeeee;
}
</style>
