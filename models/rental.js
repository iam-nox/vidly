
const mongoose = require('mongoose')
const Joi = require('joi')
const { idValidator } = require('../libs/functions')






const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 3,
                maxlength: 50,
                required: true
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                minlength: 6,
                maxlength: 50,
                required: true
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 1,
                maxlength: 50,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            },
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}))



const joiSchema = Joi.object({
    customerId: Joi.string().required()
    .custom((value, helper) => idValidator(value) ? 
    value : helper.message('please enter a valid id')),
    movieId: Joi.string().required()
    .custom((value, helper) => idValidator(value) ? 
    value : helper.message('please enter a valid id'))
})






exports.Rental = Rental
exports.joiSchema = joiSchema