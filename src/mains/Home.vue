<template>
  <div class="container">
    <!-- サイドバー -->
    <aside class="side_bar">
      <nav>
        <ul>
          <li class="list_side_bar">
            <a href="" @click.prevent="displayLatestPosts">ホーム</a>
          </li>
          <li class="list_side_bar" v-if="isLoggedIn">
            <a href="" @click.prevent="displayFolloweePosts"
              >フォローユーザーの投稿</a
            >
          </li>
          <li class="list_side_bar" v-if="isLoggedIn">
            <a href="" @click.prevent="displayMyFavoritePosts"
              >お気に入りの投稿</a
            >
          </li>
          <li class="list_side_bar" v-if="isLoggedIn">
            <a href="" @click.prevent="displayMyPosts">自分の投稿</a>
          </li>
        </ul>
      </nav>
      <nav v-if="isLoggedIn">
        <ul>
          <li class="list_side_bar ttl">フォロー</li>
          <li class="list_side_bar"><a href="">フォロー</a></li>
          <li class="list_side_bar"><a href="">フォロワー</a></li>
        </ul>
      </nav>
      <div class="side_footer">
        <ul>
          <li class="list_side_bar"><a href="">サイト概要</a></li>
        </ul>
      </div>
    </aside>

    <!-- メイン -->
    <div class="main">
      <div class="main_container">
        <router-view
          :postList="displayedPosts"
        />
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      latestPosts: [], // 最新の投稿
      displayedPosts: [], // 表示する投稿
    };
  },
  computed: {
    ...mapGetters("posts", ["followeePosts", "myPosts", "myFavoritePosts"]),
    ...mapGetters("auth", ["isLoggedIn"]),
  },
  created() {
    Promise.all([
      apiClient.get("/posts/page/1"), // 1ページ目の投稿を取得
      this.$store.dispatch("posts/getFolloweePosts"), // フォロイーの投稿をVuexに保存
    ]).then((values) => {
      this.latestPosts = values[0].data; // 最新の投稿を取得
      this.displayedPosts = this.latestPosts; // 初期は最新の投稿を表示
    });
  },
  methods: {
    // 投稿を表示する画面に遷移
    switchRoute() {
      if (this.$route.name !== 'home') {
        this.$router.push('/');
      }
    },
    // フォローしているユーザーの投稿一覧表示
    displayFolloweePosts() {
      this.switchRoute();
      this.displayedPosts = this.followeePosts;
    },
    // 自分の投稿一覧表示
    displayMyPosts() {
      this.switchRoute();
      this.displayedPosts = this.myPosts;
    },
    // 最新の投稿を表示
    displayLatestPosts() {
      this.switchRoute();
      this.displayedPosts = this.latestPosts;
    },
    // お気に入りの投稿を表示
    displayMyFavoritePosts() {
      this.switchRoute();
      this.displayedPosts = this.myFavoritePosts;
    }
  },
  beforeRouteUpdate(to, from, next) {
    // 投稿画面から遷移したとき
    if (to.name === "home") {
      Promise.all([
        apiClient.get("/posts/page/1"), // 1ページ目の投稿を取得
        this.$store.dispatch("posts/getFolloweePosts"), // フォロイーの投稿をVuexに保存
      ]).then((values) => {
        this.latestPosts = values[0].data; // 最新の投稿を取得
        this.displayedPosts = this.latestPosts; // 初期は最新の投稿を表示
        next();
      });
    }
    next();
  }
};
</script>

<style scoped>
/* 基本設定 */
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  color: white;
  text-decoration: none;
}

.container {
  display: flex;
  height: 100vh;
  font-size: 1.1em;
}

/* サイドバー */
.side_bar {
  display: flex;
  flex-direction: column;
  width: 25%;
  min-width: 250px;
  margin-top: 50px;
  overflow-y: scroll;
  background: rgb(76, 26, 92);
}

.list_side_bar {
  height: 50px;
}

.ttl {
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 30px;
  color: white;
  font-size: 1.2em;
}

nav a {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 30px;
}

nav a:hover {
  background: rgba(124, 46, 150, 0.918);
  cursor: pointer;
}

.side_footer {
  flex: 1;
  min-height: 300px;
  padding: 30px 30px;
  background: rgb(76, 26, 92);
  color: white;
  font-size: 0.8em;
}

nav {
  border-bottom: 2px solid gray;
}

/* メイン部分 */
.main {
  width: 100%;
  margin-top: 50px;
  overflow-y: scroll;
}

.main_container {
  width: 90%;
  margin: 0 auto;
}

/* スクロールバー */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(168, 89, 194, 0.795);
}

.main::-webkit-scrollbar-thumb {
  background: rgba(139, 130, 130, 0.747);
}
</style>