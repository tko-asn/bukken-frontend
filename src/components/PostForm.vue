<template>
  <!-- 投稿フォーム -->
  <form @submit.prevent class="form-post">
    <!-- 見出し -->
    <h1 class="form-post__title">質問投稿</h1>

    <!-- タイトル -->
    <input
      class="form-post__input-title"
      type="text"
      placeholder="タイトル"
      @keydown.enter.prevent
      v-model="title"
    />

    <!-- 物件名 -->
    <input
      class="form-post__input-property"
      type="text"
      placeholder="物件名"
      @keydown.enter.prevent
      v-model="property"
    />

    <ValidationMessage
      class="form-post__validation"
      :messages="validations.property"
      v-show="validations.property.length"
    />

    <!-- 内容 -->
    <textarea
      name="text"
      class="form-post__input-text"
      cols="30"
      rows="8"
      placeholder="質問内容"
      v-model="text"
    ></textarea>

    <!-- 所在地のフォーム -->
    <div class="item-form">
      <p class="item-form__title">物件の所在地</p>
      <p class="item-form__text">郵便番号を入力してください（半角）</p>
      <AddressForm
        :optionInput="true"
        :validations="addressMessages"
        @addressData="getAddressData"
      />
    </div>

    <!-- カテゴリー -->
    <div class="item-form">
      <p class="item-form__title">カテゴリー</p>
      <p class="item-form__text">※3つまで選択可</p>
      <CategoryForm
        :selectedCategories="selectedCategories"
        @add="selectedCategories.push($event)"
      />

      <!-- 選択済みカテゴリー -->
      <Tag :tags="selectedCategories" :deleteTag="removeCategory" />
    </div>

    <!-- ボタン -->
    <button class="form-post__btn" @click="createPost" :disabled="isDisabled">
      投稿
    </button>
  </form>
</template>

<script>
import apiClient from "@/axios";
import ValidationMessage from "@/components/ValidationMessage";
import CategoryForm from "@/components/CategoryForm";
import Tag from "@/components/Tag";
import AddressForm from "@/components/AddressForm";
import addressValidationMixin from "@/mixins/addressValidationMixin";

export default {
  components: {
    ValidationMessage,
    Tag,
    CategoryForm,
    AddressForm,
  },
  data() {
    return {
      // 投稿内容
      title: "",
      property: "",
      text: "",
      // 所在地
      addressData: {
        postalCodeA: "",
        postalCodeB: "",
        postalCode: "", // 郵便番号
        prefecture: "",
        municipality: "",
        townName: "",
        buildingName: "",
      },
      isDisabled: true, // ボタン無効化
      // 選択したカテゴリーのリスト
      selectedCategories: [],
      // バリデーションメッセージ
      validations: {
        property: [], // 物件名
      },
    };
  },
  mixins: [addressValidationMixin],
  methods: {
    // 子コンポーネントから所在地のデータを取得
    getAddressData(addressObj) {
      Object.keys(addressObj).forEach((key) => {
        this.addressData[key] = addressObj[key];
      });
    },
    // バリデーション
    validate() {
      // メッセージの初期化
      Object.keys(this.validations).forEach((key) => {
        this.validations[key] = [];
      });

      // 物件名
      if (!this.property) {
        // 必須入力
        this.validations.property.push("物件名を入力してください");
      }
    },
    // 投稿を作成
    async createPost() {
      this.isDisabled = true;
      // バリデーション実行
      await this.addressValidation(this.addressData).catch((err) => {
        this.isDisabled = false;
        throw new Error(err);
      });
      this.validate();

      // バリデーションメッセージの有無を確認
      Object.keys(this.validations).forEach((key) => {
        if (this.validations[key].length) {
          this.isDisabled = false;
          throw new Error("Invalid"); // 処理を中断
        }
      });

      // 住所とカテゴリーのIDを取得
      const [addressRes, categoryRes] = await Promise.all([
        apiClient.post(
          // 住所のIDを取得
          "/addresses/find/or/create/",
          this.addressData
        ),
        apiClient.post(
          // カテゴリーのIDのリストを取得
          "/categories/find/or/create/",
          this.selectedCategories
        ),
      ]);

      // 投稿データを作成
      const postData = {
        title: this.title,
        property: this.property,
        text: this.text,
        authorId: this.$store.getters["auth/userId"],
        addressId: addressRes.data.addressId, // 取得した住所のID
      };

      // 投稿を作成
      const postRes = await apiClient.post("/posts/post/new", postData);

      // 投稿モデルとカテゴリーモデルの中間テーブルのデータ作成
      await Promise.all(
        categoryRes.data.map(
          async (categoryId) =>
            await apiClient.post("/posts/set/category", {
              postId: postRes.data.id,
              categoryId: categoryId,
            })
        )
      );

      // ホームページへ
      this.$router.replace("/");
    },
    // 選択中のカテゴリを削除
    removeCategory(tagId) {
      this.selectedCategories = this.selectedCategories.filter(
        (el) => el.id !== tagId
      );
    },
  },
  watch: {
    // タイトルを入力するとボタンを有効化
    title(val) {
      this.isDisabled = val.length ? false : true;
    },
  },
};
</script>

<style scoped>
/* 投稿フォーム */
.form-post {
  display: flex;
  flex-direction: column;
  width: 60%;
  margin: 0 auto;
  padding: 20px 40px;
  animation: slideUp 0.5s;
}

/* フォームラベル */
.form-post__title {
  margin: 0;
  color: rgb(58, 65, 61);
}

/* 入力部分 */
[class*="input"] {
  height: 30px;
  margin-top: 20px;
  padding: 5px 10px;
  border: 2px solid rgb(143, 142, 142);
  border-radius: 4px;
  font-size: 1.1em;
}

/* 内容入力欄 */
.form-post__input-text {
  height: 300px;
  padding: 10px;
  font-size: 1.4em;
}

.item-form {
  display: flex;
  flex-direction: column;
}

.item-form__title {
  margin: 30px 0 0;
  font-size: 1.3em;
  letter-spacing: 2px;
}

.item-form__text {
  margin: 10px 1px 5px;
  font-size: 0.8em;
  color: rgb(78, 77, 77);
}

/* ボタン */
.form-post__btn {
  width: 40%;
  height: 50px;
  margin: 10px auto;
  border: none;
  border-radius: 3px;
  background: rgb(126, 79, 170);
  color: #fff;
  font-size: 1.2em;
}

.form-post__btn:hover {
  background: rgb(173, 110, 231);
  cursor: pointer;
}

.form-post__btn:disabled {
  background: rgba(151, 100, 199, 0.877);
  color: rgb(194, 188, 188);
  cursor: default;
}

/* アニメーション */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    transform: translateY(0);
  }
}

@media screen and (max-width: 1024px) {
  .form-post {
    width: 80%;
  }
}

@media screen and (max-width: 599px) {
  .form-post {
    width: 90%;
    padding: 20px 5px;
  }
}
</style>