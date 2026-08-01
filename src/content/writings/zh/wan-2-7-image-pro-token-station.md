---
slug: "wan-2-7-image-pro-token-station"
lang: "zh"
title: "在 Token Station 用 Wan 2.7 Image Pro 生成和编辑图片"
summary: "Wan 2.7 Image Pro 是阿里巴巴的专业级图像模型：一个 API 同时支持文生图和指令式编辑，最高 4K 输出，支持 9 张参考图，还能在十几种语言里渲染文字。它已在 Token Station 上线，模型 ID 为 qwen/wan-2.7-image-pro。"
category: "tutorial"
date: "2026-07-31"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/wan-2-7-image-pro-token-station-cover.png"
draft: false
---

Wan 2.7 Image Pro 是阿里巴巴通义万相（Wan）图像系列的专业版，2026 年 4 月发布，是 Wan 2.7 Image 的升级版本。文生图和指令式编辑走同一个端点，现已在 Token Station 上线，模型 ID 为 `qwen/wan-2.7-image-pro`。

## 这个模型能做什么

- **文生图，最高 4096x4096。** 需要全 4K 输出时可以直接生成；对博客缩略图、社交媒体图这类小尺寸场景，默认的 1024x1024 就够用。
- **指令式编辑，最高 2048x2048。** 上传一张已有图片，给出新的指令，模型直接在原图上编辑。
- **用边界框做精确区域编辑。** 加上 `bbox_list` 数组（每张图最多 2 个框，用绝对像素坐标表示），可以直接指定编辑应该发生在哪个区域，而不是靠模型自己从提示词里猜。
- **最多 9 张参考图。** 编辑和多图生成调用可以同时参考多张输入图，便于在一组图里保持角色或产品的一致性。
- **十几种语言的文字渲染。** 招牌、标签、表格和简单公式都能渲染得比较准确，不再是老一代图像模型那种糊字。
- **批量生成。** 每次调用最多输出 4 张图，单价不变。
- **可选的推理步骤。** Wan 2.7 Image Pro 在渲染前可以先跑一段"思考"：先理清空间关系、构图，以及多个元素之间如何互动，再开始生成像素。这对包含多个互动主体或有明确版式要求的提示词帮助最大。它会增加延迟，所以更适合用在复杂提示词上，而不是默认开启。

## 它做不到什么

- **没有基于像素蒙版的局部重绘（inpainting）。** 你在提示词里描述改动，也可以配合边界框指定区域，但不能像蒙版工具那样精确圈出要替换的像素。
- **跨多次生成的角色一致性不保证。** 同一次调用里用多图参考可以保持一致；但两次独立调用即便用同样的提示词，结果也可能会漂移。
- **复杂的多分区信息图是弱项。** 对于带很多标注面板的密集版式，专门为这类场景训练的模型会做得更好。

## 生成一张图片

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{ "model": "qwen/wan-2.7-image-pro", "prompt": "A childrens book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter." }'
```

`$YOUR_API_KEY` 是你的 Token Station 密钥，可从[控制台](https://models.bytefuture.ai/dashboard)获取。

## 编辑一张已有图片

加上 `image_url` 数组，放入一张或多张源图片，再在 `prompt` 里描述要做的改动：

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{"model": "qwen/wan-2.7-image-pro", "prompt": "Put a trophy in his hand", "image_url": ["https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg"]}'
```

生成和编辑用的是同一个端点。区别只在于是否带上 `image_url`，路由和模型 ID 都不变。

## 参数

| 字段 | 说明 |
|---|---|
| `model` | `qwen/wan-2.7-image-pro` |
| `prompt` | 必填。生成或编辑的指令。 |
| `image_url` | 可选的源图片 URL 数组。留空表示文生图；填入表示编辑。每次调用最多 9 张。 |
| `bbox_list` | 仅用于编辑，可选。每张输入图对应一组最多 2 个 `[x1, y1, x2, y2]` 像素坐标框，用于指定编辑生效的区域。 |

## 分辨率与输出

| 模式 | 最大分辨率 | 批量 |
|---|---|---|
| 文生图 | 4096x4096 | 每次调用最多 4 张 |
| 编辑 | 2048x2048 | 每次调用最多 4 张 |

4K 是真实输出，不是放大插值，但用在比大幅打印或首屏大图还小的场景上就是浪费。网页和社交媒体场景默认用 1024x1024，把更高分辨率留给真正会以那个尺寸展示的素材。

## 价格

Token Station 按 provider 定价零 markup 透传。`qwen/wan-2.7-image-pro` 当前每张图的单价请查看[控制台](https://models.bytefuture.ai/dashboard)；其他托管同一模型的平台给 Pro 档的报价大约是每张标准分辨率图片 0.075 美元，可以作为你评估时的参考区间。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：1 美元免费额度，无需信用卡，首次充值最高可再获得 50 美元奖励。导出你的密钥，运行上面的生成调用，再拿你自己的一张图片试试编辑。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
