<template>
  <div class="container">
    <div class="container__item-post-details">
      <article class="block-content">
        <!-- タイトル -->
        <p class="block-content__title">{{ post.title }}</p>
        <!-- 物件情報 -->
        <div class="item-property">
          <h4 class="item-property__title">対象物件</h4>
          <!-- 物件名 -->
          <p class="item-property__text">{{ post.property }}</p>
          <!-- 物件住所 -->
          <p class="item-property__text">
            {{ addressData(post.address) }}
          </p>
        </div>
        <p class="block-content__updated-at">{{ post.updatedAt }}</p>
        <!-- 内容 -->
        <p class="block-content__text">{{ post.text }}</p>
        <!-- 下部 -->
        <div class="item-bottom">
          <!-- お気に入りボタン -->
          <a
            class="item-bottom__btn"
            href=""
            @click.prevent="createFavoritePost"
            v-show="!isYourFavoritePost"
            >お気に入りに追加</a
          >
          <a
            class="item-bottom__btn"
            href=""
            @click.prevent="deleteFavoritePost"
            v-show="isYourFavoritePost"
            >お気に入り解除</a
          >
          <!-- 投稿者 -->
          <div class="item-bottom__author" @click="moveToUserPage">
            <!-- アイコン -->
            <div class="block-icon">
              <img
                class="block-icon__img"
                :src="post.user.icon_url"
                v-if="post.user.icon_url"
              />
            </div>
            <!-- ユーザー名 -->
            <p class="item-bottom__username">{{ post.user.username }}</p>
          </div>
        </div>
        <!-- カテゴリ― -->
        <div class="item-category">
          <p class="item-category__title" v-show="categoryLength(post)">
            カテゴリ―
          </p>
          <span
            class="item-category__item"
            v-for="category in post.categories"
            :key="category.secondCategory"
          >
            {{ category.firstCategory }}/{{ category.secondCategory }}
          </span>
        </div>

        <!-- 回答フォーム -->
        <div class="form-answer">
          <!-- ログイン済み -->
          <template v-if="isLoggedIn">
            <textarea
              class="form-answer__textarea"
              cols="30"
              rows="10"
              placeholder="回答を投稿する"
              v-model="newAnswer"
            ></textarea>
            <ValidationMessage
              class="form-answer__validation"
              :messages="answerValidations"
              v-show="answerValidations.length"
            />
            <button class="form-answer__btn" @click="postAnswer">回答</button>
          </template>

          <!-- 未ログイン -->
          <template v-else>
            <p class="form-answer__text">
              回答するにはログインする必要があります
            </p>
            <button class="form-answer__btn" @click="postAnswer">
              今すぐログイン
            </button>
          </template>
        </div>
      </article>

      <!-- 回答 -->
      <div class="block-content">
        <p class="block-content__title">{{ post.answers.length }}件の回答</p>
        <section
          class="block-content__section"
          v-for="answer in post.answers"
          :key="answer.id"
        >
          <p class="block-content__text">{{ answer.content }}</p>
          <div class="item-bottom">
            <a
              class="item-bottom__btn"
              href=""
              v-show="!answer.likedBy.find((el) => el.id === userId)"
              @click.prevent="like(answer.id)"
              >いいね</a
            >
            <a
              class="item-bottom__btn"
              href=""
              v-show="answer.likedBy.find((el) => el.id === userId)"
              @click.prevent="dislike(answer.id)"
              >いいね解除</a
            >
            <div class="item-bottom__author">
              <div class="block-icon">
                <img class="block-icon__img" :src="answer.user.icon_url" />
              </div>
              <p class="item-bottom__username">{{ answer.user.username }}</p>
            </div>
          </div>
          <p
            class="block-content__updated-at block-content__updated-at--answer"
          >
            {{ answer.updatedAt }}
          </p>
        </section>
        <p class="block-content__no-text" v-if="!post.answers.length">
          まだ回答がありません
        </p>
      </div>
    </div>

    <!-- サイドメニュー -->
    <SidePostList />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
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
    apiClient.get("/posts/post/" + this.postId + "/").then(({ data }) => {
      this.post = data; // 対象の投稿データをセット
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
  },
  methods: {
    ...mapActions("posts", ["addFavoritePost", "removeFavoritePost"]),
    // カテゴリーの数を返す
    categoryLength(post) {
      return post.categories?.length;
    },
    // 所在地のデータを連結して返す
    addressData(address) {
      return (
        "〒" +
        address?.["postalCode"].slice(0, 3) +
        "-" +
        address?.["postalCode"].slice(3) +
        " " +
        address?.["prefecture"] +
        address?.["municipality"] +
        address?.["townName"] +
        address?.["buildingName"]
      );
    },
    // お気に入りの投稿を追加
    createFavoritePost() {
      // ログインしていない場合はログインページへ
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }
      this.addFavoritePost({
        userId: this.userId,
        postId: this.postId,
      });
    },
    // お気に入りの投稿を削除
    deleteFavoritePost() {
      this.removeFavoritePost({
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
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;

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
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;
    },
    // 回答のいいねを外す
    async dislike(answerId) {
      // いいねを削除
      await apiClient.delete(
        "/answers/remove/like/" + answerId + "/user/" + this.userId + "/"
      );

      // 回答を更新
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;
    },
  },
  watch: {
    postId(val) {
      // サイドバーからページをpostIdを切り替えたとき
      apiClient.get("/posts/post/" + val + "/").then(({ data }) => {
        this.post = data; // 対象の投稿データをセット
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
  justify-content: space-around;
  width: 85%;
  margin: 0 auto;
  padding-top: 50px;
  font-size: 1.2em;
}

/* 投稿詳細部分 */
.container__item-post-details {
  padding-top: 25px;
  width: 65%;
}

.block-content {
  animation: slideUp 0.5s;
}

.block-content * {
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
  }
  to {
    transform: translateY(0);
  }
}

/* 質問部分 */
.block-content {
  margin-bottom: 40px;
  padding: 10px 20px;
  border-radius: 2px;
  background: white;
  box-shadow: 0 3px 2px rgb(158, 156, 156), inset 1px 1px 5px rgb(224, 224, 224),
    inset -1px -1px 5px rgb(224, 224, 224);
  overflow-wrap: break-word;
}

/* タイトル */
.block-content__title {
  margin: 10px 0;
  font-size: 1.5em;
  letter-spacing: 3px;
}

/* 内容 */
.block-content__text {
  min-height: 50px;
  margin: 30px 0;
}

/* 物件情報 */
.item-property__title {
  margin: 20px 0 0;
}

.item-property__text {
  margin: 0;
  font-size: 0.9em;
}

/* 投稿日時 */
.block-content__updated-at {
  border-bottom: 1px solid silver;
  color: gray;
  font-size: 0.8em;
}

/* コンテンツ下部 */
.item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

/* コンテンツ内ボタン */
.item-bottom__btn {
  padding: 10px 20px;
  border: 2.4px solid rgba(83, 83, 224, 0.808);
  border-radius: 5px;
  color: rgba(83, 83, 224, 0.808);
  font-weight: bold;
}

.item-bottom__btn:hover {
  background: rgb(173, 171, 171);
}

/* 投稿者 */
.item-bottom__author {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(165, 167, 165, 0.315);
  cursor: pointer;
}

/* アイコン */
.block-icon {
  width: 40px;
  height: 40px;
  background: silver;
}

.block-icon__img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

/* ユーザー名 */
.item-bottom__username {
  min-width: 80px;
  max-width: 100px;
  margin-left: 10px;
  overflow: hidden;
  color: rgb(97, 94, 94);
  font-size: 0.9em;
}

/* カテゴリ― */
.item-category {
  font-size: 0.8em;
}

.item-category__title {
  margin-bottom: 0;
}

.item-category__item {
  display: inline-block;
  margin: 5px 0 20px;
  color: rgb(109, 108, 108);
}

.item-category__item + .item-category__item {
  margin-left: 15px;
}

/* 回答フォーム */
.form-answer {
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  border-top: 1px solid silver;
}

.form-answer__textarea {
  height: 100px;
  padding: 10px;
  border-color: silver;
  border-radius: 3px;
  font-size: 1.1em;
  letter-spacing: 2px;
}

.form-answer__text {
  margin: 0;
  font-size: 0.8em;
  text-align: center;
}

.form-answer__btn {
  height: 50px;
  margin: 30px 0;
  border-color: white;
  border-radius: 5px;
  background: rgb(172, 21, 192);
  color: white;
  letter-spacing: 10px;
  cursor: pointer;
}

.form-answer__btn:hover {
  opacity: 0.8;
}

.form-answer__validation {
  margin: 0;
}

/* 回答日時 */
.block-content__updated-at--answer {
  display: flex;
  justify-content: flex-end;
  border: none;
}

/* 回答 */
.block-content__section + .block-content__section {
  border-top: 1px solid silver;
}

/* 回答がない場合 */
.block-content__no-text {
  margin: 0 0 30px;
  color: gray;
  text-align: center;
}
</style>
