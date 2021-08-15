<template>
  <div class="area_edit_profile">
    <!-- プロフィール編集フォーム -->
    <form @submit.prevent class="edit_form">
      <div class="container">
        <!-- フォームの見出し -->
        <div class="head_edit_form">
          <p class="ttl">Edit Profile</p>
        </div>

        <!-- 入力欄 -->
        <div class="body_edit_form">
          <div class="icon">
            <img :src="iconSrc" v-show="iconSrc" alt="アイコン">
          </div>
          <input class="icon_form" type="file" @change="changeFile" />
          <input class="input_username" type="text" placeholder="ユーザー名" v-model="newData.username" />
          <textarea
            class="input_self_introduction"
            cols="20"
            rows="10"
            placeholder="自己紹介文"
            v-model="newData.self_introduction"
          ></textarea>
          <button class="btn_edit_profile" @click="editProfile">保存</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Compressor from "compressorjs";

export default {
  data() {
    return {
      // プレビュー用の画像URL
      iconSrc: '',
      // 送信するデータ
      newData: {
        iconFile: null,
        username: '',
        self_introduction: '', // DBのカラム名に合わせる
      },
    }
  },
  computed: {
    ...mapGetters('auth', ['userId', 'username', 'selfIntroduction', 'iconURL'])
  },
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
          _this.getFileSrc(result).then(src => {
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
          params.append(key, value);
        });
      }

      // APIを実行
      this.$store.dispatch('auth/editProfile', params).then(() => {
        // マイページへ
        this.$router.replace({ name: 'userView', params: { id: this.userId } });
      })
    },
    // 画像のURLを取得する
    getFileSrc(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.onerror = err => reject(err);
        fileReader.readAsDataURL(file);
      })
    }
  },
};
</script>

<style scoped>
/* ページ全体 */
.area_edit_profile {
  padding: 100px 0 50px;
}

.edit_form {
  width: 45%;
  margin: 0 auto;
  border-radius: 8px;
  padding: 20px 0;
  box-shadow: 0 5px 5px rgb(173, 171, 171);
  background: #fff;
}

.container {
  width: 90%;
  margin: 0 auto;
}

/* フォームの見出し部分 */
.head_edit_form {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  text-align: center;
}

.ttl {
  width: 100%;
  margin: 0;
  font-size: 1.8em;
  letter-spacing: 2px;
}

.ttl::after {
  content: "";
  display: block;
  width: 100%;
  height: 5px;
  background: rgb(58, 202, 70);
}

/* 入力部分 */
.body_edit_form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon {
  width: 200px;
  height: 200px;
  background: silver;
}

.icon > img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}

.icon_form {
  margin: 10px 0;
}

[class*="input"] {
  width: 88%;
  margin: 10px 0;
  padding-left: 15px;
  font-size: 1.1rem;
}

.input_username {
  height: 40px;
}

.input_self_introduction {
  padding-top: 10px;
}

.btn_edit_profile {
  width: 90%;
  height: 50px;
  margin-top: 10px;
  border: 1px solid #fff;
  border-radius: 5px;
  background: rgb(15, 207, 25);
  color: #fff;
  font-size: 1.2em;
}

.btn_edit_profile:hover {
  background: rgb(30, 250, 41);
  cursor: pointer;
}
</style>