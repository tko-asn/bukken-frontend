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
        <SmallInput placeholder="ユーザー名" v-model="newData.username" />
        <div class="block-validation" v-show="usernameMessage.length">
          <ValidationMessage :messages="usernameMessage" />
        </div>
        <TextArea
          elementId="textarea-edit-profile"
          class="container-form__input-self-introduction"
          placeholder="自己紹介"
          v-model="newData.self_introduction"
        />
        <SmallButton
          btnValue="保存"
          @click="editProfile"
          :isDisabled="isDisabled"
        />
      </div>
    </form>
  </div>
</template>

<script>
import Compressor from "compressorjs";
import authInfoMixin from "@/mixins/authInfoMixin";
import ValidationMessage from "@/components/ValidationMessage";
import SmallInput from "@/components/SmallInput";
import SmallButton from "@/components/SmallButton";
import TextArea from "@/components/TextArea";

export default {
  components: {
    ValidationMessage,
    SmallInput,
    SmallButton,
    TextArea,
  },
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
      usernameMessage: [], // ユーザー名のバリデーションメッセージ
      isDisabled: false,
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
      this.isDisabled = true;

      this.usernameMessage = [];
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
      this.$store
        .dispatch("auth/editProfile", params)
        .then(() => {
          // マイページへ
          this.$router.replace({
            name: "userView",
            params: { id: this.userId },
          });
        })
        .catch((err) => {
          this.isDisabled = false;
          if (err.response.data.message === "Duplicate") {
            err.response.data.fields.forEach((field) => {
              if (field === "username") {
                this.usernameMessage.push(
                  "このユーザー名は既に使われています。"
                );
              }
            });
          }
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
  padding: 60px 0 20px;
}

.form-edit-profile {
  max-width: 430px;
  width: 40%;
  margin: 0 auto;
  padding: 20px 0;
  border: 2px solid rgb(189, 187, 187);
  border-radius: 10px;
  background: #fff;
  animation: slideUp 0.5s;
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

.item-icon,
.item-icon__img {
  width: 130px;
  height: 130px;
}

.item-icon {
  background: silver;
}

.item-icon__img {
  object-fit: cover;
}

.block-validation {
  width: 100%;
}

.container-form__input-icon {
  margin: 10px 0 5px;
}

.container-form__input-self-introduction {
  border: 1px solid silver;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    transform: translateY(0);
  }
}

@media screen and (max-width: 1024px) {
  .form-edit-profile {
    width: 60%;
  }
}

@media screen and (max-width: 599px) {
  .container {
    padding: 80px 0 0;
  }

  .form-edit-profile {
    width: 95%;
  }
}
</style>