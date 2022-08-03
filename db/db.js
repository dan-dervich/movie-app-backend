const mongoose = require('mongoose')


const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost/movie-app', {
            'useNewUrlParser': true,
            'useUnifiedTopology': true
        })
        console.log('database connected sucessfuly');
    } catch (err) {
        console.log(err)
    }
}

module.exports = connect