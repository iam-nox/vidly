
const express = require('express')
const router = express.Router()
const { Genre, joiSchema } = require('../models/genre')
const { idValidator } = require('../libs/functions')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')






router.get('/', async (req, res, next) => { 
    try {
        const result = await Genre.find()
        res.send(result)
    }
    catch(err) {
        next(err)
    }
})



router.get('/:id', async (req, res) => {
    
    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }
    
    try {
        const genre = await Genre.findById(req.params.id)
        return genre ? res.send(genre) : res.status(404).send('genre not found')
    }
    catch (err) {
        console.log(err.message)
    }
})



router.post('/', auth, async (req, res) => {

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        let genre = new Genre(value)
        genre = await genre.save()

        res.send(genre)
    }
    catch(err) {
        console.log(err.message)
    }
})



router.put('/:id', auth, async (req, res) => {
    
    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id,
             { name: value.name },
             { new: true })

        return genre ? res.send(genre) : res.status(404).send('genre not found')
    }
    catch(err) {
        console.log(err.message)
    }
})



router.delete('/:id', [auth, admin], async (req, res) => {

    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }

    try {
        const genre = await Genre.findByIdAndDelete(req.params.id)
        return genre ? res.send(genre) : res.status(404).send('genre not found')
    }
    catch(err) {
        console.log(err.message)
    }
})



module.exports = router