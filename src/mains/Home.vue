<template>
  <main>
    <!-- トップビュー -->
    <TopView />

    <!-- ボディー部分 -->
    <div class="body_home">
      <div class="container">
        <div class="layout_2_section">

          <!-- 最新の投稿 -->
          <section class="post_list">
            <div class="head_section">
              <h3 class="ttl">最新の投稿</h3>
            </div>
            <div class="body_section">
              <PostList />
            </div>
          </section>

          <!-- サイドバー -->
          <section class="side_bar">
            <div class="head_section">
              <h3 class="ttl">メニュー</h3>
            </div>
            <div class="body_section"></div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import TopView from "@/components/TopView";
import PostList from "@/components/PostList";

export default {
  components: {
    TopView,
    PostList,
  },
};
</script>

<style scoped>
/* ボディー部分 */
.body_home {
  min-height: 300px;
  margin: 20px 0 0;
  color: #fff;
}

.body_home > .container {
  max-width: 1160px;
  margin: 0 auto;
}

/* 二分割レイアウト */
.layout_2_section {
  display: flex;
  min-height: 300px;
}

/* セクション */
.head_section {
  display: flex;
  justify-content: center;
}

.body_section {
  width: 90%;
  margin: 0 auto;
}

/* 最新の投稿 */
.post_list {
  width: 70%;
  padding: 0 0 100px;
  background: navajowhite;
}

/* サイドバー */
.side_bar {
  width: 30%;
  margin: 0 0 0 15px;
  background: blue;
}

/* タイトル */
.layout_2_section .ttl {
  position: relative;
  font-size: 1.6em;
}

.layout_2_section .ttl:after {
  content: "";
  display: block;
  width: 100%;
  height: 5px;
  background: rgb(233, 88, 177);
}
</style>