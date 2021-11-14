import winston from 'winston';

export default winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'output/output.log',
      options: {flags: 'w'},
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
