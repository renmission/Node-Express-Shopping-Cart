const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/config');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

// init app
const app = express();

// db connect
mongoose.connect(config.database, { useNewUrlParser: true }, (err) => {
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
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// express messages middleware
app.use(flash());

//Local varibales using middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.errors = req.flash('errors');
    next();
});

// set public folder
app.use(express.static(path.join(__dirname + '/public')));


//set error global
app.locals.errors = null;

// set routes
app.use('/', require('./routes/pages'));
app.use('/admin/pages', require('./routes/admin_pages'));

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});