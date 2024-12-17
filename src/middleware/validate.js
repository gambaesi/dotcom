const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.error(errorMessages, 'VALIDATION_ERROR', 422);
        }
        next();
    };
};

module.exports = validate;