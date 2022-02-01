const { createLogger, format, transports } = require('winston');

module.exports = createLogger({
    transports:[
        new transports.File({
            level: 'debug',
            // Create the log directory if it does not exist
            filename: '../../logs/cruds.log',
            format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
        new transports.Console({
            level: 'info' //will print all level above silly
        })
    ] 
})

