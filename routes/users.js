const express = require('express')
const router = express.Router()
const { User, joiSchema } = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')






/* router.get('/', async (req, res) => { 
    try {
        const users = await User.find()
        res.send(users)
    }
    catch(err) {
        console.log(err.message)
    }
}) */



router.get('/me', auth, async (req, res) => {
    try {
        const user = await User
        .findById(req.user._id)
        .select(['-password', '-isAdmin'])

        res.send(user)
    }
    catch (err) {
        console.log(err.message)
    }
})



router.post('/', async (req, res) => {

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        let user = await User.findOne({ email: value.email })
        if (user) {
            return res.status(409).send('user already exists')
        }
        
        user = new User(value)

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(value.password, salt)
        
        await user.save()

        res.send(_.omit(user.toObject(), ['password', '__v']))
    }
    catch(err) {
        console.log(err.message)
    }
})



/* router.put('/:id', async (req, res) => {
    
    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id,
             { name: value.name, phone: value.phone },
             { new: true })

        return customer ? res.send(customer) : res.status(404).send('customer not found')
    }
    catch(err) {
        console.log(err.message)
    }
}) */



/* router.delete('/:id', async (req, res) => {

    if (!idValidator(req.params.id)) {
        return res.status(400).send('please enter a valid id')
    }

    try {
        const customer = await Customer.findByIdAndDelete(req.params.id)
        return customer ? res.send(customer) : res.status(404).send('customer not found')
    }
    catch(err) {
        console.log(err.message)
    }
}) */



module.exports = router