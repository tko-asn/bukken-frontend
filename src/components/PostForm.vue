<template>
  <!-- 投稿フォーム -->
  <form @submit.prevent class="form-post">
    <!-- 見出し -->
    <h1 class="form-post__title">質問投稿</h1>

    <!-- タイトル -->
    <LargeInput placeholder="タイトル" v-model="title" />

    <!-- 物件名 -->
    <LargeInput placeholder="物件名" v-model="property" />

    <ValidationMessage
      class="form-post__validation"
      :messages="validations.property"
      v-show="validations.property.length"
    />

    <!-- 内容 -->
    <TextArea
      elementId="textarea-post-form"
      placeholder="質問内容"
      height="200px"
      v-model="text"
    />

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
    <div class="form-post__btn">
      <LargeButton
        btnValue="投稿"
        :isDisabled="isDisabled"
        @click="createPost"
      />
    </div>
  </form>
</template>

<script>
import apiClient from "@/axios";
import ValidationMessage from "@/components/ValidationMessage";
import CategoryForm from "@/components/CategoryForm";
import Tag from "@/components/Tag";
import AddressForm from "@/components/AddressForm";
import LargeInput from "@/components/LargeInput";
import LargeButton from "@/components/LargeButton";
import TextArea from "@/components/TextArea";
import addressValidationMixin from "@/mixins/addressValidationMixin";

export default {
  components: {
    ValidationMessage,
    Tag,
    CategoryForm,
    AddressForm,
    LargeInput,
    LargeButton,
    TextArea,
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

.item-form {
  display: flex;
  flex-direction: column;
}

.item-form__title {
  margin: 10px 0 0;
  font-size: 1.3em;
  letter-spacing: 2px;
}

.item-form__text {
  margin: 10px 1px 5px;
  font-size: 0.8em;
  color: rgb(78, 77, 77);
}

.form-post__btn {
  margin: 0 auto;
  width: 200px;
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