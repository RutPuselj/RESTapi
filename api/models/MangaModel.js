'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MangaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: ['Unknown']
    },
    year: {
        type: String,
        default: ['Unknown']
    },
    volumes: {
        type: String,
        default: ['Unknown']
    },
    chapters: {
        type: String,
        default: ['Unknown']
    },
    status: {
        type: [{
            type: String, 
            enum: ['Upcoming', 'Publishing', 'Finished', 'Unknown']
        }],
        default: ['Unknown']
    },
    genres: {
        type: String,
        default: ['Unknown']
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: String
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('Manga', MangaSchema);