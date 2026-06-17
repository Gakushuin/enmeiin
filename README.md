# 玉龍山 延命院 ホームページ

東京都台東区元浅草にある **玉龍山 延命院** の静的ホームページです。

## 公開URL

GitHub Pages が有効になると、以下のURLで公開されます。

https://gakushuin.github.io/enmeiin/

## 連絡先

- 電話：03-3841-7122
- メール：enmeiin51@gmail.com
- 公式LINE：https://line.me/R/ti/p/@438hohjk

## ファイル構成

- `index.html`：トップページ本体、SEO設定、構造化データ
- `style.css`：デザイン、レスポンシブ対応、スマホ固定問い合わせボタン
- `script.js`：スマホ用メニュー、スクロール演出、現在地ナビ、ページ上部へ戻るボタン
- `robots.txt`：検索エンジン向けクロール設定
- `sitemap.xml`：サイトマップ
- `.github/workflows/pages.yml`：GitHub Pages公開用ワークフロー

## デザイン方針

実際のお寺の写真と誤解される外部写真素材は使わず、和紙・金茶・墨色を基調にしたグラデーション、余白、カード型レイアウト、CSS装飾で、公式サイトとして落ち着いた印象になるようにしています。

## 今回の改善ポイント

- ファーストビューを寺院サイトらしく再設計
- 法要・ご供養・墓地・納骨・札所参拝の導線を整理
- FAQ、参拝・ご相談の流れ、スマホ固定問い合わせを追加
- メタタグ、OGP、canonical、JSON-LD、robots、sitemap を追加
- スマホメニュー、現在地ナビ、スクロール演出、ページ上部へ戻るボタンを追加
- アクセシビリティを考慮し、スキップリンク・ARIA属性・キーボード操作に対応

## GitHub Pages の設定

このリポジトリには GitHub Actions 用の公開設定を入れています。

公開されない場合は、GitHub のリポジトリ画面で以下を確認してください。

1. `Settings` を開く
2. 左メニューの `Pages` を開く
3. `Build and deployment` の `Source` を `GitHub Actions` にする
4. `Actions` タブで `Deploy static site to Pages` が成功しているか確認する

## 編集方法

文章を変える場合は `index.html`、見た目を変える場合は `style.css`、動きやスマホメニューを変える場合は `script.js` を編集してください。
