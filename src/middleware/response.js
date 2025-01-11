const { successResponse, errorResponse } = require('../utils/response');

const responseMiddleware = (req, res, next) => {
    res.success = (message, data = {}) => res.status(200).json(successResponse(message, data));
    res.error = (message, error = null, statusCode = 400) => res.status(statusCode).json(errorResponse(message, error));
    next();
};

module.exports = responseMiddleware;