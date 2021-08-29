<template>
  <aside>
    <h3>最新の質問</h3>
    <nav>
      <ul>
        <li v-for="post in latestPosts" :key="post.id">
          <a href="" @click.prevent="moveToPostPage(post.id)">{{
            post.title
          }}</a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import apiClient from "@/axios";

export default {
  data() {
    return {
      latestPosts: [], // 最新の投稿
    };
  },
  created() {
    apiClient
      .get("/posts/page/1") // 最新の投稿の1ページ目を取得
      .then((response) => {
        this.latestPosts = response.data;
      });
  },
  methods: {
    // 投稿のページへ移動
    moveToPostPage(postId) {
      // 現在表示中の投稿と違う投稿のページに遷移する場合
      if (postId !== this.$route.params.postId) {
        this.$router.push({ name: "postDetails", params: { postId } });
      }
    },
  },
};
</script>

<style scoped>
/* 基本設定 */
a {
  text-decoration: none;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* サイドメニュー */
aside {
  flex: 1;
  margin-left: 40px;
}

aside > h3 + nav {
  max-width: 250px;
  border-top: 2px solid rgb(194, 193, 193);
}

aside li > a {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 10px;
  overflow: hidden;
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(105, 104, 104);
}
</style>