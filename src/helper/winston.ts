import winston from 'winston';
import LokiTransport from 'winston-loki';

const transports = [
    new winston.transports.Console(),
    new LokiTransport({
        host: 'http://127.0.0.1:3100',
        json: true,
        labels: {
            job: 'kmp-api'
        }
    })
];

const Logger = winston.createLogger({
    transports,
    exitOnError: false,
});

export default Logger