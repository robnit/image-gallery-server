const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Image = require('../models/image');

router
    .get('/', (req, res, next) => {
        Image.find(req.query)
            .populate('album', 'name')
            .lean()
            .then(images => res.send(images ))
            .catch(next);
    })  

    .get('/:id', (req, res, next) => {
        const id = req.params.id;
        Image.findById(id)
            .lean()
            .then(image => {
                if(!image) throw { 
                    code: 404, 
                    error: `image ${id} does not exist`
                };
                res.send(image);
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Image.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted ))
            .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
        new Image(req.body).save()
            .then(saved => res.send(saved ))
            .catch(err => {
                next(err);
            });
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Image.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;