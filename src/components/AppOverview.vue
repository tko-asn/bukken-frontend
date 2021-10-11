<template>
  <div class="app-overview">
    <span class="app-overview__paragraph">
      <span class="app-overview__text">当サイトは</span>
      <span class="app-overview__text">気になっている</span>
      <span class="app-overview__text">物件について</span>
      <span class="app-overview__text">質問できる</span>
      <span class="app-overview__text">物件質問アプリです。</span>
    </span>
    <span class="app-overview__paragraph">
      <span class="app-overview__text">物件について</span>
      <span class="app-overview__text">知りたいことを</span>
      <span class="app-overview__text">居住者に</span>
      <span class="app-overview__text">ピンポイントで</span>
      <span class="app-overview__text">質問できます。</span>
    </span>
    <span class="app-overview__paragraph">
      <hr />
      以下は質問の例です。
      <p class="app-overview__text app-overview__text--red">
        ・物件の周辺環境の治安
      </p>
      <p class="app-overview__text app-overview__text--red">
        ・物件の防音性について
      </p>
      <p class="app-overview__text app-overview__text--red">
        ・近所付き合いの有無
      </p>
      <hr />
    </span>
    <span class="app-overview__paragraph">
      <span class="app-overview__text">賃貸物件サイトや内見では</span>
      <span class="app-overview__text">知ることができないような</span>
      <span class="app-overview__text">疑問がありましたら</span>
      <span class="app-overview__text">当サイトで</span>
      <span class="app-overview__text">さっそく質問して</span>
      <span class="app-overview__text">みましょう。</span>
    </span>
  </div>
</template>

<style scoped>
.app-overview__text {
  margin: 10px 0;
}

.app-overview__paragraph,
.app-overview__text {
  display: inline-block;
}

.app-overview__paragraph {
  margin-bottom: 15px;
}

.app-overview__text--red {
  display: block;
  color: red;
  font-size: 0.9em;
}
</style>