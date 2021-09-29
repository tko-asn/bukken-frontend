<template>
  <div class="container">
    <!-- プロフィール編集フォーム -->
    <form @submit.prevent class="form-edit-profile">
      <div class="container-form">
        <!-- フォームの見出し -->
        <p class="container-form__title">Edit Profile</p>
        <!-- 入力欄 -->
        <div class="item-icon">
          <img
            class="item-icon__img"
            :src="iconSrc"
            v-show="iconSrc"
            alt="アイコン"
          />
        </div>
        <input
          class="container-form__input-icon"
          type="file"
          @change="changeFile"
        />
        <input
          class="container-form__input-username"
          type="text"
          placeholder="ユーザー名"
          v-model="newData.username"
        />
        <textarea
          class="container-form__input-self-introduction"
          cols="20"
          rows="10"
          placeholder="自己紹介文"
          v-model="newData.self_introduction"
        ></textarea>
        <button class="container-form__btn-input" @click="editProfile">
          保存
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Compressor from "compressorjs";
import authInfoMixin from "@/mixins/authInfoMixin";

export default {
  data() {
    return {
      // プレビュー用の画像URL
      iconSrc: "",
      // 送信するデータ
      newData: {
        iconFile: null,
        username: "",
        self_introduction: "", // DBのカラム名に合わせる
      },
    };
  },
  mixins: [authInfoMixin],
  created() {
    // vuexのデータをdataに保存
    this.iconSrc = this.iconURL;
    this.newData.username = this.username;
    this.newData.self_introduction = this.selfIntroduction;
  },
  methods: {
    changeFile(event) {
      const files = event.target.files || event.dataTransfer.files;

      const _this = this;

      // 画像圧縮
      new Compressor(files[0], {
        quality: 0.7,
        success(result) {
          // 圧縮されたファイルを保存
          _this.newData.iconFile = result;

          // プレビューURLを取得し保存
          _this.getFileSrc(result).then((src) => {
            _this.iconSrc = src;
          });
        },
        maxWidth: 200,
        maxHeight: 200,
        mimeType: "image/jpeg",
      });
    },
    editProfile() {
      let params;
      // アイコン画像に変更がない場合
      if (!this.newData.iconFile) {
        params = this.newData;

        // 新しいアイコン画像がある場合
      } else {
        params = new FormData();
        // 送信データを作成
        Object.entries(this.newData).forEach(([key, value]) => {
          // 自己紹介の値がnullの場合は空文字列をセット
          if (key === "self_introduction" && !value) {
            value = "";
          }
          params.append(key, value);
        });
      }

      // APIを実行
      this.$store.dispatch("auth/editProfile", params).then(() => {
        // マイページへ
        this.$router.replace({ name: "userView", params: { id: this.userId } });
      });
    },
    // 画像のURLを取得する
    getFileSrc(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = (err) => reject(err);
        fileReader.readAsDataURL(file);
      });
    },
  },
};
</script>

<style scoped>
/* ページ全体 */
.container {
  padding: 100px 0 50px;
}

.form-edit-profile {
  width: 45%;
  margin: 0 auto;
  border-radius: 8px;
  padding: 20px 0;
  box-shadow: 0 5px 5px rgb(173, 171, 171);
  background: #fff;
}

.container-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

/* フォームの見出し部分 */
.container-form__title {
  width: 100%;
  margin: 0 0 20px;
  font-size: 1.8em;
  letter-spacing: 2px;
  text-align: center;
}

.container-form__title::after {
  content: "";
  display: block;
  height: 5px;
  background: rgb(58, 202, 70);
}

/* 入力部分 */
.item-icon {
  width: 200px;
  height: 200px;
  background: silver;
}

.item-icon__img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

[class*="input"] {
  width: 100%;
  margin: 10px 0;
  font-size: 1.1rem;
}

.container-form__input-username {
  height: 40px;
  padding: 0 10px;
}

.container-form__input-self-introduction {
  padding: 10px 10px;
}

.container-form__btn-input {
  height: 50px;
  margin-top: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  background: rgb(15, 207, 25);
  color: #fff;
  font-size: 1.2em;
}

.container-form__btn-input:hover {
  background: rgb(30, 250, 41);
  cursor: pointer;
}
</style>