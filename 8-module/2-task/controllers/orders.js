const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');

module.exports.checkout = async function checkout(ctx, next) {
  const {product: productId, phone, address} = ctx.request.body;
  const product = Product.findById(productId);

  const order = await Order.create({
    user: ctx.user._id,
    product: productId,
    phone,
    address,
  });

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order._id,
      product,
    },
    to: ctx.user.email,
    subject: 'Успешное создание заказа',
  });

  ctx.status = 200;
  ctx.body = {
    order: order._id,
  };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user._id}).populate('product');
  ctx.status = 200;
  ctx.body = {
    orders,
  };
};
