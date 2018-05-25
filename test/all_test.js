const mocha = require('mocha');
const assert = require('assert');
const User = require('../api/models/UserModel');
const Anime = require('../api/models/AnimeModel');

const mongoose = require('mongoose');
const server = require('../server');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const jwt = require('jwt-simple');
const config = require('../api/config/database');
const passport = require('passport');


chai.use(chaiHttp);

describe('REST API TESTS', () => {

    let userId = null;
    let token = null;
    let animeId = null;
    let userAnimeId = null;
    passport.authenticate('jwt', {
        session: false
    });

    before(function (done) {
        User.remove({}, function () {});
        Anime.remove({}, function () {
            done();
        });
    });

    after(function (done) {
        User.remove({}, function () {});
        Anime.remove({}, function () {
            done();
        });
    });


    describe('POST user: /api/users', () => {
        it('should not POST an user without \'username\' field', (done) => {
            let user = new User({
                password: 'mochatester102',
            });
            chai.request('http://localhost:8080')
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.eql(false);
                    res.body.message.should.eql('Please enter username and password.');
                    done();
                });
        });

        it('should not POST an user without \'password\' field', (done) => {
            let user = new User({
                username: 'Mocha Tester',
            });
            chai.request('http://localhost:8080')
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.success.should.eql(false);
                    res.body.message.should.eql('Please enter username and password.');
                    done();
                });
        });

        it('should POST an user with unique \'username\' and \'password\' and return 201 Created', (done) => {
            let user = new User({
                username: 'BTS Lover',
                password: 'mochatester102',
            });
            chai.request('http://localhost:8080')
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    userId = res.body.user._id;
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.success.should.eql(true);
                    res.body.message.should.eql('Successfully created new user.');
                    done();
                });
        });
    });

    describe('GET users: /api/users', () => {
        it('should GET all the users', (done) => {
            chai.request('http://localhost:8080')
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('User authentication: /api/login', () => {
        it('should login an user with correct \'username\' and \'password\' and give token', (done) => {
            chai.request('http://localhost:8080')
                .post('/api/login/')
                .send({
                    username: 'BTS Lover',
                    password: 'mochatester102'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.success.should.eql(true);
                    res.body.should.have.property('token');
                    token = res.body.token;
                    done();
                });
        });

        describe('GET user: /api/users/:userId', () => {
            it('should GET an user by the given user id', (done) => {
                chai.request('http://localhost:8080')
                    .get('/api/users/' + userId)
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('username');
                        res.body.should.have.property('password');
                        res.body.should.have.property('_id').eql(userId);
                        done();
                    });
            });
        });
    
        describe('PUT user: /api/users/:userId', () => {
            it('should update an user with \'userId\'', (done) => {
                chai.request('http://localhost:8080')
                    .put('/api/users/' + userId)
                    .send({
                        username: 'Flame of love',
                    })
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.success.should.eql(true);
                        res.body.message.should.eql('User successfully updated!');
                        res.body.user.username.should.eql('Flame of love');
                        done();
                    });
            });
        });

        describe('GET anime: /api/anime', () => {
            it('should GET the anime route with given token', (done) => {
                chai.request('http://localhost:8080')
                    .get('/api/anime/')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });

            it('should not GET the anime route without token (401 Unauthorized)', (done) => {
                chai.request('http://localhost:8080')
                    .get('/api/anime/')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.success.should.eql(false);
                        res.body.message.should.eql('Unauthorized user!');
                        done();
                    });
            });


            it('should send 401 Unauthorized if wrong token is given', (done) => {
                chai.request('http://localhost:8080')
                    .get('/api/anime/')
                    .set('Authorization', 'wrong token')
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.be.a('object');
                        res.body.success.should.eql(false);
                        res.body.message.should.eql('Unauthorized user!');
                        done();
                    });
            });
        });

        describe('POST anime: /api/anime', () => {
            it('should not POST an anime without \'title\' field', (done) => {
                let anime = new Anime({
                    year: '2017',
                });
                chai.request('http://localhost:8080')
                    .post('/api/anime')
                    .set('Authorization', token)
                    .send(anime)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.success.should.eql(false);
                        res.body.message.should.eql('Please enter the title.');
                        done();
                    });
            });

            it('should POST an anime with \'title\' and optional other fields', (done) => {
                let anime = new Anime({
                    title: 'Fullmetal Alchemist: Brotherhood',
                    studio: 'Bones',
                    year: '2009',
                    episodes: '64',
                    status: 'Finished',
                    genres: ['Action', 'Military', 'Adventure', 'Comedy'],
                    comments: 'Best anime ever.',
                });
                chai.request('http://localhost:8080')
                    .post('/api/anime')
                    .set('Authorization', token)
                    .send(anime)
                    .end((err, res) => {
                        animeId = res.body.anime._id;
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.anime.should.not.have.property('image');
                        res.body.success.should.eql(true);
                        res.body.message.should.eql('Successfully created new anime!');
                        done();
                    });
            });

        });

        describe('GET anime: /api/anime/:animeId', () => {
            it('should GET the unique anime', (done) => {
                chai.request('http://localhost:8080')
                    .get('/api/anime/' + animeId)
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('title');
                        res.body.should.have.property('_id').equal(animeId);
                        done();
                    });
            });
        });

        describe('PUT anime: /api/anime/:animeId', () => {
            it('should edit the unique anime with \'animeId\'', (done) => {
                chai.request('http://localhost:8080')
                    .put('/api/anime/' + animeId)
                    .set('Authorization', token)
                    .send({
                        image: 'https://vignette.wikia.nocookie.net/fma/images/e/e9/Fmab-poster.png/revision/latest?cb=20131124145205',
                        comments: 'Best anime ever and also my favourite one.'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.anime.should.have.property('image');
                        res.body.success.should.eql(true);
                        res.body.message.should.eql('Anime successfully updated!');
                        done();
                    });
            });
        });

        describe('GET anime: /api/users/:userId/anime', () => {
            it('should GET all the anime user with \'userId\' have posted', (done) => {
                chai.request('http://localhost:8080')
                    .get('/api/users/' + userId + '/anime')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        if (res.body instanceof Array) {
                            res.body[0].should.have.property('postedBy');
                            userAnimeId = res.body[0]._id;
                        } else {
                            res.body.should.have.property('postedBy');
                            userAnimeId = res.body._id;
                        }
                        done();
                    });
            });
        });

        describe('GET anime: /api/users/:userId/anime/:animeId', () => {
            it('should GET first anime from the user with \'userId\'', (done) => {
                chai.request('http://localhost:8080')
                    .get('/api/users/' + userId + '/anime/' + userAnimeId)
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });

        describe('PUT anime: /api/users/:userId/anime/:animeId', () => {
            it('should edit the first anime from the user with \'userId\' and return 201 Created', (done) => {
                let anime = new Anime({
                    comments: 'Fullmetal Alchemist: Brotherhood is really an amazing piece of art.',
                });
                chai.request('http://localhost:8080')
                    .put('/api/users/' + userId + '/anime/' + userAnimeId)
                    .set('Authorization', token)
                    .send(anime)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.success.should.eql(true);
                        res.body.message.should.eql('Anime successfully updated!')
                        done();
                    });
            });
        });

        describe('DELETE anime: /api/users/:userId/anime/:animeId', () => {
            it('should DELETE the first anime from the user with \'userId\'', (done) => {
                chai.request('http://localhost:8080')
                    .delete('/api/users/' + userId + '/anime/' + userAnimeId)
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });
        });

        describe('POST anime: /api/anime/', () => {
            it('should POST new anime so you can delete it from another route', (done) => {
                chai.request('http://localhost:8080')
                    .post('/api/anime')
                    .set('Authorization', token)
                    .send({
                        title: 'Shingeki No Kyojin',
                        year: '2014'
                    })
                    .end((err, res) => {
                        animeId = res.body.anime._id;
                        res.should.have.status(201);
                        done();
                    });
            });
        });
    
        describe('DELETE anime: /api/anime/:animeId', () => {
            it('should DELETE an anime with \'animeId\'', (done) => {
                chai.request('http://localhost:8080')
                    .delete('/api/anime/' + animeId)
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(204);
                        done();
                    });
            });

            it('should return 404 Not Found if nonexistent \'animeId\' is written', (done) => {
                chai.request('http://localhost:8080')
                    .delete('/api/anime/' + 'wrong ID')
                    .set('Authorization', token)
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });

    describe('DELETE user: /api/users/:userId', () => {
        it('should DELETE an user with \'userId\'', (done) => {
            chai.request('http://localhost:8080')
                .delete('/api/users/' + userId)
                .set('Authorization', token)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('GET wrong route: /some/route', () => {
        it('should return 404 Not Found if wrong route is written', (done) => {
            chai.request('http://localhost:8080')
                .get('/some/route')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.message.should.eql('/some/route not found');
                    done();
                });
        });
    });

});