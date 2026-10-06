const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'chess', 'index.html'), 'utf8');

// Extract script
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let mainScript = '';
while ((m = scriptRegex.exec(html)) !== null) {
  if (m[1].includes('ChessEngine')) {
    mainScript = m[1];
  }
}

if (!mainScript) {
  console.error('Could not find main script in chess/index.html');
  process.exit(1);
}

// Minimal DOM simulation for Node
class MockElement {
  constructor(id = '', tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.classList = {
      _set: new Set(),
      add: (c) => this.classList._set.add(c),
      remove: (c) => this.classList._set.delete(c),
      toggle: (c) => this.classList._set.has(c) ? this.classList._set.delete(c) : this.classList._set.add(c),
      contains: (c) => this.classList._set.has(c)
    };
    this.style = {};
    this.dataset = {};
    this.children = [];
    this.attributes = {};
    this.innerHTML = '';
    this.textContent = '';
    this._listeners = {};
  }
  get lastElementChild() {
    return this.children[this.children.length - 1] || null;
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
    return child;
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k]; }
  addEventListener(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  }
  querySelector(sel) {
    return this.children[0] || new MockElement();
  }
  querySelectorAll(sel) {
    return [];
  }
  closest(sel) {
    return this;
  }
}

const elementsMap = {};
function getMockElement(id) {
  if (!elementsMap[id]) {
    elementsMap[id] = new MockElement(id);
  }
  return elementsMap[id];
}

const mockDocument = {
  documentElement: new MockElement('html', 'html'),
  body: new MockElement('body', 'body'),
  getElementById: (id) => getMockElement(id),
  createElement: (tag) => new MockElement('', tag),
  createElementNS: (ns, tag) => new MockElement('', tag),
  querySelector: (sel) => new MockElement(),
  querySelectorAll: (sel) => [],
  addEventListener: () => {},
  removeEventListener: () => {}
};

const sandbox = {
  console,
  setTimeout: (fn) => fn(),
  setInterval: () => 1,
  clearInterval: () => {},
  document: mockDocument,
  window: {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { origin: 'http://localhost:3000', pathname: '/chess/index.html', search: '' },
    parent: null,
    navigator: { clipboard: { writeText: async () => {} } }
  },
  navigator: { clipboard: { writeText: async () => {} } },
  AudioContext: class {
    constructor() {
      this.state = 'running';
      this.currentTime = 0;
      this.destination = {};
    }
    resume() { return Promise.resolve(); }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {}
      };
    }
    createGain() {
      return {
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {}
      };
    }
  }
};
sandbox.window.parent = sandbox.window;
sandbox.window.document = mockDocument;

vm.createContext(sandbox);

try {
  vm.runInContext(mainScript, sandbox);
  console.log('✅ Main chess script compiled and executed in sandbox without top-level errors');

  // Trigger initDOM
  sandbox.initDOM();
  console.log('✅ initDOM() executed successfully');

  // Execute a real sequence of moves
  console.log('🎮 Testing legal moves sequence...');
  // 1. e4 (from 6,4 to 4,4)
  sandbox.executeMove({ from: { r: 6, c: 4 }, to: { r: 4, c: 4 } });
  console.log('  1. e4 OK');

  // 1... e5 (from 1,4 to 3,4)
  sandbox.executeMove({ from: { r: 1, c: 4 }, to: { r: 3, c: 4 } });
  console.log('  1... e5 OK');

  // 2. Nf3 (from 7,6 to 5,5)
  sandbox.executeMove({ from: { r: 7, c: 6 }, to: { r: 5, c: 5 } });
  console.log('  2. Nf3 OK');

  // 2... Nc6 (from 0,1 to 2,2)
  sandbox.executeMove({ from: { r: 0, c: 1 }, to: { r: 2, c: 2 } });
  console.log('  2... Nc6 OK');

  // 3. d4 (from 6,3 to 4,3)
  sandbox.executeMove({ from: { r: 6, c: 3 }, to: { r: 4, c: 3 } });
  console.log('  3. d4 OK');

  // 3... exd4 (CAPTURE! from 3,4 to 4,3)
  sandbox.executeMove({ from: { r: 3, c: 4 }, to: { r: 4, c: 3 } });
  console.log('  3... exd4 (CAPTURE) OK - tray advantage updated without crashing!');

  // Test Observer stepper
  console.log('🔍 Testing Observer & Stepper...');
  sandbox.stepMove(-1); // Step back to move before capture
  console.log('  stepMove(-1) OK');
  sandbox.stepMove(1);  // Step forward
  console.log('  stepMove(1) OK');
  sandbox.viewMoveAt(1); // View move 1
  console.log('  viewMoveAt(1) OK');
  sandbox.returnToLive();
  console.log('  returnToLive() OK');

  // Test Undo
  console.log('↺ Testing Undo...');
  sandbox.undoMove();
  console.log('  undoMove() OK');

  // Test Toggle Arrow
  console.log('🏹 Testing Move Arrow Toggle...');
  sandbox.toggleArrow();
  sandbox.toggleArrow();
  console.log('  toggleArrow() OK');

  // Test Auto-fullscreen
  console.log('⛶ Testing Auto-fullscreen trigger...');
  sandbox.autoEnterFullscreen();
  console.log('  autoEnterFullscreen() OK');

  console.log('\n🎉 ALL CHESS SIMULATION TESTS PASSED WITH ZERO ERRORS!');
} catch (err) {
  console.error('❌ SIMULATION ERROR:', err);
  process.exit(1);
}
