const fs = require('fs');
const path = require('path');

const validate = (schema, location = 'body') => {
    return (req, res, next) => {
        const data = req[location]; // body, query, params
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            // 파일이 업로드된 경우 파일 삭제
            if (req.files && req.files.length > 0) {
                /*
                console.log('파일 존재\n', req.files);

                setTimeout(() => {
                    req.files.forEach(file => {
                        const filePath = path.join(__dirname, `../uploads/images/posts/${req.body.authorId}`, file.filename);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    })
                    console.log('파일 삭제 완료');
                }, 10000); // 10초 후 삭제
                */
            }
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