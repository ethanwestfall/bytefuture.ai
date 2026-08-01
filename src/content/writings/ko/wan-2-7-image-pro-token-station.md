---
slug: "wan-2-7-image-pro-token-station"
lang: "ko"
title: "Token Station에서 Wan 2.7 Image Pro로 이미지 생성하고 편집하기"
summary: "Wan 2.7 Image Pro는 Alibaba의 프로페셔널 이미지 모델이다. 텍스트 기반 이미지 생성과 프롬프트 기반 편집을 하나의 API로 처리하며, 최대 4K 출력, 참조 이미지 9장, 십여 개 언어의 텍스트 렌더링을 지원한다. Token Station에서 qwen/wan-2.7-image-pro로 바로 쓸 수 있다."
category: "tutorial"
date: "2026-07-31"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/wan-2-7-image-pro-token-station-cover.png"
draft: false
---

Wan 2.7 Image Pro는 Alibaba의 이미지 생성 모델 라인인 Wanxiang(Wan)의 프로페셔널 등급이다. 2026년 4월, Wan 2.7 Image의 업그레이드 버전으로 출시됐다. 텍스트 기반 이미지 생성과 프롬프트 기반 편집을 같은 엔드포인트에서 처리하며, Token Station에서 `qwen/wan-2.7-image-pro`로 바로 사용할 수 있다.

## 이 모델이 할 수 있는 것

- **최대 4096x4096 텍스트 기반 이미지 생성.** 완전한 4K 출력이 필요한 프롬프트에 그대로 쓸 수 있다. 블로그 썸네일이나 SNS 게시물처럼 작은 용도에는 기본값인 1024x1024로 충분하다.
- **최대 2048x2048 프롬프트 기반 편집.** 기존 이미지와 새로운 지시를 함께 보내면 모델이 그 자리에서 이미지를 편집한다.
- **바운딩 박스로 정확한 영역 편집.** `bbox_list` 배열(이미지 한 장당 최대 2개, 절대 픽셀 좌표)을 추가하면 모델이 알아서 영역을 추측하게 두는 대신 편집이 적용될 위치를 직접 지정할 수 있다.
- **참조 이미지 최대 9장.** 편집이나 다중 이미지 생성 호출에서 여러 입력 이미지를 동시에 참조할 수 있다. 여러 장에 걸쳐 캐릭터나 제품의 모습을 유지하고 싶을 때 유용하다.
- **십여 개 언어의 텍스트 렌더링.** 표지판, 라벨, 표, 간단한 수식까지 상당히 정확하게 렌더링한다. 예전 이미지 모델에서 흔했던 깨진 텍스트가 나오지 않는다.
- **배치 생성.** 요청 한 번에 최대 4장까지 생성하며, 장당 비용은 그대로다.
- **선택적인 추론 단계.** Wan 2.7 Image Pro는 렌더링 전에 "생각하기" 단계를 거칠 수 있다. 공간 관계와 구도, 여러 요소가 서로 어떻게 영향을 주는지를 픽셀을 생성하기 전에 미리 정리하는 과정이다. 여러 대상이 얽혀 있거나 구도가 명확히 정해진 프롬프트에서 특히 도움이 된다. 지연 시간이 늘어나므로 모든 요청의 기본값으로 두기보다는 복잡한 프롬프트에서 선택적으로 켜는 설정으로 생각하는 편이 낫다.

## 이 모델이 할 수 없는 것

- **픽셀 마스크 기반 인페인팅은 없다.** 원하는 변경 사항은 프롬프트로 지시하고 필요하면 바운딩 박스로 영역을 좁힐 수 있지만, 마스크 도구처럼 교체할 픽셀을 정확히 감싸는 방식은 아니다.
- **여러 번의 생성에 걸친 캐릭터 일관성은 보장되지 않는다.** 한 번의 요청 안에서 여러 이미지를 참조하면 일관성을 유지할 수 있지만, 같은 프롬프트라도 독립적인 두 번의 요청에서는 결과가 달라질 수 있다.
- **복잡한 다분할 인포그래픽은 약하다.** 라벨이 많은 패널로 이루어진 밀도 높은 레이아웃에는 그런 용도에 맞게 만들어진 모델이 더 낫다.

## 이미지 생성하기

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{ "model": "qwen/wan-2.7-image-pro", "prompt": "A childrens book drawing of a veterinarian using a stethoscope to listen to the heartbeat of a baby otter." }'
```

`$YOUR_API_KEY`는 [대시보드](https://models.bytefuture.ai/dashboard)에서 발급받는 Token Station 키다.

## 기존 이미지 편집하기

`image_url` 배열에 원본 이미지를 하나 이상 넣고, `prompt`에 원하는 변경 내용을 적는다.

```bash
curl -X POST "https://models.bytefuture.ai/v1/images/generations" \
  -H "Authorization: Bearer $YOUR_API_KEY" \
  -H "Content-type: application/json" \
  -d '{"model": "qwen/wan-2.7-image-pro", "prompt": "Put a trophy in his hand", "image_url": ["https://d3i6fh83elv35t.cloudfront.net/static/2026/06/2026-06-17T033637Z_31440324_UP1EM6H0415VH_RTRMADP_3_SOCCER-WORLDCUP-ARG-DZA-1024x674.jpg"]}'
```

생성과 편집은 같은 엔드포인트를 쓴다. 달라지는 것은 `image_url`을 포함하는지 여부뿐이고, 경로와 모델 ID는 그대로다.

## 파라미터

| 필드 | 설명 |
|---|---|
| `model` | `qwen/wan-2.7-image-pro` |
| `prompt` | 필수. 생성 또는 편집 지시. |
| `image_url` | 선택 사항인 원본 이미지 URL 배열. 생략하면 텍스트 기반 생성, 포함하면 편집이 된다. 요청 한 번에 최대 9장. |
| `bbox_list` | 편집 시에만 쓰는 선택 항목. 입력 이미지마다 최대 2개의 `[x1, y1, x2, y2]` 픽셀 좌표를 지정해 편집이 적용될 범위를 좁힌다. |

## 해상도와 출력

| 모드 | 최대 해상도 | 배치 |
|---|---|---|
| 텍스트 기반 생성 | 4096x4096 | 요청 한 번에 최대 4장 |
| 편집 | 2048x2048 | 요청 한 번에 최대 4장 |

4K는 업스케일이 아니라 실제 출력이지만, 대형 인쇄물이나 히어로 배너보다 작은 용도에 쓰면 낭비다. 웹이나 SNS 용도에는 기본값인 1024x1024를 쓰고, 실제로 그 크기로 보여질 에셋에만 더 높은 해상도를 남겨두면 된다.

## 가격

Token Station은 프로바이더 가격을 마진 없이 그대로 전달한다. `qwen/wan-2.7-image-pro`의 현재 장당 가격은 [대시보드](https://models.bytefuture.ai/dashboard)에서 확인하자. 같은 모델을 제공하는 다른 호스팅에서는 Pro 등급 가격이 표준 해상도 기준 장당 약 0.075달러 선인데, 평가할 때 대략적인 기준으로 삼을 만하다.

## 시작하기

[models.bytefuture.ai](https://models.bytefuture.ai/signup)에서 가입하자. 1달러 무료 크레딧, 카드 불필요, 첫 충전 시 최대 50달러 보너스도 받을 수 있다. 키를 export하고 위의 생성 요청을 실행한 다음, 직접 가진 이미지로 편집도 시도해보자.

[Token Station 사용해보기](https://models.bytefuture.ai/intro.html)
