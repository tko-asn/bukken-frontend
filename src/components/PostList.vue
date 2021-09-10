<template>
  <!-- 投稿リスト -->
  <div class="container-post-list">
    <!-- 投稿がある場合 -->
    <template v-if="postList.length">
      <!-- 投稿 -->
      <section
        class="section-post section-post--exist"
        v-for="post in postList"
        :key="post.id"
        @click="moveToPostPage(post.id)"
      >
        <!-- タイトル -->
        <h3 class="section-post__title">
          {{ post.title }}
        </h3>

        <!-- 投稿者 -->
        <div class="section-post__author">
          <div class="item-icon">
            <img class="item-icon__img" :src="post.user.icon_url" />
          </div>
          <p class="section-post__sub-title">{{ post.user.username }}</p>
        </div>

        <!-- 物件情報 -->
        <section class="block-property">
          <h4 class="block-property__title">質問対象の物件</h4>
          <p class="section-post__sub-title">{{ post.property }}</p>
          <p class="section-post__sub-title">
            {{ addressData(post) }}
          </p>
        </section>
      </section>

      <!-- セクションを左揃えにするための空の要素 -->
      <div class="section-post" v-show="isOdd"></div>
    </template>

    <!-- 投稿がない場合 -->
    <template v-else>
      <div class="block-no-post">
        <p class="block-no-post__text">投稿はありません</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    postList: Array, // 投稿リスト
  },
  computed: {
    // 投稿リストの要素数が奇数か判定
    isOdd() {
      return this.postList.length % 2 !== 0;
    },
  },
  methods: {
    // 住所のデータを連結して返す
    addressData(post) {
      return (
        post.address.prefecture +
        post.address.municipality +
        post.address.townName +
        post.address.buildingName
      );
    },
    moveToPostPage(id) {
      this.$router.push({ name: "postDetails", params: { postId: id } });
    },
  },
};
</script>

<style scoped>
/* 投稿リスト */
.container-post-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 20px 0;
}

/* 投稿 */
.section-post {
  width: 45%;
  max-height: 170px;
  margin-bottom: 30px;
  padding: 10px;
}

.section-post--exist {
  overflow: hidden;
  border: 2px solid rgb(189, 187, 187);
  border-radius: 5px;
  box-shadow: 0 4px 6px rgb(70, 69, 69);
  background: #fff;
  cursor: pointer;
}

/* タイトル */
.section-post__title {
  max-height: 30px;
  margin: 0;
  overflow: hidden;
  font-size: 1.3em;
}

/* 投稿者表示部分 */
.section-post__author {
  max-height: 40px;
  display: flex;
  overflow: hidden;
  align-items: center;
  margin: 10px 0;
}

.item-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  background: silver;
}

.item-icon__img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.section-post__sub-title {
  overflow: hidden;
  margin: 0;
  color: rgb(78, 76, 76);
  font-size: 1.1em;
}

.block-property__title {
  margin: 0;
  color: rgb(97, 97, 97);
}

/* 投稿がない場合 */
.block-no-post {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}
</style>
