import winston from 'winston';


winston.createLogger ({
    transports:[
        new winston.transports.File({
            level: 'debug',
            // Create the log directory if it does not exist
            filename: '../../logs/cruds.log',
            format:winston.format.combine(
                winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                winston.format.align(),
                winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
            )
        }),
        new winston.transports.Console({
            level: 'info' //will print all level above silly
        })
    ] 
})

export default {winston};

