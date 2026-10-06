---
slug: gpt-6-sol-luna-token-station
lang: ja
title: "GPT-6 Sol と Luna が Token Station に登場"
summary: "OpenAIのGPT-6 SolとGPT-6 LunaがToken Stationで利用可能になりました。GPT-5.6の同名モデルより大幅に安い価格で提供され、GPT-6 Astraのエージェント型タスクでの向上を引き継いでいます。スペック、価格、Claude Opus 5およびClaude Fable 5とのベンチマーク比較、そしてSolとLunaがAstraの隣でどのような位置づけになるかを解説します。"
category: product
date: 2026-10-02
cta: https://models.bytefuture.ai/intro.html
cover: blog/gpt-6-sol-luna-token-station-cover.png
draft: false
---

GPT-6 SolとGPT-6 Lunaが`openai/gpt-6-sol`と`openai/gpt-6-luna`としてToken Stationで利用可能になりました。GPT-6 AstraとGPT-5.6ファミリーですでに使っているのと同じOpenAI互換エンドポイントからアクセスできます。

OpenAIのGPT-6フラッグシップであるAstraが先に登場し、最も困難なエージェント型タスクやコンピュータ操作向けの価格設定がなされていました。SolとLunaはその3週間後に登場し、Astraの基盤となる技術の多くを、より安価で高速なティアに引き継いでいます。Solはインタラクティブかつエージェント型のコーディング向けのバランスの取れたルートであり、Lunaはファミリーの中で最も低コストな選択肢として、大量かつ軽量なタスクを担います。

## 新しい点

GPT-5.6の同名モデルと比較すると、Solの定価は60〜67%下がり、Lunaは90%以上下がっています(詳細は下記の価格を参照)。OpenAI自身のベンチマーク発表でも、この向上は単純な性能向上というより、コスト効率の改善として位置づけられています。

- **AutomationBench 1.0.6**(営業、マーケティング、オペレーション、サポート、財務、人事にまたがる47種類のツールを使ったビジネスワークフロー):Solは`xhigh`の推論強度で33.2%のスコアを1タスクあたり$0.27で達成し、Claude Opus 5は最大推論強度で26.9%のスコアを、約11倍のコストで記録しています。
- **Agents' Last Exam**:Solは最大推論強度で56.4%に達し、Claude Opus 5の記録済み最高スコアをわずかに上回りながら、タスクあたりのコストは約60%低くなっています。
- **DeepSWE v1.1**(実際のコードベースでのソフトウェアエンジニアリングタスク):Solは最大推論強度で68.8%のスコアとなり、Claude Fable 5の69.9%にわずか1.1ポイント差まで迫りながら、タスクあたりのコストは約80%低くなっています。Lunaは同じベンチマークで最大推論強度により66.6%に達し、中程度の推論強度のClaude Opus 5およびClaude Fable 5に匹敵するスコアを、それぞれ93%および96%低いタスクあたりのコストで記録しています。

これによってSolやLunaがあらゆる面でGPT-5.6 SolやAstraより単純に強くなったわけではありません。ここでの訴求点はコストです。価格のごく一部で同等か近い結果が得られることであり、これは単発の難しい呼び出しよりも、大量のエージェント型ファンアウトにおいて重要になります。

## スペック

| | GPT-6 Sol | GPT-6 Luna |
|---|---|---|
| コンテキストウィンドウ | 1.05M tokens | 1.05M tokens |
| 最大入力 | 922K tokens | 922K tokens |
| 最大出力 | 128K tokens | 128K tokens |
| 対応モダリティ | テキストと画像を入力、テキストを出力 | テキストと画像を入力、テキストを出力 |
| 知識カットオフ | 2026年4月20日 | 2026年5月18日 |
| 推論強度 | none、low、medium(デフォルト)、high、xhigh、max | none、low、medium(デフォルト)、high、xhigh、max |

Lunaの知識カットオフはSolより、さらにはAstra(2026年4月30日)よりも新しくなっています。ファミリーの中で最も安価なティアが最新の知識を持つというのは珍しいことですが、OpenAIが今回出荷したのはそういう形です。

## 試してみる

```bash
curl https://models.bytefuture.ai/v1/chat/completions \
  -H "Authorization: Bearer TOKEN_STATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-6-sol",
    "messages": [
      {"role": "user", "content": "Plan a safe refactor for a pricing module and list the tests to run."}
    ]
  }'
```

同じ呼び出しでより安価なティアに切り替えるには`openai/gpt-6-sol`を`openai/gpt-6-luna`に置き換えてください。また`openai/gpt-6-astra`に置き換えれば、自分のタスクにおいてフラッグシップルートが高い価格に見合うかどうかを確認できます。

## 価格

| モデル | 入力 | 出力 | キャッシュ入力 | キャッシュ書き込み |
|---|---|---|---|---|
| GPT-6 Sol | $2/M | $10/M | $0.20/M | $2.50/M |
| GPT-6 Luna | $0.10/M | $0.50/M | $0.01/M | $0.125/M |
| GPT-6 Astra | $10/M | $50/M | $1/M | $12.50/M |
| GPT-5.6 Sol（`openai/gpt-5.6`） | $5/M | $30/M | $0.50/M | $6.25/M |
| GPT-5.6 Luna | $1/M | $6/M | - | - |

Token Stationはこれらの料金をそのまま、マークアップなしでパススルーします。リクエスト単位で計測されます。

## SolとLunaの位置づけ

- **GPT-6 Sol**:注意深い複数ステップの検証が効果を発揮する、インタラクティブかつエージェント型のコーディング。Lunaの速さとAstraの長時間エージェント能力の中間に位置するティアです。
- **GPT-6 Luna**:大量かつリスクの低い作業向けです。トリアージ、分類、探索的なパス、そしてより大きなエージェント内でのサブタスクのファンアウトなど。上記のDeepSWEの結果が示すように、価格のごく一部でありながら、より高価なモデルとの差の大部分を埋めています。
- **GPT-6 Astra**:長時間のエージェント型コーディングセッション、コンピュータ操作、ターミナル中心の運用作業では、依然として選ぶべきルートです。これらはGPT-5.6ファミリーに対するAstraの優位性が最も大きかった領域です。

実践的なルーティングパターンとしては、探索とファンアウトにはデフォルトでLunaを使い、実際の実装と検証作業にはSolへ移行し、タスクから逸れることなく最も長く実行し続ける必要があるセッションにはAstraを確保しておく、という形になります。

## 始めるには

[models.bytefuture.ai](https://models.bytefuture.ai/signup)でサインアップしてください。カード登録は不要で、初回チャージ時には最大$50の100%マッチボーナスが付きます。APIキーを取得し、既存のOpenAI互換の実装を`openai/gpt-6-sol`または`openai/gpt-6-luna`に向けるだけです。

[Token Station を試す](https://models.bytefuture.ai/intro.html)
