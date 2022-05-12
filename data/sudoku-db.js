const mongoose = require('mongoose');
const assert = require('assert')

const url = process.env.URI;

mongoose.connect(
    url,
    {useNewUrlParser: true},
    function(err,db){
        assert.equal(null,err);
        console.log('Connected Successfully to DB');
    }
)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'));
mongoose.set('debug', true);

module.exports = mongoose.connection;