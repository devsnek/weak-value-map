import assert from 'assert';
import WeakValueMap from '.';

[
  [WeakValueMap, 'WeakValueMap', 0],
  [WeakValueMap.prototype.get, 'get', 1],
  [WeakValueMap.prototype.has, 'has', 1],
  [WeakValueMap.prototype.set, 'set', 2],
  [WeakValueMap.prototype.delete, 'delete', 1],
  [WeakValueMap.prototype.clear, 'clear', 0],
  [WeakValueMap.prototype.entries, 'entries', 0],
  [WeakValueMap.prototype.keys, 'keys', 0],
  [WeakValueMap.prototype.values, 'values', 0],
  [WeakValueMap.prototype[Symbol.iterator], 'entries', 0],
].forEach(([f, n, l]) => {
  assert.strictEqual(typeof f, 'function');
  assert.strictEqual(f.name, n);
  assert.strictEqual(f.length, l);
});

{
  const m = new WeakValueMap();
  const o = {};
  m.set(1, o);
  assert.strictEqual(m.has(1), true);
  assert.strictEqual(m.get(1), o);
  assert.strictEqual(m.delete(1), true);
  assert.strictEqual(m.has(1), false);
  assert.strictEqual(m.get(1), undefined);
}

{
  const m = new WeakValueMap([
    [1, { k: 1 }],
    [2, { k: 2 }],
    [3, { k: 3 }],
  ]);

  let i = 0;
  for (const [k, v] of m) {
    i += 1;
    assert.strictEqual(k, v.k);
  }

  assert.strictEqual(i, 3);

  m.clear();

  for (const [k, v] of m) {
    assert.fail();
  }
}

[
  0, 1,
  Symbol(),
  'hi',
  [undefined],
  [null],
  true,
].forEach((v) => {
  assert.throws(() => {
    new WeakValueMap(v);
  });
});

{
  const m = new WeakValueMap([
    [1, { k: 1 }],
    [2, { k: 2 }],
    [3, { k: 3 }],
  ]);

  assert.strictEqual(m.entries, m[Symbol.iterator]);

  let i = 0;
  for (const key of m.keys()) {
    i += 1;
    assert.strictEqual(key, i);
  }

  i = 0;
  for (const value of m.values()) {
    i += 1;
    assert.deepStrictEqual(value, { k: i });
  }

  i = 0;
  for (const entry of m.entries()) {
    i += 1;
    assert.deepStrictEqual(entry, [i, { k: i }]);
  }
}
