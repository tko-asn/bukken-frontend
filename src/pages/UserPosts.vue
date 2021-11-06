<template>
  <div class="container">
    <Header>
      <Search
        :userId="userId"
        :searchPosts="getPosts"
        :switchType="switchPostType"
      />
    </Header>
    <!-- タイトル -->
    <h2 class="container__title">
      <router-link
        class="container__link-username"
        :to="{ name: 'userView', params: { id: userId } }"
      >
        {{ userData.username }}
      </router-link>
      の投稿
    </h2>
    <!-- 投稿フィルター -->
    <PostFilter
      :myId="userId"
      :filterPosts="getPosts"
      :switchType="switchPostType"
    />

    <PostList :postList="postList" />
    <transition name="fadePagination">
      <Pagination
        :total="total"
        :userId="userId"
        :paginationFunc="getPosts"
        :pageNumber="page"
        v-show="postList.length"
      />
    </transition>
  </div>
</template>

<script>
import apiClient from "@/axios";
import PostList from "@/components/PostList";
import PostFilter from "@/components/PostFilter";
import Pagination from "@/components/Pagination";
import Header from "@/components/Header";
import Search from "@/components/Search";

export default {
  components: {
    PostList,
    PostFilter,
    Pagination,
    Header,
    Search,
  },
  props: {
    userId: String, // ユーザーのID
  },
  data() {
    return {
      postList: [], // 表示する投稿
      userData: {}, // ユーザーのデータ
      total: 0,
      page: 0,
      postType: "",
      conditions: {},
    };
  },
  created() {
    Promise.all([
      this.getPosts(1), // ユーザーの投稿のリストを取得
      apiClient.get("/users/" + this.userId + "/"), // ユーザーデータを取得
    ]).then((values) => {
      this.userData = values[1].data;
      this.$store.commit("home/setIsLoading", false);
    });
  },
  methods: {
    async getPosts(page, payload = {}) {
      let route = "/posts/" + this.userId + "/page/" + page + "/";
      if (this.postType === "filter") {
        route = "/posts/filter/query/page/" + page + "/";
      } else if (this.postType === "search") {
        route = "/posts/search/query/page/" + page + "/";
      }
      // フィルタリング・検索条件に変更があった場合
      if ("params" in payload) {
        payload.params.authorId = this.userId;
        this.conditions = payload;
      }
      // ページ切り替え時も条件を引き継ぐ
      const { data } = await apiClient.get(route, this.conditions);
      this.postList = data.posts;
      this.total = data.total;
      this.page = page;
    },
    switchPostType(type) {
      this.postType = type;
    },
  },
  beforeRouteLeave(to, from, next) {
    // isLoadingを初期化
    this.$store.commit("home/setIsLoading", true);
    next();
  },
};
</script>

<style scoped>
/* コンテナ */
.container {
  width: 80%;
  padding: 50px 0;
  margin: 0 auto;
}

/* タイトル */
.container__title {
  margin-bottom: 0;
  padding-left: 10px;
  font-size: 1.7em;
}

/* ユーザー名のリンク */
.container__link-username {
  text-decoration: none;
}

/* 投稿が存在しない場合 */
.container__text-no-posts {
  text-align: center;
  color: gray;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fadePagination-enter,
.fadePagination-leave-to {
  opacity: 0;
}

.fadePagination-enter-active,
.fadePagination-leave-active {
  transition: opacity 2.5s;
}

@media screen and (max-width: 599px) {
  .container__title {
    text-align: center;
  }
}
</style>