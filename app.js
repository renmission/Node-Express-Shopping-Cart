const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/config');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');

// init app
const app = express();

// db connect
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => {
    if (err) return console.log(err);
    console.log('DB CONNECTED');
});

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express session middleware
// resave: true, remove cookie: { secure: true } to unable the connect-flash
app.use(session({
    secret: 'keyboard cat',
    resave: true, // make this true
    saveUninitialized: true,
    // cookie: { secure: true } - REMOVE THIS
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// set public folder
app.use(express.static(path.join(__dirname + '/public')));


// Set global errors variable
app.locals.errors = null;

//express fileupload
app.use(fileUpload());


// set routes
app.use('/', require('./routes/pages'));
app.use('/admin/pages', require('./routes/admin_pages'));
app.use('/admin/categories', require('./routes/admin_categories'));
app.use('/admin/products', require('./routes/admin_products'));

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});