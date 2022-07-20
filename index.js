const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const routes = require('./routes');
const passport = require('passport');
const { jwtStrategy } = require('./middleware/passport');
const { handleError, convertToApiError } = require('./middleware/apiError');


//DB connexion
mongoose.connect("mongodb://localhost:27017/auth");

const app = express();
const port = 3090;



app.use(helmet()); // adding Helmet to enhance API's security
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(cors()); // enabling CORS for all requests
app.use(morgan('combined')); // adding morgan to log HTTP requests
app.use(xss());
app.use(mongoSanitize());

// PASSPORT
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);


app.use('/api', routes);

// error handling
app.use(convertToApiError)
app.use((err,req,res,next)=>{
    handleError(err,res)
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});