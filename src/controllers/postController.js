const postService = require('../services/postService');

exports.createPost = async (req, res, next) => {
    try{
        const { title, content, authorId, isPublished, ...optionalData } = req.body;

        const result = await postService.createPost({ title, content, authorId, isPublished, ...optionalData });

        return res.success('게시글 작성이 완료되었습니다.', { post: result }, 201);
    } catch (error) {
        next(error);
    }
}

exports.updatePostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const result = await postService.updatePostById(id, updateData);

        if (result.error) {
            return res.error(result.error, result.code, 404);
        }

        return res.success('게시글 수정이 완료되었습니다.', { post: result }, 200);
    } catch (error) {
        next(error);
    }
}

exports.softDeletePostById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await postService.softDeletePostById(id);

        if (result.error) {
            return res.error(result.error, result.code, 400);
        }

        return res.success('게시글 삭제가 완료되었습니다.', result, 204);
    } catch (error) {
        next(error);
    }
}

exports.getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await postService.getPostById(id);

        if (result.error) {
            return res.error(result.error, result.code, 400);
        }

        return res.success('게시글 조회가 완료되었습니다.', result, 200);
    } catch (error) {
        next(error);
    }
}

exports.getPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.error('page와 limit 값은 숫자(양수)이어야 합니다.', 'INVALID_PARAMETER', 400);
        }

        const validSortBy = ['createdAt'];
        if (!validSortBy.includes(sortBy)) {
            return res.error(`sortBy 값은 ${validSortBy.join(', ')} 중 하나이어야 합니다.`, 'INVALID_PARAMETER', 400);
        }

        const validSortOrder = ['ASC', 'DESC'];
        if (!validSortOrder.includes(sortOrder.toUpperCase())) {
            return res.error('sortOrder는 ASC 또는 DESC이어야 합니다.', 'INVALID_PARAMETER', 400);
        }

        const result = await postService.getPosts({ page: pageNumber, limit: limitNumber , sortBy, sortOrder, filters });

        if (result.error) {
            return res.error(result.error, result.code, 400);
        }

        return  res.success('게시글 조회가 완료되었습니다.', result, 200);
    } catch (error) {
        next(error);
    }
}