const Joi = require('joi');

const createPostSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.base": "제목은 문자열이어야 합니다.",
        "string.empty": "제목은 필수 입력값입니다.",
        "any.required": "제목은 필수 입력값입니다."
    }),
    content: Joi.string().required().messages({
        "string.base": "내용은 문자열이어야 합니다.",
        "string.empty": "내용은 필수 입력값입니다.",
        "any.required": "내용은 필수 입력값입니다."
    }),
    authorId: Joi.number().integer().positive().required().messages({
        "number.base": "작성자 ID(PK)는 숫자여야 합니다.",
        "number.empty": "작성자 ID(PK)는 필수 입력값입니다.",
        "any.required": "작성자 ID(PK)는 필수 입력값입니다."
    }),
    isPublished: Joi.boolean().required().messages({
        "boolean.base": "게시 여부는 boolean 값이어야 합니다.",
        "any.required": "게시 여부는 필수 입력값입니다."
    }),
});

const updatePostSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.base": "제목은 문자열이어야 합니다.",
        "string.empty": "제목은 필수 입력값입니다.",
        "any.required": "제목은 필수 입력값입니다."
    }),
    content: Joi.string().required().messages({
        "string.base": "내용은 문자열이어야 합니다.",
        "string.empty": "내용은 필수 입력값입니다.",
        "any.required": "내용은 필수 입력값입니다."
    }),
    isPublished: Joi.boolean().required().messages({
        "boolean.base": "게시 여부는 boolean 값이어야 합니다.",
        "any.required": "게시 여부는 필수 입력값입니다."
    }),
});

module.exports = { createPostSchema, updatePostSchema }