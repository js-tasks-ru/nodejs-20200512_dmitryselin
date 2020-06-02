const Product = require('../models/Product');

const transformProduct = (product) => {
  const newProduct = JSON.parse(JSON.stringify(product));
  newProduct.id = product._id;
  delete newProduct['_id'];
  delete newProduct['__v'];
  return newProduct;
};

module.exports.productsByQuery = async function productsByQuery(ctx) {
  const query = ctx.query.query;

  const products = await Product.find({
    $text: {
      $search: query,
    },
  });

  ctx.body = {
    products: products.map((product) => transformProduct(product)),
  };
};
