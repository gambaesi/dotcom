const postService = require('../services/postService');

exports.createPost = async (req, res, next) => {
    try{
        const { title, content, authorId, isPublished, ...optionalData } = req.body;
        if (!title || !content || typeof isPublished !== 'boolean') {
            return res.error('필수 입력값이 누락되었습니다.', 'MISSING_REQUIRED_FIELDS', 400);
        }
        if (!authorId) {
            return res.error('작성자 ID가 누락되었습니다.', 'MISSING_AUTHOR_ID', 400);
        }

        const result = await postService.createPost({ title, content, authorId, isPublished, ...optionalData });

        return res.success('게시글 작성이 완료되었습니다', { post: result }, 201);
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
            return res.error(result.error, result.code, 400);
        }

        return res.success('게시글 수정이 완료되었습니다', { post: result }, 200);
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

        return res.success('게시글 삭제가 완료되었습니다', result, 204);
    } catch (error) {
        next(error);
    }
}

exports.getPostById = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

exports.getAllPosts = (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}