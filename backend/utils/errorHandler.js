const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    let statusCode = 500;
    if (err.statusCode) {
      statusCode = err.statusCode;
    }
    res.status(statusCode).json({ error: err.message });
};

export default errorHandler;