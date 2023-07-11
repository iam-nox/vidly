const mongoose = require('mongoose')
const Joi = require('joi')
const config = require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})


userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
}


const User = mongoose.model('User', userSchema)


const joiSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(255).required()
})



exports.User = User
exports.joiSchema = joiSchema