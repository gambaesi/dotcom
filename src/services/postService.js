const dayjs = require('dayjs');
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
        const [updateCount] = await Post.update(updateData, { fields: updateData, where: { id: postId } });
        if (updateCount ===0) {
            return { error: '해당 게시글을 찾을 수 없습니다.', code: 'POST_NOT_FOUND' };
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

exports.getPosts = async ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', filters }) => {
    try {
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);

        const offset = (parsedPage - 1) * parsedLimit;

        const options = {
            offset,
            limit: parsedLimit,
            order: [[sortBy, sortOrder.toUpperCase()]],
            where: {},
        };

        const filterMapping = {
            title: (value) => ({ title: { [Op.like]: `%${value}%` } }),
            content: (value) => ({ content: { [Op.like]: `%${value}%` } }),
            startDate: (value) => ({ createdAt: { [Op.gte]: dayjs(value).startOf('day').toDate() } }),
            endDate: (value) => ({ createdAt: { [Op.lte]: dayjs(value).endOf('day').toDate() } }),
        };

        // title, content, startDate, endDate
        for (const key in filters) {
            if (filters[key] && filterMapping[key]) {
                const condition = filterMapping[key](filters[key]);

                // startDate와 endDate의 경우 조건을 Op.and로 묶어 처리
                if (key === 'startDate' || key === 'endDate') {
                    if (!options.where.createdAt) {
                        options.where.createdAt = {};
                    }
                    if (key === 'startDate') {
                        options.where.createdAt[Op.gte] = dayjs(filters[key]).startOf('day').toDate();
                    } else if (key === 'endDate') {
                        options.where.createdAt[Op.lte] = dayjs(filters[key]).endOf('day').toDate();
                    }
                } else {
                    options.where = { ...options.where, ...condition};
                }
            }
        }

        const posts = await Post.findAll(options);

        return posts;
    } catch (error) {
        throw error;
    }
};