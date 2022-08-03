const connect = require("./db");
const mongoose = require('mongoose')
const {
    Schema
} = mongoose

connect()


const schema = new Schema({
    users: [String],
    movieListName: {required: true, type: String},
    movieList: [{
        movieName: String,
        movieId: String,
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