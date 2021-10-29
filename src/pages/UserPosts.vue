<template>
  <div class="container">
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
    <PostFilter :myId="userId" />

    <!-- 投稿が存在する場合 -->
    <transition name="fade" mode="out-in">
      <template v-if="postList.length">
        <PostList :postList="postList" />
      </template>

      <!-- 投稿が存在しない場合 -->
      <p class="container__text-no-posts" v-else>投稿はありません</p>
    </transition>
    <transition name="fadePagination">
      <Pagination
        :total="total"
        :userId="userId"
        @movePage="pagination"
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
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    PostList,
    PostFilter,
    Pagination,
  },
  props: {
    userId: String, // ユーザーのID
  },
  data() {
    return {
      postList: [], // 表示する投稿
      userData: {}, // ユーザーのデータ
      total: 0,
    };
  },
  computed: {
    ...mapGetters("posts", [
      "filteredPosts",
      "searchedPosts",
      "pageTotal",
      "filterType",
    ]),
  },
  created() {
    Promise.all([
      apiClient.get("/posts/" + this.userId + "/page/" + 1 + "/"), // ユーザーの投稿のリストを取得
      apiClient.get("/users/" + this.userId + "/"), // ユーザーデータを取得
    ]).then((values) => {
      this.resetFilterType(); // filterTypeの初期化
      this.resetActiveMenu("myPosts"); // フィルタリング時に使用
      this.postList = values[0].data.posts; // ユーザーの投稿はdataに保存
      this.total = values[0].data.total;
      this.userData = values[1].data;
    });
  },
  methods: {
    ...mapActions("posts", ["resetFilterType", "resetActiveMenu"]),
    // ページネーション
    pagination(posts) {
      this.postList = posts;
    },
  },
  watch: {
    filterType(val) {
      // 投稿がフィルタリングした場合
      if (val === "filter") {
        this.postList = this.filteredPosts;
        this.total = this.pageTotal.filter;

        // 投稿が検索された場合
      } else if (val === "search") {
        this.postList = this.searchedPosts;
        this.total = this.pageTotal.search;
      }
    },
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