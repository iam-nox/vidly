const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { User } = require('../models/user')
const bcrypt = require('bcrypt')





router.post('/', async (req, res) => {

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        let user = await User.findOne({ email: value.email })
        if (!user) {
            return res.status(400).send('invalid email or password')
        }

        if (!await bcrypt.compare(value.password, user.password)) {
            return res.status(400).send('invalid email or password')
        }


        const token = user.generateAuthToken()
        
        res.header('x-auth-token', token).send('you have successfully logged in')
    }
    catch(err) {
        console.log(err.message)
    }
})



const joiSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).max(255).required()
})



module.exports = router