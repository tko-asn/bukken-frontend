<template>
  <div class="item-search">
    <input
      class="item-search__input"
      placeholder="物件名・地名"
      v-model="keyword"
    />
    <button class="item-search__button" @click="search">
      <fa-icon class="item-search__icon" icon="search" />
      <span class="item-search__search">検索</span>
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    userId: String,
  },
  data() {
    return {
      routeList: [],
      keyword: "",
    };
  },
  methods: {
    ...mapActions("posts", [
      "registerSearchedPosts",
      "registerSearchData",
      "resetFilterType",
    ]),
    async search() {
      this.$store.commit("posts/setIsLoading", true);

      // watchでfilterTypeの変更を感知できるように検索データを初期化
      this.resetFilterType();

      // 検索キーワードを保存
      this.registerSearchData(this.keyword);

      const params = { page: 1, userId: this.userId };
      await this.registerSearchedPosts(params);

      this.$store.commit("posts/setIsLoading", false);
    },
  },
  watch: {
    $route() {
      this.keyword = "";
    },
  },
};
</script>

<style scoped>
.item-search {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  border-radius: 5px;
  background: #fff;
}

.item-search__input {
  width: 350px;
  height: 28px;
  padding-left: 10px;
  border: none;
  box-shadow: inset 2px 2px 5px rgb(179, 177, 177),
    inset -2px -2px 5px rgb(179, 177, 177);
}

.item-search__button {
  width: 100px;
  border: none;
  background: rgb(172, 75, 172);
  color: #fff;
}

.item-search__button:hover {
  opacity: 0.8;
}

.item-search__button:active {
  background: rgb(129, 54, 129);
}

@media screen and (max-width: 1024px) {
  .item-search__input {
    width: 300px;
  }

  .item-search__button {
    width: 50px;
  }

  .item-search__search {
    display: none;
  }
}

@media screen and (max-width: 599px) {
  .item-search__input {
    width: 80%;
  }

  .item-search__button {
    width: 20%;
  }
}
</style>