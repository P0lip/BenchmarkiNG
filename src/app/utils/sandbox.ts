const window = {}; // hopefully this is going to be shared... if not, we might have a memory leak here
const worker = {}; // same as above...

const iframe = document.body.appendChild(document.createElement('iframe'));
Object.getOwnPropertyNames(iframe.contentWindow).forEach(key => {
  const val = iframe.contentWindow[key];
  if (!/^(?:webkit|moz|ms)/.test(key)) { // even though vendor-prefixed functions are not enumerable, we add a simple check here
    if (typeof val === 'function') {
      window[key] = Function.prototype.bind.call(val, iframe.contentWindow); // contentWindow is unlikely to be GC-ed in this case
    } else {
      window[key] = val;
    }
  }
});

iframe.remove();
Object.freeze(window);

const traps = {
  has(): boolean {
    return true;
  },

  get(target: Object, prop: string | symbol): any {
    if (prop !== Symbol.unscopables) {
      if (!(prop in target)) {
        throw new ReferenceError(`${prop} is undefined.`);
      }

      return target[prop];
    }
  },
};

export default (func: string, obj = {}): any => {
  const context = Object.assign({}, window, obj);
  const sandboxedFunc = new Function(
    'sandbox',
    `with(sandbox){ ${func.replace(/^[\n\r;]*/, '')} }`,
  );
  return sandboxedFunc(new Proxy(context, traps));
};
