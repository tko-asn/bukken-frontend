<template>
  <div class="container">
    <!-- サイドバー -->
    <aside class="container__side-bar">
      <nav class="nav">
        <ul class="list">
          <li
            class="list__item"
            v-for="obj in mainMenu"
            :key="obj.name"
            v-show="obj.login ? isLoggedIn : true"
            @click.prevent="switchPosts(obj.type)"
          >
            <a
              href=""
              :class="{
                list__link: true,
                is_active_menu: obj.type === activeMenu,
              }"
            >
              {{ obj.name }}
            </a>
          </li>
        </ul>
      </nav>
      <nav class="nav">
        <ul class="list">
          <!-- フォローしているユーザーのリストを表示 -->
          <template v-if="isLoggedIn">
            <li class="list__title">フォロー</li>
            <li
              class="list__item"
              v-for="menuObj in followMenu"
              :key="menuObj.name"
            >
              <a
                href=""
                class="list__link"
                @click.prevent="toggleUser(menuObj.type)"
                >{{ menuObj.name }}</a
              >
              <!-- ドロップダウンメニュー -->
              <ul
                class="list"
                v-show="
                  menuObj.type === 'followee'
                    ? showFolloweeList
                    : showFollowerList
                "
              >
                <li
                  class="list__item"
                  v-for="obj in followsList(menuObj.type)"
                  :key="obj.id"
                >
                  <router-link
                    class="list__link list__link--small"
                    :to="{
                      name: 'userView',
                      params: {
                        id: followsObjKey(menuObj.type, obj).id,
                      },
                    }"
                  >
                    <div class="item-icon">
                      <img
                        class="item-icon__img"
                        :src="followsObjKey(menuObj.type, obj).iconURL"
                      />
                    </div>
                    <p class="list__username">
                      {{ followsObjKey(menuObj.type, obj).username }}
                    </p>
                  </router-link>
                </li>
                <a
                  class="list__link list__link--large"
                  href=""
                  @click.prevent="closeUserList(menuObj.type)"
                  >閉じる</a
                >
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="item-no-login">
              <p class="item-no-login__text">
                ログインするとフォロー機能を使用できます
              </p>
              <router-link
                to="/login"
                class="item-no-login__btn-login"
                tag="button"
              >
                ログイン
              </router-link>
            </li>
          </template>
        </ul>
      </nav>
      <div class="side-footer">
        <ul class="list">
          <li class="list__item"><a href="">サイト概要</a></li>
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
          v-show="$route.name === 'home'"
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
      mainMenu: {
        // サイドメニュー一覧
        home: {
          login: false,
          name: "ホーム",
          type: "home",
        },
        followee: {
          login: true,
          name: "フォローユーザーの投稿",
          type: "followee",
        },
        favorites: {
          login: true,
          name: "お気に入りの投稿",
          type: "favorites",
        },
        myPosts: {
          login: true,
          name: "自分の投稿",
          type: "myPosts",
        },
      },
      followMenu: {
        followee: {
          name: "フォロー",
          type: "followee",
        },
        follower: {
          name: "フォロワー",
          type: "follower",
        },
      },
    };
  },
  computed: {
    ...mapGetters("posts", ["followeePosts", "myPosts", "myFavoritePosts"]),
    ...mapGetters("auth", ["isLoggedIn", "userId"]),
    ...mapGetters("follows", ["follow", "follower"]),
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
    // フォローデータの種類を判定しデータのリストを返す
    followsList(type) {
      // フォローしているユーザー一覧を取得する場合
      if (type === "followee") {
        return this.follow;

        // フォロワー一覧を取得する場合
      } else if (type === "follower") {
        return this.follower;
      }
    },
    // フォローデータの種類を判定しデータの属性の値を返す
    followsObjKey(type, obj) {
      if (type === "followee") {
        return obj.follow;
      } else if (type === "follower") {
        return obj.user;
      }
    },
    // 投稿を表示する画面に遷移
    switchRoute() {
      if (this.$route.name !== "home") {
        this.$router.push("/");
      }
    },
    // 投稿を切り替え表示
    switchPosts(type) {
      const menuAndPosts = {
        // メニューの種類と表示する投稿の対応表
        home: this.latestPosts,
        followee: this.followeePosts,
        favorites: this.myFavoritePosts,
        myPosts: this.myPosts,
      };
      this.switchRoute();
      this.activeMenu = type;
      this.displayedPosts = menuAndPosts[type];
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

.list__title {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 30px;
  color: white;
  font-size: 1.2em;
}

.list__link {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 30px;
}

.list__link:hover {
  background: rgba(124, 46, 150, 0.918);
  cursor: pointer;
}

/* フォロイー・フォロワー表示部分 */
.list-follow {
  padding: 10px 0;
}

.list__link--small {
  height: 40px;
}

.list__username {
  margin-left: 20px;
  overflow: hidden;
  color: white;
}

.item-icon {
  width: 30px;
  height: 30px;
  background: silver;
}

.item-icon__img {
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

.nav {
  border-bottom: 2px solid gray;
}

.list__link--large {
  padding: 5px 30px;
  font-size: 0.9em;
}

/* ログインしていない場合のフォロー部分 */
.item-no-login {
  min-height: 100px;
  padding: 20px;
}

.item-no-login__text {
  color: silver;
  font-size: 0.7em;
  text-align: center;
}

.item-no-login__btn-login {
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