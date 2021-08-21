<template>
  <div class="my_page">
    <div class="area_head_profile">
      <div class="container">
        <div class="layout_2_div">
          <div class="left_profile">
            <!-- アイコン画像 -->
            <div class="icon">
              <img
                :src="anotherIconURL || iconURL"
                v-show="anotherIconURL || iconURL"
              />
            </div>
          </div>

          <div class="right_profile">
            <!-- ユーザー名 -->
            <div class="username">
              <p>
                {{ anotherUsername || username }}
              </p>
            </div>

            <!-- プロフィール編集ボタン -->
            <div class="option_right_profile" v-if="isMe">
              <router-link
                class="btn_edit_profile"
                :to="{ name: 'editProfile' }"
                >プロフィールを編集</router-link
              >
            </div>

            <!-- フォローボタン -->
            <div class="option_right_profile" v-else>
              <a
                class="btn_follow_user"
                v-show="!isYourFavoriteUser"
                @click="followUser"
                >フォローする</a
              >
              <a
                class="btn_follow_user"
                v-show="isYourFavoriteUser"
                @click="unfollowUser"
                >フォローを解除</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="area_body_profile">
      <!-- ユーザーの投稿一覧 -->
      <section class="content_list">
        <div class="head_content_list">
          <p class="ttl">{{ contentListTitle[$route.name] }}</p>
        </div>

        <div
          :class="{ body_content_list: true, scroll_content_list: isScroll }"
        >
          <router-view
            :isMe="isMe"
            :userId="id"
            :follow="follow"
            :follower="follower"
            :selfIntroduction="anotherIntroduction || selfIntroduction"
          />
        </div>
      </section>

      <!-- メニュー -->
      <aside class="side_menu">
        <!-- 投稿一覧 -->
        <div>
          <!-- マイページの場合 -->
          <template v-if="isMe">
            <a
              href=""
              class="ttl"
              @click.prevent="openSideMenu('posts', $event)"
              >投稿一覧</a
            >
            <div id="" class="item_posts" v-show="items.posts">
              <a href="">自分の投稿</a>
              <a href="">お気に入りの投稿</a>
            </div>
          </template>

          <!-- ログインユーザー以外の場合 -->
          <template v-else>
            <a href="" class="ttl" @click.prevent="openSideMenu('posts')"
              >ユーザーの投稿</a
            >
          </template>
        </div>

        <!-- フォロー -->
        <div>
          <a
            href=""
            class="ttl"
            @click.prevent="openSideMenu('following', $event)"
            >フォロー</a
          >
          <div id="" class="item_following" v-show="items.following">
            <router-link :to="{ name: 'followList' }"
              >フォローしているユーザー</router-link
            >
            <router-link :to="{ name: 'followerList' }">フォロワー</router-link>
          </div>
        </div>

        <!-- 設定 -->
        <div v-if="isMe">
          <a
            href=""
            class="ttl"
            @click.prevent="openSideMenu('settings', $event)"
            >設定</a
          >
          <div id="" class="item_settings" v-show="items.settings">
            <router-link :to="{ name: 'editProfile' }"
              >プロフィール編集</router-link
            >
            <router-link :to="{ name: 'authInfo' }">認証情報</router-link>
            <a href="" @click.prevent="logout">ログアウト</a>
            <a href="" @click.prevent="showDeleteAccount">アカウントを閉鎖</a>
          </div>
        </div>
      </aside>
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
      // ログインユーザー以外のユーザーの情報
      anotherUsername: "",
      anotherIntroduction: "",
      anotherIconURL: "",
      // サイドメニューのv-show用boolean
      items: {
        posts: false,
        following: false,
        settings: false,
      },
      // モーダルウィンドウの情報
      modalInfo: {
        slotName: "", // 表示するモーダルウィンドウ
        showWindow: false, // モーダルウィンドウの表示・非表示
      },
      // deleteText: "", // アカウント閉鎖確認用
      contentListTitle: {
        userView: "プロフィール",
        authInfo: "認証情報",
        changePassword: "パスワードの変更",
        followList: "フォロー",
        followerList: "フォロワー",
      },
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
    // ログインユーザーかどうか判定
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
          username: this.anotherUsername,
          iconURL: this.anotherIconURL,
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
        this.anotherUsername = response.data.username;
        this.anotherIntroduction = response.data.self_introduction;
        this.anotherIconURL = response.data.icon_url;
      });
    }
  },
  methods: {
    // サイドメニューのアイテムを開閉
    openSideMenu(itemName, event) {
      if (event) {
        event.target.classList.toggle("active_side_menu");
      }
      this.items[itemName] = !this.items[itemName];
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
      // URLのidが更新されたとき
      if (!this.isMe) {
        // 自分以外のユーザーのidの場合
        this.$store.dispatch("users/retrieve", val).then((response) => {
          this.anotherUsername = response.data.username;
          this.anotherIntroduction = response.data.self_introduction;
          this.anotherIconURL = response.data.icon_url;
        });
      } else {
        // idがログインユーザー自身のものの場合
        this.anotherUsername = "";
        this.anotherIntroduction = "";
        this.anotherIconURL = "";
      }
    },
  },
};
</script>

<style scoped>
/* 基本設定 */
a {
  display: block;
  color: #fff;
  text-decoration: none;
}

p {
  margin: 0;
}

.container {
  width: 90%;
  margin: 0 auto;
}

/* ページ全体 */
.my_page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0 auto;
}

/* ミドル部分 */
.area_head_profile {
  width: 100%;
  padding: 80px 0 10px;
  box-shadow: 0 3px 5px rgb(165, 164, 164);
  background: #fff;
}

.layout_2_div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

/* プロフィールの左部分 */
.left_profile {
  width: 200px;
  height: 200px;
}

.left_profile > div {
  width: 100%;
  text-align: center;
}

/* アイコン画像 */
.icon {
  width: 100%;
  height: 100%;
  background: silver;
}

.icon > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* プロフィールの右部分 */
.right_profile {
  width: 600px;
  margin: 10px 10%;
}

/* ユーザー名 */
.username {
  width: 100%;
  overflow: hidden;
  font-size: 1.7em;
  letter-spacing: 2px;
}

/* プロフィール編集ボタン */
.option_right_profile {
  margin-top: 20px;
}

.option_right_profile > a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 35px;
  border-radius: 3px;
  background: rgb(42, 85, 226);
  font-size: 1.08em;
  cursor: pointer;
}

.option_right_profile > a:hover {
  background: rgb(25, 47, 119);
}

/* ボトム部分 */
.area_body_profile {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  width: 95%;
  margin: 40px auto 0;
}

.area_body_profile > * {
  box-shadow: 0 5px 5px rgb(165, 164, 164);
}

/* コンテントリストの見出し */
.head_content_list {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-weight: bold;
}

/* セクションのタイトル */
.ttl {
  color: #fff;
  font-size: 1.1em;
  letter-spacing: 3px;
}

/* コンテンツのリスト */
.content_list {
  width: 60%;
  min-height: 90px;
  overflow: hidden;
  border-radius: 5px;
}

.head_content_list {
  background: rgb(139, 140, 146);
}

.body_content_list {
  max-height: 300px;
}

/* スクロールバー */
.scroll_content_list {
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
.side_menu {
  position: sticky;
  width: 25%;
  background: rgb(25, 31, 156);
}

/* サイドメニューアイテム */
.side_menu > div + div {
  border-top: 1px solid #fff;
}

.side_menu a {
  display: flex;
  align-items: center;
  height: 70px;
  padding-left: 20px;
  color: #fff;
}

.side_menu a:hover {
  background: rgb(36, 45, 218);
}

.active_side_menu {
  background: rgb(12, 15, 71);
}

[class*="item"] > a {
  height: 50px;
  border-top: 1px solid rgb(151, 146, 146);
  background: rgb(65, 72, 204);
}

[class*="item"] > a:hover {
  background: rgb(36, 41, 138);
}
</style>