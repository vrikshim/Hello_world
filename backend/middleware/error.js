const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error ";

    // wrong mongodb id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid : ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    //Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is Invalid : Try again`;
        err = new ErrorHandler(message, 400);
    }
    // JWT expire error
    if (err.name === "JsonExpiredError") {
        const message = `Json web token is Expired : Try again`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        error: err.stack,
    });
};