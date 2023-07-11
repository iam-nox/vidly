const express = require('express')
const app = express()
const { logger, uncaughts } = require('./startup/logging')



require('./startup/db')()
uncaughts()
require('./startup/routes')(app)
require('./startup/prod')(app)



if (!process.env.vidly_jwtPrivateKey) {
    logger.error('jwtPrivateKey is not defined.')
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
}



const port = process.env.PORT || 3000
const environment = process.env.NODE_ENV || 'development'



logger.debug(environment)
app.listen(port, () => logger.info(`vidly listening on port ${port}`))
