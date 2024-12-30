const validate = (schema, location = 'body') => {
    return (req, res, next) => {
        const data = req[location]; // body, query, params
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.error(errorMessages, 'VALIDATION_ERROR', 400);
        }

        // 검증된 데이터 저장
        req.validatedData = req.validatedData || {};
        req.validatedData[location] = data;
        
        next();
    };
};

module.exports = validate;