# 玉龍山 延命院 ホームページ（生成画像使用版）

東京都台東区元浅草にある **玉龍山 延命院** の静的ホームページです。

## 特徴

- 生成した背景画像（WebP）をそのまま使用したバージョン
- `assets/images/enmeiin-hero.webp` をヒーロー背景に使用
- `assets/images/enmeiin-washi.webp` を全体・和紙背景に使用
- `assets/images/enmeiin-cta.webp` をCTAや暗めのカード背景に使用
- `backgrounds.css` で背景画像の適用を管理

## 公開URL

GitHub Pages が有効になると、以下のURLで公開されます。

https://gakushuin.github.io/enmeiin/

## ファイル構成

- `index.html`：トップページ本体
- `style.css`：共通デザイン
- `backgrounds.css`：生成画像背景の適用
- `script.js`：スマホメニュー、スクロール演出、現在地ナビ、ページ上部へ戻るボタン
- `robots.txt`：検索エンジン向けクロール設定
- `sitemap.xml`：サイトマップ
- `.github/workflows/pages.yml`：GitHub Pages公開用ワークフロー
- `assets/images/*.webp`：生成画像
