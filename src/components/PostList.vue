<template>
  <!-- 投稿リスト -->
  <div class="post_list">
    <!-- 投稿がある場合 -->
    <template v-if="postList.length">
      <!-- 投稿 -->
      <section
        class="post_card"
        v-for="post in postList"
        :key="post.id"
        @click="moveToPostPage(post.id)"
      >
        <div class="card_container">
          <!-- タイトル -->
          <h3 class="ttl">
            {{ post.title }}
          </h3>

          <!-- 投稿者 -->
          <div class="author">
            <div class="icon">
              <img :src="post.user.icon_url" />
            </div>
            <p class="sub_ttl">{{ post.user.username }}</p>
          </div>

          <!-- 内容 -->
          <div class="content">
            <p class="sub_ttl">{{ post.text }}</p>
          </div>
        </div>
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
    postList: Array, // 投稿リスト
  },
  methods: {
    moveToPostPage(id) {
      this.$router.push({ name: "postDetails", params: { postId: id } });
    },
  },
};
</script>

<style scoped>
/* 基本設定 */
h3,
p {
  margin: 0;
}

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
  overflow: hidden;
  border: 2px solid rgb(189, 187, 187);
  border-radius: 5px;
  box-shadow: 0 4px 6px rgb(70, 69, 69);
  background: #fff;
  cursor: pointer;
}

.card_container {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 20px auto;
  overflow: hidden;
}

/* タイトル */
.ttl {
  font-size: 1.3em;
}

/* 投稿者表示部分 */
.author {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  background: silver;
}

.icon > img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

/* 投稿内容部分 */
.content {
  margin-top: 20px;
  overflow-wrap: break-word;
}

.sub_ttl {
  color: rgb(78, 76, 76);
  font-size: 1.1em;
}

/* 投稿がない場合 */
.no_post {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}
</style>
