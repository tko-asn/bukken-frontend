<template>
  <div class="container">
    <!-- タイトル -->
    <h1 class="container__title">
      <router-link
        class="container__link-username"
        :to="{ name: 'userView', params: { id: userId } }"
      >
        {{ userData.username }}
      </router-link>
      の投稿
    </h1>
    <!-- 投稿フィルター -->
    <PostFilter :currentMenu="'myPosts'" :myId="userId" @filter="filterPosts" />

    <!-- 投稿が存在する場合 -->
    <PostList :postList="postList" v-if="postList.length" />

    <!-- 投稿が存在しない場合 -->
    <p class="container__text-no-posts" v-else>投稿はありません</p>
  </div>
</template>

<script>
import apiClient from "@/axios";
import PostList from "@/components/PostList";
import PostFilter from "@/components/PostFilter";

export default {
  components: {
    PostList,
    PostFilter,
  },
  props: {
    userId: String, // ユーザーのID
  },
  data() {
    return {
      postList: [], // ユーザーの投稿のリスト
      userData: {}, // ユーザーのデータ
    };
  },
  created() {
    Promise.all([
      apiClient.get("/posts/" + this.userId + "/"), // ユーザーの投稿のリストを取得
      apiClient.get("/users/" + this.userId + "/"), // ユーザーデータを取得
    ]).then((values) => {
      this.postList = values[0].data;
      this.userData = values[1].data;
    });
  },
  methods: {
    // 投稿のフィルタリング
    filterPosts(posts) {
      this.postList = posts;
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
}

/* ユーザー名のリンク */
.container__link-username {
  text-decoration: none;
}

/* 投稿が存在しない場合 */
.container__text-no-posts {
  text-align: center;
  color: gray;
  font-size: 1.2em;
}
</style>