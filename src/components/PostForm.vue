<template>
  <!-- 投稿フォーム -->
  <form @submit.prevent class="post_form">
    <!-- 見出し -->
    <h1 class="head_form">質問投稿</h1>

    <!-- タイトル -->
    <input
      class="input_title"
      type="text"
      placeholder="タイトル"
      @keydown.enter.prevent
      v-model="title"
    />

    <!-- 物件名 -->
    <input
      class="input_property"
      type="text"
      placeholder="物件名"
      @keydown.enter.prevent
      v-model="property"
    />

    <ValidationMessage
      class="validation"
      :messages="validations.property"
      v-show="validations.property.length"
    />

    <!-- 内容 -->
    <textarea
      name="text"
      class="input_text"
      cols="30"
      rows="8"
      placeholder="質問内容"
      v-model="text"
    ></textarea>

    <!-- 住所 -->
    <div class="address_form">
      <h6>物件住所</h6>
      <div class="postal_code_form">
        <p>郵便番号を入力してください（半角）</p>
        <input
          class="input_postal_code_A"
          type="text"
          placeholder="xxx"
          @keydown.enter.prevent
          v-model="postalCodeA"
          maxlength="3"
        />
        <span>-</span>
        <input
          class="input_postal_code_B"
          type="text"
          placeholder="xxxx"
          @keydown.enter.prevent
          v-model="postalCodeB"
          maxlength="4"
        />
      </div>

      <ValidationMessage
        class="validation"
        :messages="validations.postalCode"
        v-show="validations.postalCode.length"
      />

      <!-- 郵便番号が入力されたら表示 -->
      <template v-if="prefecture && municipality">
        <input
          class="input_prefecture"
          type="text"
          v-model="prefecture"
          readonly
        />
        <input
          class="input_municipality"
          type="text"
          v-model="municipality"
          readonly
        />
        <input
          class="input_town_name"
          type="text"
          placeholder="町名・番地"
          @keydown.enter.prevent
          v-model="townName"
        />
        <input
          class="input_building_name"
          type="text"
          placeholder="アパート・マンション名"
          @keydown.enter.prevent
          v-model="buildingName"
        />
      </template>
    </div>

    <!-- ボタン -->
    <button class="btn_post" @click="createPost" :disabled="isDisabled">
      投稿
    </button>
  </form>
</template>

<script>
import apiClient from "@/axios";
import ValidationMessage from "@/components/ValidationMessage";
const YubinBango = require("yubinbango-core2");

export default {
  components: {
    ValidationMessage,
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

      // 住所のIDを取得
      const res = await apiClient.post(
        "/addresses/find/or/create/",
        addressData
      );

      // 投稿データを作成
      const postData = {
        title: this.title,
        property: this.property,
        text: this.text,
        authorId: this.$store.getters["auth/userId"],
        addressId: res.data.addressId, // 取得した住所のID
      };

      // 投稿を作成
      await apiClient.post("/posts/post/new", postData);

      // Vuexの自分の投稿を更新
      await this.$store.dispatch("posts/getMyPosts");

      // ホームページへ
      this.$router.push("/");
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
.post_form {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 20px 40px;
}

/* フォームラベル */
.head_form {
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
.input_text {
  height: 300px;
  padding: 10px;
  font-size: 1.4em;
}

/* 住所 */
.address_form {
  display: flex;
  flex-direction: column;
  margin: 30px 0;
}

.address_form > h6 {
  margin: 0;
  font-size: 1.3em;
  letter-spacing: 2px;
}

.address_form > [class*="input"] {
  width: 70%;
}

.input_postal_code_A {
  margin: 0;
  width: 40px;
}

.input_postal_code_B {
  margin: 0;
  width: 60px;
}

.address_form > input:read-only {
  background: rgb(216, 214, 214);
}

.postal_code_form > span {
  padding: 0 10px;
}

.postal_code_form > p {
  margin: 10px 1px 5px;
  font-size: 0.8em;
  color: rgb(78, 77, 77);
}

/* ボタン */
.btn_post {
  width: 40%;
  height: 50px;
  margin: 10px auto;
  border-color: white;
  border-radius: 3px;
  background: rgb(126, 79, 170);
  color: #fff;
  font-size: 1.2em;
}

.btn_post:hover {
  background: rgb(173, 110, 231);
  cursor: pointer;
}

.btn_post[disabled] {
  background: rgba(151, 100, 199, 0.877);
  color: rgb(194, 188, 188);
  cursor: default;
}

/* バリデーションメッセージ */
.validation {
  margin: 0;
}
</style>