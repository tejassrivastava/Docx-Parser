const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const uri = 'mongodb://localhost:27017/idup'

mongoose.connect(uri)
    .then(() => console.log("Mongodb connection estrablished"))
    .catch(err => console.log(err))

module.exports = mongoose.connection;