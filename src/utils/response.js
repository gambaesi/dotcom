function successResponse(message, data = {}) {
    return {
        status: "success",
        message,
        data,
    };
};

function errorResponse(message, error = null) {
    return {
        status: "error",
        message,
        error,
    };
};

module.exports = { successResponse, errorResponse };