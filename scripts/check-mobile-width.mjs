import http from 'node:http';
import { spawn } from 'node:child_process';
import WebSocket from 'ws';

const url = process.argv[2] || 'http://127.0.0.1:8770/blog/astro-framework-test.html';
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = Number(process.env.CDP_PORT || 9225);
const userDataDir = `/tmp/bytefuture-chrome-${port}`;

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

function putJson(path) {
  return new Promise((resolve, reject) => {
    http.request({ host: '127.0.0.1', port, path, method: 'PUT' }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject).end();
  });
}

async function waitForChrome() {
  for (let i = 0; i < 30; i += 1) {
    try {
      return await getJson('/json/version');
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error('Chrome CDP did not become ready');
}

async function main() {
  let chromeLog = '';
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=375,812',
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  chrome.stderr.on('data', (chunk) => {
    chromeLog += chunk.toString();
  });

  try {
    await waitForChrome();
    const target = await putJson(`/json/new?${encodeURIComponent(url)}`);
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    ws.on('message', (buffer) => {
      const message = JSON.parse(buffer.toString());
      if (message.id && pending.has(message.id)) {
        pending.get(message.id)(message);
        pending.delete(message.id);
      }
    });
    await new Promise((resolve) => ws.on('open', resolve));
    const send = (method, params = {}) => new Promise((resolve) => {
      const messageId = ++id;
      pending.set(messageId, resolve);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await send('Page.enable');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => ({
        innerWidth: window.innerWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        title: document.title
      }))()`,
    });
    const value = result.result.result.value;
    console.log(JSON.stringify(value));
    if (value.scrollWidth > value.clientWidth) {
      throw new Error(`Horizontal overflow: scrollWidth ${value.scrollWidth} > clientWidth ${value.clientWidth}`);
    }
    ws.close();
  } catch (error) {
    if (chromeLog.trim()) {
      console.error('Chrome stderr:');
      console.error(chromeLog.trim());
    }
    throw error;
  } finally {
    chrome.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
