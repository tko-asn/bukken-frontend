<template>
  <!-- トップビュー -->
  <div class="area_top_view">
    <div class="container">

      <!-- 概要 -->
      <div class="head_top_view">
        <p class="ttl">地域要望アプリ</p>
      </div>

      <!-- ボタンエリア -->
      <div class="btnarea">

        <!-- ログイン済み -->
        <template v-if="isLoggedIn">
          <router-link class="btn_post" to="/post">投稿する</router-link>
        </template>

        <!-- 未ログイン -->
        <template v-else>
          <router-link class="btn_signup" to="/signup">新規登録</router-link>
          <router-link class="btn_login" to="/login">ログイン</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('auth', ['isLoggedIn'])
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

/* トップビュー */
.area_top_view {
  padding-top: 50px;
  background: navy;
}

.area_top_view > .container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1160px;
  height: 300px;
  margin: 0 auto;
}

/* 概要部分 */
.head_top_view {
  width: 100%;
  padding: 50px 0;
  text-align: center;
}

.ttl {
  color: #fff;
}

/* ボタンエリア */
.btnarea {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 30px 0 0;
}

.btnarea a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 0 15px;
  padding: 0 50px;
  border-radius: 5%;
  background: slateblue;
  box-shadow: 0 2px 2px 0 rgb(92, 88, 121);
}

.btnarea a:hover {
  background: rgb(127, 115, 207);
  color: #fff;
}

.btnarea a:active {
  position: relative;
  background: rgb(81, 76, 119);
  color: #b3aaaa;
  top: 2px;
  box-shadow: none;
}
</style>
