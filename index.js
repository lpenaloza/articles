'use strict'
require('dotenv').config();

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('La conexión a la base de datos se ha realizado bien!!!');

        // Crear servidor y ponerme a escuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Server corriendo em http://localhost:' + port)
        });

    });