const express = require('express')
const router = express.Router()
const { Rental, joiSchema } = require('../models/rental')
const { idValidator } = require('../libs/functions')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')






router.get('/', async (req, res) => { 
    try {
        const result = await Rental.find()
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
        const rental = await Rental.findById(req.params.id)
        return rental ? res.send(rental) : res.status(404).send('rental not found')
    }
    catch (err) {
        console.log(err.message)
    }
})



router.post('/', auth, async (req, res) => {

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    const { customerId, movieId } = value

    try {
        const customer = await Customer.findById(customerId)
        if ( !customer ) res.status(404).send('customer not found')

        const movie = await Movie.findById(movieId)
        if ( !movie ) res.status(404).send('movie not found')

        if (movie.numberInStock === 0) {
            return res.send('this movie currently unavailable')
        }


        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        })
        
        const session = await mongoose.startSession()
        
        await session.withTransaction(async () => {
        const result = await rental.save()
        movie.numberInStock--
        await movie.save()
        res.send(result)
      })

      session.endSession()

    }
    catch(err) {
        console.log(err.message)
    }
})



/* router.put('/:id', async (req, res) => {
    
    if (!idVaditor(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    const { customerId, movieId } = value

    try {
        const customer = await Customer.findById(customerId)
        if ( !customer ) res.status(404).send('customer not found')

        const movie = await Movie.findById(movieId)
        if ( !movie ) res.status(404).send('movie not found')

        if (movie.numberInStock === 0) {
            return res.send('this movie currently unavailable')
        } 
        const rental = await Rental.findByIdAndUpdate(req.params.id, { 
            customer: {_id: customer._id, name: customer.name, phone: customer.phone }, 
            movie: { _id: movie._id, title: movie.title, dailyRentalRate: movie.dailyRentalRate }}, 
            { new: true })


            return rental ? res.send(rental) : res.status(404).send('rental not found')
    }
    catch(err) {
        console.log(err.message)
    }
}) */



router.delete('/:id', admin, async (req, res) => {

    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }

    try {
        const rental = await Rental.findByIdAndDelete(req.params.id)
        return rental ? res.send(rental) : res.status(404).send('rental not found')
    }
    catch(err) {
        console.log(err.message)
    }
})



module.exports = router