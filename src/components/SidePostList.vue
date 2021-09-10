<template>
  <aside class="block-side">
    <nav class="block-side__nav">
      <ul class="block-side__list">
        <li class="item">
          <h3 class="item__title">最新の質問</h3>
        </li>
        <li v-for="post in latestPosts" :key="post.id" class="item">
          <a
            href=""
            class="item__link"
            @click.prevent="moveToPostPage(post.id)"
          >
            {{ post.title }}
          </a>
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
/* サイドメニュー */
.block-side {
  width: 25%;
}

.block-side__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.block-side__nav {
  border-top: 2px solid rgb(194, 193, 193);
}

.item__title {
  margin-bottom: 0;
}

.item__link {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 10px;
  overflow: hidden;
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(105, 104, 104);
  text-decoration: none;
}
</style>