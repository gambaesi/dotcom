const Joi = require('joi');

const signUpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "유효한 이메일 형식이 아닙니다.",
        "any.required": "이메일은 필수 항목입니다."
    }),
    password: Joi.string().min(2).required().messages({
        "string.min": "비밀번호는 최소 2자 이상이어야 합니다.",
        "any.required": "비밀번호는 필수 항목입니다."
    }),
    name: Joi.string().min(2).required().messages({
        "string.min": "이름은 최소 2자 이상이어야 합니다.",
        "any.required": "이름은 필수 항목입니다."
    }),
    gender: Joi.string().valid('M', 'F', 'O').optional().messages({
        "any.only": "성별은 'M', 'F', 'O' 중 하나이어야 합니다."
    }),
    birthDate: Joi.date().iso().optional().messages({
        "date.base": "생년월일은 날짜 형식이어야 합니다.",
        "date.format": "생년월일은 'YYYY-MM-DD' 형식으로 입력해주세요."
    }),
    phoneNumber: Joi.string().pattern(/^\d{3}-\d{4}-\d{4}$/).optional().messages({
        "string.pattern.base": "전화번호는 '000-0000-0000' 형식으로 입력해주세요."
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "유효한 이메일 형식이 아닙니다.",
        "string.empty": "이메일을 입력해주세요.",
        "any.required": "이메일을 입력해주세요."
    }),
    password: Joi.string().required().messages({
        "string.empty": "비밀번호를 입력해주세요.",
        "any.required": "비밀번호를 입력해주세요."
    }),
});


module.exports = { signUpSchema, loginSchema }