---
slug: astro-framework-test
lang: zh
title: "ByteFuture Writings 的 Astro 框架测试"
summary: "这个内部迁移测试证明 Astro 可以生成 ByteFuture Writings 页面，同时旧的 .html 链接继续可访问。"
category: engineering
date: 2026-07-13
draft: false
---

这个迁移测试页由 Astro 生成。现有 ByteFuture Writings URL 仍然从静态站复制出来，所以已发布链接会继续打开，新文章则可以逐步迁移到 Markdown 框架。

## 框架目标

目标不是改变公开 URL，而是在保留 `/blog/try-claude-fable-5-in-codex-openclaw-and-pi.html` 这类旧链接的同时，让新文章更容易维护。

```bash
npm run build
npm run check:legacy-links
```
