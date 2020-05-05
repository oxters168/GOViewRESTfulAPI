const express = require('express');
const app = express();
const debugLog = require('morgan');
const bodyParser = require('body-parser');

const GOViewRoutes = require('./api/routes/GOView');

//Logs requests as they come in
app.use(debugLog('dev'));
//Parses bodies with json (not actually using this currently)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Avoid CORS error
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET');
        return res.status(200).json({});
    }
    next();
});

//Filters all requests received with GOView in the url and funnels them to GOView.js
app.use('/GOView', GOViewRoutes);

//If message was not handled by any routes, pass not found error
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Handle all errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;