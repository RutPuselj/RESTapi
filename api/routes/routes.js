'use strict';

module.exports = function (express, app, swaggerSpec) {
    const usersList = require('../controllers/UserController');
    const animeList = require('../controllers/AnimeController');
    //const mangaList = require('../controllers/MangaController');

    const jwt = require('jwt-simple');
    const passport = require('passport');
    require('../config/passport')(passport);

    var userRouter = express.Router();
    var animeRouter = express.Router();
    var animeUserRouter = express.Router({
        mergeParams: true
    });
    /*var mangaRouter = express.Router({
        mergeParams: true
    });*/
    var apiRouter = express.Router();

    userRouter.use('/:userId/anime', animeUserRouter);
    //userRouter.use('/:userId/manga', mangaRouter);

    /**
     * @swagger
     *   response:
     *     UnauthorizedError:
     *       description: access token is missing or invalid
     */

     /**
     * @swagger
     *   securityDefinition:
     *     token_authorization:
     *       type: apiKey
     *       in: header
     *       name: Authorization
     *       scheme: bearer
     *       bearerFormat: JWT
     */

    /**
     * @swagger
     * definition:
     *   User:
     *     type: object
     *     required:
     *       - username
     *       - password
     *     properties:
     *       _id: 
     *         type: string
     *       username:
     *         type: string
     *       password:
     *         type: string
     *         format: password
     *       full_name:
     *         type: string
     *       created_date:
     *         type: string
     *         format: date
     */

    /**
     * @swagger
     * definition:
     *   Anime:
     *     type: object
     *     required:
     *       - title
     *     properties:
     *       _id: 
     *         type: string
     *       title: 
     *         type: string
     *       studio: 
     *         type: string
     *         default: Unknown
     *       year: 
     *         type: string
     *         default: Unknown
     *       episodes: 
     *         type: string
     *         default: Unknown
     *       status: 
     *         type: string
     *         default: Unknown
     *         items:
     *           type: string
     *         enum:
     *           - Upcoming
     *           - Airing
     *           - Finished
     *           - Unknown
     *       genres: 
     *         type: array
     *         items:
     *           type: string
     *       created_date: 
     *         type: string
     *         format: date
     *       comments: 
     *         type: string
     *       image: 
     *         type: string
     *       postedBy: 
     *         type: integer
     */


    /**
     * @swagger
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     description: Returns an array of all registered/created users.
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: an array of users
     *         schema:
     *           $ref: '#/definitions/User'
     *       400:
     *         description: bad request
     */

    /**
     * @swagger
     * /users:
     *   post:
     *     tags:
     *       - Users
     *     description: Creates a new user with given parameters.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         description: Username
     *         in: body
     *         required: true
     *         schema:
     *           type: string
     *       - name: password
     *         description: Password
     *         in: body
     *         required: true
     *         schema:
     *           type: string
     *       - name: full_name
     *         description: Full name
     *         in: body
     *         required: false
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: successfully created new user
     *         schema:
     *           $ref: '#/definitions/User'
     *       400:
     *         description: bad request
     */

    userRouter.route('/')
        .get(usersList.getAllUsers)
        .post(usersList.createNewUser);

    /**
     * @swagger
     * /users/{userId}:
     *   get:
     *     tags:
     *       - Users
     *     description: Returns a single user with userId.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userId
     *         description: User's id
     *         in: path
     *         required: true
     *         type: integer
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: a single user with userId
     *         schema:
     *           $ref: '#/definitions/User'
     *       404:
     *         description: user not found
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    /**
     * @swagger
     * /users/{userId}:
     *   put:
     *     tags: 
     *       - Users
     *     description: Updates a single user with userId.
     *     produces: application/json
     *     parameters:
     *       - name: username
     *         description: Username
     *         in: body
     *         required: true
     *         schema:
     *           type: string
     *       - name: password
     *         description: Password
     *         in: body
     *         required: true
     *         schema:
     *           type: string
     *       - name: full_name
     *         description: Full name
     *         in: body
     *         required: false
     *         schema:
     *           type: string
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: user successfully updated
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     *           
     */

    /**
     * @swagger
     * /users/{userId}:
     *   delete:
     *     tags:
     *       - Users
     *     description: Deletes a single user with userId.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userId
     *         description: User's unique id
     *         in: path
     *         required: true
     *         type: integer
     *     security:
     *       - token_authorization: []
     *     responses:
     *       204:
     *         description: user successfully deleted
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    userRouter.route('/:userId')
        .get(usersList.loginRequired, usersList.getUser)
        .put(usersList.loginRequired, usersList.updateUser)
        .delete(usersList.loginRequired, usersList.deleteUser);

    /**
     * @swagger
     * /users/login:
     *   post:
     *     tags:
     *       - Users
     *     description: Login an already created (registered) user.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         description: Username
     *         in: body
     *         required: true
     *         schema:
     *           type: string
     *       - name: password
     *         description: Password
     *         in: body
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: user successfully logged in and received an unique token
     *       400:
     *         description: bad request
     */

    apiRouter.route('/login')
        .post(usersList.authenticate);

    /**
     * @swagger
     * /users/{userId}/anime:
     *   get:
     *     tags:
     *       - Users
     *     description: Returns all anime user with userId has posted.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userId
     *         description: User's id
     *         in: path
     *         required: true
     *         type: integer
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: an array of anime from user with userId
     *         schema:
     *           $ref: '#/definitions/Anime'
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    animeUserRouter.route('/')
        .get(usersList.loginRequired, animeList.getAllUserAnime);
    //.post(usersList.loginRequired, animeList.createNewAnime);

    /**
     * @swagger
     * /users/{userId}/anime/{animeId}:
     *   get:
     *     tags:
     *       - Users
     *     description: Returns a specific anime with animeId posted by user with userId.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: userId
     *         description: Users's id
     *         in: path
     *         required: true
     *         type: integer
     *       - name: animeId
     *         description: Anime's id
     *         in: path
     *         required: true
     *         type: integer
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: a single anime with animeId from user with userId
     *         schema:
     *           $ref: '#/definitions/Anime'
     *       404:
     *         description: anime not found
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    /**
     * @swagger
     * /users/{userId}/anime/{animeId}:
     *   put:
     *     tags: 
     *       - Users
     *     description: Updates an anime with animeId from user with userId.
     *     produces: application/json
     *     parameters:
     *       - name: anime
     *         in: body
     *         description: Fields for the anime resource
     *         schema:
     *           type: array
     *           $ref: '#/definitions/Anime'
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: anime successfully updated
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     *           
     */

    /**
     * @swagger
     * /users/{userId}/anime/{animeId}:
     *   delete:
     *     tags:
     *       - Users
     *     description: Deletes a single anime with animeId from user with userId.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: animeId
     *         description: Anime's unique id
     *         in: path
     *         required: true
     *         type: integer
     *     security:
     *       - token_authorization: []
     *     responses:
     *       204:
     *         description: anime successfully deleted
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */


    animeUserRouter.route('/:animeId')
        .get(animeList.getUserAnime)
        .put(animeList.updateAnime)
        .delete(animeList.deleteAnime);

    /**
     * @swagger
     * /anime:
     *   get:
     *     tags:
     *       - Anime
     *     description: Returns an array of all anime data. User login required.
     *     produces:
     *       - application/json
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: an array of anime
     *         schema:
     *           $ref: '#/definitions/Anime'
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    /**
     * @swagger
     * /anime:
     *   post:
     *     tags:
     *       - Anime
     *     description: Creates a new anime with given parameters.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: anime
     *         description: Anime
     *         in: body
     *         required: true
     *         schema:
     *           $ref: '#/definitions/Anime'
     *     security:
     *       - token_authorization: []
     *     responses:
     *       201:
     *         description: successfully created new anime
     *         schema:
     *           $ref: '#/definitions/Anime'
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    animeRouter.route('/')
        .get(usersList.loginRequired, animeList.getAllAnime)
        .post(usersList.loginRequired, animeList.createNewAnime);

    /**
     * @swagger
     * /anime/{animeId}:
     *   get:
     *     tags:
     *       - Anime
     *     description: Returns a single anime.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: animeId
     *         description: Anime's id
     *         in: path
     *         required: true
     *         type: integer
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: a single anime with animeId
     *         schema:
     *           $ref: '#/definitions/Anime'
     *       404:
     *         description: anime not found
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    /**
     * @swagger
     * /anime/{animeId}:
     *   put:
     *     tags: 
     *       - Anime
     *     description: Updates an anime with animeId.
     *     produces: application/json
     *     parameters:
     *       - name: anime
     *         in: body
     *         description: Fields for the anime resource
     *         schema:
     *           type: array
     *           $ref: '#/definitions/Anime'
     *     security:
     *       - token_authorization: []
     *     responses:
     *       200:
     *         description: anime successfully updated
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     *           
     */

    /**
     * @swagger
     * /anime/{animeId}:
     *   delete:
     *     tags:
     *       - Anime
     *     description: Deletes a single anime with animeId.
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: animeId
     *         description: Anime's unique id
     *         in: path
     *         required: true
     *         type: integer
     *     security:
     *       - token_authorization: []
     *     responses:
     *       204:
     *         description: anime successfully deleted
     *       400:
     *         description: bad request
     *       401:
     *         $ref: '#/responses/UnauthorizedError'
     */

    animeRouter.route('/:animeId')
        .get(usersList.loginRequired, animeList.getAnime)
        .put(usersList.loginRequired, animeList.updateAnime)
        .delete(usersList.loginRequired, animeList.deleteAnime);

    /*mangaRouter.route('/')
        .get(usersList.loginRequired, mangaList.getAllManga)
        .post(usersList.loginRequired, mangaList.createNewManga);

    mangaRouter.route('/:mangaId')
        .get(mangaList.getManga)
        .put(mangaList.updateManga)
        .delete(mangaList.deleteManga);*/


    app.get('/swagger.json', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.use('/api/users', userRouter);
    app.use('/api/anime', animeRouter);
    //app.use('/api/manga', mangaRouter);
    app.use('/api', apiRouter);

}