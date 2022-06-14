const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jwt-simple');
const config = require('./config');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const User = require('./models/user');

//DB connexion
mongoose.connect("mongodb://localhost:27017/auth");

const app = express();
const port = 3090;


const roles = [
    'ROLE_DOCTOR',
    'ROLE_ADMIN'
]

app.use(helmet()); // adding Helmet to enhance API's security
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(cors()); // enabling CORS for all requests
app.use(morgan('combined')); // adding morgan to log HTTP requests

function tokenForUser(user){
    const timeStamp = new Date().getTime();
    return jwt.encode({ subject: user.id , issuedAt : timeStamp}, config.secret);
}

app.get('/', (req, res) => {
    res.send('Hello, world');
});

app.post('/api/auth/signup', (req, res, next) => {
    const { username, email, password } = req.body;

    User.findOne({ email : email}, function(err, existingUser){
        if(err) {return next(err);}

        if(existingUser){
            return res.status(422).send({error : 'Email is in use'});
        }

        const user = new User({
            username : username,
            email : email,
            password : password
        })

        user.save(function(err){
            if(err) {return next(err);}
        });

        res.json({
            message: `Registered as ${username}`,
            token : tokenForUser(user)
        });

    });


});

app.post('/api/auth/signin', (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({username : username}, function(err, user){
        if (err) {return next(err);}

        if(!user) {
            return res.json(
                {message : `User ${username} not found`, roles: []}
            );
        }

        user.comparePassword(password, (err, isMatch)=> {
            if(err) res.status(400).send(err);
            if(!isMatch) res.json({message : "Bad password", roles: []});

            res.json({
                accessToken: tokenForUser(user),
                username,
                roles
            });
        });

    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});