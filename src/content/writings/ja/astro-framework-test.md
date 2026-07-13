---
slug: astro-framework-test
lang: ja
title: "ByteFuture Writings の Astro フレームワークテスト"
summary: "この内部 migration test は、既存の .html リンクを保ったまま Astro が ByteFuture Writings ページを生成できることを確認します。"
category: engineering
date: 2026-07-13
draft: false
---

この migration test page は Astro で生成されています。既存の ByteFuture Writings URL は静的サイトからそのままコピーされるため、公開済みリンクは引き続き開けます。新しい記事は Markdown ベースの framework に移行できます。

## フレームワークの目的

目的は公開 URL を変えることではありません。`/blog/try-claude-fable-5-in-codex-openclaw-and-pi.html` のような既存リンクを保ちながら、新しい記事を保守しやすくすることです。

```bash
npm run build
npm run check:legacy-links
```
