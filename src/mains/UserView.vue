<template>
  <div class="block-my-page">
    <div class="block-my-page__item-top">
      <div class="container">
        <div class="container__block-left">
          <!-- アイコン画像 -->
          <div class="item-icon">
            <img
              class="item-icon__img"
              :src="displayedIconURL"
              v-show="displayedIconURL"
            />
          </div>
        </div>

        <div class="container__block-right">
          <!-- ユーザー名 -->
          <p class="container__username">
            {{ displayedUsername }}
          </p>

          <!-- プロフィール編集ボタン -->
          <router-link
            class="container__btn"
            :to="{ name: 'editProfile' }"
            v-if="isMe"
            ><span class="container__btn--pc">プロフィールを</span>編集
          </router-link>

          <!-- フォローボタン -->
          <template v-else>
            <a
              href=""
              class="container__btn"
              v-show="!isYourFavoriteUser"
              @click.prevent="following"
              >フォロー<span class="container__btn--pc">する</span></a
            >
            <a
              href=""
              class="container__btn"
              v-show="isYourFavoriteUser"
              @click.prevent="unfollowing"
              ><span class="container__btn--pc">フォローを</span>解除</a
            >
          </template>
        </div>
      </div>
    </div>

    <div class="block-my-page__item-bottom">
      <div class="container container--space">
        <!-- コンテンツ -->
        <section class="container__section">
          <h2 class="container__title">
            <a
              href=""
              class="container__btn-menu"
              v-if="width < 1025"
              @click.prevent="showSideMenu = !showSideMenu"
            >
              <fa-icon class="container__icon-menu" icon="bars" />
            </a>
            {{ contentListTitle[$route.name] }}
          </h2>
          <div :class="{ 'item-content': true, container__scroll: isScroll }">
            <transition name="fade" mode="out-in" appear>
              <router-view
                :isMe="isMe"
                :userId="id"
                :follow="follow"
                :follower="follower"
                :selfIntroduction="displayedSelfIntroduction"
              />
            </transition>
          </div>
        </section>

        <!-- メニュー -->
        <transition name="slideLeft">
          <aside class="side-menu" v-show="showSideMenu || width >= 1025">
            <ul class="list">
              <li
                :class="{ list__item: true, 'list__link--active': item.open }"
                v-for="item in sideMenuList"
                :key="item.name"
                v-show="showMenuItem(item)"
              >
                <router-link
                  class="list__link"
                  :to="item.link"
                  v-if="item.link"
                >
                  {{ item.name }}
                </router-link>
                <a
                  href=""
                  class="list__link"
                  @click.prevent="pullDownMenu(item)"
                  v-else
                >
                  {{ item.name }}
                </a>
                <transition name="open">
                  <ul
                    class="list list--sub"
                    v-show="item.children && item.open"
                  >
                    <li
                      class="list__item"
                      v-for="child in item.children"
                      :key="child.name"
                    >
                      <router-link
                        class="list__link list__link--small"
                        :to="{ name: child.link.name }"
                        v-if="child.link"
                      >
                        {{ child.name }}
                      </router-link>
                      <a
                        href=""
                        class="list__link list__link--small"
                        @click.prevent="child.methodName"
                        v-else
                      >
                        {{ child.name }}
                      </a>
                    </li>
                  </ul>
                </transition>
              </li>
            </ul>
          </aside>
        </transition>
      </div>
    </div>

    <!-- モーダルウィンドウ -->
    <ModalWindow
      v-show="showWindow"
      :title="modalTitle"
      :closeWindow="closeWindow"
    >
      <!-- アカウント閉鎖 -->
      <DeleteAccount />
    </ModalWindow>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ModalWindow from "@/components/ModalWindow";
import DeleteAccount from "@/components/DeleteAccount";
import authInfoMixin from "@/mixins/authInfoMixin";
import apiClient from "@/axios";

export default {
  components: {
    ModalWindow,
    DeleteAccount,
  },
  props: {
    // URLのparam
    id: String,
  },
  data() {
    return {
      // テンプレートに表示する情報
      displayedUsername: "",
      displayedSelfIntroduction: "",
      displayedIconURL: "",
      // モーダルウィンドウの情報
      slotName: "", // 表示するモーダルウィンドウ
      modalTitle: "", // モーダルのタイトル
      showWindow: false, // モーダルウィンドウの表示・非表示
      contentListTitle: {
        userView: "プロフィール",
        authInfo: "認証情報",
        changePassword: "パスワードの変更",
        followList: "フォロー",
        followerList: "フォロワー",
      },
      width: window.innerWidth,
      showSideMenu: false,
      // サイドメニュー一覧
      sideMenuList: [
        {
          name: "ユーザーの投稿",
          myPageItem: false,
          link: {
            name: "userPosts",
            params: {
              userId: this.id,
            },
          },
        },
        {
          name: "フォロー",
          open: false, // 展開するメニューにのみ指定
          children: [
            {
              name: "フォローしているユーザー",
              link: {
                name: "followList",
              },
            },
            {
              name: "フォロワー",
              link: {
                name: "followerList",
              },
            },
          ],
        },
        {
          name: "プロフィール",
          myPageItem: false,
          link: {
            name: "userView",
          },
        },
        {
          name: "設定",
          open: false,
          myPageItem: true,
          children: [
            {
              name: "プロフィール",
              link: {
                name: "userView",
              },
            },
            {
              name: "プロフィール編集",
              link: {
                name: "editProfile",
              },
            },
            {
              name: "認証情報",
              link: {
                name: "authInfo",
              },
            },
            {
              name: "ログアウト",
              methodName: this.logout,
            },
            {
              name: "アカウントを閉鎖",
              methodName: this.showDeleteAccount,
            },
          ],
        },
      ],
    };
  },
  mixins: [authInfoMixin],
  computed: {
    // ログインユーザーのフォローしているユーザーのリスト
    ...mapGetters("follows", ["follow", "follower"]),
    // 自分のページかどうか判定
    isMe() {
      if (this.userId === this.id) {
        return true;
      }
      return false;
    },
    // フォローしているユーザーか判定
    isYourFavoriteUser() {
      if (!this.isMe && this.follow.find((el) => el.follow.id === this.id)) {
        return true;
      }
      return false;
    },
    isScroll() {
      // コンテンツリストにスクロールバーを表示しないルート
      const notScrollRoutes = ["authInfo", "changePassword"];

      // スクロールバーを表示しない場合
      if (notScrollRoutes.includes(this.$route.name)) {
        return false;
      }
      // スクロールバーを表示する場合
      return true;
    },
    userInfo() {
      // マイページではないときにユーザーの情報のオブジェクトを返す
      if (!this.isMe) {
        const userInfo = {
          id: this.id,
          username: this.displayedUsername,
          iconURL: this.displayedIconURL,
        };
        return userInfo;
      }
      return undefined;
    },
  },
  created() {
    // 他のユーザーの場合
    if (!this.isMe) {
      // ユーザーの情報を取得
      apiClient
        .get("/users/" + this.id + "/")
        .then(({ data }) => {
          this.displayedUsername = data.username;
          this.displayedSelfIntroduction = data.self_introduction;
          this.displayedIconURL = data.icon_url;
        })
        .catch((err) => Promise.reject(err));

      // ログインユーザー自身の情報をセット
    } else {
      this.displayedUsername = this.username;
      this.displayedSelfIntroduction = this.selfIntroduction;
      this.displayedIconURL = this.iconURL;
    }
  },
  mounted() {
    // 画面幅の変更を感知
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });
  },
  methods: {
    ...mapActions("follows", ["followUser", "unfollowUser"]),
    // サイドメニューの表示・非表示
    showMenuItem(item) {
      // フォローはマイページでもユーザーページでも表示
      if (item.name === "フォロー") {
        return true;
      }

      // マイページかどうか
      return this.isMe ? item.myPageItem : !item.myPageItem;
    },
    // メニューの開閉
    pullDownMenu(item) {
      // 展開できないメニューの場合
      if ("open" in item === false) {
        return;
      }

      // 展開できるメニューの場合
      item.open = !item.open;
    },
    // ログアウト
    logout() {
      this.$store.dispatch("auth/logout").then(() => {
        if (this.$route.path !== "/") {
          // ホームページへ遷移
          this.$router.push("/");
        }
      });
    },
    // モーダルウィンドウを閉じる
    closeWindow() {
      this.modalTitle = "";
      this.slotName = "";
      this.showWindow = false;
    },
    // アカウント閉鎖のモーダルウィンドウを表示
    showDeleteAccount() {
      this.slotName = "deleteAccount";
      this.modalTitle = "アカウントを閉鎖する";
      this.showWindow = true;
    },
    // ユーザーをフォロー
    following() {
      if (!this.isLoggedIn) {
        // ログインしていなければログインページへ
        this.$router.push("/login");
        return;
      }
      this.followUser(this.userInfo);
    },
    // ユーザーのフォローを解除
    unfollowing() {
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      // followリストからユーザーのidを使ってフォローデータを検索
      const targetObj = this.follow.find((el) => el.follow.id === this.id);

      this.unfollowUser(targetObj.id);
    },
  },
  beforeRouteEnter(to, from, next) {
    // myPageOnlyがmetaにある場合
    if (to.matched.some((record) => record.meta.myPageOnly)) {
      // マイページ内でしか洋画できないコンポーネントはURLからの直接のアクセスを禁止
      next("/");
    }
    next();
  },
  watch: {
    id(val) {
      // SP・タブレットの場合サイドメニューを閉じる
      this.showSideMenu = false;
      // 開いていたサイドメニューを閉じる
      this.sideMenuList.map((el) => (el.open = false));

      // ユーザーの投稿のidを変更
      this.sideMenuList[0].link.params.userId = val;

      // URLのidが更新されたとき
      if (!this.isMe) {
        // 自分以外のユーザーのidの場合
        apiClient
          .get("/users/" + val + "/")
          .then(({ data }) => {
            this.displayedUsername = data.username;
            this.displayedSelfIntroduction = data.self_introduction;
            this.displayedIconURL = data.icon_url;
          })
          .catch((err) => Promise.reject(err));

        // idがログインユーザー自身の場合
      } else {
        this.displayedUsername = this.username;
        this.displayedSelfIntroduction = this.selfIntroduction;
        this.displayedIconURL = this.iconURL;
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.showSideMenu = false;
    next();
  },
};
</script>

<style scoped>
/* 基本設定 */
a {
  color: #fff;
  text-decoration: none;
}

/* トップ部分 */
.block-my-page__item-top {
  width: 100%;
  padding: 80px 0 10px;
  box-shadow: 0 3px 5px rgb(165, 164, 164);
  background: #fff;
  animation: slideDown 0.8s;
}

/* コンテナ */
.container {
  display: flex;
  align-items: center;
  width: 70%;
  margin: 0 auto;
}

/* 子要素を両端に寄せるコンテナ */
.container--space {
  justify-content: space-around;
  align-items: flex-start;
}

/* プロフィールの左部分 */
.container__block-left {
  width: 200px;
  height: 200px;
}

/* アイコン画像 */
.item-icon {
  width: 100%;
  height: 100%;
  background: silver;
}

.item-icon__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* プロフィールの右部分 */
.container__block-right {
  margin: 10px 10%;
}

/* ユーザー名 */
.container__username {
  width: 100%;
  overflow: hidden;
  font-size: 1.7em;
  letter-spacing: 2px;
}

/* プロフィール編集・フォローボタン */
.container__btn {
  padding: 5px 30px;
  margin-top: 20px;
  border-radius: 3px;
  background: rgb(42, 85, 226);
  font-size: 1.08em;
  text-align: center;
}

.container__btn:hover {
  opacity: 0.6;
}

/* ボトム部分 */
.block-my-page__item-bottom {
  margin: 40px auto 0;
}

/* コンテンツのリスト */
.container__section {
  width: 60%;
  min-height: 90px;
  overflow: hidden;
  border: 3px solid gray;
  border-radius: 5px;
  animation: slideUp 0.8s;
}

.container__title {
  position: relative;
  font-size: 1.3em;
  text-align: center;
}

.container__btn-menu {
  position: absolute;
  left: 10px;
}

.container__icon-menu {
  color: gray;
}

.item-content {
  max-height: 300px;
  background: #fff;
}

/* スクロールバー */
.container__scroll {
  overflow-y: scroll;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(158, 154, 154, 0.781);
}

/* サイドメニュー */
.side-menu {
  position: sticky;
  width: 30%;
  border: 3px solid rgb(185, 181, 181);
  border-radius: 5px;
  background: rgb(156, 154, 154);
}

/* サイドメニューのリスト */
.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* リストのアイテム */
.list__link {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 20px;
}

.list__link:hover {
  background: rgb(177, 174, 174);
}

/* 選択されたアイテム */
.list__link--active {
  background: rgb(99, 106, 114);
}

/* ネストされたリスト */
.list__link--small {
  height: 50px;
  background: rgb(134, 131, 131);
}

/* アニメーション */
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-acitve {
  transition: opacity 0.3s;
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    transform: translateY(0);
  }
}

.open-enter-active {
  animation: open 0.2s ease-in;
}
.open-leave-active {
  animation: open 0.2s linear reverse;
}

.slideLeft-enter,
.slideLeft-leave-to {
  opacity: 0;
}

.slideLeft-enter-active {
  transition: opacity 0.2s;
  animation: slideLeft 0.2s;
}

.slideLeft-leave-active {
  transition: opacity 0.2s;
  animation: slideLeft 0.2s reverse;
}

@keyframes slideLeft {
  from {
    transform: translateX(500px);
  }
  to {
    transform: translateX(0);
  }
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    transform: translateY(0);
  }
}

@media screen and (max-width: 1024px) {
  .container {
    width: 70%;
  }

  .container__section {
    width: 90%;
  }

  .container__btn {
    padding: 5px 10px;
    font-size: 0.9em;
  }

  .container__btn--pc {
    display: none;
  }

  .side-menu {
    position: fixed;
    right: 50px;
    width: 30%;
    z-index: 20;
  }

  .list--sub {
    max-height: 160px;
    overflow-y: scroll;
  }
}

@media screen and (max-width: 599px) {
  .container {
    width: 95%;
  }

  .container__block-left {
    width: 140px;
    height: 140px;
  }

  .side-menu {
    right: 20px;
    width: 70%;
  }

  .list__link {
    height: 50px;
  }
}
</style>