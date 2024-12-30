const Joi = require('joi');
const dayjs = require('dayjs');

const postIdSchema = Joi.object({
    id: Joi.number().integer().required().messages({
        "number.base": "게시글 ID(PK)는 숫자이어야 합니다.",
        "number.integer": "게시글 ID(PK)는 정수 값이어야 합니다.",
        "any.required": "게시글 ID는 필수 입력값입니다."
    })
});

const createPostSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.base": "제목은 문자열이어야 합니다.",
        "string.empty": "제목은 빈 문자열일 수 없습니다.",
        "any.required": "제목은 필수 입력값입니다."
    }),
    content: Joi.string().required().messages({
        "string.base": "내용은 문자열이어야 합니다.",
        "string.empty": "내용은 빈 문자열일 수 없습니다.",
        "any.required": "내용은 필수 입력값입니다."
    }),
    authorId: Joi.number().integer().positive().required().messages({
        "number.base": "작성자 ID(PK)는 숫자여야 합니다.",
        "number.integer": "작성자 ID(PK)는 정수 값이어야 합니다.",
        "any.required": "작성자 ID(PK)는 필수 입력값입니다."
    }),
    isPublished: Joi.boolean().required().messages({
        "boolean.base": "게시 여부는 boolean 값이어야 합니다.",
        "any.required": "게시 여부는 필수 입력값입니다."
    }),
});

const updatePostSchema = Joi.object({
    title: Joi.string().messages({
        "string.base": "제목은 문자열이어야 합니다.",
        "string.empty": "제목은 빈 문자열일 수 없습니다."
    }),
    content: Joi.string().messages({
        "string.base": "내용은 문자열이어야 합니다.",
        "string.empty": "내용은 빈 문자열일 수 없습니다."
    }),
    isPublished: Joi.boolean().messages({
        "boolean.base": "게시 여부는 boolean 값이어야 합니다."
    }),
});

const getPostsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        "number.base": "page 값은 숫자이어야 합니다.",
        "number.integer": "page 값은 정수이어야 합니다.",
        "number.min": "page 값은 1 이상의 숫자이어야 합니다."
    }),
    limit: Joi.number().integer().min(1).default(10).messages({
        "number.base": "limit 값은 숫자이어야 합니다.",
        "number.integer": "limit 값은 정수이어야 합니다.",
        "number.min": "limit 값은 1 이상의 숫자이어야 합니다."
    }),
    sortBy: Joi.string().valid('createdAt').default('createdAt').messages({
        "any.only": "sortBy 값은 createdAt만 허용됩니다.",
        "string.base": "sortBy 값은 문자열이어야 합니다."
    }),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC').messages({
        "any.only": "sortOrder 값은 ASC 또는 DESC만 허용됩니다.",
        "string.base": "sortOrder 값은 문자열이어야 합니다."
    }),
    startDate: Joi.string().optional().custom((value, helpers) => {
        console.log('@@value', value);
        // 문자열을 날짜로 변환하고 검증 (쿼리 파라미터 처리 방식 이슈)
        if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
            return helpers.error("any.invalid", { message: "startDate 값은 'YYYY-MM-DD' 형식으로 입력해주세요." });
        }
        console.log('##value', value);
        return value;
    }),
    endDate: Joi.string().optional().custom((value, helpers) => {
        // 문자열을 날짜로 변환하고 검증 (쿼리 파라미터 처리 방식 이슈)
        if (!dayjs(value, 'YYYY-MM-DD', true).isValid()) {
            return helpers.error("any.invalid", { message: "endDate 값은 'YYYY-MM-DD' 형식으로 입력해주세요." });
        }
        return value;
    }),
}).custom((value, helpers) => {
    const { startDate, endDate } = value;
    if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
        return helpers.error("any.invalid", { message: "startDate가 endDate보다 나중일 수 없습니다." });
    }
    return value;
}).messages({
    "any.invalid": "유효하지 않은 날짜 범위입니다."
});

module.exports = { postIdSchema, createPostSchema, updatePostSchema, getPostsSchema }