<template>
  <div class="app">
    <!-- ヘッダー -->
    <Header>
      <Search
        :userId="getUserId"
        v-show="searchRoutes.includes($route.name)"
      />
    </Header>

    <!-- メイン -->
    <router-view class="area_main" />
  </div>
</template>

<script>
import Header from "./components/Header";
import Search from "./components/Search";
import authInfoMixin from "./mixins/authInfoMixin";

export default {
  components: {
    Header,
    Search,
  },
  mixins: [authInfoMixin],
  data() { 
    return {
      searchRoutes: ["home", "userPosts"],
    };
  },
  computed: {
    getUserId() {
      if (this.$route.name === "home") {
        return this.userId;
      } else if (this.$route.name === "userPosts") {
        return this.$route.params.userId;
      }
      return undefined;
    }
  }
};
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #eeeeee;
}
</style>
