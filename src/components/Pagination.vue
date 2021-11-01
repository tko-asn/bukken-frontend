<template>
  <ul class="list-pagination">
    <template v-if="width >= 1025">
      <!-- 前のページ -->
      <li class="item-page">
        <a
          href=""
          :class="{
            'item-page__link': true,
            'item-page__link--direction': true,
            'item-page__link--disabled': currentPage === 1,
            'item-page__link--end': currentPage === 1,
          }"
          @click.prevent="movePage(currentPage - 1)"
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
            'item-page__link--current': num === currentPage,
            'item-page__link--disabled': num === currentPage,
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
            'item-page__link--disabled': total === currentPage,
            'item-page__link--end': total === currentPage,
          }"
          @click.prevent="movePage(currentPage + 1)"
        >
          次へ
        </a>
      </li>
    </template>
    <template v-else>
      <!-- ページ番号 -->
      <li class="item-page">
        <a
          href=""
          :class="{
            'item-page__link': true,
            'item-page__link--current': num === currentPage,
            'item-page__link--disabled': num === currentPage,
          }"
          @click.prevent="movePage(num)"
          v-show="displayPageButton(num)"
          v-for="num in total"
          :key="num"
        >
          {{ num }}
        </a>
      </li>
      <li class="item-page">
        <!-- 前のページ -->
        <a
          href=""
          :class="{
            'item-page__link': true,
            'item-page__link--direction': true,
            'item-page__link--disabled': currentPage === 1,
            'item-page__link--end': currentPage === 1,
          }"
          @click.prevent="movePage(currentPage - 1)"
        >
          前へ
        </a>
        <!-- 次のページ -->
        <a
          href=""
          :class="{
            'item-page__link': true,
            'item-page__link--direction': true,
            'item-page__link--disabled': total === currentPage,
            'item-page__link--end': total === currentPage,
          }"
          @click.prevent="movePage(currentPage + 1)"
        >
          次へ
        </a>
      </li>
    </template>
  </ul>
</template>

<script>
import apiClient from "@/axios";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    total: Number, // 総ページ数
    userId: {
      // 取得する投稿の投稿者ID
      type: String,
      required: false,
      default: "",
    },
  },
  computed: {
    ...mapGetters("posts", ["activeMenu", "filterType"]),
    currentPage() {
      if (this.filterType === "filter" || this.filterType === "search") {
        return this.currentPageList[this.filterType];
      }
      return this.currentPageList[this.activeMenu];
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
        filter: 1,
        search: 1,
      },
      getPostAction: {
        // 投稿取得アクション名
        home: "getLatestPosts",
        followee: "getFolloweePosts",
        favorites: "getMyFavoritePosts",
        myPosts: "getMyPosts",
      },
      width: window.innerWidth,
    };
  },
  mounted() {
    // 画面幅の変更を感知
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
  methods: {
    ...mapActions("posts", [
      "registerFilteredPosts",
      "registerSearchedPosts",
      "resetFilterType",
    ]),
    // ページボタンの表示・非表示
    displayPageButton(num) {
      if (this.currentPage === 1 || this.currentPage === 2) {
        return num <= 5;
      } else if (
        this.currentPage === this.total ||
        this.currentPage === this.total - 1
      ) {
        return num >= this.total - 4;
      } else if (num === this.currentPage) {
        return true;
      } else if (num < this.currentPage) {
        return num >= this.currentPage - 2;
      } else if (num > this.currentPage) {
        return num <= this.currentPage + 2;
      }
    },
    // ページ移動
    async movePage(page) {
      this.$store.commit("posts/setIsLoading", true);

      // フィルタリング条件指定時
      if (this.filterType === "filter") {
        // watchでfilterTypeの変更を感知できるように検索データを初期化
        this.resetFilterType();

        await this.registerFilteredPosts({
          page,
          userId: this.userId,
        });
        this.currentPageList.filter = page;

        // 検索キーワード指定時
      } else if (this.filterType === "search") {
        // watchでfilterTypeの変更を感知できるように検索データを初期化
        this.resetFilterType();

        await this.registerSearchedPosts({
          page,
          userId: this.userId,
        });
        this.currentPageList.search = page;

        // UserPosts.vue
      } else if (this.$route.name === "userPosts") {
        const { data } = await apiClient.get(
          "/posts/" + this.userId + "/page/" + page + "/"
        );
        this.$emit("movePage", data.posts);
        this.currentPageList[this.activeMenu] = page;

        // Home.vue
      } else {
        await this.$store.dispatch(
          "posts/" + this.getPostAction[this.activeMenu],
          page
        );
        this.$emit("movePage");
        this.currentPageList[this.activeMenu] = page;
      }

      this.$store.commit("posts/setIsLoading", false);
    },
  },
  watch: {
    filterType(val, old) {
      // フィルタリングされた投稿を非表示にした場合
      if (!val && old === "filter") {
        this.currentPageList.filter = 1;

        // 検索された投稿を非表示にした場合
      } else if (!val && old === "search") {
        this.currentPageList.search = 1;
      }
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
  padding: 20px 0;
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

@media screen and (max-width: 1024px) {
  .list-pagination {
    flex-direction: column;
    align-items: center;
  }

  .item-page {
    display: flex;
    margin-bottom: 10px;
  }
}
</style>
