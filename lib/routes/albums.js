const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Album = require('../models/album');
const Image = require('../models/image');

router
    .get('/', (req, res, next) => {
        Album.find(req.query).lean()
            .then(albums => res.send(albums))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const id = req.params.id;

        Promise.all([
            Album.findById(id).lean(),
            Image.find({ album: id }).lean()
        ])
        .then(([album, images]) => {
            if(!album) throw { 
                code: 404, 
                error: `album ${id} does not exist`
            };
            album.images = images;
            res.send(album);
        })
        .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        const album = req.params.id;

        Promise.all([
            Album.findByIdAndRemove(album),
            Image.find({ album }).remove()
        ])
        .then(([album]) => res.send(album))
        .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
        new Album(req.body).save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Album.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;