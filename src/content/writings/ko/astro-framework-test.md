---
slug: astro-framework-test
lang: ko
title: "ByteFuture Writings Astro 프레임워크 테스트"
summary: "이 내부 migration test는 기존 .html 링크를 유지하면서 Astro가 ByteFuture Writings 페이지를 생성할 수 있음을 확인합니다."
category: engineering
date: 2026-07-13
draft: false
---

이 migration test page는 Astro로 생성됩니다. 기존 ByteFuture Writings URL은 정적 사이트에서 그대로 복사되므로 공개된 링크는 계속 열립니다. 새 글은 Markdown 기반 framework로 점진적으로 옮길 수 있습니다.

## 프레임워크 목표

목표는 공개 URL을 바꾸는 것이 아닙니다. `/blog/try-claude-fable-5-in-codex-openclaw-and-pi.html` 같은 기존 링크를 유지하면서 새 글을 더 쉽게 관리하는 것입니다.

```bash
npm run build
npm run check:legacy-links
```
