const express = require('express')
const router = express.Router()
const { Customer, joiSchema } = require('../models/customer')
const { idValidator } = require('../libs/functions')
const auth = require('../middleware/auth')






router.get('/', async (req, res) => { 
    try {
        const result = await Customer.find()
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
        const customer = await Customer.findById(req.params.id)
        return customer ? res.send(customer) : res.status(404).send('customer not found')
    }
    catch (err) {
        console.log(err.message)
    }
})



router.post('/', auth, async (req, res) => {

    const { error, value } = joiSchema.validate(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)

    try {
        let customer = new Customer(value)
        customer = await customer.save()

        res.send(customer)
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
        const customer = await Customer.findByIdAndUpdate(req.params.id,
             { name: value.name, phone: value.phone },
             { new: true })

        return customer ? res.send(customer) : res.status(404).send('customer not found')
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
        const customer = await Customer.findByIdAndDelete(req.params.id)
        return customer ? res.send(customer) : res.status(404).send('customer not found')
    }
    catch(err) {
        console.log(err.message)
    }
})



module.exports = router