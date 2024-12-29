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

exports.getPosts = async ({ page, limit , sortBy, sortOrder, filters }) => {
    try {
        if (filters.startDate && filters.endDate && dayjs(filters.startDate).isAfter(dayjs(filters.endDate))) {
            return { error: 'startDate가 endDate보다 나중일 수 없습니다.', code: 'INVALID_DATE_RANGE' };
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
            startDate: (value) => ({ createdAt: { [Op.gte]: dayjs(value).startOf('day').toDate() } }),
            endDate: (value) => ({ createdAt: { [Op.lte]: dayjs(value).endOf('day').toDate() } }),
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (filterMapping[key] && value !== undefined && value !== null && value !== '') {
                if (key === 'startDate' || key === 'endDate') {
                    if (!options.where.createdAt) {
                        options.where.createdAt = {};
                    }
                    if (key === 'startDate') {
                        options.where.createdAt[Op.gte] = dayjs(value).startOf('day').toDate();
                    } else if (key === 'endDate') {
                        options.where.createdAt[Op.lte] = dayjs(value).endOf('day').toDate();
                    }
                } else {
                    options.where = { ...options.where, ...filterMapping[key](value) };
                }
            }
        });

        const posts = await Post.findAll(options);

        return posts;
    } catch (error) {
        throw error;
    }
};