const { logEvents } = require('./logEvents');

// const errorHandler = (err, req, res, next) => {
//     console.log('SSSSSHIIITTTT')
//     logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
//     console.error(err.stack)
//     res.status(500).send(err.message);
// }
const errorHandler = (err, req, res, next) => {
    // 1. Log the error internally
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack);

    // 2. SAFETY CHECK: 
    // If the response was already sent (by the controller), 
    // we CANNOT send another one. We just delegate to the default Express handler.
    if (res.headersSent) {
        console.log('Error handler called, but headers were already sent. Delegating to default handler.');
        return next(err);
    }

    // 3. If headers weren't sent, it's safe to send the 500 error
    res.status(500).send(err.message);
}

module.exports = errorHandler;

