<template>
  <div class="container">
    <Header>
      <Search
        :userId="userId"
        :searchPosts="getPosts"
        :switchType="switchPostType"
      />
    </Header>
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
              @click.prevent="switchMenu(obj.type)"
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
                >
                  {{ menuObj.name }}
                </a>
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
                            id: obj.id,
                          },
                        }"
                      >
                        <div class="item-icon">
                          <img class="item-icon__img" :src="obj.icon_url" />
                        </div>
                        <p class="list__username">
                          {{ obj.username }}
                        </p>
                      </router-link>
                    </li>
                    <router-link
                      class="list__link list__link--small"
                      :to="{
                        name: moreUserLinkName(menuObj.type),
                        params: { id: userId },
                      }"
                      v-if="followTotal[menuObj.type] > 1"
                    >
                      もっとみる
                      <fa-icon class="list__icon" icon="angle-double-right" />
                    </router-link>
                    <a
                      class="list__link list__link--small"
                      href=""
                      @click.prevent="closeUserList(menuObj.type)"
                      >閉じる
                      <fa-icon class="list__icon" icon="chevron-up" />
                    </a>
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
        <PostFilter
          :myId="userId"
          :filterPosts="getPosts"
          :switchType="switchPostType"
          v-show="$route.name === 'home'"
        />
        <router-view :postList="postObj[postType].posts" />
        <!-- ページネーション -->
        <transition name="fade">
          <Pagination
            :total="total"
            :userId="userId"
            :paginationFunc="getPosts"
            :pageNumber="postObj[postType].page"
            v-show="
              $route.name === 'home' && postObj[postType].posts.length > 0
            "
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Search from "@/components/Search";
import ModalWindow from "@/components/ModalWindow";
import AppOverview from "@/components/AppOverview";
import PostFilter from "@/components/PostFilter";
import Pagination from "@/components/Pagination";
import apiClient from "@/axios";
import { mapGetters, mapMutations } from "vuex";
import followData from "@/mixins/followData";

export default {
  components: {
    Header,
    Search,
    ModalWindow,
    AppOverview,
    PostFilter,
    Pagination,
  },
  mixins: [followData],
  data() {
    return {
      total: 0,
      postObj: {
        home: { posts: [], page: 1 },
        favorites: { posts: [], page: 1 },
        followee: { posts: [], page: 1 },
        myPosts: { posts: [], page: 1 },
        filter: { posts: [], page: 1 },
        search: { posts: [], page: 1 },
      },
      postType: "home",
      activeMenu: "home",
      conditions: {},
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
      width: window.innerWidth,
      showFolloweeList: false,
      showFollowerList: false,
      showAppOverview: false, // 概要の表示・非表示
      getPostMethods: {
        home: this.getLatestPosts,
        followee: this.getFolloweePosts,
        favorites: this.getFavoritePosts,
        myPosts: this.getMyPosts,
        filter: this.getFilteredPosts,
        search: this.getSearchedPosts,
      },
    };
  },
  async created() {
    await Promise.all([
      this.getLatestPosts(1),
      this.getFollowees(1),
      this.getFollowers(1),
    ]);
    this.setIsLoading(false);
  },
  mounted() {
    // 画面幅の変更を感知
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
  computed: {
    ...mapGetters("auth", ["userId", "isLoggedIn"]),
    ...mapGetters("home", ["showSideMenu", "isLoading"]),
    ...mapGetters("followeeId", ["followeeId"]),
  },
  methods: {
    ...mapMutations("home", ["toggleSideMenu", "hideSideMenu", "setIsLoading"]),
    async getLatestPosts(page) {
      const { data } = await apiClient.get("/posts/page/" + page + "/");
      this.postObj.home.posts = data.posts;
      this.total = data.total;
      this.postObj.home.page = page;
    },
    async getFavoritePosts(page) {
      const { data } = await apiClient.get(
        "/posts/favorite/user/" + this.userId + "/page/" + page + "/"
      );
      this.postObj.favorites.posts = data.posts;
      this.total = data.total;
      this.postObj.favorites.page = page;
    },
    async getFolloweePosts(page) {
      const { data } = await apiClient.post(
        "/posts/followee/page/" + page + "/",
        { followsId: this.followeeId }
      );
      this.postObj.followee.posts = data.posts;
      this.total = data.total;
      this.postObj.followee.page = page;
    },
    async getMyPosts(page) {
      const { data } = await apiClient.get(
        "/posts/" + this.userId + "/page/" + page + "/"
      );
      this.postObj.myPosts.posts = data.posts;
      this.total = data.total;
      this.postObj.myPosts.page = page;
    },
    async getFilteredPosts(page, conditions = {}) {
      const { data } = await apiClient.get(
        "/posts/filter/query/page/" + page + "/",
        conditions
      );

      this.postObj.filter.posts = data.posts;
      this.total = data.total;
      this.postObj.filter.page = page;
    },
    async getSearchedPosts(page, conditions = {}) {
      const { data } = await apiClient.get(
        "/posts/search/query/page/" + page + "/",
        conditions
      );
      this.postObj.search.posts = data.posts;
      this.total = data.total;
      this.postObj.search.page = page;
    },
    async switchMenu(type) {
      // 投稿ページからメニューを押した場合
      if (this.$route.name !== "home") {
        this.$router.push("/");
      }
      await this.getPostMethods[type](this.postObj[type].page);
      this.activeMenu = this.postType = type;
    },
    // ページネーション・フィルタリング・検索
    async getPosts(page, payload = {}) {
      if ("params" in payload) {
        // myPostsで絞り込み
        if (this.activeMenu === "myPosts") {
          payload.params.authorId = this.userId;

          // followeeで絞り込み
        } else if (this.activeMenu === "followee") {
          payload.params.authorId = this.followeeId;

          // お気に入りの投稿表示中の絞り込み
        } else if (this.activeMenu === "favorites") {
          payload.params.userId = this.userId;
        }
        this.conditions = payload;
      }
      // フィルタリングor検索orフィルタリング・検索でのページネーション
      if (this.postType === "filter" || this.postType === "search") {
        // ページ切り替え時も条件を引き継ぐ
        await this.getPostMethods[this.postType](page, this.conditions);

        // 通常メニューでのページネーション
      } else {
        await this.getPostMethods[this.postType](page);
      }
    },
    switchPostType(type) {
      this.postType = type;
    },
    // フォローしているユーザーの表示切り替え
    toggleUser(userType) {
      // フォローしているユーザーのドロップダウンメニュー
      if (userType === "followee") {
        this.showFolloweeList = !this.showFolloweeList;

        // フォロワーのドロップダウンメニュー
      } else if (userType === "follower") {
        this.showFollowerList = !this.showFollowerList;
      }
    },
    // フォローデータの種類を判定しデータのリストを返す
    followsList(type) {
      // フォローしているユーザー一覧を取得する場合
      if (type === "followee") {
        return this.followees;

        // フォロワー一覧を取得する場合
      } else if (type === "follower") {
        return this.followers;
      }
    },
    moreUserLinkName(type) {
      return type === "followee" ? "followList" : "followerList";
    },
    // ユーザーのドロップダウンメニューを閉じる
    closeUserList(userType) {
      if (userType === "followee") {
        this.showFolloweeList = false;
      } else if (userType === "follower") {
        this.showFollowerList = false;
      }
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
  beforeRouteUpdate(to, from, next) {
    if (to.name === "home") {
      this.getLatestPosts(1);
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    // isLoadingを初期化
    this.$store.commit("home/setIsLoading", true);
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

.list__icon {
  margin-left: 5px;
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