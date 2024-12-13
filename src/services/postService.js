const Post = require('../models/post');

exports.createPost = async ({ title, content, authorId, isPublished, ...optionalData }) => {
    try {
        const newPost = await Post.create({
            title,
            content,
            authorId,
            isPublished,
            ...optionalData
        });

        return newPost;
    } catch (error) {
        throw error;
    }
};

exports.updatePostById = async (postId, updateData) => {
    try {
        // 수정 가능한 필드만 업데이트하도록 제한
        const allowedFields = ['title', 'content', 'isPublished'];
        const updateFields = Object.keys(updateData).filter(field => allowedFields.includes(field));
        if (updateFields.length === 0) {
            return { error: '수정 가능한 데이터가 없습니다.', code: 'NO_EDITABLE_DATA' };
        }

        const [updateCount] = await Post.update(updateData, { fields: updateFields, where: { id: postId } });
        if (updateCount ===0) {
            return { error: '해당 게시글을 찾을 수 없습니다', code: 'POST_NOT_FOUND' };
        }

        const updatedPost = await Post.findByPk(postId);

        return updatedPost;
    } catch (error) {
        throw error;
    }
};

exports.softDeletePostById = async (postId) => {
    try {
        const deletedCount = await Post.destroy({ where: { id: postId} });
        if (deletedCount === 0) {
            return { error: '해당 게시글을 찾을 수 없습니다.', code: 'POST_NOT_FOUND' };
        }

        return {};
    } catch (error) {
        throw error;
    }
};