---
slug: "route-aider-through-token-station"
lang: "zh"
title: "在 Aider 中接入 Token Station：GPT-5.6 Sol 和 Luna"
summary: "Aider 是一个开源的终端编码 agent，支持任意 OpenAI 兼容的 endpoint。把它指向 Token Station，它的 architect/editor 模式会把规划和编辑真正拆分到两个不同的模型上，并在 Token Station 自己的用量日志上得到确认，过程中也遇到了几个真实的坑：一个 Python 版本引发的安装陷阱、一个双重的 openai/ 前缀，以及一个只断言测试结果、却不实际运行的 architect。"
category: "tutorial"
date: "2026-10-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-aider-through-token-station-cover.png"
draft: false
---

[Aider](https://aider.chat) 是一个开源的终端 AI 结对编程工具：没有桌面应用，没有 IDE 插件，只有一个 CLI，在你本地的 git 仓库里编辑文件，边改边提交。和本系列的其他工具一样，它支持任意 OpenAI 兼容的自定义 endpoint，把它指向 Token Station，就能把 OpenAI 的 GPT-5.6 系列添加为可选模型，全部通过你自己的 Token Station key 计费。

这篇文章之所以值得单独写：Aider 内置了 **architect/editor 模式**，一个模型用自然语言规划改动，另一个模型把这个计划变成实际的 diff。这和 Hermes 那篇文章里的 subagent 委派是不同的拆分方式，值得单独确认，因为"文档说你可以设置两个模型"和"第二个模型真的被计费、真的干了活"不是一回事。

在开始配置之前，这里的道理和把其他工具通过 Token Station 路由、而不是直接付费给某个 provider 是一样的：成本可见性（每个请求都按 provider 的真实费率计费，零加价，显示在你自己的控制台里）和统一管理（同一个 key、同一批模型 ID 在你用的每个工具上都能用，Aider 也不例外）。

## 开始之前需要准备什么

- 安装 Aider：`pip install aider-chat`。有一个坑值得提前知道：在非常新的 Python 版本上（写这篇文章时是 3.14），pip 可能会悄悄解析到一个古老的 `aider-chat` 版本，它硬性锁定了 2023 年的依赖，编译会失败。用 Python 3.12 的虚拟环境可以完全绕开这个问题；具体的失败信息见下面的"值得了解的坑"部分。
- 一个 Token Station 账号和 API key。在 [models.bytefuture.ai](https://models.bytefuture.ai) 免费注册，不需要信用卡。

## 步骤 1：安装 Aider，并把它指向 Token Station

在一个激活了 Python 3.12 的虚拟环境里，安装 Aider，建一个项目，然后把它指向 Token Station 的 OpenAI 兼容 endpoint：

```
pip install aider-chat
mkdir aider-demo
cd aider-demo
git init
```

```powershell
$env:OPENAI_API_BASE = "https://models.bytefuture.ai/v1"
$env:OPENAI_API_KEY  = "gw-YOUR_TOKEN_STATION_KEY"
```

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/setup-aider.mp4" type="video/mp4">
  </video>
  <figcaption>把 Aider 安装进一个 Python 3.12 虚拟环境，创建项目，运行 git init，并设置 OPENAI_API_BASE 和 OPENAI_API_KEY（key 在画面里已打码）。最后那次用于检查的启动，不带 --model 参数的 aider，用的是 Aider 自带的默认值（"Main model: gpt-4o with diff edit format, Weak model: gpt-4o-mini"），还没有接入 Token Station。模型的选择在下一步进行。</figcaption>
</figure>

## 步骤 2：确认连接真的生效

Aider 把每个调用都通过 [litellm](https://github.com/BerriAI/litellm) 路由。`--model` 上的 `openai/` 前缀告诉它用 OpenAI 兼容协议去访问 `OPENAI_API_BASE` 指向的地址，litellm 会把这个前缀之后的所有内容原样当作 model 字段传过去。Token Station 自己的模型 ID 本身就带有一个厂商前缀（`openai/gpt-5.6-sol`），所以完整的参数最终是双重前缀：`openai/openai/gpt-5.6-sol`。看起来像个笔误，其实不是：Aider 自己的文档确认，外层 `openai/` 之后的字符串会原样传给 endpoint，所以里层的 `openai/` 只是 Token Station 模型 ID 的一部分，不需要去"清理"它。

```
aider --model openai/openai/gpt-5.6-sol
```

在提示符里输入：`say hello and tell me what model you are`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/connectivity-test.mp4" type="video/mp4">
  </video>
  <figcaption>用 --model openai/openai/gpt-5.6-sol 启动 Aider。Aider 提示它本地无法识别这个双重前缀的名字（"Unknown context window size and costs, using sane defaults"），这是无害的，这条警告针对的是 Aider 本地的成本估算表，和调用是否成功无关。模型的回复是："Hello! I'm ChatGPT, an AI language model created by OpenAI. No code changes are needed."</figcaption>
</figure>

值得诚实说明的一点：这条回复是一段通用的、模板化的自我介绍，它并没有具体点名 Sol，所以单凭这条回复，不能证明是 `gpt-5.6-sol` 处理了这次请求。Aider 打印出的 token 统计（609 sent, 23 received），以及更有说服力的 Token Station 自己的请求日志，才是真正能确认是哪个模型在作答的证据，而不是模型自己怎么说自己。

## 步骤 3：确认真实的工具调用

一个能在聊天里回复的模型，不等于一个能写出可运行文件的模型。开一个新会话，还是同一个模型，交给它一个需要真正创建点东西的任务：

```
aider --model openai/openai/gpt-5.6-sol
```

提示词：`Create temperature_converter.py with a function celsius_to_farenheit(c) that converts Celsius to Fahrenheit, plus a --main-- block that converts 100 and prints the result.`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/tool-use-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol 写出 temperature_converter.py：一个 celsius_to_farenheit 函数，加上一个打印 100°C 转换结果的 __main__ 代码块。Aider 展示了 diff，询问是否创建文件，应用修改，并自动提交（"Commit 7cea5c4 feat: add Celsius-to-Fahrenheit temperature converter"）。这段视频展示了写入和提交；下一步才是这段代码真正被执行、被验证的地方，通过一次真实的测试运行。</figcaption>
</figure>

```python
def celsius_to_farenheit(c):
    return (c * 9 / 5) + 32


if __name__ == "__main__":
    print(celsius_to_farenheit(100))
```

（函数名里的拼写错误来自提示词本身，不是 Sol 引入的。这一点值得记住，因为下一步里，Aider 的 architect 模式处理一个真正损坏的文件时，表现完全不同。）

## 步骤 4：把 architect 和 editor 拆分到两个模型上

Aider 的 architect/editor 模式会把计划发给一个模型，把实际的修改发给另一个模型，两者可以独立设置：

```
aider --architect --model openai/openai/gpt-5.6-sol --editor-model openai/openai/gpt-5.6-luna
```

| Model | Cost (input/output per M) | Role in this setup |
|---|---|---|
| `openai/gpt-5.6-sol` | $5 / $30 | Architect：读取文件，用自然语言规划改动。 |
| `openai/gpt-5.6-luna` | $1 / $6 | Editor：把计划变成实际的 diff。 |

提示词：`Add input validation to celsius_to_fahrenheit so it raises ValueError on non-numeric input, then write test_temperature_converter.py with three cases: a normal conversion, 0, and a non-numeric input that should raise ValueError.`

在录完上一步和这一步之间，`temperature_converter.py` 出了一个真实的意外：一条敲错了地方的命令把文件内容覆盖成了它自己的文本，整个文件最后只剩下字面意义上的一行：`python temperature_converter.py`。这是无意中留下的，但值得保留，因为它展示了一件事：Sol 读了这个文件，正确识别出这一行"不是合法的 Python 源码"，然后把它干净地重写了一遍，而不是在垃圾内容上打补丁。

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/architect-editor-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol（architect）读取文件，标记出那行多余的内容无效，然后给 Luna（editor）下达精确的指令：用 isinstance(celsius, Real) 做校验，失败时 raise ValueError("celsius must be numeric")，返回 celsius * 9 / 5 + 32，再加上 test_temperature_converter.py 需要的三个 pytest 用例。Luna 应用了修改，Aider 自动提交（"Commit 105d10f feat: add validated Celsius-to-Fahrenheit conversion"）。接着 Sol 说 "I can't execute shell commands in this environment... the tests should pass: 3 passed"，这是在断言一个结果，而不是确认它。退出后手动运行 python -m pytest test_temperature_converter.py -v，才拿到真正的答案：3 passed in 0.03s。视频的结尾落在 Token Station 的控制台上，展示 gpt-5.6-sol 和 gpt-5.6-luna 的请求在同一个会话里交替出现。</figcaption>
</figure>

```python
from numbers import Real


def celsius_to_fahrenheit(celsius):
    if not isinstance(celsius, Real):
        raise ValueError("celsius must be numeric")
    return celsius * 9 / 5 + 32
```

```python
import pytest
from temperature_converter import celsius_to_fahrenheit


def test_normal_conversion():
    assert celsius_to_fahrenheit(25) == 77


def test_zero_celsius():
    assert celsius_to_fahrenheit(0) == 32


def test_non_numeric_input():
    with pytest.raises(ValueError):
        celsius_to_fahrenheit("not a number")
```

值得了解的一点：和 Hermes 那篇文章不同，那里的 agent 会自己运行命令、报告真实的输出，Aider 的 architect/editor 循环默认不会执行任何东西，它是在断言，而不是在确认。Aider 确实有办法在会话内部运行 shell 命令，`/run <command>`，这样测试可以不用离开对话就跑起来；只是模型自己默认不会主动去用它。

证明这次拆分真的用到了两个模型的证据：Token Station 的 Usage 页面，这次会话运行那几分钟里的请求历史。

<figure>
  <img src="/blog/route-aider-through-token-station/usage-sol-luna-interleaved.jpg" alt="Token Station Usage page request history showing openai/gpt-5.6-sol and openai/gpt-5.6-luna requests interleaved within the same two-minute window" />
  <figcaption>同一个会话里 Token Station 的请求历史：01:11:28 到 01:12:13 之间的五个请求，gpt-5.6-sol 和 gpt-5.6-luna 交替出现，各自单独计费（从 Luna 一次小调用的 $0.000235，到 Sol 一次大调用的 $0.006252）。</figcaption>
</figure>

## 目前能用的

把 Aider 指向 Token Station，当作一个通用的 OpenAI 兼容 endpoint 来用是可行的，双重的 `openai/` 前缀是唯一一个值得提前知道、而不是靠踩坑才发现的语法细节。真实的工具调用，写文件并提交，已经在 `openai/gpt-5.6-sol` 上得到确认。Architect/editor 模式真的把工作拆分到了两个模型上：Sol 负责规划，Luna 负责编辑，这一点既能从 Aider 自己打印的 "Editor model:" 启动信息看到，也能从 Token Station 控制台上两个模型在同一个会话里分别计费看到。

## 值得了解的坑

- **非常新的 Python 版本可能让安装失败。** 在 Python 3.14 上，pip 把 `aider-chat` 解析到了一个古老的 0.16.0 版本，它硬性锁定了 2023 年的依赖（`numpy==1.24.3`、`aiohttp==3.8.4`），从源码编译这个老版本 numpy 直接失败。用 Python 3.12 的虚拟环境可以干净地装上当前版本。
- **模型参数是双重前缀的。** `openai/` 告诉 Aider 的 litellm 层用 OpenAI 兼容协议去访问 `OPENAI_API_BASE`；它之后的所有内容会原样传过去。因为 Token Station 自己的模型 ID 本身就以厂商名开头，完整的参数看起来像是多余的（`openai/openai/gpt-5.6-sol`），但这是对的。
- **模型自己报出的名字说明不了什么。** 被问到自己是什么模型时，Sol 给出的是一段通用的 "I'm ChatGPT" 式自我介绍，而不是一个针对具体模型的回答。真正能确认是哪个模型在跑的，是 Token Station 自己的请求日志，而不是模型的自我陈述。
- **在 Aider 的提示符里敲一条 shell 命令，并不会真的执行它。** `architect>` 提示符发送的是一条聊天消息，不是终端命令；在那里敲一行 `pip install pytest`，只会被谈论，不会被执行。要在会话内部真正执行点什么，用 `/run <command>`，或者另开一个终端。
- **Architect/editor 模式不会自己验证结果。** Sol 断言"the tests should pass: 3 passed"，却什么都没运行。要确认这一点，还得之后真的跑一次 `pytest`。

## 开始使用

前往 [models.bytefuture.ai](https://models.bytefuture.ai/signup) 注册：无需信用卡，首次充值最高可获得 100% 的等额奖励，最多 50 美元。导出你的 key，设置 `OPENAI_API_BASE` 和 `OPENAI_API_KEY`，然后让 `--model` 指向你想试的任何 Token Station 模型。

[试用 Token Station](https://models.bytefuture.ai/intro.html)
