const { createLogger, format, transports } = require('winston')



const logger = createLogger({
    level: "debug",
    format: format.json(),
    transports: [ new transports.Console() ]
})



module.exports.logger = logger
module.exports.uncaughts = () => {
    
    logger.exceptions.handle(
        new transports.Console(),
        new transports.File({ filename: 'uncaughtExceptions.log' }))
    
    logger.rejections.handle(
        new transports.Console(),
        new transports.File({ filename: 'uncaughtPromiseRejections.log' }))
}