const PRODUCTS = [
  {
    id: 'aurora-lamp',
    name: 'Aurora Lamp',
    price: 48,
    tag: 'lighting'
  },
  {
    id: 'cobalt-mug',
    name: 'Cobalt Mug',
    price: 18,
    tag: 'kitchen'
  },
  {
    id: 'nimbus-notebook',
    name: 'Nimbus Notebook',
    price: 12,
    tag: 'stationery'
  }
];

const USERS = [
  {
    email: 'ada@example.com',
    password: 'lightning',
    name: 'Ada Lovelace'
  }
];

function searchProducts(query = '') {
  const needle = query.trim().toLowerCase();
  if (!needle) return PRODUCTS.slice();
  return PRODUCTS.filter((product) =>
    `${product.name} ${product.tag}`.toLowerCase().includes(needle)
  );
}

function authenticate(email, password) {
  return USERS.find((user) => user.email === email && user.password === password) || null;
}

module.exports = { PRODUCTS, USERS, searchProducts, authenticate };
