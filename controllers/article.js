'use strict'

var validator = require('validator');
var fs  = require('fs');
var path = require('path');

var articleModel = require('../models/article');

var controller = {

   datosCurso: (req, res) => {
        var param = req.body.param;
        return res.status(200).send({
            curso: 'Master en Frameworks JS',
            autor: 'Luis Peñaloza Guette',
            url: 'luis.penaloza.com',
            param: param
        });
    },

    test: (req, res) => {
       return res.status(200).send({
           message: 'Soy la acción test de mi controlador de articulos'
       }) 
    },

    save: (req, res) => {

        // Recoger los parametros por post
        var params  = req.body;

        // Validar datos (validator)
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                message: 'Faltan dato por enviar !!!'
            });
        }

        if(validateTitle && validateContent) {
            // Crear el objeto a guardar
            var article = new articleModel();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el articulo
            article.save((err, articleStored) => {
                
                if(err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidados !!!'
            });
        }

    },

    getArticles: (req, res) => {

        var query = articleModel.find({});

        var last = req.params.last;

        if(last || last != undefined) {
            query.limit(5);
        }

        //find
        query.sort('-_id').exec((err, articles) => {

            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!!'
                });
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });

    },

    getArticle: (req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Comprobar que datos existe
        if(!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo !!!' 
            });
        }

        // Busca el articulo
        articleModel.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No existe el articulo !!!'
                });
            }

            //Devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });

        });
    },

    update: (req, res) => {

        // Recoger el id del articulo por la url
        var articleId = req.params.id; 

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
            
        } catch(err) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validateTitle && validateContent) {
            // Find and update
            articleModel.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
                if(err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    });
                }

                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo !!!'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            });
        } else {
            // Devolver la respuesta
            return res.status(500).send({
                status: 'error',
                message: 'La validación no es correcta !!!'
            });
        }
    },

    delete: (req, res) => {
        // Recoger el id de la url
        var articleId = req.params.id;

        //find and delete
        articleModel.findOneAndDelete({_id: articleId}, (err, articleRemoved) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if(!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no existe !!!'
                });   
            }

            return res.status(200).send({
                status: 'success', 
                article: articleRemoved
            });
        });
    },

    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js

        // Recoger el fichero de la petición
        var fileName = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: fileName
            })
        }

        // Conseguir nombre y la extensión del archivo
        var filePath =  req.files.file0.path;
        var fileSplit = filePath.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var fileName = fileSplit[2];

        // Extención del fichero
        var extensionSplit = fileName.split('\.');
        var fileExt =  extensionSplit[1];

        // Comprobar la extensión, solo imagenes, si es valida borrar el fichero
        if (fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif') {

            // borrar el archivo subido
            fs.unlink(filePath, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });

        } else {
            // Si todo es valido
            var articleId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            articleModel.findOneAndUpdate({_id: articleId}, {image: fileName}, {new: true}, (err, articleUpdated) => {

                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen de articulo !!!'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var pathFile = './upload/articles/' + file;
        fs.exists(pathFile, (exists) => {
            if(exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });

    },

    search: (req, res) => {
        // sacar el string a buscar
        var searchString = req.params.search;

        // find or
        articleModel.find({ "$or": [
            {  "title" : { "$regex": searchString, "$options" : "i" }},
            {  "content" : { "$regex": searchString, "$options" : "i" }}
        ]})
        .sort([['data', 'descending']])
        .exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición !!!'
                });
            }

            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });

    }
    
}; // end controller

module.exports = controller;