const mongoose = require('mongoose')


const connect = async () => {
    try {
        await mongoose.connect('mongodb+srv://Dan:izYg4nj0SXexivBh@cluster0.mvwdpvj.mongodb.net/?retryWrites=true&w=majority', {
            'useNewUrlParser': true,
            'useUnifiedTopology': true
        })
        console.log('database connected sucessfuly');
    } catch (err) {
        console.log(err)
    }
}

module.exports = connect