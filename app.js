const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

//For cookie
app.use(cookieParser());

// App Use
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//Routes Imports
const user = require('./routes/userRoute');
const clock = require('./routes/sponsoredClockRoutes');
const information = require('./routes/informativeRoute');

app.use('/api/v1', user);
app.use('/api/v1', clock);
app.use('/api/v1', information);

module.exports = app;
