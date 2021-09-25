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

      <!-- 地域 -->
      <section class="section">
        <!-- タイトル -->
        <h3 class="section__title">地域</h3>
        <AddressForm
          class="section__form-address"
          @addressData="getAddressData"
        />
      </section>

      <!-- 絞り込みボタン -->
      <a href="" class="item-filter__btn" @click.prevent="filter"> 絞り込む </a>
    </div>
  </div>
</template>

<script>
import AddressForm from "@/components/AddressForm";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    AddressForm,
  },
  props: {
    myId: String,
  },
  computed: {
    ...mapGetters("posts", ["activeMenu"]),
  },
  data() {
    return {
      // カテゴリー一覧
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
      postalCode: "", // 投稿絞り込みのための郵便番号
      selectedCategories: [], // 選択中のカテゴリーのオブジェクトを要素としてもつ配列
      openFilter: false,
      isDisabled: true,
    };
  },
  methods: {
    ...mapActions("posts", [
      "resetFilterType",
      "registerFilterData",
      "registerFilteredPosts",
    ]),
    // 絞り込みの住所のデータを取得
    getAddressData(addressData) {
      Object.keys(addressData).forEach((key) => {
        if (key === "postalCode") {
          this.postalCode = addressData[key];
        }
      });
    },
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
    async filter() {
      // filterの現在のページ数の初期化のため
      this.resetFilterType();

      const payload = {
        categories: this.selectedCategories,
        postalCode: this.postalCode,
      }
      this.registerFilterData(payload);

      const params = {
        page: 1,
        userId: this.myId,
      }
      await this.registerFilteredPosts(params);
      this.$emit("filtered");
    },
    // フィルターの開閉
    toggleFilter() {
      this.openFilter = !this.openFilter;
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
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
  list-style: none;
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
  box-shadow: inset 2px 2px 2px rgb(218, 216, 216), 
    inset -2px -2px 2px rgb(218, 216, 216);
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

.section__form-address {
  width: 60%;
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
