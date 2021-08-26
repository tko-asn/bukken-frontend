<template>
  <div class="container">
    <!-- 投稿フォーム -->
    <form @submit.prevent class="post_form">
      <div class="form_container">
        <!-- 見出し -->
        <div class="head_form">
          <h1>Post Form</h1>
        </div>

        <!-- 入力部分 -->
        <div class="body_form">
          <!-- タイトル -->
          <input
            class="input_title"
            type="text"
            placeholder="タイトル"
            v-model="title"
          />

          <!-- 内容 -->
          <textarea
            name="text"
            class="input_text"
            cols="30"
            rows="8"
            placeholder="内容"
            v-model="text"
          ></textarea>

          <!-- ボタン -->
          <button class="btn_post" @click="createPost" :disabled="isDisabled">
            投稿
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import apiClient from "@/axios";

export default {
  data() {
    return {
      title: "",
      text: "",
      isDisabled: true, // ボタン無効化
    };
  },
  methods: {
    // 投稿を作成
    async createPost() {
      // 投稿データを作成
      const postData = {
        title: this.title,
        text: this.text,
        authorId: this.$store.getters["auth/userId"],
      };

      // 投稿を作成
      await apiClient.post("/posts/post/new", postData);

      // Vuexの自分の投稿を更新
      await this.$store.dispatch('posts/getMyPosts');

      // ホームページへ
      this.$router.push("/");
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
/* formの位置を中央にする */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* 投稿フォーム */
.post_form {
  width: 60%;
  padding: 30px 0;
  border: 4px solid rgb(161, 168, 166);
  border-radius: 5px;
  background: #fff;
}

/* フォーム内コンテナ */
.form_container {
  width: 85%;
  margin: 0 auto;
  padding: 0;
}

/* フォームラベル */
.head_form > h1 {
  margin: 0;
  text-align: center;
  color: rgb(97, 99, 98);
}

/* 入力部分 */
.body_form {
  display: flex;
  flex-direction: column;
}

[class*="input"] {
  margin-top: 20px;
  border: 3px solid rgb(192, 192, 192);
  border-radius: 4px;
}

/* タイトル入力欄 */
.input_title {
  height: 40px;
  font-size: 1.3em;
  padding: 5px 10px;
}

/* 内容入力欄 */
.input_text {
  padding: 10px;
  font-size: 1.4em;
}

/* ボタン */
.btn_post {
  width: 40%;
  height: 50px;
  margin: 40px auto 0;
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
</style>