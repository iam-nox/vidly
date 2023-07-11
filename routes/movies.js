const express = require('express')
const router = express.Router()
const { Movie, joiSchema } = require('../models/movie')
const { Genre } = require('../models/genre')
const { idValidator } = require('../libs/functions')
const auth = require('../middleware/auth')






router.get('/', async (req, res) => { 
    try {
        const result = await Movie.find()
        res.send(result)
    }
    catch(err) {
        console.log(err.message)
    }
})



router.get('/:id', async (req, res) => {
    
    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }
    
    try {
        const movie = await Movie.findById(req.params.id)
        return movie ? res.send(movie) : res.status(404).send('movie not found')
    }
    catch (err) {
        console.log(err.message)
    }
})



router.post('/', auth, async (req, res) => {

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        const genre = await Genre.findById(value.genreId)
        if ( !genre ) res.status(404).send('genre not found')

        const { title, numberInStock, dailyRentalRate } = value

        const movie = new Movie({
            title: title,
            numberInStock: numberInStock,
            dailyRentalRate: dailyRentalRate,
            genre: {
                _id: genre._id,
                name: genre.name
            }
        })
        await movie.save()

        res.send(movie)
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
        const genre = await Genre.findById(value.genreId)
        if ( !genre ) res.status(404).send('genre not found')

        const { title, numberInStock, dailyRentalRate } = value
        
        const movie = await Movie.findByIdAndUpdate(req.params.id, { 
            title: title, numberInStock: numberInStock, 
            dailyRentalRate: dailyRentalRate, genre: { _id: genre._id, name: genre.name }},
            { new: true })

        return movie ? res.send(movie) : res.status(404).send('movie not found')
    }
    catch(err) {
        console.log(err.message)
    }
})



router.delete('/:id', auth, async (req, res) => {

    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }

    try {
        const movie = await Movie.findByIdAndDelete(req.params.id)
        return movie ? res.send(movie) : res.status(404).send('movie not found')
    }
    catch(err) {
        console.log(err.message)
    }
})



module.exports = router