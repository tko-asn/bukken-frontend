<template>
  <!-- 投稿リスト -->
  <div class="post_list">
    <!-- 投稿がある場合 -->
    <template v-if="posts.length">
      <!-- 投稿 -->
      <section class="post_card" v-for="post in posts" :key="post.id">
        <p class="ttl">{{ post.title }}</p>
        <p class="author_username">{{ post.author.username }}</p>
      </section>
    </template>

    <!-- 投稿がない場合 -->
    <template v-else>
      <div class="no_post">
        <p>投稿はありません</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    // スクロールバーを表示するかどうか
    scroll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      posts: [
        { title: "aaaaaaa", author: { username: "aaaaaaa" } },
        { title: "aaaaaaa", author: { username: "aaaaaaa" } },
        { title: "aaaaaaa", author: { username: "aaaaaaa" } },
        { title: "aaaaaaa", author: { username: "aaaaaaa" } },
        { title: "aaaaaaa", author: { username: "aaaaaaa" } },
        { title: "aaaaaaa", author: { username: "aaaaaaa" } },
      ],
    };
  },
};
</script>

<style scoped>
/* 投稿リスト */
.post_list {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 0 auto;
  padding: 20px 0;
}

/* 投稿 */
.post_card {
  width: 100%;
  height: 200px;
  margin: 0 auto 20px;
  border: 2px solid rgb(189, 187, 187);
  border-radius: 5px;
  box-shadow: 0 4px 6px rgb(70, 69, 69);
  background: #fff;
}

.no_post {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}
</style>
