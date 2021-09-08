<template>
  <div class="container">
    <!-- サイドバー -->
    <aside class="container__side-bar">
      <nav class="list-menu">
        <ul>
          <li>
            <a
              href=""
              :class="{ is_active_menu: isActiveMenu('home') }"
              @click.prevent="displayLatestPosts"
              >ホーム</a
            >
          </li>
          <li v-if="isLoggedIn">
            <a
              href=""
              :class="{ is_active_menu: isActiveMenu('followee') }"
              @click.prevent="displayFolloweePosts"
              >フォローユーザーの投稿</a
            >
          </li>
          <li v-if="isLoggedIn">
            <a
              href=""
              :class="{ is_active_menu: isActiveMenu('favorites') }"
              @click.prevent="displayMyFavoritePosts"
              >お気に入りの投稿</a
            >
          </li>
          <li v-if="isLoggedIn">
            <a
              href=""
              :class="{ is_active_menu: isActiveMenu('myPosts') }"
              @click.prevent="displayMyPosts"
              >自分の投稿</a
            >
          </li>
        </ul>
      </nav>
      <nav class="list-follow">
        <ul>
          <!-- フォローしているユーザーのリストを表示 -->
          <template v-if="isLoggedIn">
            <li class="ttl">フォロー</li>
            <li>
              <a href="" @click.prevent="toggleUser('followee')">フォロー</a>
              <!-- ドロップダウンメニュー -->
              <ul class="list_user" v-show="showFolloweeList">
                <li v-for="followObj in follow" :key="followObj.id">
                  <router-link to="home">
                    <div class="icon">
                      <img :src="followObj.follow.iconURL" />
                    </div>
                    <p>{{ followObj.follow.username }}</p>
                  </router-link>
                </li>
                <a
                  class="btn_close"
                  href=""
                  @click.prevent="closeUserList('followee')"
                  >閉じる</a
                >
              </ul>
            </li>

            <!-- フォロワーのリストを表示 -->
            <li>
              <a href="" @click.prevent="toggleUser('follower')">フォロワー</a>
              <!-- ドロップダウンメニュー -->
              <ul class="list_user" v-show="showFollowerList">
                <li v-for="followerObj in follower" :key="followerObj.id">
                  <router-link to="home">
                    <div class="icon">
                      <img :src="followerObj.user.iconURL" />
                    </div>
                    <p>{{ followerObj.user.username }}</p>
                  </router-link>
                </li>
                <a
                  class="btn_close"
                  href=""
                  @click.prevent="closeUserList('follower')"
                  >閉じる</a
                >
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="list_no_login">
              <p>ログインするとフォロー機能を使用できます</p>
              <router-link to="/login" class="btn_login" tag="button"
                >ログイン</router-link
              >
            </li>
          </template>
        </ul>
      </nav>
      <div class="side-footer">
        <ul>
          <li><a href="">サイト概要</a></li>
        </ul>
      </div>
    </aside>

    <!-- メイン -->
    <div class="container__main">
      <div class="container-main">
        <PostFilter
          @filter="filterPosts"
          :currentMenu="activeMenu"
          :myId="userId"
        />
        <router-view :postList="displayedPosts" />
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios";
import PostFilter from "@/components/PostFilter";
import { mapGetters } from "vuex";

export default {
  components: {
    PostFilter,
  },
  data() {
    return {
      latestPosts: [], // 最新の投稿
      displayedPosts: [], // 表示する投稿
      showFolloweeList: false,
      showFollowerList: false,
      activeMenu: "home",
    };
  },
  computed: {
    ...mapGetters("posts", ["followeePosts", "myPosts", "myFavoritePosts"]),
    ...mapGetters("auth", ["isLoggedIn", "userId"]),
    ...mapGetters("follows", ["follow", "follower"]),
    isActiveMenu() {
      return (menuType) => {
        if (menuType === this.activeMenu) {
          return true;
        }
      };
    },
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
      if (this.$route.name !== "home") {
        this.$router.push("/");
      }
    },
    // フォローしているユーザーの投稿一覧表示
    displayFolloweePosts() {
      this.switchRoute();
      this.activeMenu = "followee";
      this.displayedPosts = this.followeePosts;
    },
    // 自分の投稿一覧表示
    displayMyPosts() {
      this.switchRoute();
      this.activeMenu = "myPosts";
      this.displayedPosts = this.myPosts;
    },
    // 最新の投稿を表示
    displayLatestPosts() {
      this.switchRoute();
      this.activeMenu = "home";
      this.displayedPosts = this.latestPosts;
    },
    // お気に入りの投稿を表示
    displayMyFavoritePosts() {
      this.switchRoute();
      this.activeMenu = "favorites";
      this.displayedPosts = this.myFavoritePosts;
    },
    // フォローしているユーザーの表示を切り替える
    toggleUser(userType) {
      // フォローしているユーザーのドロップダウンメニュー
      if (userType === "followee") {
        this.showFolloweeList = !this.showFolloweeList;

        // フォロワーのドロップダウンメニュー
      } else if (userType === "follower") {
        this.showFollowerList = !this.showFollowerList;
      }
    },
    // ユーザーのドロップダウンメニューを閉じる
    closeUserList(userType) {
      if (userType === "followee") {
        this.showFolloweeList = false;
      } else if (userType === "follower") {
        this.showFollowerList = false;
      }
    },
    // 投稿のフィルタリング
    filterPosts(posts) {
      this.displayedPosts = posts; // フィルタリングした投稿を切り替える
    },
  },
  beforeRouteUpdate(to, from, next) {
    // 投稿画面から遷移したとき
    if (to.name === "home") {
      Promise.all([
        apiClient.get("/posts/page/1"), // 1ページ目の投稿を取得
        this.$store.dispatch("posts/getFolloweePosts"), // フォロイーの投稿をVuexに保存
      ]).then((values) => {
        this.activeMenu = "home"; // サイドメニューをホームにする
        this.latestPosts = values[0].data; // 最新の投稿を取得
        this.displayedPosts = this.latestPosts; // 初期は最新の投稿を表示
        next();
      });
    }
    next();
  },
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
.container__side-bar {
  display: flex;
  flex-direction: column;
  width: 25%;
  min-width: 250px;
  margin-top: 50px;
  overflow-y: scroll;
  background: rgb(76, 26, 92);
}

.is_active_menu {
  background: rgb(129, 50, 155);
}

.ttl {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 30px;
  color: white;
  font-size: 1.2em;
}

nav a {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 30px;
}

nav a:hover {
  background: rgba(124, 46, 150, 0.918);
  cursor: pointer;
}

/* フォロイー・フォロワー表示部分 */
.list-follow {
  padding: 10px 0;
}

.list_user a {
  display: flex;
  align-items: center;
  height: 40px;
}

.list_user a > p {
  margin-left: 20px;
  overflow: hidden;
  color: white;
}

.icon {
  width: 30px;
  height: 30px;
  background: silver;
}

.icon > img {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

.side-footer {
  flex: 1;
  min-height: 250px;
  padding: 30px 30px;
  background: rgb(76, 26, 92);
  color: white;
  font-size: 0.8em;
}

nav {
  border-bottom: 2px solid gray;
}

.btn_close {
  padding: 5px 30px;
  font-size: 0.9em;
}

/* ログインしていない場合のフォロー部分 */
.list_no_login {
  min-height: 100px;
  padding: 20px;
}

.list_no_login > p {
  color: silver;
  font-size: 0.7em;
  text-align: center;
}

.btn_login {
  display: block;
  width: 130px;
  height: 40px;
  margin: 0 auto;
  border-radius: 3px;
  border-color: rgb(76, 26, 92);
  background: rgba(168, 129, 168, 0.966);
  color: white;
  font-size: 1.1em;
  cursor: pointer;
}

/* メイン部分 */
.container__main {
  width: 100%;
  margin-top: 50px;
  overflow-y: scroll;
}

.container-main {
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

.container__main::-webkit-scrollbar-thumb {
  background: rgba(139, 130, 130, 0.747);
}
</style>