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
              class="item-bottom__btn item-bottom__btn--active"
              href=""
              @click.prevent="deleteFavoritePost"
              v-show="isYourFavoritePost"
              >お気に入り解除</a
            >
            <!-- 投稿者 -->
            <div
              class="item-bottom__author"
              @click="moveToUserPage(postUserData('id'))"
            >
              <!-- アイコン -->
              <div class="block-icon">
                <img
                  class="block-icon__img"
                  :src="postUserData('icon_url')"
                  v-if="postUserData('icon_url')"
                />
              </div>
              <!-- ユーザー名 -->
              <p class="item-bottom__username">
                {{ postUserData("username") }}
              </p>
            </div>
          </div>
          <!-- 物件情報 -->
          <div class="item-property item-property--no_editing">
            <div class="item-property__body--no_editing">
              <!-- 物件名 -->
              <h4 class="item-property__title">物件</h4>
              <p class="item-property__text">
                {{ post.property }}
              </p>
              <div class="item-property__map" ref="map" v-if="showMap"></div>
              <!-- 物件住所 -->
              <p class="item-property__text item-property__text--top_space">
                <span class="item-property__postal-code">
                  {{ "〒" + postalCodeA(post) + "-" + postalCodeB(post) }}
                </span>
                <span class="item-property__span">
                  {{ prefecture(post) + municipality(post) + townName(post) }}
                </span>
                <span class="item-property__span">
                  {{ buildingName(post) }}
                </span>
              </p>
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
          <LargeInput v-model="editPostData.title" placeholder="タイトル" />
          <!-- 物件情報 -->
          <div class="item-property">
            <h4 class="item-property__title">物件情報</h4>
            <div class="item-property__body--editing">
              <MiddleInput
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
          <TextArea 
            elementId="textarea-post-edit"
            class="block-content__textarea"
            placeholder="質問内容" 
            v-model="editPostData.text" 
          />
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
            <AnswerForm
              :buttonFunc="postAnswer"
              :isDisabled="isDisabled.postAnswer"
              :validations="answerValidations"
              v-if="!haveYouAnswered"
            />
            <!-- 既に回答している場合 -->
            <p class="form-answer__text form-answer__text--answered" v-else>
              この質問には回答済みです
            </p>
          </template>

          <!-- ログイン済みかつ自分の質問の場合 -->
          <template v-else-if="isLoggedIn && isYourPost">
            <!-- 編集モードでない場合 -->
            <MiddleButton
              btnValue="投稿を編集する"
              v-if="!isEditingPost"
              @click="switchPostEditMode(true)"
            />
            <!-- 編集モード -->
            <template v-else>
              <div class="form-answer__block-btn">
                <MiddleButton
                  btnValue="キャンセル"
                  btnColor="cancel"
                  width="45%"
                  @click="switchPostEditMode(false)"
                />
                <MiddleButton
                  btnValue="編集"
                  @click="updatePost"
                  btnColor="edit"
                  width="45%"
                  :isDisabled="isDisabled.updatePost"
                />
              </div>
              <h4 class="form-answer__title">質問を削除する</h4>
              <p class="form-answer__text form-answer__text--delete">
                「削除」と入力してください
              </p>
              <MiddleInput placeholder="削除" v-model="deletePostText" />
              <MiddleButton
                btnValue="削除"
                @click="deletePost"
                btnColor="delete"
                :isDisabled="deletePostText !== '削除' || isDisabled.deletePost"
              />
            </template>
          </template>

          <!-- 未ログイン -->
          <template v-else>
            <p class="form-answer__text">
              回答するにはログインする必要があります
            </p>
            <MiddleButton btnValue="今すぐログイン" @click="postAnswer" />
          </template>
        </div>
      </article>

      <!-- 回答 -->
      <div class="block-content">
        <div class="block-rate" v-show="answerLength">
          <p class="block-rate__title">質問内容に対する物件の評価の比率</p>
          <div class="item-rate">
            <span
              class="item-rate__span item-rate__span--good"
              :style="evaluationWidth(1)"
            ></span>
            <span
              class="item-rate__span item-rate__span--bad"
              :style="evaluationWidth(2)"
            ></span>
          </div>
          <p class="block-rate__help">※ 評価：普通は比率に含まれません</p>
        </div>
        <p class="block-content__title">{{ answerLength }}件の回答</p>
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
            <div class="block-evaluation">
              <p class="block-evaluation__title">質問に対する物件の評価</p>
              <div
                class="block-evaluation__item block-evaluation__item--normal"
                v-show="answer.evaluation === 0"
              >
                <fa-icon class="block-evaluation__icon" icon="meh-blank" />
                <span class="block-evaluation__text">普通</span>
              </div>
              <div
                class="block-evaluation__item block-evaluation__item--good"
                v-show="answer.evaluation === 1"
              >
                <fa-icon class="block-evaluation__icon" icon="laugh" />
                <span class="block-evaluation__text">良い</span>
              </div>
              <div
                class="block-evaluation__item block-evaluation__item--bad"
                v-show="answer.evaluation === 2"
              >
                <fa-icon class="block-evaluation__icon" icon="frown" />
                <span class="block-evaluation__text">悪い</span>
              </div>
            </div>
            <p class="block-content__text">{{ answer.content }}</p>
            <div class="item-bottom">
              <a
                class="item-bottom__btn"
                href=""
                v-show="!answer.likedBy.find((el) => el.id === userId)"
                @click.prevent="like(answer.id)"
                >いいね {{ likeLength(answer) }}</a
              >
              <a
                class="item-bottom__btn item-bottom__btn--active"
                href=""
                v-show="answer.likedBy.find((el) => el.id === userId)"
                @click.prevent="dislike(answer.id)"
                >いいね {{ likeLength(answer) }}</a
              >
              <div
                class="item-bottom__author"
                @click="moveToUserPage(answerUserData(answer, 'id'))"
              >
                <div class="block-icon">
                  <img
                    class="block-icon__img"
                    :src="answerUserData(answer, 'icon_url')"
                  />
                </div>
                <p class="item-bottom__username">
                  {{ answerUserData(answer, "username") }}
                </p>
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
            <div
              class="item-icon"
              v-if="userId === answerUserData(answer, 'id')"
            >
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
            v-if="
              userId === answerUserData(answer, 'id') &&
              getEditAnswerData(answer.id).isEditing
            "
          >
            <AnswerForm
              :buttonFunc="editAnswer"
              :isDisabled="isDisabled.editAnswer"
              :validations="getEditAnswerData(answer.id).validations"
              :isTwoButton="true"
              :cancelFunc="switchEditAnswerData"
              :answerId="answer.id"
              :defaultData="getEditAnswerData(answer.id)"
            />
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
              <MiddleButton
                btnValue="キャンセル"
                @click="
                  switchEditAnswerData(answer.id, false, { deleteAns: false })
                "
                btnColor="cancel"
                width="45%"
              />
              <MiddleButton
                btnValue="削除"
                @click="deleteAnswer(answer.id)"
                btnColor="delete"
                :isDisabled="isDisabled.deleteAnswer"
                width="45%"
              />
            </div>
          </div>

          <!-- コメント -->
          <div class="item-comment">
            <!-- コメントフォーム -->
            <div
              class="form-comment"
              v-if="
                userId === answerUserData(answer, 'id') ||
                userId === postUserData('id')
              "
            >
              <TextArea 
                :elementId="`textarea-comment-form-${answer.id}`"
                placeholder="コメントを入力" 
                height="70px"
                v-model="newComments[answer.id]" 
              />
              <ValidationMessage
                class="form-comment__validation"
                :messages="commentValidations"
              />
              <SmallButton
                btnValue="コメントする"
                @click="createComment(answer.id)"
                :isDisabled="isDisabled.createComment"
                btnColor="info"
              />
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
                    <SmallButton
                      btnValue="キャンセル"
                      btnColor="cancel"
                      width="100px"
                      @click="
                        switchEditCommentData(comment.id, false, {
                          answerId: answer.id,
                          deleteCmt: true,
                        })
                      "
                    />
                    <SmallButton
                      class="form-comment__btn-right"
                      btnValue="削除"
                      btnColor="delete"
                      width="45px"
                      @click="deleteComment(comment.id)"
                      :isDisabled="isDisabled.deleteComment"
                    />
                  </div>
                  <template v-if="editCommentData[comment.id].isEditing">
                    <TextArea 
                      :elementId="`textarea-comment-edit-${comment.id}`"
                      placeholder="コメントを入力"
                      height="70px"
                      v-model="editCommentData[comment.id].content"
                    />
                    <ValidationMessage
                      class="form-answer__validation"
                      :messages="editCommentData[comment.id].validations"
                    />
                    <div class="form-comment__edit">
                      <SmallButton
                        btnValue="キャンセル"
                        btnColor="cancel"
                        width="100px"
                        @click="
                          switchEditCommentData(comment.id, false, {
                            answerId: answer.id,
                          })
                        "
                      />
                      <SmallButton
                        class="form-comment__btn-right"
                        btnValue="保存"
                        @click="editComment(comment.id)"
                        width="45px"
                        :isDisabled="isDisabled.editComment"
                      />
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
        <p class="block-content__no-text" v-if="!answerLength">
          まだ回答がありません
        </p>
      </div>
    </div>

    <!-- サイドメニュー -->
    <SidePostList class="container__list-side-post" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import apiClient from "@/axios";
import ValidationMessage from "@/components/ValidationMessage";
import SidePostList from "@/components/SidePostList";
import AddressForm from "@/components/AddressForm";
import CategoryForm from "@/components/CategoryForm";
import AnswerForm from "@/components/AnswerForm";
import Tag from "@/components/Tag";
import LargeInput from "@/components/LargeInput";
import MiddleInput from "@/components/MiddleInput";
import MiddleButton from "@/components/MiddleButton";
import SmallButton from "@/components/SmallButton";
import TextArea from "@/components/TextArea";
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
    AnswerForm,
    MiddleButton,
    SmallButton,
    LargeInput,
    MiddleInput,
    TextArea,
  },
  mixins: [addressValidationMixin, addressData],
  data() {
    return {
      post: {},
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
      deletePostText: "", // 投稿削除文
      favoritePostList: [],
      isDisabled: {
        postAnswer: false,
        createComment: false,
        updatePost: false,
        editAnswer: false,
        editComment: false,
        deletePost: false,
        deleteAnswer: false,
        deleteComment: false,
      },
      showMap: true,
    };
  },
  created() {
    // ユーザーのお気に入りの投稿のidリスト取得
    if (this.isLoggedIn) {
      this.getFavoritePostList();
    }
    apiClient.get(`/posts/post/${this.postId}/`).then(({ data }) => {
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
  mounted() {
    this.getPropertyMap();
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "userId"]),
    // ユーザーのお気に入りの投稿かどうか
    isYourFavoritePost() {
      return this.favoritePostList.some((el) => el.id === this.postId);
    },
    // 質問に回答済みかどうか
    haveYouAnswered() {
      return this.post.answers?.some((el) => el.user.id === this.userId);
    },
    // 自分の質問かどうか
    isYourPost() {
      return this.postUserData("id") === this.userId;
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
    // カテゴリー数
    categoryLength() {
      return this.post.categories?.length;
    },
    // 回答数
    answerLength() {
      return this.post.answers?.length;
    },
    evaluationWidth() {
      return (type) => {
        const targetCount = this.post.answers?.filter(
          (el) => el.evaluation === type
        ).length;
        const evaluationCount = this.post.answers?.filter(
          (el) => el.evaluation !== 0
        ).length;
        const rate = evaluationCount
          ? Math.round((targetCount / evaluationCount) * 100)
          : 0;
        return `width: ${rate}%;`;
      };
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
    // 時間フォーマッター
    datetime(date) {
      return moment(date).format("YYYY年MM月D日 HH時mm分");
    },
    // コメントの数
    commentLength(answer) {
      return answer.comments?.length;
    },
    // いいねの数
    likeLength(answer) {
      return answer.likedBy?.length;
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
    async createFavoritePost() {
      // ログインしていない場合はログインページへ
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }
      const params = {
        userId: this.userId,
        postId: this.postId,
      };
      // お気に入りの投稿を追加
      await apiClient.post("/posts/create/favorite/", params);
      await this.getFavoritePostList();
    },
    // お気に入りの投稿を削除
    async deleteFavoritePost() {
      // お気に入りの投稿を削除
      await apiClient.delete(
        `/posts/${this.postId}/remove/favorite/${this.userId}/`
      );
      await this.getFavoritePostList();
    },
    // 投稿者のページへ移動
    moveToUserPage(id) {
      this.$router.push({
        name: "userView",
        params: { id },
      });
    },
    async getFavoritePostList() {
      const { data } = await apiClient.get(
        `/posts/favorite/user/${this.userId}/id/list/`
      );
      this.favoritePostList = data;
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
      this.isDisabled.updatePost = true;
      // 住所に変更がある場合
      if (
        this.editAddressData.postalCode !== this.post.address.postalCode ||
        this.editAddressData.townName !== this.post.address.townName ||
        this.editAddressData.buildingName !== this.post.address.buildingName
      ) {
        // バリデーションを実行
        await this.addressValidation(this.editAddressData).catch((err) => {
          this.isDisabled.updatePost = false;
          throw new Error(err);
        });
        const { data } = await apiClient.post(
          // 住所のIDを取得
          "/addresses/find/or/create/",
          this.editAddressData
        );
        this.editPostData.addressId = data.addressId;
      }

      // 投稿を編集
      await apiClient.patch(
        `/posts/update/${this.post.id}/`,
        this.editPostData
      );

      if (this.editCategory) {
        // 投稿のカテゴリーを全削除
        await apiClient.delete(`/posts/${this.post.id}/remove/categories/`);
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
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;

      // フラグを初期化
      this.editCategory = false;

      this.isEditingPost = false;
      this.isDisabled.updatePost = false;
    },
    // 回答を投稿する
    async postAnswer(answerData) {
      this.isDisabled.postAnswer = true;
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      // バリデーションメッセージを初期化
      this.answerValidations = [];

      // 回答のバリデーション
      if (!answerData.content) {
        this.answerValidations.push("回答を入力してください");
        this.isDisabled.postAnswer = false;
        return;
      }

      const params = {
        ...answerData,
        questionId: this.postId,
        respondentId: this.userId,
      };

      // 回答を作成
      await apiClient.post("/answers/create/", params);

      // 回答を更新
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;

      // 回答の編集用データを更新
      this.setEditAnswerData(this.post.answers);

      this.isDisabled.postAnswer = false;
    },
    // 投稿を削除
    deletePost() {
      this.isDisabled.deletePost = true;
      apiClient
        .delete(`/posts/delete/${this.post.id}/`)
        .then(() => {
          this.isDisabled.deletePost = false;
          this.$router.replace("/");
        })
        .catch(() => {
          this.isDisabled.deletePost = false;
        });
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
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;
    },
    // 回答のいいねを外す
    async dislike(answerId) {
      // いいねを削除
      await apiClient.delete(
        `/answers/remove/like/${answerId}/user/${this.userId}/`
      );

      // 回答を更新
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;
    },
    // 回答を編集
    async editAnswer(params, answerId) {
      this.isDisabled.editAnswer = true;

      this.editAnswerData[answerId].validations = [];
      if (!params.content) {
        this.editAnswerData[answerId].validations.push(
          "回答を入力してください"
        );
        this.isDisabled.editAnswer = false;
        return;
      }

      await apiClient.patch(`/answers/update/${answerId}/`, params);

      // 回答を更新
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;
      this.setEditAnswerData(this.post.answers);

      // 回答編集フォームを閉じる
      this.editAnswerData[answerId].isEditing = false;
      this.isDisabled.editAnswer = false;
    },
    // 回答を削除
    async deleteAnswer(answerId) {
      this.isDisabled.deleteAnswer = true;
      await apiClient.delete(`/answers/destroy/${answerId}/`);

      // 回答を更新
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;

      // 編集用データを削除
      delete this.editAnswerData[answerId];
      this.isDisabled.deleteAnswer = false;
    },
    // コメントを作成
    async createComment(answerId) {
      this.isDisabled.createComment = true;

      this.commentValidations = [];
      if (!this.newComments[answerId]) {
        this.commentValidations.push("コメントを入力してください");
        this.isDisabled.createComment = false;
        return;
      }

      const params = {
        content: this.newComments[answerId],
        authorId: this.userId,
        answerId,
      };
      await apiClient.post("/comments/create/", params);

      // 回答を更新
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;

      // 編集用データを更新
      this.setEditCommentData(this.post.answers);

      // コメントフォームを初期化
      this.newComments[answerId] = "";

      this.isDisabled.createComment = false;
    },
    async editComment(commentId) {
      this.isDisabled.editComment = true;
      this.editCommentData[commentId].validations = [];

      if (!this.editCommentData[commentId].content) {
        this.editCommentData[commentId].validations.push(
          "コメントを入力してください"
        );
        this.isDisabled.editComment = false;
        return;
      }

      const params = {
        content: this.editCommentData[commentId].content,
      };
      await apiClient.patch(`/comments/update/${commentId}/`, params);

      // 回答を更新
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;

      // フォームを閉じる
      this.editCommentData[commentId].isEditing = false;
      this.isDisabled.editComment = false;
    },
    async deleteComment(commentId) {
      this.isDisabled.deleteComment = true;
      await apiClient.delete(`/comments/delete/${commentId}/`);

      // 回答を更新
      const { data } = await apiClient.get(`/posts/post/${this.postId}/`);
      this.post = data;

      // 編集用データを削除
      delete this.editCommentData[commentId];
      this.isDisabled.deleteComment = false;
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
          evaluation: el.evaluation,
          validations: [],
        };
      });
    },
    // 回答の編集用データを取得
    getEditAnswerData(answerId) {
      return this.editAnswerData[answerId] || {};
    },
    postUserData(column) {
      return this.post.user?.[column];
    },
    answerUserData(answerData, column) {
      return answerData.user?.[column];
    },
    switchPostEditMode(boolean) {
      this.isEditingPost = boolean;
    },
    getPropertyMap() {
      let timer = setInterval(() => {
        if (window.google && this.post) {
          clearInterval(timer);
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: this.addressData(this.post) }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK) {
              const map = new window.google.maps.Map(this.$refs.map, {
                center: results[0].geometry.location,
                zoom: 15,
              });
              new window.google.maps.Marker({
                position: results[0].geometry.location,
                map,
              });
            } else {
              this.showMap = false;
            }
          });
        }
      }, 500);
    },
  },
  watch: {
    postId(val) {
      // サイドバーからページをpostIdを切り替えたとき
      apiClient.get(`/posts/post/${val}/`).then(({ data }) => {
        this.post = data; // 対象の投稿データをセット
        this.setEditCommentData(this.post.answers);
        this.setEditAnswerData(this.post.answers);

        // 編集用データ
        this.editPostData.title = data.title;
        this.editPostData.text = data.text;
        this.editPostData.property = data.property;
        this.editAddressData = { ...data.address };
        this.editCategoryData = [...data.categories];
        this.editAddressData.postalCodeA = this.postalCodeA(this.post);
        this.editAddressData.postalCodeB = this.postalCodeB(this.post);

        this.isEditingPost = false;
      });
    },
    isEditingPost(val) {
      if (!val) {
        this.getPropertyMap();
      }
    }
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
  border: 2px solid rgb(189, 187, 187);
  border-radius: 5px;
  background: white;
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

.block-content__textarea {
  margin: 20px 0;
}

.form-answer__block-btn {
  display: flex;
  justify-content: space-around;
}

/* 物件情報 */
.item-property--no_editing {
  border-top: 1px solid silver;
  padding: 10px 0 20px;
}

.item-property__title {
  margin: 5px 0 0;
}

.item-property__text {
  overflow-wrap: break-word;
  margin: 0;
  font-size: 0.9em;
}

.item-property__text--top_space {
  margin-top: 10px;
  font-size: 0.8em;
}

.item-property__postal-code {
  display: block;
}

.item-property__span {
  display: inline-block;
}

.item-property__map {
  width: 260px;
  height: 180px;
  margin-top: 10px;
  border: 1px solid gray;
  background: silver;
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
  padding: 5px 10px;
  background: rgba(165, 167, 165, 0.315);
  cursor: pointer;
}

.item-bottom__author:hover {
  filter: brightness(80%);
}

/* アイコン */
.block-icon,
.block-icon__img {
  width: 30px;
  height: 30px;
}

.block-icon {
  background: silver;
}

.block-icon__img {
  object-fit: cover;
}

/* ユーザー名 */
.item-bottom__username {
  min-width: 80px;
  max-width: 100px;
  margin: 0 0 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.form-answer__text {
  margin: 0;
  font-size: 0.8em;
  text-align: center;
}

.form-answer__text--answered {
  padding: 10px 0;
}

.form-answer__text--delete {
  display: flex;
}

.form-answer__title {
  margin: 30px 0 20px;
  padding-top: 10px;
  border-top: 1px solid rgb(173, 172, 172);
}

.form-answer__validation {
  margin: 0;
}

.block-radio {
  font-size: 0.8em;
}

.block-radio__help {
  font-size: 1.1em;
  margin: 10px 0 5px;
}

.block-radio__item + .block-radio__item {
  margin-left: 10px;
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

.block-evaluation__title {
  margin-bottom: 8px;
  color: gray;
  font-size: 0.8em;
}

.block-evaluation__icon {
  font-size: 1.8em;
}

.block-evaluation__item {
  display: flex;
  align-items: center;
}

.block-evaluation__item--good {
  color: rgb(255, 70, 70);
}

.block-evaluation__item--normal {
  color: rgb(128, 127, 127);
}

.block-evaluation__item--bad {
  color: rgb(29, 55, 202);
}

.block-evaluation__text {
  margin-left: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.block-rate {
  padding: 10px 0 15px;
}

.block-rate__title {
  margin: 0 0 10px;
  color: gray;
  font-size: 0.9em;
}

.block-rate__help {
  margin: 5px 0 0;
  color: rgb(85, 83, 83);
  font-size: 0.7em;
}

.item-rate {
  height: 20px;
  overflow: hidden;
  border-radius: 1.5em;
  background: silver;
}

.item-rate__span {
  display: inline-block;
  vertical-align: top;
  height: 100%;
}

.item-rate__span--good {
  background: rgb(255, 70, 70);
}

.item-rate__span--bad {
  background: rgb(29, 55, 202);
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

.form-comment__edit {
  display: flex;
  justify-content: flex-end;
}

.form-comment__validation {
  font-size: 0.8em;
}

.form-comment__btn-right {
  margin-left: 5px;
}

/* コメント表示欄 */
.item-comment__list {
  width: 95%;
  margin: 0 0 0 auto;
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
  display: inline-block;
  vertical-align: top;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

  .item-property__map {
    height: 200px;
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

  .block-content__updated-at {
    margin: 5px 0;
  }

  .container__item-post-details {
    padding-top: 0;
  }

  .item-property__map {
    width: 100%;
    height: 180px;
  }
}
</style>
