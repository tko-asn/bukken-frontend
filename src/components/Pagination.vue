<template>
  <ul class="list-pagination">
    <!-- 前のページ -->
    <li class="item-page">
      <a
        href=""
        :class="{
          'item-page__link': true,
          'item-page__link--direction': true,
          'item-page__link--disabled': currentPageList[postType] === 1,
          'item-page__link--end': currentPageList[postType] === 1,
        }"
        @click.prevent="movePage(currentPageList[postType] - 1)"
      >
        前へ
      </a>
    </li>
    <!-- ページ番号 -->
    <li class="item-page" v-for="num in total" :key="num">
      <a
        href=""
        :class="{
          'item-page__link': true,
          'item-page__link--current': num === currentPageList[postType],
          'item-page__link--disabled': num === currentPageList[postType],
        }"
        @click.prevent="movePage(num)"
        v-show="displayPageButton(num)"
      >
        {{ num }}
      </a>
    </li>
    <!-- 次のページ -->
    <li class="item-page">
      <a
        href=""
        :class="{
          'item-page__link': true,
          'item-page__link--direction': true,
          'item-page__link--disabled': total === currentPageList[postType],
          'item-page__link--end': total === currentPageList[postType],
        }"
        @click.prevent="movePage(currentPageList[postType] + 1)"
      >
        次へ
      </a>
    </li>
  </ul>
</template>

<script>
import apiClient from "@/axios";

export default {
  props: {
    total: Number, // 総ページ数
    postType: String, // 表示する投稿の種類
    userId: {
      // 取得する投稿の投稿者ID
      type: String,
      require: false,
    },
  },
  data() {
    return {
      currentPageList: {
        // それぞれのメニューでの現在のページ数
        home: 1,
        followee: 1,
        favorites: 1,
        myPosts: 1,
        other: 1,
      },
      getPostAction: {
        // 投稿取得アクション名
        home: "getLatestPosts",
        followee: "getFolloweePosts",
        favorites: "getMyFavoritePosts",
        myPosts: "getMyPosts",
      },
    };
  },
  methods: {
    // ページボタンの表示・非表示
    displayPageButton(num) {
      const currentPage = this.currentPageList[this.postType];
      if (currentPage === 1 || currentPage === 2) {
        return num <= 5;
      } else if (currentPage === this.total || currentPage === this.total - 1) {
        return num >= this.total - 4;
      } else if (num === currentPage) {
        return true;
      } else if (num < currentPage) {
        return num >= currentPage - 2;
      } else if (num > currentPage) {
        return num <= currentPage + 2;
      }
    },
    async movePage(page) {
      // 現在のページを更新
      this.currentPageList[this.postType] = page;

      // UserPosts.vue
      if (this.postType === "other") {
        const { data } = await apiClient.get(
          "/posts/" + this.userId + "/page/" + page + "/"
        );
        this.$emit("movePage", data.posts);
        return;
      }

      // Home.vue
      await this.$store.dispatch(
        "posts/" + this.getPostAction[this.postType],
        page
      );
      this.$emit("movePage");
    },
  },
};
</script>

<style scoped>
.list-pagination {
  display: flex;
  justify-content: center;
  padding-bottom: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.item-page__link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 50px;
  margin: 0 5px;
  border: 1px solid gray;
  box-shadow: 0 2px 2px rgb(90, 90, 90);
  border-radius: 5px;
  background: #fff;
  color: rgb(101, 102, 102);
  text-decoration: none;
}

.item-page__link--current {
  background: rgba(189, 190, 190, 0.678);
}

.item-page__link--disabled {
  pointer-events: none;
}

.item-page__link--end {
  opacity: 0.5;
}

.item-page__link--direction {
  width: 80px;
}
</style>
