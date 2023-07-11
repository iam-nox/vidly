const mongoose = require('mongoose')
const Joi = require('joi')



const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10
    }
})



const Genre = mongoose.model('Genre', genreSchema)



const joiSchema = Joi.object({
    name: Joi.string()
    .min(3)
    .max(10)
    .required()
})



exports.Genre = Genre
exports.joiSchema = joiSchema
exports.genreSchema = genreSchema