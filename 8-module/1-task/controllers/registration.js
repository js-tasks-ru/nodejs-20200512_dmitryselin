const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {email, displayName, password} = ctx.request.body;
  const user = await User.findOne({email});

  if (user) {
    ctx.status = 400;
    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };
    return next();
  }

  const newUser = await User.create({email, displayName, verificationToken});
  await newUser.setPassword(password);
  await newUser.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
  });

  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  const user = await User.findOne({verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return next();
  }

  user.verificationToken = undefined;
  await user.save();

  const token = uuid();
  ctx.body = {token};
};
