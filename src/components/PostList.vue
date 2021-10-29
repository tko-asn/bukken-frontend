<template>
  <!-- 投稿リスト -->
  <div class="container-post-list">
    <!-- 投稿がある場合 -->
    <transition name="fade" mode="out-in" appear>
      <transition-group
        name="fade"
        class="container-post-list__block-posts"
        v-if="postList.length"
        key="showPosts"
      >
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
            <p class="section-post__sub-title section-post__sub-title--nowrap">
              {{ post.user.username }}
            </p>
          </div>

          <!-- 物件情報 -->
          <section class="block-property">
            <h4 class="block-property__title">物件名</h4>
            <p class="section-post__sub-title section-post__sub-title--nowrap">
              {{ post.property }}
            </p>
            <h4 class="block-property__title">所在地</h4>
            <p class="section-post__sub-title">
              {{ "〒" + postalCodeA(post) + "-" + postalCodeB(post)
              }}<span>{{ addressData(post) }}</span>
            </p>
          </section>
        </section>

        <!-- セクションを左揃えにするための空の要素 -->
        <div class="section-post" v-show="isOdd" key="emptyPost"></div>
      </transition-group>

      <!-- 投稿がない場合 -->
      <div class="block-no-post" v-else key="hidePosts">
        <p class="block-no-post__text">投稿はありません</p>
      </div>
    </transition>
  </div>
</template>

<script>
import addressData from "@/mixins/addressData";

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
  mixins: [addressData],
  methods: {
    moveToPostPage(id) {
      this.$router.push({ name: "postDetails", params: { postId: id } });
    },
  },
};
</script>

<style scoped>
/* 投稿リスト */
.container-post-list {
  padding: 20px 0;
}

/* 投稿リストの投稿ブロック */
.container-post-list__block-posts {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

/* 投稿 */
.section-post {
  width: 40%;
  max-height: 270px;
  margin-bottom: 30px;
  padding: 10px;
  overflow: hidden;
}

.section-post--exist {
  border: 2px solid rgb(189, 187, 187);
  border-radius: 5px;
  box-shadow: 0 3px 4px rgb(70, 69, 69);
  background: #fff;
  cursor: pointer;
}

.section-post--exist:hover {
  filter: brightness(90%);
}

/* タイトル */
.section-post__title {
  max-height: 30px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.1em;
}

/* 投稿者表示部分 */
.section-post__author {
  max-height: 40px;
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
  margin: 10px 0;
}

.item-icon {
  width: 35px;
  height: 35px;
  margin-right: 10px;
  background: silver;
}

.item-icon__img {
  width: 35px;
  height: 35px;
  object-fit: cover;
}

.section-post__sub-title {
  margin: 0;
  overflow-wrap: break-word;
  color: rgb(78, 76, 76);
  font-size: 0.9em;
}

.section-post__sub-title--nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.block-property__title {
  margin: 10px 0 0;
  color: rgb(97, 97, 97);
  letter-spacing: 1px;
}

/* 投稿がない場合 */
.block-no-post {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}

/* アニメーション */
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.5s;
  animation: slideUp 0.5s;
}

.fade-leave-active {
  transition: opacity 0.2s;
  position: absolute;
}

.fade-move {
  transition: transform 0.8s;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
  }
  to {
    transform: translateY(0);
  }
}

@media screen and (max-width: 1024px) {
  .section-post {
    width: 40%;
  }
}

@media screen and (max-width: 599px) {
  .section-post {
    width: 85%;
  }
}
</style>
