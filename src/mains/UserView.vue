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
            >プロフィールを編集
          </router-link>

          <!-- フォローボタン -->
          <template v-else>
            <a
              href=""
              class="container__btn"
              v-show="!isYourFavoriteUser"
              @click.prevent="followUser"
              >フォローする</a
            >
            <a
              href=""
              class="container__btn"
              v-show="isYourFavoriteUser"
              @click.prevent="unfollowUser"
              >フォローを解除</a
            >
          </template>
        </div>
      </div>
    </div>

    <div class="block-my-page__item-bottom">
      <div class="container container--space">
        <!-- コンテンツ -->
        <section class="container__section">
          <h2 class="container__title">{{ contentListTitle[$route.name] }}</h2>
          <div :class="{ 'item-content': true, container__scroll: isScroll }">
            <router-view
              :isMe="isMe"
              :userId="id"
              :follow="follow"
              :follower="follower"
              :selfIntroduction="displayedSelfIntroduction"
            />
          </div>
        </section>

        <!-- メニュー -->
        <aside class="side-menu">
          <ul class="list">
            <li
              :class="{ list__item: true, 'list__link--active': item.open }"
              v-for="item in sideMenuList"
              :key="item.name"
              v-show="showMenuItem(item)"
            >
              <router-link
                class="list__link"
                :to="{ name: item.link.name }"
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
              <ul class="list" v-show="item.children && item.open">
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
            </li>
          </ul>
        </aside>
      </div>
    </div>

    <!-- モーダルウィンドウ -->
    <ModalWindow
      v-show="modalInfo.showWindow"
      :slotName="modalInfo.slotName"
      @close="closeWindow"
    >
      <!-- アカウント閉鎖 -->
      <template v-slot:deleteAccount>
        <DeleteAccount />
      </template>
    </ModalWindow>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalWindow from "@/components/ModalWindow";
import DeleteAccount from "@/components/DeleteAccount";

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
      modalInfo: {
        slotName: "", // 表示するモーダルウィンドウ
        showWindow: false, // モーダルウィンドウの表示・非表示
      },
      contentListTitle: {
        userView: "プロフィール",
        authInfo: "認証情報",
        changePassword: "パスワードの変更",
        followList: "フォロー",
        followerList: "フォロワー",
      },
      // サイドメニュー一覧
      sideMenuList: [
        {
          name: "ユーザーの投稿",
          myPageItem: false, 
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
  computed: {
    ...mapGetters("auth", [
      // ログインユーザーの認証情報・プロフィール
      "isLoggedIn",
      "userId",
      "username",
      "selfIntroduction",
      "iconURL",
    ]),
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
      this.$store.dispatch("users/retrieve", this.id).then((response) => {
        this.displayedUsername = response.data.username;
        this.displayedSelfIntroduction = response.data.self_introduction;
        this.displayedIconURL = response.data.icon_url;
      });

      // ログインユーザー自身の情報をセット
    } else {
      this.displayedUsername = this.username;
      this.displayedSelfIntroduction = this.selfIntroduction;
      this.displayedIconURL = this.iconURL;
    }
  },
  methods: {
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
      this.modalInfo.slotName = "";
      this.modalInfo.showWindow = false;
    },
    // アカウント閉鎖のモーダルウィンドウを表示
    showDeleteAccount() {
      this.modalInfo = {
        slotName: "deleteAccount",
        showWindow: true,
      };
    },
    // ユーザーをフォロー
    followUser() {
      if (!this.isLoggedIn) {
        // ログインしていなければログインページへ
        this.$router.push("/login");
        return;
      }
      this.$store.dispatch("follows/followUser", this.userInfo);
    },
    // ユーザーのフォローを解除
    unfollowUser() {
      if (!this.isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      // followリストからユーザーのidを使ってフォローデータを検索
      const targetObj = this.follow.find((el) => el.follow.id === this.id);

      this.$store.dispatch("follows/unfollowUser", targetObj.id);
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
      // 開いていたサイドメニューを閉じる
      this.sideMenuList.map((el) => (el.open = false));

      // URLのidが更新されたとき
      if (!this.isMe) {
        // 自分以外のユーザーのidの場合
        this.$store.dispatch("users/retrieve", val).then((response) => {
          this.displayedUsername = response.data.username;
          this.displayedSelfIntroduction = response.data.self_introduction;
          this.displayedIconURL = response.data.icon_url;
        });

        // idがログインユーザー自身の場合
      } else {
        this.displayedUsername = this.username;
        this.displayedSelfIntroduction = this.selfIntroduction;
        this.displayedIconURL = this.iconURL;
      }
    },
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
}

/* コンテナ */
.container {
  display: flex;
  align-items: center;
  width: 80%;
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
}

.container__title {
  font-size: 1.3em;
  text-align: center;
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
  width: 25%;
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
  background: rgb(64, 79, 94);
}

/* ネストされたリスト */
.list__link--small {
  height: 50px;
  background: rgb(134, 131, 131);
}
</style>