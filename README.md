# WeakValueMap

A map where the values are weak.

```js
import WeakValueMap from '@snek/wvm';

const map = new WeakValueMap();
map.set('some key', someBigObject);
```

### `new WeakValueMap([iterable [, options]])`

* `iterable` An Array or other iterable object whose elements are
  key-value pairs (arrays with two elements, e.g. `[[ 1, { a: 1 } ], [ 2, { a: 2 } ]]`).
  Each key-value pair is added to the new Map; `null` values are treated as `undefined`.
* `options`
  * `eager` A boolean option indicating whether collected items should be eagerly tracked
    and removed from the map. If you have concerns about GC pressure, you may want to
    consider disabling this option. **Default**: `true`.
