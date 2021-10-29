# bukken-frontend

## アプリの概要
マンションやアパートなどの特定の物件について気になっていることを質問できる物件専用質問アプリ

## 機能一覧
- 質問
  - 一覧表示機能
  - 詳細表示機能
  - 作成機能
  - 編集機能
  - 削除機能
- 回答
  - 一覧表示機能
  - 作成機能
  - 編集機能
  - 削除機能
- コメント
  - 一覧表示機能
  - 作成機能
  - 編集機能
  - 削除機能
- ユーザー
  - 詳細表示機能
  - 作成機能
  - 編集機能
  - 削除機能
- 認証機能
- ページネーション機能
- 画像アップロード機能
- アニメーション機能
- 質問をお気に入りに登録する機能
- 質問のフィルタリング・検索機能
- 回答に「いいね」をつける機能
- ユーザーをフォローする機能

## 使用技術
- HTML/CSS
- JavaScript
- Vue.js 2.6.14

## インフラ
- AWS
  - CloudFront
  - S3
  - Route 53
  - AWS Certificate Manager
  - AWS CodePipeline
  - AWS CodeBuild

## テストログインアカウント
- ユーザー名: test01
- パスワード: test01-pass

## アプリURL
https://prod.bukken-question.com/

## APIのURL
https://github.com/tko-asn/bukken-api

## 作成した目的
物件選びの際に物件に関する詳しい情報を得ることができず、実際に住んでみて想像していた環境と違ったというパターンが引越しの際にはあると思います。
そんなときに実際にその物件に住んでいる人に聞きたいことを質問できるようなアプリがあれば物件選びが楽になるのではないかと考え、こちらのアプリを作成しました。

## 使い方
#### トップ画面
###### ログインしていない場合
![image](https://user-images.githubusercontent.com/83702606/139508131-5131624a-e1af-4134-99e8-173f80c5c52a.png)

###### ログイン済みの場合
![image](https://user-images.githubusercontent.com/83702606/139508804-aafe95a4-e742-4b8b-9685-cab4f37188b7.png)

- 質問一覧が表示されます
- サイドメニューから質問の種類を選択することで、各種の質問一覧を閲覧できます
- ヘッダーの検索バーから質問を検索できます
- 上部のフィルターから質問をフィルタリングできます
- サイドメニューのフッターの「サイト概要」からサイトの概要を閲覧できます
- サイドメニューの「フォロー」から以下のユーザーのリストを閲覧できます
  - フォローしているユーザー
  - フォロワー

#### 質問詳細画面
###### ログインしていない場合
![image](https://user-images.githubusercontent.com/83702606/139509502-f7d46102-07c9-4b63-9c4c-54a49d0e2222.png)

![image](https://user-images.githubusercontent.com/83702606/139508223-71a3763d-c964-4fbb-a855-02533f1c82cb.png)

###### ログイン済みの場合
![image](https://user-images.githubusercontent.com/83702606/139509364-82951b83-b08a-4781-9e65-b4aa6bce7f5e.png)

![image](https://user-images.githubusercontent.com/83702606/139509396-f36509e5-c7b6-44a0-bd14-92dec46f4aa0.png)

- 質問の詳細情報を閲覧できます
- 「地図を表示」のリンクから質問対象の物件の所在地を地図で確認できます
- 質問下部のボタンから質問をお気に入りに登録できます
- 質問下部のユーザー表示部分からユーザーのページに移動できます
- ログインユーザー自身の質問であれば質問を編集・削除できます
- 他のユーザーの質問であればユーザー1人につき1回ずつ回答できます
- 回答がログインユーザー自身のものであれば編集・削除できます
- 回答には「いいね」をつけることができます
- サイドメニューには最新の質問10件が表示されており、それぞれの質問の詳細画面に移動できます
- 以下の条件を満たす場合回答へのコメントを作成・編集・削除することができます
  - 質問がログインユーザー自身のものである場合
  - コメントのついた回答がログインユーザー自身のものである場合

#### 質問投稿画面
![image](https://user-images.githubusercontent.com/83702606/139508293-47acd492-54d8-41e7-8db0-b199eee2a07c.png)

![image](https://user-images.githubusercontent.com/83702606/139508316-b56da300-3b3a-4180-99aa-509d36b4c370.png)

- 以下の情報を入力することで質問を作成できます
  - タイトル（必須）
  - 質問対象の物件名（必須）
  - 質問内容
  - 対象物件の所在地（必須）
  - 質問のカテゴリー

#### ユーザー表示画面
###### マイページ
![image](https://user-images.githubusercontent.com/83702606/139509240-a8284187-29e7-47e2-8a8d-ca9a5c6fe7c8.png)

メニュー

![image](https://user-images.githubusercontent.com/83702606/139508423-10e8b02c-7e4a-4332-a4f7-ef2bcedf92cd.png)

###### 他のユーザーのページ
![image](https://user-images.githubusercontent.com/83702606/139508495-e63ebe67-8757-44e1-826c-b1c289bd64d6.png)

メニュー

![image](https://user-images.githubusercontent.com/83702606/139508529-ed87d5aa-9059-4d31-8c49-4e1d69ddf2ee.png)

- ユーザーの以下の情報を閲覧できます
  - ユーザーアイコン
  - ユーザー名
  - プロフィール
  - ユーザーのフォローしているユーザー
  - ユーザーのフォロワー
  - メールアドレス（マイページの場合）
- マイページの場合以下の機能が利用できます
  - プロフィール編集機能
  - メールアドレス変更機能
  - パスワード変更機能
  - ログアウト機能
  - アカウント削除機能
- 他のユーザーのページの場合以下の機能が利用できます
  - フォロー機能
  - ユーザーの質問表示機能（ユーザーの質問画面に移動）

#### ユーザーの質問画面
![image](https://user-images.githubusercontent.com/83702606/139509290-085e9494-7ebf-4a91-a713-7745faaf6c02.png)

- ユーザーの質問一覧が閲覧できます
- ヘッダーの検索バーから質問を検索できます
- 上部のフィルターからユーザーの質問をフィルタリングできます

#### ユーザー編集画面
![image](https://user-images.githubusercontent.com/83702606/139508605-187ef3b6-34f6-4659-845a-494a337a80bf.png)

![image](https://user-images.githubusercontent.com/83702606/139508649-404c9698-db31-421a-80e6-5fb4735403d4.png)

- ユーザーの以下の情報を編集できます
  - ユーザー名
  - ユーザーアイコン
  - 自己紹介

#### ログイン画面
![image](https://user-images.githubusercontent.com/83702606/139508687-debceead-937f-4f99-a93f-a6b25b7a408e.png)

- 以下の情報でログインできます
  - ユーザー名またはメールアドレス
  - パスワード
 
#### 新規登録画面
![image](https://user-images.githubusercontent.com/83702606/139508706-115a0694-4d81-4462-adca-12297309996b.png)

- 以下の情報でサインアップできます
  - ユーザー名
  - メールアドレス
  - パスワード
  - 確認用パスワード
