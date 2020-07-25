//to store authentication strategies

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


var config = require('./config.js');


exports.local=passport.use(new LocalStrategy(User.authenticate()));
//using sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing the user object it will create a token and return it
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

//extract jwt from request header
//optons that i m gonna specify for jwt strategy
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

//exporting jwt strategy
//jwt strategy takes two parameters
//first parameter is opts we have created
//second parameter is verify function
//done is the call back provided by passport
//with the help of this done we will be passing nformaton to passport to load it on to request msg
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

//used to verify incoming user
//we are not creating sessions
//how this strategy is gonna work?
//token wll be ncluded in authentication header
//f it is included then it is extracted and that will be used to authenticate the user based on taken
exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = function (req, res, next) {
    if (req.user.admin) {
        next();
    } else {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
}

