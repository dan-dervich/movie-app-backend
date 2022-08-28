const connect = require("./db");
const mongoose = require('mongoose')
const {
    Schema
} = mongoose

connect()


const schema = new Schema({
    users: [String],
    listAdmin: String, // username of the admin of the list
    movieListName: {required: true, type: String},
    movieList: [{
        movieId: {type: String, index: true}, // https://api.themoviedb.org/3/movie/${id}?api_key=6613a07317df91e35dcaa81f86ebfc97&language=es
        agreedToWatch: [{
            username: String,
            agreedToWatch: Boolean
        }],
    }]
}, {
    collection: "movieList"
})


const movieList = mongoose.model('movieList', schema)

module.exports = movieList