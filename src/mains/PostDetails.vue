<template>
  <div class="container">
    <div class="post_details">
      <article class="content">
        <!-- タイトル -->
        <h6 class="ttl">{{ post.title }}</h6>
        <!-- 物件情報 -->
        <div class="property">
          <h4>対象物件</h4>
          <!-- 物件名 -->
          <p>{{ post.property }}</p>
          <!-- 物件住所 -->
          <p>
            {{ addressData("prefecture") }}{{ addressData("municipality") }}
            {{ addressData("townName") }}{{ addressData("buildingName") }}
          </p>
        </div>
        <p class="updated_at">{{ post.updatedAt }}</p>
        <!-- 内容 -->
        <p class="text">{{ post.text }}</p>
        <div class="bottom">
          <!-- お気に入りボタン -->
          <a
            class="btn_content"
            href=""
            @click.prevent="createFavoritePost"
            v-show="!isYourFavoritePost"
            >お気に入りに追加</a
          >
          <a
            class="btn_content"
            href=""
            @click.prevent="deleteFavoritePost"
            v-show="isYourFavoritePost"
            >お気に入り解除</a
          >
          <!-- 投稿者 -->
          <div class="author" @click="moveToUserPage">
            <!-- アイコン -->
            <div class="icon">
              <img :src="post.user.icon_url" v-if="post.user.icon_url" />
            </div>
            <!-- ユーザー名 -->
            <p class="username">{{ post.user.username }}</p>
          </div>
        </div>

        <!-- 回答フォーム -->
        <div class="answer_form">
          <!-- ログイン済み -->
          <template v-if="isLoggedIn">
            <textarea
              cols="30"
              rows="10"
              placeholder="回答を投稿する"
              v-model="newAnswer"
            ></textarea>
            <ValidationMessage
              class="validation"
              :messages="answerValidations"
              v-show="answerValidations.length"
            />
            <button class="btn_answer" @click="postAnswer">回答</button>
          </template>

          <!-- 未ログイン -->
          <template v-else>
            <p>回答するにはログインする必要があります</p>
            <button class="btn_answer" @click="postAnswer">
              今すぐログイン
            </button>
          </template>
        </div>
      </article>

      <!-- 回答 -->
      <div class="content">
        <p class="ttl_answer">{{ post.answers.length }}件の回答</p>
        <section
          class="answer_section"
          v-for="answer in post.answers"
          :key="answer.id"
        >
          <p class="text">{{ answer.content }}</p>
          <div class="bottom">
            <a
              class="btn_content"
              href=""
              v-show="!answer.likedBy.find((el) => el.id === userId)"
              @click.prevent="like(answer.id)"
              >いいね</a
            >
            <a
              class="btn_content"
              href=""
              v-show="answer.likedBy.find((el) => el.id === userId)"
              @click.prevent="dislike(answer.id)"
              >いいね解除</a
            >
            <div class="author">
              <div class="icon">
                <img :src="answer.user.icon_url" />
              </div>
              <p class="username">{{ answer.user.username }}</p>
            </div>
          </div>
          <p class="answered_at">{{ answer.updatedAt }}</p>
        </section>
        <p class="text_no_answer" v-if="!post.answers.length">
          まだ回答がありません
        </p>
      </div>
    </div>

    <!-- サイドメニュー -->
    <SidePostList />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import apiClient from "@/axios";
import ValidationMessage from "@/components/ValidationMessage";
import SidePostList from "@/components/SidePostList";

export default {
  props: {
    postId: String,
  },
  components: {
    ValidationMessage,
    SidePostList,
  },
  data() {
    return {
      post: {
        // 表示する投稿
        id: "",
        title: "",
        text: "",
        updatedAt: "",
        user: {
          id: "",
          icon_url: "",
          username: "",
        },
        answers: [
          // 投稿についた回答
          {
            id: "",
            content: "",
            user: {
              id: "",
              username: "",
              icon_url: "",
            },
            updatedAt: "",
            likedBy: [], // 回答にいいねしたユーザーのIDのリスト
          },
        ],
      },
      newAnswer: "", // 新しい回答文
      answerValidations: [], // 回答のバリデーションメッセージ
    };
  },
  created() {
    apiClient.get("/posts/post/" + this.postId + "/").then((response) => {
      this.post = response.data; // 対象の投稿データをセット
    });
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "userId"]),
    ...mapGetters("posts", ["myFavoritePosts"]),
    isYourFavoritePost() {
      // ユーザーのお気に入りの投稿かどうか
      if (this.myFavoritePosts.find((el) => el.id === this.postId)) {
        return true;
      }
      return false;
    },
    // 住所のデータ
    addressData() {
      return (key) => this.post.address?.[key];
    },
  },
  methods: {
    // お気に入りの投稿を追加
    createFavoritePost() {
      // ログインしていない場合はログインページへ
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }
      this.$store.dispatch("posts/addFavoritePost", {
        userId: this.userId,
        postId: this.postId,
      });
    },
    // お気に入りの投稿を削除
    deleteFavoritePost() {
      this.$store.dispatch("posts/removeFavoritePost", {
        userId: this.userId,
        postId: this.postId,
      });
    },
    // 投稿者のページへ移動
    moveToUserPage() {
      this.$router.push({
        name: "userView",
        params: { id: this.post.user.id },
      });
    },
    // 回答を投稿する
    async postAnswer() {
      // ログインしていなければログインページへ
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      // バリデーションメッセージを初期化
      this.answerValidations = [];

      // 回答のバリデーション
      if (!this.newAnswer) {
        this.answerValidations.push("回答を入力してください");
        return;
      }

      const params = {
        content: this.newAnswer,
        questionId: this.postId,
        respondentId: this.userId,
      };

      // 回答を作成
      await apiClient.post("/answers/create/", params);

      // 回答を更新
      const res = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = res.data;

      // フォームの文章を初期化
      this.newAnswer = "";
    },
    // 回答にいいねする
    async like(answerId) {
      // ログインしていなければログインページへ
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      const params = {
        userId: this.userId,
        answerId,
      };
      // いいねを追加
      await apiClient.post("/answers/add/like/", params);

      // 回答を更新
      const res = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = res.data;
    },
    // 回答のいいねを外す
    async dislike(answerId) {
      // いいねを削除
      await apiClient.delete(
        "/answers/remove/like/" + answerId + "/user/" + this.userId + "/"
      );

      // 回答を更新
      const res = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = res.data;
    },
  },
  watch: {
    postId(val) {
      // サイドバーからページをpostIdを切り替えたとき
      apiClient.get("/posts/post/" + val + "/").then((response) => {
        this.post = response.data; // 対象の投稿データをセット
      });
    },
  },
};
</script>

<style scoped>
/* 基本設定 */
a {
  text-decoration: none;
}

.container {
  display: flex;
  width: 85%;
  margin: 0 auto;
  padding-top: 50px;
  font-size: 1.2em;
}

/* 投稿詳細部分 */
.post_details {
  padding-top: 25px;
  width: 75%;
}

/* 質問部分 */
.content {
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 2px;
  background: white;
  box-shadow: 0 5px 5px rgb(155, 153, 153);
  overflow-wrap: break-word;
}

/* タイトル */
.ttl {
  margin: 10px 0;
  font-weight: normal;
  font-size: 1.8em;
}

/* 内容 */
.text {
  min-height: 50px;
  margin: 30px 0;
}

/* 物件情報 */
.property {
  margin: 20px 0 5px;
}

.property > h4,
p {
  margin: 0;
}

.property > p {
  font-size: 0.9em;
}

/* 投稿日時 */
.updated_at {
  border-bottom: 1px solid silver;
  color: gray;
  font-size: 0.8em;
}

/* コンテンツ下部 */
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* コンテンツ内ボタン */
.btn_content {
  padding: 10px 20px;
  border: 2.4px solid rgba(83, 83, 224, 0.808);
  border-radius: 5px;
  color: rgba(83, 83, 224, 0.808);
  font-weight: bold;
}

.btn_content:hover {
  background: rgb(173, 171, 171);
}

/* 投稿者 */
.author {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(165, 167, 165, 0.315);
  cursor: pointer;
}

/* アイコン */
.icon {
  width: 40px;
  height: 40px;
  background: silver;
}

.icon > img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

/* ユーザー名 */
.username {
  min-width: 80px;
  max-width: 100px;
  margin-left: 10px;
  overflow: hidden;
  color: rgb(97, 94, 94);
  font-size: 0.9em;
}

/* 回答フォーム */
.answer_form {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid silver;
}

.answer_form > textarea {
  height: 100px;
  padding: 10px;
  border-color: silver;
  border-radius: 3px;
  font-size: 1.1em;
  letter-spacing: 2px;
}

.answer_form > p {
  margin: 0;
  font-size: 0.8em;
  text-align: center;
}

.btn_answer {
  height: 50px;
  margin: 30px 0;
  border-color: white;
  border-radius: 5px;
  background: rgb(172, 21, 192);
  color: white;
  letter-spacing: 10px;
  cursor: pointer;
}

.btn_answer:hover {
  opacity: 0.8;
}

.validation {
  margin: 0;
}

/* 回答 */
.ttl_answer {
  margin: 0 0 40px;
  font-size: 1.5em;
  letter-spacing: 3px;
}

.answer_section + .answer_section {
  border-top: 1px solid silver;
}

/* 回答日時 */
.answered_at {
  display: flex;
  justify-content: flex-end;
  margin: 5px 0;
  color: gray;
  font-size: 0.8em;
}

/* 回答がない場合 */
.text_no_answer {
  margin: 0 0 30px;
  color: gray;
  text-align: center;
}
</style>
