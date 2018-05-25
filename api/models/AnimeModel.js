'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require('mongoose-auto-increment');

const AnimeSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true
    },
    studio: {
        type: String,
        default: ['Unknown']
    },
    year: {
        type: String,
        default: ['Unknown']
    },
    episodes: {
        type: String,
        default: ['Unknown']
    },
    status: {
        type: [{
            type: String, 
            enum: ['Upcoming', 'Airing', 'Finished', 'Unknown']
        }],
        default: ['Unknown']
    },
    genres: [{
        type: String,
    }],
    created_date: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: String
    },
    image: {
        type: String,
    },
    postedBy: {
        type: Number,
        required: true,
    }
});

autoIncrement.initialize(mongoose);
AnimeSchema.plugin(autoIncrement.plugin, 'Anime');
module.exports = mongoose.model('Anime', AnimeSchema);