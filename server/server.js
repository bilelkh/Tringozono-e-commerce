const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');

const app = express();

// testing database connection
mongoose.connect(config.database, { useMongoClient: true}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

// parses the text as JSON
app.use(bodyParser.json());
// parses the text as URL encoded data
app.use(bodyParser.urlencoded({ extended: false}));
// morgan generate logs
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');

app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);

// testing port connection
app.listen(3030, (err) => {
    console.log("Port: " + config.port);
});
