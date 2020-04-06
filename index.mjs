const KEYS = 1;
const VALUES = 2;
const KEYS_VALUES = 3;

export default class WeakValueMap {
  #eager;
  #map = new Map();
  #group = new FinalizationRegistry((key) => {
    this.#map.delete(key);
  });

  constructor(iterable = undefined, { eager = true } = {}) {
    this.#eager = eager;

    if (iterable !== undefined && iterable !== null) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }
  }

  set(key, value) {
    const entry = this.#map.get(key);
    if (this.#eager && entry !== undefined) {
      this.#group.unregister(entry);
    }
    const ref = new WeakRef(value);
    this.#map.set(key, ref);
    if (this.#eager) {
      this.#group.register(value, key, ref);
    }
  }

  has(key) {
    const w = this.#map.get(key);
    if (w === undefined) {
      return false;
    }
    if (w.deref() === undefined) {
      this.#map.delete(key);
      if (this.#eager) {
        this.#group.unregister(w);
      }
      return false;
    }
    return true;
  }

  get(key) {
    const w = this.#map.get(key);
    if (w === undefined) {
      return undefined;
    }
    const v = w.deref();
    if (v === undefined) {
      this.#map.delete(key);
      if (this.#eager) {
        this.#group.unregister(w);
      }
      return undefined;
    }
    return v;
  }

  delete(key) {
    const w = this.#map.get(key);
    if (w !== undefined) {
      this.#map.delete(key);
      if (this.#eager) {
        this.#group.unregister(w);
      }
      if (w.deref() === undefined) {
        return false;
      }
      return true;
    }
    return false;
  }

  clear() {
    if (this.#eager) {
      for (const w of this.#map.values()) {
        this.#group.unregister(w);
      }
    }
    this.#map.clear();
  }

  #iterator = function* iterator(type) {
    for (const [key, weak] of this.#map) {
      const v = weak.deref();
      if (v === undefined) {
        this.#map.delete(key);
        if (this.#eager) {
          this.#group.unregister(weak);
        }
      } else if (type === KEYS) {
        yield key;
      } else if (type === VALUES) {
        yield v;
      } else {
        yield [key, v];
      }
    }
  };

  keys() {
    return this.#iterator(KEYS);
  }

  values() {
    return this.#iterator(VALUES);
  }

  entries() {
    return this.#iterator(KEYS_VALUES);
  }

  forEach(callback, thisArg) {
    for (const [key, value] of this) {
      callback.call(thisArg, key, value, this);
    }
  }
}

Object.defineProperty(WeakValueMap.prototype, Symbol.iterator, {
  value: WeakValueMap.prototype.entries,
  writable: true,
  enumerable: false,
  configurable: true,
});
