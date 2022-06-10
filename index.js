const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');


// DB setup
mongoose.connect("mongodb://localhost:27017/auth");



// App setup
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors()); // enabling CORS for all requests
router(app);

// Server setup
const port = process.env.PORT || 3090;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

