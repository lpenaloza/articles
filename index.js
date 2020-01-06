'use strict'
require('dotenv').config();

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
/*mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('La conexión a la base de datos se ha realizado bien!!!');

        // Crear servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Server corriendo em http://localhost:' + port)
        });

});*/

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