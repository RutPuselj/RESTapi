'use strict';

var mongoose = require('mongoose');
var Manga = mongoose.model('Manga');

exports.getAllManga = function(req, res) {
    Manga.find({}, function(err, manga) {
        if(err) {
            res.send(err);
        } else {
            res.json(manga);
        }
    })
};

exports.createNewManga = function(req, res) {
    let newManga = new Manga(req.body);
    newManga.save(function(err, manga) {
        if(err) {
            res.send(err);
        } else {
            res.json(manga);
        }
    });
};

exports.deleteManga = function(req, res) {
    Manga.remove({_id: req.params.mangaId}, function(err, manga) {
        if(err) {
            res.save(err);
        } else {
            res.json({
                message: 'Manga successfully deleted.'
            });
        }
    });
};

exports.updateManga = function(req, res) {
    Manga.findOneAndUpdate( {_id: req.params.mangaId}, req.body, {new: true}, function(err, manga) {
        if(err) {
            res.save(err);
        } else {
            res.json({
                message: 'Manga successfully updated!'
            });
        }
    });
};

exports.getManga = function(req, res) {
    Manga.findById(req.params.mangaId, function(err, manga) {
        if(err) {
            res.status(404).send({
                message: 'Manga not found.'
            });
        } else {
            res.json(manga);
        }
    });
};
