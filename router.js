const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session : false});
const requireSignin = passport.authenticate('local', { session : false});

module.exports = function(app){
    app.get('/', requireAuth, function(req, res){
        res.send({hello: 'You are authorized'});
    });
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
}

/*module.exports = function (app) {
    app.get('/', function(req, res, next){
        res.send(['water', 'phone', 'balloon']);
    });


}*/