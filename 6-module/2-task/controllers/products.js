const mongoose = require('mongoose');
const Product = require('../models/Product');

const transformProduct = (product) => {
  const newProduct = JSON.parse(JSON.stringify(product));
  newProduct.id = product._id;
  delete newProduct['_id'];
  delete newProduct['__v'];
  return newProduct;
};

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query.subcategory;
  if (subcategory) {
    const products = await Product.find({subcategory});
    ctx.body = {
      products: products.map((product) => transformProduct(product)),
    };
  } else {
    await next();
  }
};

module.exports.productList = async function productList(ctx) {
  const products = await Product.find();
  ctx.body = {
    products: products.map((product) => transformProduct(product)),
  };
};

module.exports.productById = async function productById(ctx) {
  const id = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const product = await Product.findById(id);
  if (!product) {
    ctx.status = 404;
    return;
  }

  ctx.body = {
    product: transformProduct(product),
  };
};
