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
              v-if="post.createdAt !== post.updatedAt"
              >(編集済み)</span
            >
          </p>
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
                placeholder="回答を投稿する"
                v-model="newAnswer"
              ></textarea>
              <ValidationMessage
                class="form-answer__validation"
                :messages="answerValidations"
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
          <!-- 通常時 -->
          <div
            v-show="
              !getEditAnswerData(answer.id).isEditing &&
              !getEditAnswerData(answer.id).isDeleting
            "
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
              class="
                block-content__updated-at block-content__updated-at--answer
              "
            >
              {{ datetime(answer.updatedAt) }}
              <span
                class="block-content__span"
                v-if="answer.createdAt !== answer.updatedAt"
              >
                (編集済み)</span
              >
            </p>
            <div class="item-icon" v-if="userId === answer.user.id">
              <fa-icon
                class="item-icon__icon"
                icon="edit"
                @click="switchEditAnswerData(answer.id, true)"
              />
              <fa-icon
                class="item-icon__icon"
                icon="trash-alt"
                @click="
                  switchEditAnswerData(answer.id, true, { deleteAns: true })
                "
              />
            </div>
          </div>

          <!-- 回答編集時 -->
          <div
            class="form-answer"
            v-show="
              userId === answer.user.id &&
              getEditAnswerData(answer.id).isEditing
            "
          >
            <textarea
              class="form-answer__textarea"
              placeholder="回答を入力"
              v-model="getEditAnswerData(answer.id).content"
            ></textarea>
            <ValidationMessage
              class="form-answer__validation"
              :messages="getEditAnswerData(answer.id).validations"
            />
            <div class="form-answer__block-btn">
              <button
                class="form-answer__btn form-answer__btn--cancel"
                @click="
                  switchEditAnswerData(answer.id, false, { cancel: true })
                "
              >
                キャンセル
              </button>
              <button class="form-answer__btn" @click="editAnswer(answer.id)">
                保存
              </button>
            </div>
          </div>

          <!-- 回答削除時 -->
          <div
            class="form-answer"
            v-show="getEditAnswerData(answer.id).isDeleting"
          >
            <!-- 改行するとスペースが入るので注意 -->
            <p class="form-answer__content block-content__text">{{ answer.content }}
            </p>
            <div class="form-answer__block-btn">
              <button
                class="form-answer__btn form-answer__btn--cancel"
                @click="
                  switchEditAnswerData(answer.id, false, { deleteAns: false })
                "
              >
                キャンセル
              </button>
              <button
                class="form-answer__btn form-answer__btn--delete"
                @click="deleteAnswer(answer.id)"
              >
                削除
              </button>
            </div>
          </div>

          <!-- コメント -->
          <div class="item-comment">
            <!-- コメントフォーム -->
            <div
              class="form-comment"
              v-if="userId === answer.user.id || userId === post.user.id"
            >
              <textarea
                class="form-comment__textarea"
                placeholder="コメントを入力"
                v-model="newComments[answer.id]"
              ></textarea>
              <ValidationMessage
                class="form-comment__validation"
                :messages="commentValidations"
              />
              <button
                class="form-comment__btn"
                @click="createComment(answer.id)"
              >
                コメントする
              </button>
            </div>
            <!-- コメント一覧 -->
            <ul class="item-comment__list" v-if="commentLength(answer)">
              <li
                class="block-comment"
                v-for="comment in commentLimitCount(answer.comments)"
                :key="comment.id"
              >
                <!-- 通常時 -->
                <!-- 改行すると行頭にスペースが入るので注意 -->
                <p
                  class="block-comment__content"
                  v-show="!editCommentData[comment.id].isEditing"
                >{{ comment.content }}
                </p>
                <!-- コメント編集時 -->
                <div class="form-comment">
                  <div
                    class="form-comment__edit"
                    v-show="editCommentData[comment.id].isDeleting"
                  >
                    <button
                      class="form-comment__btn form-comment__btn--cancel"
                      @click="
                        switchEditCommentData(comment.id, false, {
                          answerId: answer.id,
                          deleteCmt: true,
                        })
                      "
                    >
                      キャンセル
                    </button>
                    <button
                      class="form-comment__btn form-comment__btn--delete"
                      @click="deleteComment(comment.id)"
                    >
                      削除
                    </button>
                  </div>
                  <template v-if="editCommentData[comment.id].isEditing">
                    <textarea
                      class="form-comment__textarea"
                      placeholder="コメントを入力"
                      v-model="editCommentData[comment.id].content"
                    ></textarea>
                    <ValidationMessage
                      class="form-answer__validation"
                      :messages="editCommentData[comment.id].validations"
                    />
                    <div class="form-comment__edit">
                      <button
                        class="form-comment__btn form-comment__btn--cancel"
                        @click="
                          switchEditCommentData(comment.id, false, {
                            answerId: answer.id,
                          })
                        "
                      >
                        キャンセル
                      </button>
                      <button
                        class="form-comment__btn"
                        @click="editComment(comment.id)"
                      >
                        保存
                      </button>
                    </div>
                  </template>
                </div>
                <p class="block-content__updated-at">
                  {{ datetime(comment.createdAt) }}
                  <span
                    class="block-content__span"
                    v-if="comment.createdAt !== comment.updatedAt"
                    >(編集済み)</span
                  >
                  -
                  <router-link
                    class="block-comment__author"
                    :to="{ name: 'userView', params: { id: comment.user.id } }"
                    >{{ comment.user.username }}</router-link
                  >
                  <template v-if="userId === comment.user.id">
                    <fa-icon
                      class="block-comment__icon"
                      icon="edit"
                      v-show="!editCommentData[comment.id].isEditing"
                      @click="switchEditCommentData(comment.id, true)"
                    />
                    <fa-icon
                      class="block-comment__icon"
                      icon="trash-alt"
                      v-show="!editCommentData[comment.id].isDeleting"
                      @click="
                        switchEditCommentData(comment.id, true, {
                          deleteCmt: true,
                        })
                      "
                    />
                  </template>
                </p>
              </li>
              <a
                href=""
                class="link-comment"
                v-show="commentLength(answer) >= 3 && isFullDisplay === false"
                @click.prevent="isFullDisplay = true"
                ><fa-icon class="link-comment__icon" icon="chevron-down" />
                残りの{{ commentLength(answer) - 2 }}件を表示する</a
              >
              <a
                href=""
                class="link-comment"
                v-show="commentLength(answer) >= 3 && isFullDisplay === true"
                @click.prevent="isFullDisplay = false"
                ><fa-icon class="link-comment__icon" icon="chevron-up" />
                折りたたむ</a
              >
            </ul>
          </div>
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
      newComments: {}, // 新しいコメント
      editAnswerData: {}, // 回答の編集用データ
      editCommentData: {}, // コメントの編集用データ
      answerValidations: [], // 回答のバリデーションメッセージ
      commentValidations: [], // コメントのバリデーションメッセージ
      // 更新用質問データ
      editPostData: {
        title: "",
        property: "",
        text: "",
      },
      editAddressData: {},
      editCategoryData: [],
      isEditingPost: false, // 質問を編集中かどうか
      editCategory: false, // カテゴリーを編集したかどうか
      isFullDisplay: false, // コメントを全表示するかどうか
    };
  },
  created() {
    apiClient.get("/posts/post/" + this.postId + "/").then(({ data }) => {
      this.post = data; // 対象の投稿データをセット

      // コメントの初期値を作成
      this.post.answers.forEach((el) => {
        this.newComments[el.id] = "";
      });

      // コメントの編集用データの初期値を作成
      this.setEditCommentData(this.post.answers);
      // 回答の編集用データの初期値を作成
      this.setEditAnswerData(this.post.answers);

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
    // コメント編集フォームの表示切り替え
    switchEditCommentData(
      commentId,
      boolean,
      { answerId = "", deleteCmt = false } = {}
    ) {
      // キャンセル時はcontentを初期化
      if (answerId) {
        const answerObj = this.post.answers.find(({ id }) => id === answerId);
        const commentObj = answerObj.comments.find(
          ({ id }) => id === commentId
        );
        this.editCommentData[commentId].content = commentObj.content;
      }

      if (deleteCmt) {
        this.editCommentData[commentId].isDeleting = boolean;
        this.editCommentData[commentId].isEditing = false;
      } else {
        this.editCommentData[commentId].isEditing = boolean;
        this.editCommentData[commentId].isDeleting = false;
      }

      this.editCommentData[commentId].validations = [];
      this.editCommentData = { ...this.editCommentData };
    },
    // 回答編集フォームの表示切り替え
    switchEditAnswerData(
      answerId,
      boolean,
      { deleteAns = false, cancel = false } = {}
    ) {
      // キャンセル時はcontentを初期化
      const { content } = this.post.answers.find(({ id }) => id === answerId);
      if (cancel) {
        this.editAnswerData[answerId].content = content;
      }

      if (deleteAns) {
        this.editAnswerData[answerId].isDeleting = boolean;
        this.editAnswerData[answerId].isEditing = false;
      } else {
        this.editAnswerData[answerId].isEditing = boolean;
        this.editAnswerData[answerId].isDeleting = false;
      }

      this.editAnswerData[answerId].validations = [];
      this.editAnswerData = { ...this.editAnswerData };
    },
    ...mapActions("posts", ["addFavoritePost", "removeFavoritePost"]),
    // 時間フォーマッター
    datetime(date) {
      return moment(date).format("YYYY年MM月D日 HH時mm分");
    },
    // コメントの数
    commentLength(answer) {
      return answer.comments?.length;
    },
    // コメント表示数
    commentLimitCount(comments) {
      if (this.isFullDisplay) {
        return comments;
      }
      return comments.slice(0, 2);
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

      // 回答の編集用データを更新
      this.setEditAnswerData(this.post.answers);

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
    // 回答を編集
    async editAnswer(answerId) {
      this.editAnswerData[answerId].validations = [];

      if (!this.editAnswerData[answerId].content) {
        this.editAnswerData[answerId].validations.push(
          "回答を入力してください"
        );
        return;
      }

      const params = {
        content: this.editAnswerData[answerId].content,
      };
      await apiClient.patch("/answers/update/" + answerId + "/", params);

      // 回答を更新
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;

      // 回答編集フォームを閉じる
      this.editAnswerData[answerId].isEditing = false;
    },
    // 回答を削除
    async deleteAnswer(answerId) {
      await apiClient.delete("/answers/destroy/" + answerId + "/");

      // 回答を更新
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;

      // 編集用データを削除
      delete this.editAnswerData[answerId];
    },
    // コメントを作成
    async createComment(answerId) {
      this.commentValidations = [];
      if (!this.newComments[answerId]) {
        this.commentValidations.push("コメントを入力してください");
        return;
      }

      const params = {
        content: this.newComments[answerId],
        authorId: this.userId,
        answerId,
      };
      await apiClient.post("/comments/create/", params);

      // 回答を更新
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;

      // 編集用データを更新
      this.setEditCommentData(this.post.answers);

      // コメントフォームを初期化
      this.newComments[answerId] = "";
    },
    async editComment(commentId) {
      this.editCommentData[commentId].validations = [];

      if (!this.editCommentData[commentId].content) {
        this.editCommentData[commentId].validations.push(
          "コメントを入力してください"
        );
        return;
      }

      const params = {
        content: this.editCommentData[commentId].content,
      };
      await apiClient.patch("/comments/update/" + commentId + "/", params);

      // 回答を更新
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;

      // フォームを閉じる
      this.editCommentData[commentId].isEditing = false;
    },
    async deleteComment(commentId) {
      await apiClient.delete("/comments/delete/" + commentId + "/");

      // 回答を更新
      const { data } = await apiClient.get("/posts/post/" + this.postId + "/");
      this.post = data;

      // 編集用データを削除
      delete this.editCommentData[commentId];
    },
    // コメントの編集用データを作成
    setEditCommentData(answers) {
      answers.forEach((el) => {
        el.comments.forEach((comment) => {
          this.editCommentData[comment.id] = {
            isEditing: false,
            isDeleting: false,
            content: comment.content,
            validations: [],
          };
        });
      });
    },
    // 回答の編集用データを作成
    setEditAnswerData(answers) {
      answers.forEach((el) => {
        this.editAnswerData[el.id] = {
          isEditing: false,
          isDeleting: false,
          content: el.content,
          validations: [],
        };
      });
    },
    // 回答の編集用データを取得
    getEditAnswerData(answerId) {
      return this.editAnswerData[answerId] || {};
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

ul {
  list-style: none;
  padding: 0;
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
  animation: fadeIn 0.3s;
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
  border-bottom: 1px solid silver;
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
}

.form-answer__textarea {
  height: 130px;
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
  border: none;
  border-radius: 5px;
  background: rgb(172, 21, 192);
  color: white;
  letter-spacing: 2px;
  cursor: pointer;
}

.form-answer__block-btn {
  display: flex;
  justify-content: flex-end;
}

.form-answer__btn--cancel {
  background: rgb(167, 165, 165);
  margin-right: 5px;
}

.form-answer__btn--delete {
  background: rgb(231, 39, 39);
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

/* 回答の編集アイコン */
.item-icon {
  display: flex;
  justify-content: flex-end;
  padding: 0 0 5px;
  color: gray;
  cursor: pointer;
}

.item-icon__icon + .item-icon__icon {
  margin-left: 5px;
}

/* コメントフォーム */
.form-comment {
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
}

.form-comment__textarea {
  height: 70px;
  margin: 10px 0;
  border: 1px solid silver;
  border-radius: 5px;
}

.form-comment__btn {
  height: 30px;
  border: none;
  border-radius: 3px;
  background: rgb(19, 126, 214);
  color: white;
  cursor: pointer;
}

.form-comment__edit {
  display: flex;
  justify-content: flex-end;
}

.form-comment__btn--cancel {
  margin-right: 10px;
  background: rgb(170, 170, 170);
}

.form-comment__btn--delete {
  background: rgb(231, 39, 39);
}

.form-comment__validation {
  font-size: 0.8em;
}

.form-comment__btn:hover {
  opacity: 0.8;
}

/* コメント表示欄 */
.item-comment__list {
  width: 95%;
  margin-left: auto;
  border-top: 1px solid silver;
  font-size: 0.8em;
}

.block-comment {
  padding-left: 10px;
}

.block-comment__content {
  white-space: pre-wrap;
  padding: 0 5px;
}

.block-comment__author {
  font-size: 1.2em;
  color: black;
  text-decoration: underline;
}

.block-comment__icon {
  margin-left: 5px;
  font-size: 1.2em;
  cursor: pointer;
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
