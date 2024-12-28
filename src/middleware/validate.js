const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.error(errorMessages, 'VALIDATION_ERROR', 400);
        }
        next();
    };
};

module.exports = validate;