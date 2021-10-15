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
            {{ post.property }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("posts", ["latestPosts"]),
  },
  created() {
    this.$store.dispatch("posts/getLatestPosts");
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
  animation: scaleUp 0.5s;
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}

.block-side__list {
  list-style: none;
  margin: 0;
  padding: 0;
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