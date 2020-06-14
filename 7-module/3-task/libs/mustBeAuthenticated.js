module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    const error = new Error();
    error.status = 401;
    error.message = 'Пользователь не залогинен';
    throw error;
  }
  return next();
};
