<template>
  <div class="my_page">
    <!-- 背景 -->
    <div class="area_top_profile"></div>

    <div class="area_middle_profile">
      <div class="container">
        <div class="layout_2_div">
          <div class="left_profile">
            <!-- アイコン画像 -->
            <div class="icon">
              <img :src="anotherIconURL || iconURL" />
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
              <a class="btn_follow_user" v-show="!isYourFavoriteUser"
                >フォローする</a
              >
              <a class="btn_follow_user" v-show="isYourFavoriteUser"
                >フォローを解除</a
              >
            </div>
          </div>
        </div>

        <!-- 自己紹介 -->
        <div
          class="self_introduction"
          v-if="anotherIntroduction || selfIntroduction"
        >
          <p>{{ anotherIntroduction || selfIntroduction }}</p>
        </div>
      </div>
    </div>

    <div class="area_bottom_profile">
      <div class="container">
        <!-- ユーザーの投稿一覧 -->
        <section class="content_list">
          <div class="head_content_list">
            <p class="ttl">{{ contentListTitle[$route.name] }}</p>
          </div>

          <div
            :class="{ body_content_list: true, scroll_content_list: isScroll }"
          >
            <router-view />
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
              <a href="">フォローしているユーザー</a>
              <a href="">フォロワー</a>
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
    </div>

    <!-- モーダルウィンドウ -->
    <ModalWindow
      v-show="modalInfo.showWindow"
      :slotName="modalInfo.slotName"
      @close="closeWindow"
    >
      <!-- アカウント閉鎖 -->
      <template v-slot:deleteAccount>
        <div class="delete_account">
          <!-- タイトル -->
          <div class="top_modal">
            <p>アカウントを閉鎖する</p>
          </div>

          <!-- メッセージ＆フォーム -->
          <div class="middle_modal">
            <p>アカウントを閉鎖しますか？</p>
            <p class="warning_text">
              アカウントを閉鎖すると二度と復元できなくなります。
            </p>
            <p class="warning_text">投稿はすべて削除されます。</p>
            <p>閉鎖する場合は「完全に削除」と入力して下さい。</p>
            <input type="text" placeholder="完全に削除" v-model="deleteText" />
          </div>

          <!-- ボタン -->
          <div class="bottom_modal">
            <button @click.prevent="deleteAccount" :disabled="isDisabled">アカウントを閉鎖</button>
          </div>
        </div>
      </template>
    </ModalWindow>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ModalWindow from "@/components/ModalWindow";

export default {
  components: {
    ModalWindow,
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
      deleteText: '', // アカウント閉鎖確認用
      contentListTitle: {
        userView: '最新の投稿',
        authInfo: '認証情報',
        changePassword: 'パスワードの変更'
      },
    };
  },
  computed: {
    ...mapGetters("auth", [
      "userId",
      "username",
      "selfIntroduction",
      "favoriteUsers",
      "iconURL",
    ]),
    // ログインユーザーかどうか判定
    isMe() {
      if (this.userId === this.id) {
        return true;
      }
      return false;
    },
    // フォローしているユーザーか判定
    isYourFavoriteUser() {
      if (!this.isMe && this.favoriteUsers.includes(this.id)) {
        return true;
      }
      return false;
    },
    isScroll() {
      // コンテンツリストにスクロールバーを表示しないルート
      const notScrollRoutes = ["authInfo", 'changePassword'];

      // スクロールバーを表示しない場合
      if (notScrollRoutes.includes(this.$route.name)) {
        return false;
      }
      // スクロールバーを表示する場合
      return true;
    },
    isDisabled() {
      if (this.deleteText === '完全に削除') {
        return false;
      }
      return true;
    }
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
    // アカウント削除
    deleteAccount() {
      this.$store.dispatch('auth/delete').then(() => {
        // ホームページへ
        this.$router.replace('/');
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    // myPageOnlyがmetaにある場合
    if (to.matched.some(record => record.meta.myPageOnly)) {
      // マイページ内でしか洋画できないコンポーネントはURLからの直接のアクセスを禁止
      next('/');
    }
    next();
  }
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

/* ページ全体 */
.my_page {
  padding-bottom: 30px;
}

/* トップ部分 背景 */
.area_top_profile {
  height: 250px;
  padding-top: 50px;
  background: #cfcece;
}

/* ミドル部分 */
.area_middle_profile > .container {
  max-width: 1300px;
  margin: 0 auto;
  box-shadow: 0 3px 5px rgb(165, 164, 164);
  background: #fff;
}

.layout_2_div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
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
  margin: 10px 30px;
}

/* ユーザー名 */
.username {
  overflow: hidden;
  width: 100%;
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
}

.option_right_profile > a:hover {
  background: rgb(25, 47, 119);
}

/* 自己紹介 */
.self_introduction {
  padding: 10px 50px 30px;
  overflow-wrap: break-word;
}

/* ボトム部分 */
.area_bottom_profile > .container {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  max-width: 1200px;
  margin: 40px auto 0;
}

.area_bottom_profile > .container > * {
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
  max-height: 500px;
}

/* スクロールバー */
.scroll_content_list {
  overflow-y: scroll;
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

/* モーダルウィンドウ */
/* モーダルトップの題名部分 */
.top_modal {
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 20px;
  background: rgb(52, 52, 80);
  color: #fff;
  font-size: 1.5em;
}

/* モーダル中部の文章とインプット */
.middle_modal {
  margin-top: 30px;
}

.middle_modal > input {
  width: 70%;
  height: 40px;
  margin-top: 10px;
  padding-left: 10px;
  font-size: 1.1em;
}

/* 警告文 */
.warning_text {
  color: red;
  font-size: 0.9em;
}

.warning_text + .warning_text {
  margin-bottom: 50px;
}

/* モーダル下部のボタン */
.bottom_modal {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 30px;
  padding-right: 20px;
}

.bottom_modal > button {
  padding: 10px;
  border-color: #fff;
  border-radius: 8px;
  background: rgba(247, 18, 10, 0.829);
  color: #fff;
  font-size: 1.1em;
  cursor: pointer;
}

.bottom_modal > button[disabled] {
  background: rgba(241, 153, 150, 0.829);
} 
</style>