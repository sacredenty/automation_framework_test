const assert = require('assert');
const { searchProducts, authenticate } = require('../../demo/catalog');

const lamp = searchProducts('lamp');
assert.strictEqual(lamp.length, 1);
assert.strictEqual(lamp[0].id, 'aurora-lamp');

const kitchen = searchProducts('Kitchen');
assert.deepStrictEqual(kitchen.map((product) => product.id), ['cobalt-mug']);

assert.strictEqual(searchProducts('').length, 3);
assert.strictEqual(searchProducts('   ').length, 3);
assert.strictEqual(searchProducts('nope').length, 0);

const user = authenticate('ada@example.com', 'lightning');
assert.strictEqual(user.name, 'Ada Lovelace');
assert.strictEqual(authenticate('ada@example.com', 'nope'), null);

console.log('catalog unit checks passed');
