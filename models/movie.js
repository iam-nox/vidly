const mongoose = require('mongoose')
const Joi = require('joi')
const { genreSchema } = require('./genre')
const { idValidator } = require('../libs/functions')






const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genreSchema,
        required: true
    }
}))



const joiSchema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
    genreId: Joi.string().required()
    .custom((value, helper) => idValidator(value) ? 
            value : helper.message('please enter a valid id'))
})






exports.Movie = Movie
exports.joiSchema = joiSchema