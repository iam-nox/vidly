const mongoose = require('mongoose')
const Joi = require('joi')



const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 10
    },
    isGold: {
        type: Boolean,
        default: false
    }
}))



const joiSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(50)
    .required(),
    phone: Joi.string()
    .min(5)
    .max(10)
    .required(),
    isGold: Joi.boolean()
})



exports.Customer = Customer
exports.joiSchema = joiSchema