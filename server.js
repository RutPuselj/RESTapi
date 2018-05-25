let express = require('express'),
    app = express(), // define app using express
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    User = require('./api/models/UserModel'),
    Anime = require('./api/models/AnimeModel'),
    //Manga = require('./api/models/MangaModel'),
    bodyParser = require('body-parser'),
    config = require('./api/config/database'),
    jwt = require('jwt-simple'),
    swaggerJSDoc = require('swagger-jsdoc'),
    path = require('path');

var swaggerDefinition = {
    info: {
        title: 'REST API',
        version: '1.0.0',
        description: 'Simple REST API made with Node.js, Express and MongoDB. It has two types of resources: users and anime. Users need to be authenticated with bearer token to access all routes beside /users and /users/login.',
    },
    host: 'localhost:8080',
    basePath: '/api',
};

var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./api/routes/*.js'],
};

let swaggerSpec = swaggerJSDoc(options);

app.use(express.static(path.join(__dirname, 'public'))); 

mongoose.connect('mongodb://localhost/myApiDB', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        let decoded = jwt.decode(req.headers.authorization.split(' ')[1], config.secret);
        if (decoded) {
            res.locals = {
                user: req.user
            };
            req.user = decoded;
            next();
        } else {
            req.user = undefined;
            next();
        }
    } else {
        req.user = undefined;
        next();
    }
});

let routes = require('./api/routes/routes');
routes(express, app, swaggerSpec);

app.use(function (req, res) {
    res.status(404).send({
        message: req.originalUrl + ' not found'
    })
});


app.listen(port, () => {
    console.log('RESTful API server started on port: ' + port);
});