const mongoose = require('mongoose')
const { logger } = require('./logging')



module.exports = () => {
    //catch is not done to stop the program if it is not connected to the database
    mongoose.connect('mongodb://127.0.0.1:27017/vidly')
    .then(() => logger.info('connected to db...'))
}