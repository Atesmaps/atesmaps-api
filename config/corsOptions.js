const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    preflightContinue: false,
    credentials: true,
    maxAge:5,
    optionsSuccessStatus: 204
}

// const corsOptions = {
//     origin: true,
//     optionsSuccessStatus: 200
// }


module.exports = corsOptions;