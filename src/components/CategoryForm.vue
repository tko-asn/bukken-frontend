<template>
  <div class="item-category">
    <!-- 第一カテゴリー -->
    <select
      name="first_category"
      class="item-category__select"
      v-model="selectedFirstCategory"
    >
      <option class="item-category__option" value="">カテゴリを選択</option>
      <option
        class="item-category__option"
        :value="key"
        v-for="(value, key) in firstCategories"
        :key="key"
      >
        {{ value }}
      </option>
    </select>

    <span class="item-category__span" v-show="selectedFirstCategory">></span>

    <!-- 第二カテゴリー -->
    <select
      name="second_category"
      class="item-category__select"
      v-for="(value, key) in secondCategories"
      :key="key"
      v-show="selectedFirstCategory === key"
      v-model="selectedSecondCategory"
    >
      <option class="item-category__option" value="">さらに絞り込む</option>
      <option
        class="item-category__option"
        :value="category"
        v-for="category in value"
        :key="category"
      >
        {{ category }}
      </option>
    </select>

    <button
      class="item-category__btn"
      v-show="selectedFirstCategory"
      @click="addCategory"
      :disabled="fullCategories"
    >
      追加
    </button>
  </div>
</template>

<script>
export default {
  props: {
    selectedCategories: Array, // 選択済みのカテゴリー
  },
  data() {
    return {
      // 選択中のカテゴリー
      selectedFirstCategory: "",
      selectedSecondCategory: "",
      // 第一カテゴリー
      firstCategories: {
        environment: "周辺環境",
        facility: "設備",
        location: "立地",
        traffic: "交通",
      },
      // 第二カテゴリー
      secondCategories: {
        environment: ["自然", "騒音", "治安", "施設", "近隣住民"],
        facility: ["内装・間取り", "外観・雰囲気", "セキュリティ", "防音性"],
        location: ["駅", "商業施設", "空港", "観光地", "宅配・配達"],
        traffic: ["バス", "電車", "タクシー"],
      },
      fullCategories: false,
    };
  },
  methods: {
    // カテゴリーをリストに追加
    addCategory() {
      const firstCategory = this.firstCategories[this.selectedFirstCategory];
      const id = firstCategory + this.selectedSecondCategory; // Tagコンポーネントのv-forのkeyとして利用

      const newCategory = {
        id,
        firstCategory,
        secondCategory: this.selectedSecondCategory,
      };

      // 同じカテゴリなら終了
      if (!this.selectedCategories.some((el) => el.id === newCategory.id)) {
        // カテゴリーを追加
        this.$emit("add", newCategory);
        // 選択中のカテゴリーの初期化
        this.selectedFirstCategory = "";
        this.selectedSecondCategory = "";
      }
    },
  },
  watch: {
    // 選択できるカテゴリーは3個まで
    selectedCategories(val) {
      if (val.length === 3) {
        this.fullCategories = true;
      } else {
        this.fullCategories = false;
      }
    },
    // 第一カテゴリー選択時に選択中の第二カテゴリーを初期化
    selectedFirstCategory() {
      this.selectedSecondCategory = "";
    },
  },
};
</script>

<style scoped>
.item-category {
  display: flex;
  align-items: center;
}

.item-category__select {
  height: 30px;
  border: 2px solid rgb(143, 142, 142);
}

.item-category__span {
  margin: 0 20px;
}

.item-category__btn {
  width: 70px;
  height: 30px;
  margin-left: 40px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgb(114, 113, 113);
  background: rgb(219, 16, 16);
  color: white;
}

.item-category__btn:active {
  position: relative;
  box-shadow: none;
  top: 2px;
}

.item-category__btn:disabled {
  opacity: 0.4;
}

@media screen and (max-width: 599px) {
  .item-category {
    flex-direction: column;
  }

  .item-category__span {
    display: none;
  }

  .item-category__select {
    width: 100%;
    border: 1px solid gray;
    margin-bottom: 10px;
  }

  .item-category__btn {
    margin-left: 0;
  }
}
</style>