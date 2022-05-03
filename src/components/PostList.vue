<template>
  <!-- 投稿リスト -->
  <div class="container-post-list">
    <!-- 投稿がある場合 -->
    <transition name="fade" mode="out-in" appear>
      <Loader v-if="isLoading" />
      <transition-group
        name="fadeGroup"
        class="container-post-list__block-posts"
        v-else-if="postList.length"
        key="showPosts"
      >
        <!-- 投稿 -->
        <section
          class="section-post"
          v-for="post in postList"
          :key="post.id"
          @click="moveToPostPage(post.id)"
        >
          <!-- タイトル -->
          <h3 class="section-post__title">
            {{ post.title }}
          </h3>

          <!-- 投稿者 -->
          <div class="block-author">
            <div class="item-icon">
              <img class="item-icon__img" :src="post.user.icon_url" />
            </div>
            <p class="section-post__sub-title section-post__sub-title--nowrap">
              {{ post.user.username }}
            </p>
          </div>

          <!-- 物件情報 -->
          <div class="block-property">
            <h4 class="block-property__title">物件名</h4>
            <p class="section-post__sub-title section-post__sub-title--nowrap">
              {{ post.property }}
            </p>
            <h4 class="block-property__title">所在地</h4>
            <p
              :class="{
                'section-post__sub-title': true,
                'section-post__sub-title--nowrap': width >= 600,
              }"
            >
              {{ "〒" + postalCodeA(post) + "-" + postalCodeB(post)
              }}<span>{{ addressData(post) }}</span>
            </p>
          </div>

          <!-- カテゴリー -->
          <div
            class="block-category"
            v-if="post.categories && post.categories.length"
            v-show="width >= 600"
          >
            <span
              class="block-category__span"
              v-for="category in post.categories"
              :key="category.id"
            >
              {{ category.firstCategory }}/{{ category.secondCategory }}
            </span>
          </div>
        </section>
      </transition-group>

      <!-- 投稿がない場合 -->
      <div class="block-no-post" v-else key="hidePosts">
        <p class="block-no-post__text">投稿はありません</p>
      </div>
    </transition>
  </div>
</template>

<script>
import Loader from "@/components/Loader";
import addressData from "@/mixins/addressData";
import widthMixin from "@/mixins/widthMixin";

export default {
  props: {
    postList: { // 投稿リスト
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Loader,
  },
  mixins: [addressData, widthMixin],
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
  min-height: 270px;
  padding: 20px 0;
}

/* 投稿リストの投稿ブロック */
.container-post-list__block-posts {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 0 auto;
}

/* ロード中 */
.container-post-list__loader {
  text-align: center;
}

/* 投稿 */
.section-post {
  max-height: 270px;
  padding: 10px;
  overflow: hidden;
  border: 1px solid rgb(189, 187, 187);
  background: #fff;
  cursor: pointer;
}

.section-post + .section-post {
  margin-top: 20px;
}

.section-post:hover {
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

.block-category {
  width: 100%;
  padding: 5px 0;
  overflow-wrap: break-word;
}

.block-category__span {
  margin-right: 5px;
  color: gray;
  font-size: 0.8em;
}

/* 投稿者表示部分 */
.block-author {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
  margin: 10px 0;
}

.item-icon,
.item-icon__img {
  width: 20px;
  height: 20px;
}

.item-icon {
  margin-right: 5px;
  background: silver;
}

.item-icon__img {
  object-fit: cover;
}

.section-post__sub-title {
  margin: 0;
  overflow: hidden;
  color: rgb(78, 76, 76);
  font-size: 0.9em;
}

.section-post__sub-title--nowrap {
  white-space: nowrap;
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
.fade-leave-to,
.fadeGroup-enter,
.fadeGroup-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fadeGroup-enter-active {
  transition: opacity 0.5s;
  animation: slideUp 0.5s;
}

.fade-leave-active,
.fadeGroup-leave-active {
  transition: opacity 0.2s;
}

.fadeGroup-leave-active {
  position: absolute;
}

.fadeGroup-move {
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
</style>
