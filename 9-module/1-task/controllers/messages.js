const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({
    user: ctx.user.displayName,
  }).sort({
    _id: -1,
  }).limit(20);

  ctx.body = {
    messages: messages.map(({_id: id, date, text, user}) => ({
      id,
      date,
      text,
      user,
    })),
  };
};
