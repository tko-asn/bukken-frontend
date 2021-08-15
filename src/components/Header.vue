<template>
  <header>
    <div class="container">
      <!-- ロゴイメージ -->
      <div class="area_logo_header">
        <router-link class="logo" to="/"> ロゴ </router-link>
      </div>

      <!-- ナビゲーションメニュー -->
      <nav class="nav_header">
        <ul class="list_nav_header">
          <!-- ログイン済み -->
          <template v-if="isLoggedIn">
            <li class="area_account_navbar" @mouseleave="pullUp">
              <a href="" class="account" @click.prevent @mouseover="pullDown"
                >アカウント</a
              >

              <!-- プルダウンメニュー -->
              <ul ref="pull_down_block" class="pd_account" @mouseleave="pullUp">
                <li>
                  <router-link
                    :to="{ name: 'userView', params: { id: userId } }"
                    class="link_pull_down"
                    >マイページ</router-link
                  >
                </li>
                <li>
                  <router-link
                    :to="{ name: 'editProfile', params: { id: userId } }"
                    class="link_pull_down"
                    >プロフィール編集</router-link
                  >
                </li>
                <li>
                  <a href="" class="link_pull_down" @click.prevent="logout"
                    >ログアウト</a
                  >
                </li>
              </ul>
            </li>

            <!-- 投稿ボタン -->
            <li>
              <router-link class="btn_post" to="/post">投稿する</router-link>
            </li>
          </template>

          <!-- 未ログイン -->
          <template v-else>
            <li><router-link to="/signup">新規登録</router-link></li>
            <li><router-link to="/login">ログイン</router-link></li>
          </template>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "userId"]),
  },
  methods: {
    // プルダウンメニュー展開
    pullDown() {
      this.$refs.pull_down_block.style.display = "block";
    },
    // プルダウンメニュー縮小
    pullUp(event) {
      if (!event.toElement.closest(".pd_account")) {
        this.$refs.pull_down_block.style.display = "none";
      }
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
  },
};
</script>

<style scoped>
/* 基本設定 */
a {
  color: #fff;
  text-decoration: none;
}

a:hover {
  color: #b3aaaa;
}

ul {
  list-style: none;
}

/* ヘッダー全体 */
header {
  position: fixed;
  z-index: 10;
  width: 100%;
  background: #000;
  top: 0;
  left: 0;
}

header > .container {
  display: flex;
  align-items: center;
  height: 50px;
  margin: 0 auto;
  padding: 0 60px;
}

/* ロゴ */
.area_logo_header .logo {
  display: block;
}

/* .area_logo_header img {
  height: 60px;
} */

/* ヘッダーナビ */
.nav_header {
  /* 右詰め */
  margin: 0 0 0 auto;
}

.list_nav_header {
  display: flex;
  align-items: center;
  margin: 0 -15px;
}

.list_nav_header > li {
  padding: 0 15px;
}

/* プルダウンメニュー */
.area_account_navbar {
  position: relative;
}

.pd_account {
  position: absolute;
  left: 12px;
  display: none;
  width: 150px;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgb(82, 81, 81);
  border-radius: 4px;
  background: white;
}

/* プルダウンのボタン */
.link_pull_down {
  display: block;
  padding: 5px 10px;
  color: rgb(54, 53, 53);
}

.link_pull_down:hover {
  background: rgb(238, 235, 235);
  color: rgb(54, 53, 53);
}

/* 投稿ボタン */
.btn_post {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 20px;
  border-radius: 3px;
  box-shadow: 0 2px 2px 0 rgb(92, 88, 121);
  background: slateblue;
}

.btn_post:hover {
  background: rgb(127, 115, 207);
  color: #fff;
}

.btn_post:active {
  position: relative;
  box-shadow: none;
  background: rgb(81, 76, 119);
  color: #b3aaaa;
  top: 2px;
}
</style>