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

    <!-- 住所 -->
    <div class="form-post__item">
      <p class="form-post__item__title">物件住所</p>
      <p class="form-post__item__text">郵便番号を入力してください（半角）</p>
      <div class="form-post__item__item-postal-code">
        <input
          class="form-post__item__item-postal-code__input-a"
          type="text"
          placeholder="xxx"
          @keydown.enter.prevent
          v-model="postalCodeA"
          maxlength="3"
        />
        <span>-</span>
        <input
          class="form-post__item__item-postal-code__input-b"
          type="text"
          placeholder="xxxx"
          @keydown.enter.prevent
          v-model="postalCodeB"
          maxlength="4"
        />
      </div>

      <ValidationMessage
        class="form-post__validation"
        :messages="validations.postalCode"
        v-show="validations.postalCode.length"
      />

      <!-- 郵便番号が入力されたら表示 -->
      <template v-if="prefecture && municipality">
        <input
          class="form-post__item__input-prefecture"
          type="text"
          v-model="prefecture"
          readonly
        />
        <input
          class="form-post__item__input-municipality"
          type="text"
          v-model="municipality"
          readonly
        />
        <input
          class="form-post__item__input-town-name"
          type="text"
          placeholder="町名・番地"
          @keydown.enter.prevent
          v-model="townName"
        />
        <input
          class="form-post__item__input-building-name"
          type="text"
          placeholder="アパート・マンション名"
          @keydown.enter.prevent
          v-model="buildingName"
        />
      </template>
    </div>

    <!-- カテゴリー -->
    <div class="form-post__item">
      <p class="form-post__item__title">カテゴリ</p>
      <p class="form-post__item__text">※3つまで選択可</p>
      <CategoryForm
        :selectedCategories="selectedCategories"
        @add="selectedCategories.push($event)"
      />

      <!-- 選択済みカテゴリー -->
      <Tag :tags="selectedCategories" @delete="removeCategory" />
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
const YubinBango = require("yubinbango-core2");

export default {
  components: {
    ValidationMessage,
    Tag,
    CategoryForm,
  },
  data() {
    return {
      // 投稿内容
      title: "",
      property: "",
      text: "",
      postalCode: "",
      prefecture: "",
      municipality: "",
      townName: "",
      buildingName: "",
      // 郵便番号の部品
      postalCodeA: "",
      postalCodeB: "",
      isDisabled: true, // ボタン無効化
      // 選択したカテゴリーのリスト
      selectedCategories: [],
      // バリデーションメッセージ
      validations: {
        property: [], // 物件名
        postalCode: [], // 郵便番号
      },
    };
  },
  methods: {
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

      // 郵便番号
      if (!this.postalCode) {
        this.validations.postalCode.push("物件の住所を入力してください"); // 必須入力
      } else if (this.postalCode.match(/[^0-9]/g)) {
        // 半角数字のみ
        this.validations.postalCode.push("半角数字で入力してください");
      } else if (
        // 文字数チェック
        this.postalCodeA.length !== 3 ||
        this.postalCodeB.length !== 4
      ) {
        this.validations.postalCode.push("郵便番号を正しく入力してください");
      } else if (!this.prefecture || !this.municipality) {
        // 郵便番号チェック
        this.validations.postalCode.push("正しい郵便番号を入力してください");
      }
    },
    // 投稿を作成
    async createPost() {
      // バリデーション実行
      this.validate();

      // バリデーションメッセージの有無を確認
      Object.keys(this.validations).forEach((key) => {
        if (this.validations[key].length) {
          throw new Error("Invalid"); // 処理を中断
        }
      });

      // 住所の情報
      const addressData = {
        postalCode: this.postalCode,
        prefecture: this.prefecture,
        municipality: this.municipality,
        townName: this.townName,
        buildingName: this.buildingName,
      };

      // 住所とカテゴリーのIDを取得
      const [addressRes, categoryRes] = await Promise.all([
        apiClient.post(
          // 住所のIDを取得
          "/addresses/find/or/create/",
          addressData
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

      // Vuexの自分の投稿を更新
      await this.$store.dispatch("posts/getMyPosts");

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
    postalCodeA(val) {
      this.postalCode = val + this.postalCodeB; // 郵便番号を結合
    },
    postalCodeB(val) {
      this.postalCode = this.postalCodeA + val; // 郵便番号を結合
    },
    // 郵便番号
    postalCode(val) {
      const _this = this;
      // 半角数字以外の文字はNG
      if (val && !val.match(/[^0-9]/g)) {
        new YubinBango.Core(val, (addr) => {
          _this.prefecture = addr.region; // 都道府県
          _this.municipality = addr.locality + addr.street; // 市区町村
        });

        // 適切でない値が入力されたら値を初期化
      } else {
        _this.prefecture = "";
        _this.municipality = "";
      }
    },
  },
};
</script>

<style scoped>
/* 投稿フォーム */
.form-post {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 20px 40px;
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

/* 住所 */
.form-post__item {
  display: flex;
  flex-direction: column;
  margin: 30px 0 0;
}

.form-post__item__title {
  margin: 0;
  font-size: 1.3em;
  letter-spacing: 2px;
}

[class*="form-post__item__input"] {
  width: 70%;
}

.form-post__item__item-postal-code__input-a {
  margin: 0;
  width: 40px;
}

.form-post__item__item-postal-code__input-b {
  margin: 0;
  width: 60px;
}

.form-post__item > input:read-only {
  background: rgb(216, 214, 214);
}

.form-post__item__item-postal-code > span {
  padding: 0 10px;
}

.form-post__item__text {
  margin: 10px 1px 5px;
  font-size: 0.8em;
  color: rgb(78, 77, 77);
}

/* ボタン */
.form-post__btn {
  width: 40%;
  height: 50px;
  margin: 10px auto;
  border-color: white;
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

/* バリデーションメッセージ */
.form-post__validation {
  margin: 0;
}
</style>