const connect = require("./db");
const mongoose = require('mongoose')
const {
    Schema
} = mongoose

connect()


const schema = new Schema({
    username: {required: true, type: String, unique: true, index: true},
    email: {required: true, type: String, unique: true, index: true},
    password: {required: true, type: String},
    // eventually add a pfp
    linkedUsers: [{
        username: String,
        userId: String,
    }],
}, {
    collection: "user"
})
// movieList: [{
//     movieName: String,
//     movieId: String,
//     agreedToWatch: [{
//         username: String,
//         agreedToWatch: Boolean
//     }],
// }]


const User = mongoose.model('user', schema)

module.exports = User