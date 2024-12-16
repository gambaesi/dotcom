const { Op } = require('sequelize');
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

exports.getPostById = async (postId) => {
    try {
        const post = await Post.findOne({ where: { id: postId } });
        if (!post) {
            return { error: '해당 게시글을 찾을 수 없습니다.', code: 'POST_NOT_FOUND' };
        }

        return post;
    } catch (error) {
        throw error;
    }
};

exports.getPosts = async ({ page, limit , sortBy, sortOrder, filters }) => {
    try {
        if (filters.afterDate && filters.beforeDate && new Date(filters.afterDate) > new Date(filters.beforeDate)) {
            return { error: 'afterDate가 beforeDate보다 나중일 수 없습니다.', code: 'INVALID_DATE_RANGE' };
        }

        const offset = (page - 1) * limit;
        const options = {
            offset,
            limit,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: {},
        };

        const filterMapping = {
            title: (value) => ({ title: { [Op.like]: `%${value}%` } }),
            content: (value) => ({ content: { [Op.like]: `%${value}%` } }),
            afterDate: (value) => ({ createdAt: { [Op.gte]: new Date(value) } }),
            beforeDate: (value) => ({ createdAt: { [Op.lte]: new Date(value) } }),
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (filterMapping[key] && value !== undefined && value !== null && value !== '') {
                options.where = { ...options.where, ...filterMapping[key](value) };
            }
        });

        const posts = await Post.findAll(options);

        return posts;
    } catch (error) {
        throw error;
    }
};