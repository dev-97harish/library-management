const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
let opts = {
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'nodejs-learning',
};

passport.use(
  new JWTStrategy(opts, function (jwtPayload, done) {
    User.findById(jwtPayload._id, function (err, user) {
      if (err) {
        console.log('error in finding users from jwt');
        return;
      }
      if (user) {
        console.log(user, 'usr::');
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;
