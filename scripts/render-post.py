#!/usr/bin/env python3
"""Render ByteFuture Writings posts from Markdown source.

Usage:
  python3 scripts/render-post.py content/posts/en/<slug>.md

Requires sibling localized Markdown files:
  content/posts/{en,zh,ja,ko}/<slug>.md

This intentionally uses only Python stdlib so GitHub Pages authors do not need a JS build stack.
"""
from __future__ import annotations

import html
import json
import re
import sys
from datetime import date, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "blog" / "use-any-model-in-claude-code-through-token-station.html"
LANGS = {
    "en": {"suffix": "", "html_lang": "en", "og_locale": "en_US", "posts": "posts.json", "writings": "Writings", "all": "All writings", "recent": "Recent", "topics": "Topics", "share": "Share this post"},
    "zh": {"suffix": "-zh", "html_lang": "zh-Hans", "og_locale": "zh_CN", "posts": "posts-zh.json", "writings": "文章", "all": "所有文章", "recent": "最新", "topics": "主题", "share": "分享文章"},
    "ja": {"suffix": "-ja", "html_lang": "ja", "og_locale": "ja_JP", "posts": "posts-ja.json", "writings": "記事", "all": "すべての記事", "recent": "最新", "topics": "トピック", "share": "この記事を共有"},
    "ko": {"suffix": "-ko", "html_lang": "ko", "og_locale": "ko_KR", "posts": "posts-ko.json", "writings": "글", "all": "모든 글", "recent": "최근", "topics": "주제", "share": "글 공유"},
}
CATEGORY_LABELS = {
    "en": {"model-launches": "Model Launches", "tutorial": "Tutorial", "research": "Research"},
    "zh": {"model-launches": "模型发布", "tutorial": "教程", "research": "研究"},
    "ja": {"model-launches": "モデル発表", "tutorial": "チュートリアル", "research": "リサーチ"},
    "ko": {"model-launches": "모델 출시", "tutorial": "튜토리얼", "research": "리서치"},
}


def parse_frontmatter(text: str):
    if not text.startswith("---\n"):
        raise SystemExit("Markdown must start with YAML-like frontmatter")
    _, fm, body = text.split("---\n", 2)
    meta = {}
    for raw in fm.splitlines():
        if not raw.strip():
            continue
        key, val = raw.split(":", 1)
        val = val.strip()
        if len(val) >= 2 and val[0] == val[-1] == '"':
            val = val[1:-1]
        meta[key.strip()] = val
    return meta, body.strip() + "\n"


def slugify(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = re.sub(r"[`*_~]", "", s)
    s = s.lower()
    s = re.sub(r"[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+", "-", s).strip("-")
    return s or "section"


def inline_md(s: str) -> str:
    placeholders = []
    def stash(m):
        placeholders.append(f"<code>{html.escape(m.group(1))}</code>")
        return f"@@CODE{len(placeholders)-1}@@"
    s = re.sub(r"`([^`]+)`", stash, html.escape(s))
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", lambda m: f'<a href="{html.escape(m.group(2), quote=True)}">{m.group(1)}</a>', s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    for i, val in enumerate(placeholders):
        s = s.replace(f"@@CODE{i}@@", val)
    return s


def render_markdown(body: str) -> str:
    out = []
    lines = body.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("```"):
            lang = line[3:].strip()
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            out.append(f"<pre><code>{html.escape(chr(10).join(buf))}</code></pre>")
            continue
        if line.startswith("## "):
            title = line[3:].strip()
            out.append(f'<h2 id="{slugify(title)}">{inline_md(title)}</h2>')
            i += 1
            continue
        if line.startswith("### "):
            title = line[4:].strip()
            out.append(f"<h3>{inline_md(title)}</h3>")
            i += 1
            continue
        if line.startswith("- "):
            items = []
            while i < len(lines) and lines[i].startswith("- "):
                items.append(f"<li>{inline_md(lines[i][2:].strip())}</li>")
                i += 1
            out.append("<ul>\n" + "\n".join(items) + "\n</ul>")
            continue
        # paragraph
        parts = [line.strip()]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("## ", "### ", "- ", "```")):
            parts.append(lines[i].strip())
            i += 1
        out.append(f"<p>{inline_md(' '.join(parts))}</p>")
    return "\n".join("  " + x for x in out)


def pretty_date(d: str, lang: str) -> str:
    dt = datetime.strptime(d, "%Y-%m-%d").date()
    if lang == "en":
        return dt.strftime("%B %-d, %Y")
    if lang == "zh":
        return f"{dt.year}年{dt.month}月{dt.day}日"
    if lang == "ja":
        return f"{dt.year}年{dt.month}月{dt.day}日"
    return f"{dt.year}년 {dt.month}월 {dt.day}일"


def build_page(template: str, lang: str, meta: dict, article_html: str) -> str:
    cfg = LANGS[lang]
    slug = meta["slug"]
    suffix = cfg["suffix"]
    url = f"https://bytefuture.ai/blog/{slug}{suffix}.html"
    title = meta["title"]
    desc = meta["summary"]
    category = meta.get("category", "tutorial")
    category_label = CATEGORY_LABELS[lang].get(category, category.replace("-", " ").title())
    t = template
    t = re.sub(r'<html lang="[^"]+">', f'<html lang="{cfg["html_lang"]}">', t, count=1)
    t = re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)} — ByteFuture Writings</title>', t, count=1)
    t = re.sub(r'<meta name="description" content="[^"]*" />', f'<meta name="description" content="{html.escape(desc, quote=True)}" />', t, count=1)
    t = re.sub(r'<link rel="canonical" href="[^"]*" />', f'<link rel="canonical" href="{url}" />', t, count=1)
    t = re.sub(r'<meta property="og:title" content="[^"]*" />', f'<meta property="og:title" content="{html.escape(title, quote=True)} — ByteFuture Writings" />', t, count=1)
    t = re.sub(r'<meta property="og:description" content="[^"]*" />', f'<meta property="og:description" content="{html.escape(desc, quote=True)}" />', t, count=1)
    t = re.sub(r'<meta property="og:url" content="[^"]*" />', f'<meta property="og:url" content="{url}" />', t, count=1)
    t = re.sub(r'<meta property="og:locale" content="[^"]*" />', f'<meta property="og:locale" content="{cfg["og_locale"]}" />', t, count=1)
    # alternates for this slug
    alternates = "\n".join([
        f'  <link rel="alternate" hreflang="en" href="https://bytefuture.ai/blog/{slug}.html" />',
        f'  <link rel="alternate" hreflang="zh-Hans" href="https://bytefuture.ai/blog/{slug}-zh.html" />',
        f'  <link rel="alternate" hreflang="ja" href="https://bytefuture.ai/blog/{slug}-ja.html" />',
        f'  <link rel="alternate" hreflang="ko" href="https://bytefuture.ai/blog/{slug}-ko.html" />',
        f'  <link rel="alternate" hreflang="x-default" href="https://bytefuture.ai/blog/{slug}.html" />',
    ])
    t = re.sub(r'  <link rel="alternate" hreflang="en".*?x-default" href="[^"]+" />', alternates, t, count=1, flags=re.S)
    t = re.sub(r'(<a href="/blog/" class="nav-hide-sm"[^>]*>).*?(</a>)', rf'\1{cfg["writings"]}\2', t, count=1)
    t = re.sub(r'(<a href="/blog/" style="font-weight:500;[^>]*>).*?(</a>)', rf'\1&larr; {cfg["all"]}\2', t, count=1)
    t = re.sub(r'<h4>Recent</h4>', f'<h4>{cfg["recent"]}</h4>', t, count=1)
    t = re.sub(r'<h4>Topics</h4>', f'<h4>{cfg["topics"]}</h4>', t, count=1)
    t = re.sub(r'<span style="font-size:12px;[^>]*>.*?</span>\s*\n\s*<time style="font-size:13px;[^>]*>.*?</time>',
               f'<span style="font-size:12px; font-family:\'Space Grotesk\',sans-serif; font-weight:500; color:#2563EB; background:rgba(37,99,235,0.08); padding:3px 10px; border-radius:50px;">{html.escape(category_label)}</span>\n        <time style="font-size:13px; color:#a1a1aa; font-family:\'Space Grotesk\',sans-serif;">{pretty_date(meta["date"], lang)}</time>', t, count=1, flags=re.S)
    t = re.sub(r'<h1 style="[^"]*">.*?</h1>', f'<h1 style="font-family:\'Space Grotesk\',sans-serif; font-size:clamp(32px,5vw,44px); font-weight:700; letter-spacing:-0.02em; line-height:1.15; margin:0;">{html.escape(title)}</h1>', t, count=1, flags=re.S)
    t = re.sub(r'(<article class="prose" style="padding:0 0 96px;">).*?(\n\s*<hr />)', rf'\1\n{article_html}\n\2', t, count=1, flags=re.S)
    t = re.sub(r"var currentSlug = '[^']+';", f"var currentSlug = '{slug}';", t, count=1)
    return t


def update_posts(lang: str, meta: dict):
    path = ROOT / LANGS[lang]["posts"]
    posts = json.loads(path.read_text()) if path.exists() else []
    entry = {"slug": meta["slug"], "title": meta["title"], "summary": meta["summary"], "category": meta.get("category", "tutorial"), "date": meta["date"]}
    cover = meta.get("cover")
    if cover:
        entry["cover"] = cover
    posts = [p for p in posts if p.get("slug") != meta["slug"]]
    posts.insert(0, entry)
    path.write_text(json.dumps(posts, ensure_ascii=False, indent=2) + "\n")


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    src = Path(sys.argv[1]).resolve()
    meta0, _ = parse_frontmatter(src.read_text())
    slug = meta0["slug"]
    template = TEMPLATE.read_text()
    for lang in LANGS:
        md = ROOT / "content/posts" / lang / f"{slug}.md"
        if not md.exists():
            raise SystemExit(f"Missing localized source: {md}")
        meta, body = parse_frontmatter(md.read_text())
        if meta["slug"] != slug:
            raise SystemExit(f"Slug mismatch in {md}")
        article_html = render_markdown(body)
        page = build_page(template, lang, meta, article_html)
        out = ROOT / "blog" / f"{slug}{LANGS[lang]['suffix']}.html"
        out.write_text(page)
        update_posts(lang, meta)
        print(out.relative_to(ROOT))

if __name__ == "__main__":
    main()
