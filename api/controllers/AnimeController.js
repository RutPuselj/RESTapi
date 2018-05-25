'use strict';

const mongoose = require('mongoose');
const Anime = mongoose.model('Anime');
const express = require('express');
let app = express();

exports.getAllAnime = function(req, res) {
    Anime.find({}, function(err, anime) {
        if(anime === null || err) {
            res.status(400).send({
                success: false,
                message: 'Anime not found.'
            });
        } else {
            res.status(200).json(anime);
        }
    });
};

exports.createNewAnime = function(req, res) {
    let newAnime = new Anime(req.body);
    newAnime.postedBy = res.locals.user._id;
    newAnime.save(function(err, anime) {
        if(anime === undefined || err) {
            res.status(400).send({
                success: false,
                message: 'Please enter the title.'
            });
        } else {
            res.status(201).json({
                success: true,
                message: 'Successfully created new anime!',
                anime: anime
            });
        }
    });
};

exports.deleteAnime = function(req, res) {
    Anime.remove({_id: req.params.animeId}, function(err, anime) {
        if(anime === undefined || err) {
            res.status(404).send(err);
        } else {
            res.status(204).json();
        }
    });
};

exports.updateAnime = function(req, res) {
    Anime.findOneAndUpdate( {_id: req.params.animeId}, req.body, {new: true}, function(err, anime) {
        if(anime === undefined || err) {
            res.status(400).send(err);
        } else {
            res.status(200).json({
                success: true,
                message: 'Anime successfully updated!',
                anime: anime
            });
        }
    });
};

exports.getAnime = function(req, res) {
    Anime.findById(req.params.animeId, function(err, anime) {
        if(anime === undefined || err) {
            res.status(404).send({
                success: false,
                message: 'Anime not found.'
            });
        } else {
            res.status(200).json(anime);
        }
    });
};

exports.getAllUserAnime = function(req, res) {
    Anime.find({postedBy: req.params.userId}).find(function(err, animeList) {
        if(animeList === undefined || err) {
            res.status(400).send({
                success: false,
                message: 'Anime not found.'
            });
        } else {
            res.status(200).json(animeList);
        }
    });
};

exports.getUserAnime = function(req, res) {
    Anime.findOne({_id: req.params.animeId, postedBy: req.params.userId}, function(err, anime) {
        if(anime === undefined || err) {
            res.status(404).send({
                success: false,
                message: 'Anime not found.'
            });
        } else {
            res.status(200).json(anime);
        }
    });
};
