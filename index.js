'use strict'
require('dotenv').config();

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 8000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
// Connect DB
mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => console.log('DB Connected'))
    .catch(err => console.log(err))
app.listen(port, () => {
    console.log(`app listening on port ${port}!`)
})