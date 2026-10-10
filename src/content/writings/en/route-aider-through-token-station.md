---
slug: "route-aider-through-token-station"
lang: "en"
title: "Route Aider through Token Station: GPT-5.6 Sol and Luna"
summary: "Aider is a terminal-based, open-source coding agent that speaks any OpenAI-compatible endpoint. Point it at Token Station and its architect/editor mode genuinely splits planning and editing across two different models, confirmed on Token Station's own usage log, with a few real quirks along the way: a Python-version install trap, a double openai/ prefix, and an architect that asserts test results instead of running them."
category: "tutorial"
date: "2026-10-10"
cta: "https://models.bytefuture.ai/intro.html"
cover: "blog/route-aider-through-token-station-cover.png"
draft: false
---

[Aider](https://aider.chat) is an open-source, terminal-based AI pair programming tool: no desktop app, no IDE plugin, just a CLI that edits files in your local git repo and commits as it goes. Like the rest of this series, it supports any OpenAI-compatible custom endpoint, so pointing it at Token Station gets you OpenAI's GPT-5.6 family as selectable models, billed through your own Token Station key.

The reason this one earns its own article: Aider has a built-in **architect/editor mode**, where one model plans the change in plain language and a second model turns that plan into the actual diff. That's a different split from the Hermes piece's subagent delegation, and worth confirming separately, since "the docs say you can set two models" and "the second model actually gets billed for real work" aren't the same claim.

The same reasoning applies here as with any tool routed through Token Station instead of paying a provider directly: cost visibility (every request bills at the provider's real rate, zero markup, visible on your own dashboard) and consolidation (one key and one set of model IDs across every tool, Aider included).

## What you need before starting

- Aider installed: `pip install aider-chat`. One catch worth knowing before you hit it yourself: on a very new Python (3.14 at the time of writing), pip can silently resolve to an ancient `aider-chat` release with hard-pinned 2023-era dependencies that fail to build. A Python 3.12 virtual environment sidesteps it entirely; see the quirks section below for the exact failure.
- A Token Station account and API key. Sign up free at [models.bytefuture.ai](https://models.bytefuture.ai), no card required.

## Step 1: Install Aider and point it at Token Station

With Python 3.12 active in a virtual environment, install Aider, set up a project, and point it at Token Station's OpenAI-compatible endpoint:

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
  <figcaption>Installing Aider into a Python 3.12 virtual environment, creating a project, running git init, and setting OPENAI_API_BASE and OPENAI_API_KEY (key redacted on screen). The sanity-check launch at the end, plain aider with no --model flag, starts with Aider's own built-in defaults ("Main model: gpt-4o with diff edit format, Weak model: gpt-4o-mini"), not yet Token Station. Model selection happens in the next step.</figcaption>
</figure>

## Step 2: Confirm the connection actually works

Aider routes every call through [litellm](https://github.com/BerriAI/litellm). The `openai/` prefix on `--model` tells it to speak the OpenAI-compatible protocol to whatever `OPENAI_API_BASE` points at, and litellm passes everything after that prefix straight through as the literal model field. Token Station's own model IDs already carry a vendor prefix (`openai/gpt-5.6-sol`), so the full argument ends up double-prefixed: `openai/openai/gpt-5.6-sol`. It looks like a typo. It isn't: Aider's own docs confirm the string after the outer `openai/` is passed straight through to the endpoint untouched, so the inner `openai/` is just part of Token Station's model ID, not a mistake to clean up.

```
aider --model openai/openai/gpt-5.6-sol
```

At the prompt: `say hello and tell me what model you are`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/connectivity-test.mp4" type="video/mp4">
  </video>
  <figcaption>Launching Aider with --model openai/openai/gpt-5.6-sol. Aider warns that it doesn't recognize the double-prefixed name locally ("Unknown context window size and costs, using sane defaults"), harmless, that warning is about Aider's local cost-estimate table, not about whether the call works. The model replies: "Hello! I'm ChatGPT, an AI language model created by OpenAI. No code changes are needed."</figcaption>
</figure>

Worth being honest about: that reply is a generic, templated self-identification. It doesn't name Sol specifically, so it isn't proof by itself that `gpt-5.6-sol` handled the request. The token accounting Aider prints (609 sent, 23 received) and, more convincingly, Token Station's own request log are what actually confirm which model answered, not what the model says about itself.

## Step 3: Confirm real tool-use

A model that replies in chat isn't the same as a model that can write a working file. New session, same model, a task that requires creating something real:

```
aider --model openai/openai/gpt-5.6-sol
```

Prompt: `Create temperature_converter.py with a function celsius_to_farenheit(c) that converts Celsius to Fahrenheit, plus a --main-- block that converts 100 and prints the result.`

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/tool-use-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol writing temperature_converter.py: a celsius_to_farenheit function and a __main__ block that prints the 100°C conversion. Aider shows the diff, asks to create the file, applies it, and auto-commits ("Commit 7cea5c4 feat: add Celsius-to-Fahrenheit temperature converter"). This clip shows the write and the commit; the next step is where the code actually gets exercised, via a real test run.</figcaption>
</figure>

```python
def celsius_to_farenheit(c):
    return (c * 9 / 5) + 32


if __name__ == "__main__":
    print(celsius_to_farenheit(100))
```

(The function name reproduces a typo from the prompt itself, not something Sol introduced. Worth keeping in mind for the next step, where Aider's architect mode handles an actually broken file very differently.)

## Step 4: Split architect and editor across two models

Aider's architect/editor mode sends the plan to one model and the actual edit to another, set independently:

```
aider --architect --model openai/openai/gpt-5.6-sol --editor-model openai/openai/gpt-5.6-luna
```

| Model | Cost (input/output per M) | Role in this setup |
|---|---|---|
| `openai/gpt-5.6-sol` | $5 / $30 | Architect: reads the file, plans the change in plain language. |
| `openai/gpt-5.6-luna` | $1 / $6 | Editor: turns the plan into the actual diff. |

Prompt: `Add input validation to celsius_to_fahrenheit so it raises ValueError on non-numeric input, then write test_temperature_converter.py with three cases: a normal conversion, 0, and a non-numeric input that should raise ValueError.`

Between recording the last step and this one, `temperature_converter.py` picked up a real mistake: a command typed in the wrong place had overwritten the file with its own text, leaving the file containing nothing but the literal line `python temperature_converter.py`. Left in by accident, and worth keeping in for what it shows: Sol read the file, correctly identified that line as "not valid Python source," and rewrote it clean rather than patching garbage.

<figure>
  <video controls preload="metadata" playsinline>
    <source src="/blog/route-aider-through-token-station/architect-editor-demo.mp4" type="video/mp4">
  </video>
  <figcaption>Sol (architect) reads the file, flags the stray line as invalid, and hands Luna (editor) precise instructions: validate with isinstance(celsius, Real), raise ValueError("celsius must be numeric") on failure, return celsius * 9 / 5 + 32, plus three pytest cases for test_temperature_converter.py. Luna applies the edit and Aider auto-commits ("Commit 105d10f feat: add validated Celsius-to-Fahrenheit conversion"). Sol then says "I can't execute shell commands in this environment... the tests should pass: 3 passed", asserting a result rather than confirming one. Exiting and running python -m pytest test_temperature_converter.py -v manually gets the real answer: 3 passed in 0.03s. The clip ends on Token Station's dashboard, showing gpt-5.6-sol and gpt-5.6-luna requests interleaved in the same session.</figcaption>
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

Worth knowing: unlike the Hermes piece, where the agent ran commands and reported real output on its own, Aider's architect/editor loop doesn't execute anything by default, it asserts rather than confirms. Aider does have a way to run shell commands from inside the session, `/run <command>`, which would let the test happen without leaving the chat; the model itself just doesn't reach for it automatically.

The proof that the split genuinely used two models: Token Station's Usage page, request history, for the minutes this session ran.

<figure>
  <img src="/blog/route-aider-through-token-station/usage-sol-luna-interleaved.jpg" alt="Token Station Usage page request history showing openai/gpt-5.6-sol and openai/gpt-5.6-luna requests interleaved within the same two-minute window" />
  <figcaption>Token Station's request history, same session: five requests between 01:11:28 and 01:12:13, gpt-5.6-sol and gpt-5.6-luna interleaved, each billed separately (from $0.000235 for a small Luna call up to $0.006252 for a larger Sol call).</figcaption>
</figure>

## What works today

Pointing Aider at Token Station as a generic OpenAI-compatible endpoint works, with the double `openai/` prefix being the one piece of syntax worth knowing ahead of time rather than discovering through a confusing error. Real tool-use, writing and committing an actual file, is confirmed for `openai/gpt-5.6-sol`. Architect/editor mode genuinely splits the work across two models: Sol plans and Luna edits, confirmed both by Aider's own "Editor model:" startup line and by Token Station's dashboard showing both models billed separately in the same session.

## Quirks worth knowing

- **Very new Python can break the install.** On Python 3.14, pip resolved `aider-chat` down to an ancient 0.16.0 release with hard-pinned 2023 dependencies (`numpy==1.24.3`, `aiohttp==3.8.4`), and building that old numpy from source failed outright. A Python 3.12 virtual environment installs the current release cleanly.
- **The model argument is double-prefixed.** `openai/` tells Aider's litellm layer to speak the OpenAI-compatible protocol to `OPENAI_API_BASE`; everything after it is passed straight through. Since Token Station's own model IDs already start with their vendor name, the full argument looks redundant (`openai/openai/gpt-5.6-sol`) but is correct.
- **A model naming itself proves nothing.** Asked what model it is, Sol replied with a generic "I'm ChatGPT" self-description, not a model-specific answer. Token Station's own request log, not the model's self-report, is the real confirmation of which model is running.
- **Typing a shell command at the Aider prompt doesn't run it.** The `architect>` prompt sends a chat message, not a terminal command; a stray `pip install pytest` typed there just gets talked about, not executed. Use `/run <command>` to actually execute something inside the session, or open a separate terminal.
- **Architect/editor mode doesn't self-verify.** Sol asserted "the tests should pass: 3 passed" without running anything. Confirming that took an actual `pytest` run afterward.

## Get started

Sign up at [models.bytefuture.ai](https://models.bytefuture.ai/signup): no card required, with a 100% match up to $50 on your first top-up. Export your key, set `OPENAI_API_BASE` and `OPENAI_API_KEY`, and point `--model` at whatever Token Station model you want to try.

[Try Token Station](https://models.bytefuture.ai/intro.html)
