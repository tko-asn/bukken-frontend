<template>
  <div class="container">
    <div class="container__item-post-details">
      <article class="block-content">
        <!-- 通常時 -->
        <template v-if="!isEditingPost">
          <!-- タイトル -->
          <p class="block-content__title">
            {{ post.title }}
          </p>
          <!-- 物件情報 -->
          <div class="item-property">
            <h4 class="item-property__title">対象物件</h4>
            <div class="item-proprety__body--no_editing">
              <!-- 物件名 -->
              <p class="item-property__text">{{ post.property }}</p>
              <!-- 物件住所 -->
              <p class="item-property__text">
                {{ "〒" + postalCodeA(post) + "-" + postalCodeB(post) }}
                <span>{{ addressData(post) }}</span>
              </p>
              <a
                class="item-property__link-map"
                :href="
                  'https://maps.google.co.jp/maps/search/' + addressData(post)
                "
                target="_blank"
                rel="noopener noreferrer"
                >地図を表示</a
              >
            </div>
          </div>
          <p class="block-content__updated-at">
            {{ datetime(post.createdAt) }}
            <span
              class="block-content__span"
              v-if="post.createdAt != post.updatedAt"
              >(編集済み)</span
            >
          </p>
          <!-- 内容（改行するとスペースが入る） -->
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
            <div
              class="item-bottom__author"
              @click="moveToUserPage(post.user.id)"
            >
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
          <!-- カテゴリー -->
          <div class="item-category">
            <div class="item-category__body--no_editing">
              <p class="item-category__title" v-show="categoryLength">
                カテゴリ―
              </p>
              <span
                class="item-category__item"
                v-for="category in post.categories"
                :key="category.secondCategory"
              >
                {{ category.firstCategory
                }}<span
                  class="item-category__span"
                  v-if="category.secondCategory"
                  >/</span
                >{{ category.secondCategory }}
              </span>
            </div>
          </div>
        </template>

        <!-- 編集時 -->
        <template v-else>
          <!-- タイトル -->
          <input
            class="block-content__input-title block-content__title"
            type="text"
            v-model="editPostData.title"
            placeholder="タイトル"
          />
          <!-- 物件情報 -->
          <div class="item-property">
            <h4 class="item-property__title">物件情報</h4>
            <div class="item-property__body--editing">
              <input
                type="text"
                class="block-content__input-property"
                v-model="editPostData.property"
                placeholder="物件名"
              />
              <AddressForm
                :addressProps="addressDataProps"
                :optionInput="true"
                :validations="addressMessages"
                @addressData="getAddressData"
              />
            </div>
          </div>
          <!-- 内容 -->
          <textarea
            class="block-content__input-text"
            cols="30"
            rows="10"
            v-model="editPostData.text"
            placeholder="質問内容"
          ></textarea>
          <!-- カテゴリー -->
          <div class="item-category">
            <!-- 編集モード -->
            <div class="item-category__body--editing">
              <CategoryForm
                :selectedCategories="editCategoryData"
                @add="addCategory"
              />
              <Tag :tags="editCategoryData" :deleteTag="removeCategory" />
            </div>
          </div>
        </template>

        <!-- 回答フォーム -->
        <div class="form-answer">
          <!-- ログイン済みかつ自分の質問でない場合 -->
          <template v-if="isLoggedIn && !isYourPost">
            <!-- まだ回答していない場合 -->
            <template v-if="!haveYouAnswered">
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
            <!-- 既に回答している場合 -->
            <p class="form-answer__text form-answer__text--answered" v-else>
              この質問には回答済みです
            </p>
          </template>

          <!-- ログイン済みかつ自分の質問の場合 -->
          <template v-else-if="isLoggedIn && isYourPost">
            <!-- 編集モードでない場合 -->
            <button
              class="form-answer__btn"
              @click="isEditingPost = true"
              v-show="!isEditingPost"
            >
              投稿を編集する
            </button>
            <!-- 編集モード -->
            <div class="form-answer__edit-post" v-show="isEditingPost">
              <button
                class="form-answer__btn form-answer__btn--half_cancel"
                @click="isEditingPost = false"
              >
                キャンセル
              </button>
              <button
                class="form-answer__btn form-answer__btn--half_edit"
                @click="updatePost"
              >
                編集
              </button>
            </div>
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
              >いいね {{ answer.likedBy.length }}</a
            >
            <a
              class="item-bottom__btn item-bottom__btn--active"
              href=""
              v-show="answer.likedBy.find((el) => el.id === userId)"
              @click.prevent="dislike(answer.id)"
              >いいね {{ answer.likedBy.length }}</a
            >
            <div
              class="item-bottom__author"
              @click="moveToUserPage(answer.user.id)"
            >
              <div class="block-icon">
                <img class="block-icon__img" :src="answer.user.icon_url" />
              </div>
              <p class="item-bottom__username">{{ answer.user.username }}</p>
            </div>
          </div>
          <p
            class="block-content__updated-at block-content__updated-at--answer"
          >
            {{ datetime(answer.updatedAt) }}
          </p>
        </section>
        <p class="block-content__no-text" v-if="!post.answers.length">
          まだ回答がありません
        </p>
      </div>
    </div>

    <!-- サイドメニュー -->
    <SidePostList class="container__list-side-post" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import apiClient from "@/axios";
import ValidationMessage from "@/components/ValidationMessage";
import SidePostList from "@/components/SidePostList";
import AddressForm from "@/components/AddressForm";
import CategoryForm from "@/components/CategoryForm";
import Tag from "@/components/Tag";
import moment from "moment";
import addressValidationMixin from "@/mixins/addressValidationMixin";
import addressData from "@/mixins/addressData";

export default {
  props: {
    postId: String,
  },
  components: {
    ValidationMessage,
    SidePostList,
    AddressForm,
    CategoryForm,
    Tag,
  },
  mixins: [addressValidationMixin, addressData],
  data() {
    return {
      // 参照エラーが発生するので空のデータを追加
      post: {
        // 表示する投稿
        id: "",
        title: "",
        text: "",
        updatedAt: "",
        createdAt: "",
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
      // 更新用質問データ
      editPostData: {
        title: "",
        property: "",
        text: "",
      },
      editAddressData: {},
      editCategoryData: [],
      isEditingPost: false, // 質問を編集中かどうか
      editFlag: {
        address: false,
        category: false,
      },
      editCategory: false, // カテゴリーを編集したかどうか
    };
  },
  created() {
    apiClient.get("/posts/post/" + this.postId + "/").then(({ data }) => {
      this.post = data; // 対象の投稿データをセット

      // 編集用データ
      this.editPostData.title = data.title;
      this.editPostData.text = data.text;
      this.editPostData.property = data.property;
      this.editAddressData = { ...data.address };
      this.editCategoryData = [...data.categories];
      this.editAddressData.postalCodeA = this.postalCodeA(this.post);
      this.editAddressData.postalCodeB = this.postalCodeB(this.post);
    });
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "userId"]),
    ...mapGetters("posts", ["myFavoritePosts"]),
    // ユーザーのお気に入りの投稿かどうか
    isYourFavoritePost() {
      return this.myFavoritePosts.some((el) => el.id === this.postId);
    },
    // 質問に回答済みかどうか
    haveYouAnswered() {
      return this.post.answers.some((el) => el.user.id === this.userId);
    },
    // 自分の質問かどうか
    isYourPost() {
      return this.post.user.id === this.userId;
    },
    // 所在地の初期値を設定
    addressDataProps() {
      return {
        postalCodeA: this.postalCodeA(this.post),
        postalCodeB: this.postalCodeB(this.post),
        townName: this.post.address?.["townName"],
        buildingName: this.post.address?.["buildingName"],
      };
    },
    // カテゴリーの数を返す
    categoryLength() {
      return this.post.categories?.length;
    },
  },
  methods: {
    ...mapActions("posts", ["addFavoritePost", "removeFavoritePost"]),
    // 時間フォーマッター
    datetime(date) {
      return moment(date).format("YYYY年MM月D日 HH時mm分");
    },
    // AddressFormから所在地データを取得
    getAddressData(addressObj) {
      Object.keys(addressObj).forEach((key) => {
        this.editAddressData[key] = addressObj[key];
      });
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
    moveToUserPage(id) {
      this.$router.push({
        name: "userView",
        params: { id },
      });
    },
    // 選択中のカテゴリを削除
    removeCategory(id) {
      this.editCategory = true;
      this.editCategoryData = this.editCategoryData.filter(
        (el) => el.id !== id
      );
    },
    // カテゴリーの追加
    addCategory(newCategory) {
      this.editCategory = true;
      this.editCategoryData.push(newCategory);
    },
    // 投稿を編集する
    async updatePost() {
      // 住所に変更がある場合
      if (
        this.editAddressData.postalCode !== this.post.address.postalCode ||
        this.editAddressData.townName !== this.post.address.townName ||
        this.editAddressData.buildingName !== this.post.address.buildingName
      ) {
        // バリデーションを実行
        this.addressValidation(this.editAddressData);
        const { data } = await apiClient.post(
          // 住所のIDを取得
          "/addresses/find/or/create/",
          this.editAddressData
        );
        this.editPostData.addressId = data.addressId;
      }

      // 投稿を編集
      await apiClient.patch(
        "/posts/update/" + this.post.id + "/",
        this.editPostData
      );

      if (this.editCategory) {
        // 投稿のカテゴリーを全削除
        await apiClient.delete("/posts/" + this.post.id + "/remove/categories");
        // カテゴリーのIDのリストを取得
        const { data } = await apiClient.post(
          "/categories/find/or/create/",
          this.editCategoryData
        );
        // 投稿モデルとカテゴリーモデルの中間テーブルのデータ作成
        await Promise.all(
          data.map(
            async (categoryId) =>
              await apiClient.post("/posts/set/category", {
                postId: this.post.id,
                categoryId,
              })
          )
        );
      }

      // 投稿内容を更新
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;

      // フラグを初期化
      this.editCategory = false;

      this.isEditingPost = false;
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
  justify-content: center;
  width: 85%;
  margin: 0 auto;
  padding-top: 50px;
}

/* 投稿詳細部分 */
.container__item-post-details {
  max-width: 700px;
  width: 50%;
  margin-right: 50px;
  padding-top: 25px;
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
  animation: slideUp 0.5s;
}

/* タイトル */
.block-content__title {
  margin: 10px 0;
  font-size: 1.2em;
  letter-spacing: 3px;
}

/* 内容 */
.block-content__text {
  min-height: 50px;
  margin: 20px 0;
  white-space: pre-wrap;
  font-size: 0.9em;
}

/* 編集フォーム */
[class*="block-content__input"] {
  width: 100%;
  border: 2px solid rgb(143, 142, 142);
  box-sizing: border-box;
  border-radius: 5px;
}

.block-content__input-title {
  height: 40px;
}

.block-content__input-property {
  height: 30px;
  margin: 10px 0;
}

.block-content__input-text {
  margin: 20px 0;
}

.form-answer__edit-post {
  display: flex;
}

[class*="form-answer__btn--half"] {
  width: 50%;
}

/* 物件情報 */
.item-property {
  overflow: hidden;
}

.item-property__title {
  margin: 5px 0 0;
}

.item-property__text {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
}

/* 投稿日時 */
.block-content__updated-at {
  border-bottom: 1px solid silver;
  color: gray;
  font-size: 0.8em;
}

.block-content__span {
  display: inline-block;
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
  padding: 5px 10px;
  border: 2.4px solid rgba(83, 83, 224, 0.808);
  border-radius: 5px;
  color: rgba(83, 83, 224, 0.808);
  font-weight: bold;
}

.item-bottom__btn:hover {
  background: rgb(202, 200, 200);
}

.item-bottom__btn--active {
  background: rgb(188, 250, 250);
  color: rgba(145, 145, 238, 0.808);
}

/* 投稿者 */
.item-bottom__author {
  display: flex;
  align-items: center;
  padding: 0 10px;
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
.item-category__body--no_editing {
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
  padding-top: 10px;
  border-top: 1px solid silver;
}

.form-answer__textarea {
  height: 200px;
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

.form-answer__text--answered {
  padding: 10px 0;
}

.form-answer__btn {
  height: 40px;
  margin: 20px 0;
  border-color: white;
  border-radius: 5px;
  background: rgb(172, 21, 192);
  color: white;
  letter-spacing: 2px;
  cursor: pointer;
}

.form-answer__btn:hover {
  opacity: 0.8;
}

.form-answer__btn--half_cancel {
  background: gray;
}

.form-answer__btn--half_edit {
  background: rgb(27, 235, 27);
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

@media screen and (max-width: 1024px) {
  .container {
    width: 80%;
    flex-direction: column;
  }

  .container__item-post-details {
    max-width: none;
    width: 100%;
    margin: 0;
  }

  .container__list-side-post {
    display: none;
  }
}

@media screen and (max-width: 599px) {
  .container {
    width: 100%;
  }

  .block-content__title {
    letter-spacing: 0;
  }

  .item-property__title {
    margin: 0;
  }

  .item-bottom {
    flex-direction: column-reverse;
  }

  .item-bottom__author {
    align-self: end;
    height: 40px;
    margin-bottom: 10px;
    padding: 0 5px;
  }

  .item-bottom__btn {
    width: 100%;
    padding: 2px 0;
    text-align: center;
  }

  .block-icon,
  .block-icon__img {
    width: 30px;
    height: 30px;
  }

  .block-content__updated-at {
    margin: 5px 0 0;
  }

  .container__item-post-details {
    padding-top: 0;
  }
}
</style>
