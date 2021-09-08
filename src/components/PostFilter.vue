<template>
  <div class="block-filter">
    <!-- タイトル -->
    <div class="item-title">
      <span class="item-title__title" @click.prevent="toggleFilter">
        <fa-icon icon="filter" class="item-title__icon" />
        フィルター
      </span>
    </div>
    <!-- フィルター部分 -->
    <div class="item-filter" v-show="openFilter">
      <!-- カテゴリー -->
      <section class="section">
        <h3 class="section__title">カテゴリー</h3>
        <ul class="section__list">
          <li
            class="list"
            v-for="firstCategory in categories"
            :key="firstCategory.name"
          >
            <a
              href=""
              class="list__item"
              @click.prevent="switchCategory($event, firstCategory.name)"
              >{{ firstCategory.name }}</a
            >
          </li>
        </ul>
        <ul
          class="section__list"
          v-show="currentCategory === firstCategory.name"
          v-for="firstCategory in categories"
          :key="firstCategory.name"
        >
          <li
            class="list-checkbox"
            v-for="secondCategory in firstCategory.children"
            :key="secondCategory"
          >
            <input
              type="checkbox"
              :value="secondCategory"
              :id="secondCategory"
              class="list-checkbox__input"
              v-model="selectedCategories"
            />
            <label :for="secondCategory" class="list-checkbox__label">{{
              secondCategory
            }}</label>
          </li>
        </ul>
      </section>
      <!-- 絞り込みボタン -->
      <a href="" class="item-filter__btn" @click.prevent="filter"> 絞り込む </a>
    </div>
  </div>
</template>

<script>
import apiClient from "@/axios";
import qs from "qs";

export default {
  props: {
    currentMenu: String,
    myId: String,
  },
  data() {
    return {
      categories: {
        environment: {
          name: "周辺環境",
          children: ["自然", "騒音", "治安", "施設", "近隣住民"],
        },
        facility: {
          name: "設備",
          children: ["内装・間取り", "外観・雰囲気", "セキュリティ", "防音性"],
        },
        location: {
          name: "立地",
          children: ["駅", "商業施設", "空港", "観光地", "宅配・配達"],
        },
        traffic: {
          name: "交通",
          children: ["バス", "電車", "タクシー"],
        },
      },
      currentCategory: "",
      selectedCategories: [], // 選択中のカテゴリーのオブジェクトを要素としてもつ配列
      openFilter: false,
      isDisabled: true,
    };
  },
  methods: {
    // 第二カテゴリーの表示を切り替える
    switchCategory(e, name) {
      // 現在アクティブの第一カテゴリーをクリックしたとき
      if (e.target.closest(".list--active")) {
        e.target.classList.remove("list--active");
        this.currentCategory = "";
        return;
      }

      // 現在他の第一カテゴリーを選択中の場合
      if (this.currentCategory) {
        document
          .getElementsByClassName("list--active")[0]
          .classList.remove("list--active");
      }
      e.target.classList.add("list--active");
      this.currentCategory = name;
    },
    // 絞り込み
    filter() {
      const params = {
        categories: this.selectedCategories,
      };

      // 自分の投稿表示中の絞り込み
      if (this.currentMenu === "myPosts") {
        params.authorId = this.myId;

        // フォローしているユーザーの投稿表示中の絞り込み
      } else if (this.currentMenu === "followee") {
        const followsId = []; // フォローしているユーザーのIDの配列
        for (const obj of this.$store.getters["follows/follow"]) {
          followsId.push(obj.follow.id);
        }
        params.authorId = followsId;

        // お気に入りの投稿表示中の絞り込み
      } else if (this.currentMenu === "favorites") {
        params.userId = this.myId;
      }

      apiClient
        .get("/posts/filter/page/1", {
          params, // クエリパラメータ
          paramsSerializer: (params) => qs.stringify(params),
        })
        .then((response) => {
          this.$emit("filter", response.data);
        })
        .catch((err) => console.log(err));
    },
    // フィルターの開閉
    toggleFilter() {
      this.openFilter = !this.openFilter;
    },
  },
  watch: {
    currentMenu() {
      // メニューを切り替えるたびにフィルターを初期化
      this.openFilter = false;
      this.selectedCategories = [];
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}

ul {
  list-style: none;
}

.item-title {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 3px solid rgb(184, 182, 182);
}

.item-title__title {
  margin: 20px 0 10px;
  color: gray;
  cursor: pointer;
}

.item-title__icon {
  margin-right: 10px;
}

.section__list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 10px;
  padding: 0;
}

.list {
  flex: 1;
  border: 1px solid rgb(189, 189, 189);
  background: #fff;
}

.list--active {
  box-shadow: inset 2px 2px 2px rgb(129, 129, 129);
  background: rgb(205, 206, 206);
  color: rgb(99, 99, 99);
}

.list__item {
  display: flex;
  padding: 10px 20px;
}

.list-checkbox {
  display: flex;
  align-items: center;
  width: 50%;
  height: 50px;
  font-size: 1.1em;
}

.list-checkbox__label {
  display: flex;
  align-items: center;
}

.list-checkbox__label:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0 10px;
  box-shadow: inset 1px 1px 3px rgb(139, 137, 137);
  border-radius: 3px;
  background: #fff;
}

.list-checkbox__input:checked + .list-checkbox__label:before {
  content: "\2713";
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: rgb(42, 213, 243);
  font-size: 1.1em;
}

.list-checkbox__input {
  display: none;
}

.item-filter__btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 50px;
  margin: 30px auto;
  border-radius: 5px;
  background: rgb(68, 111, 252);
  color: white;
  font-size: 1.1em;
}

.item-filter__btn:hover {
  opacity: 0.9;
}

.item-filter__btn:active {
  opacity: 0.4;
}
</style>
