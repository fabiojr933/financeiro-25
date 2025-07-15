const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const express = require('express');
const appExpress = express();
const bodyParser = require('body-parser');
const Route = require('./src/routes/routes');







    appExpress.set('view engine', 'ejs');
    appExpress.set('views', path.join(__dirname, 'views'));
    appExpress.use(express.static(path.join(__dirname, 'public')));
    appExpress.use(bodyParser.json());
    appExpress.use(bodyParser.urlencoded({ extended: true }));
    appExpress.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 3000000, secure: false }
    }));
    appExpress.use(flash());
    appExpress.use(cookieParser());
    appExpress.use('/', Route);

appExpress.listen(3000, () => {
        console.log('Servidor Express rodando na porta 3000');
      
});
