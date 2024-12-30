const postService = require('../services/postService');

exports.createPost = async (req, res, next) => {
    try{
        const { title, content, authorId, isPublished, ...optionalData } = req.validatedData.body;

        const result = await postService.createPost({ title, content, authorId, isPublished, ...optionalData });

        return res.success('게시글 작성이 완료되었습니다.', { post: result }, 201);
    } catch (error) {
        next(error);
    }
}

exports.updatePostById = async (req, res, next) => {
    try {
        const { id } = req.validatedData.params;
        const updateData = req.validatedData.body;

        const result = await postService.updatePostById(id, updateData);

        // 게시글이 디비에 존재하지 않음
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
        const { id } = req.validatedData.params;

        const result = await postService.softDeletePostById(id);

        // 게시글이 디비에 존재하지 않음
        if (result.error) {
            return res.error(result.error, result.code, 404);
        }

        return res.success('게시글 삭제가 완료되었습니다.', result, 204);
    } catch (error) {
        next(error);
    }
}

exports.getPostById = async (req, res, next) => {
    try {
        const { id } = req.validatedData.params;

        const result = await postService.getPostById(id);

        // 게시글이 디비에 존재하지 않음
        if (result.error) {
            return res.error(result.error, result.code, 404);
        }

        return res.success('게시글 조회가 완료되었습니다.', { post: result }, 200);
    } catch (error) {
        next(error);
    }
}

exports.getPosts = async (req, res, next) => {
    try {
        const { page, limit, sortBy, sortOrder, ...filters } = req.query;

        const result = await postService.getPosts({ page, limit, sortBy, sortOrder, filters });

        if (result.error) {
            return res.error(result.error, result.code, 400);
        }

        return  res.success('게시글 조회가 완료되었습니다.', result, 200);
    } catch (error) {
        next(error);
    }
}