<template>
  <div class="container">
    <transition name="fadeModal">
      <ModalWindow
        class="container__modal"
        :haveContent="false"
        v-show="showSideMenu && $route.name == 'home'"
        :closeWindow="toggleSideMenu"
      />
    </transition>
    <ModalWindow
      title="概要"
      v-show="showAppOverview"
      :closeWindow="toggleAppOverview"
      ><AppOverview
    /></ModalWindow>
    <!-- サイドバー -->
    <transition name="slide">
      <aside
        class="container__side-bar"
        v-show="(showSideMenu && $route.name == 'home') || width >= 1025"
      >
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
                <transition name="open">
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
                      class="list__link list__link--small"
                      href=""
                      @click.prevent="closeUserList(menuObj.type)"
                      >閉じる</a
                    >
                  </ul>
                </transition>
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
        <nav class="nav nav--tablet_sp" v-if="isLoggedIn">
          <ul class="list">
            <li class="list__title">アカウント</li>
            <li class="list__item">
              <router-link
                :to="{ name: 'userView', params: { id: userId } }"
                class="list__link"
                >マイページ</router-link
              >
            </li>
            <li class="list__item">
              <router-link
                :to="{ name: 'editProfile', params: { id: userId } }"
                class="list__link"
                >プロフィール編集</router-link
              >
            </li>
            <li class="list__item">
              <router-link to="/post/form" class="list__link">
                投稿する
              </router-link>
            </li>
            <li class="list__item">
              <a href="" class="list__link" @click.prevent="logout"
                >ログアウト</a
              >
            </li>
          </ul>
        </nav>
        <div class="side-footer">
          <ul class="list">
            <li class="list__item">
              <a href="" @click.prevent="toggleAppOverview">サイト概要</a>
            </li>
          </ul>
        </div>
      </aside>
    </transition>

    <!-- メイン -->
    <div class="container__main">
      <div class="container-main">
        <PostFilter :myId="userId" v-show="$route.name === 'home'" />
        <router-view :postList="displayedPosts" />
        <!-- ページネーション -->
        <transition name="fade">
          <Pagination
            :total="total"
            @movePage="pagination"
            :userId="userId"
            v-show="$route.name === 'home' && displayedPosts.length > 0"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import PostFilter from "@/components/PostFilter";
import Pagination from "@/components/Pagination";
import ModalWindow from "@/components/ModalWindow";
import AppOverview from "@/components/AppOverview";
import { mapGetters, mapActions, mapMutations } from "vuex";
import authInfoMixin from "@/mixins/authInfoMixin";

export default {
  components: {
    PostFilter,
    Pagination,
    ModalWindow,
    AppOverview,
  },
  data() {
    return {
      displayedPosts: [], // 表示する投稿
      showFolloweeList: false,
      showFollowerList: false,
      total: 0, // 総ページ数
      mainMenu: {
        // サイドメニュー一覧
        home: { login: false, name: "ホーム", type: "home" },
        followee: {
          login: true,
          name: "フォローユーザーの投稿",
          type: "followee",
        },
        favorites: { login: true, name: "お気に入りの投稿", type: "favorites" },
        myPosts: { login: true, name: "自分の投稿", type: "myPosts" },
      },
      followMenu: {
        followee: { name: "フォロー", type: "followee" },
        follower: { name: "フォロワー", type: "follower" },
      },
      // 画面幅
      width: window.innerWidth,
      showAppOverview: false, // 概要の表示・非表示
    };
  },
  computed: {
    ...mapGetters("posts", [
      "latestPosts",
      "followeePosts",
      "myPosts",
      "myFavoritePosts",
      "filteredPosts",
      "searchedPosts",
      "filterType",
      "pageTotal",
      "activeMenu",
      "showSideMenu",
    ]),
    ...mapGetters("follows", ["follow", "follower"]),
  },
  mixins: [authInfoMixin],
  created() {
    Promise.all([
      this.getLatestPosts(), // 最新の投稿をVuexに保存
      this.getFolloweePosts(), // フォロイーの投稿をVuexに保存
    ]).then(() => {
      this.resetFilterType(); // filterTypeを初期化
      this.resetActiveMenu("home");
      this.total = this.pageTotal["home"]; // 最新の投稿の総ページ数
      this.displayedPosts = this.latestPosts; // 最新の投稿を表示

      this.$store.commit("posts/setIsLoading", false);
    });
  },
  mounted() {
    // 画面幅の変更を感知
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
  methods: {
    ...mapActions("posts", [
      "getLatestPosts",
      "getFolloweePosts",
      "getMyFavoritePosts",
      "getMyPosts",
      "resetActiveMenu",
      "resetFilterType",
    ]),
    ...mapMutations("posts", ["toggleSideMenu", "hideSideMenu"]),
    // ページ別に適切な投稿を返す
    getPosts(postType) {
      const menuAndPosts = {
        // メニューの種類と表示する投稿の対応表
        home: this.latestPosts,
        followee: this.followeePosts,
        favorites: this.myFavoritePosts,
        myPosts: this.myPosts,
      };
      return menuAndPosts[postType];
    },
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
    // 投稿を切り替え表示
    switchPosts(type) {
      // 投稿ページからメニューを押した場合
      if (this.$route.name !== "home") {
        this.$router.push("/");
      }
      this.displayedPosts = this.getPosts(type); // 投稿を切り替え
      this.total = this.pageTotal[type]; // 総ページ数を更新
      this.resetActiveMenu(type); // メニューのタイプを切り替え
      this.resetFilterType(); // filterTypeを初期化
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
    // ページ移動時（フィルタリング・検索時は対象外）
    pagination() {
      this.displayedPosts = this.getPosts(this.activeMenu); // それ以外のページ
    },
    // ログアウト
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        if (this.$route.path !== "/") {
          // ホームページへ遷移
          this.$router.push("/");
        }
      });
    },
    // サイト概要の表示・非表示切り替え
    toggleAppOverview() {
      this.hideSideMenu();
      this.showAppOverview = !this.showAppOverview;
    },
  },
  watch: {
    filterType(val) {
      // 投稿がフィルタリングされた場合
      if (val === "filter") {
        this.displayedPosts = this.filteredPosts;
        this.total = this.pageTotal.filter;

        // 投稿が検索された場合
      } else if (val === "search") {
        this.displayedPosts = this.searchedPosts;
        this.total = this.pageTotal.search;
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    // 投稿画面から遷移したとき
    if (to.name === "home") {
      Promise.all([
        this.getLatestPosts(), // 最新の投稿をVuexに保存
        this.getFolloweePosts(), // フォロイーの投稿をVuexに保存
      ]).then(() => {
        this.resetActiveMenu("home");
        this.total = this.pageTotal["home"]; // 最新の投稿
        this.displayedPosts = this.latestPosts; // 初期は最新の投稿を表示
        next();
      });
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    const params = [this.getLatestPosts(), this.getFolloweePosts()];
    if (this.isLoggedIn) {
      params.push(this.getMyPosts());
      params.push(this.getMyFavoritePosts());
    }
    // 投稿を初期化
    Promise.all(params).then(() => {
      // isLoadingを初期化
      this.$store.commit("posts/setIsLoading", true);
      next();
    });
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
}

/* サイドバー */
.container__side-bar {
  display: flex;
  flex-direction: column;
  width: 20%;
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
  font-size: 1.1em;
  letter-spacing: 4px;
}

.list__link {
  display: flex;
  align-items: center;
  height: 45px;
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
  height: 35px;
  font-size: 0.8em;
}

.list__username {
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.item-icon {
  width: 25px;
  height: 25px;
  background: silver;
}

.item-icon__img {
  width: 25px;
  height: 25px;
  object-fit: cover;
}

.side-footer {
  flex: 1;
  min-height: 150px;
  padding: 30px 30px;
  background: rgb(76, 26, 92);
  color: white;
  font-size: 0.8em;
}

.nav {
  border-bottom: 2px solid gray;
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
  border: none;
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

/* アニメーション */
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2.5s;
}

.fadeModal-leave-active {
  transition: opacity 0.3s;
}

.fadeModal-leave-to {
  opacity: 0;
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide {
  from {
    opacity: 0;
    transform: translateX(-300px);
  }
  to {
    transform: translateX(0);
  }
}

.open-enter-active {
  animation: open 0.4s ease-in;
}

.open-leave-active {
  animation: open 0.3s linear reverse;
}

.slide-enter-active {
  animation: slide 0.3s ease-in;
}

.slide-leave-active {
  animation: slide 0.3s ease-in reverse;
}

.nav--tablet_sp {
  display: none;
}

@media screen and (max-width: 1024px) {
  .container__side-bar {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 60;
  }

  .nav--tablet_sp {
    display: block;
  }
}
</style>