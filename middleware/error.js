const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint } = format



const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Tehran'
    })
}



const logger = createLogger({
  format: combine(
    label({ label: 'testing winston logger' }),
    timestamp({ format: timezoned }),
    prettyPrint()
  ),
  transports: [ new transports.File({ filename: 'error.log', level: 'error' }) ]
})



module.exports = (err, req, res, next) => {
    logger.error(err.message)
    
    res.status(500).send(err.message)
}