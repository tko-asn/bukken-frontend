<template>
  <aside class="block-side">
    <nav class="block-side__nav">
      <ul class="block-side__list">
        <li class="item">
          <h3 class="item__title">{{ title }}</h3>
        </li>
        <li
          v-for="(post, index) in posts"
          :key="post.id"
          class="item"
          v-show="isHalf ? index < 5 : true"
        >
          <a
            href=""
            class="item__link"
            @click.prevent="moveToPostPage(post.id)"
          >
            <p class="item__text">{{ post.title }}</p>
            <p class="item__text item__text--small">{{ post.property }}</p>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
    isHalf: {
      type: Boolean,
      default: false,
    },
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
  display: block;
  height: 40px;
  padding: 3px 5px;
  border-bottom: 1px solid rgb(194, 193, 193);
  color: rgb(105, 104, 104);
  text-decoration: none;
}

.item__link:hover {
  background: rgb(209, 209, 209);
}

.item__text {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item__text--small {
  font-size: 0.8em;
}
</style>