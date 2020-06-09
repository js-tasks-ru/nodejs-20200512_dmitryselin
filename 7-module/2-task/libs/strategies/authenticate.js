const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  const user = await User.findOne({email});
  if (user) return done(null, user, null);

  const newUser = new User({
    email,
    displayName,
  });

  const emailValidationError = newUser.validateSync('email');
  if (emailValidationError) return done(emailValidationError, false, null);

  await newUser.save();
  done(null, newUser, null);
};
