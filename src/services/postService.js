const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const Post = require('../models/post');
const PostImage = require('../models/postImage');
const { sequelize } = require('../models');
const { deleteFile } = require('../middleware/s3');

exports.createPost = async ({ title, content, authorId, isPublished, files, imageUrls, ...optionalData }) => {
    const transaction = await sequelize.transaction();

    try {
        const newPost = await Post.create({
            title,
            content,
            authorId,
            isPublished,
            ...optionalData
        }, { transaction });

        let urls = [];
        if (files && files.length > 0) {
            const imageRecords = files.map((file, index) => ({
                postId: newPost.id,
                //imageUrl: path.join(__dirname, `../uploads/images/posts/${authorId}`, file.filename),
                imageUrl: imageUrls[index],
                originalName: file.originalname
            }));
            const images = await PostImage.bulkCreate(imageRecords, { transaction });
            urls = images.map(image => ({
                id: image.dataValues.id,
                url: image.dataValues.imageUrl,
            }));
        }

        await transaction.commit();

        const postResponse = {
            id: newPost.id,
            title: newPost.title,
            content: newPost.content,
            authorId: newPost.authorId,
            isPublished: newPost.isPublished,
            views: newPost.views,
            createdAt: newPost.createdAt,
            updatedAt: newPost.updatedAt,
            imageUrls: urls
        };

        return postResponse;
    } catch (error) {
        // 파일이 업로드된 경우 파일 삭제
        /*
        if (files && files.length > 0) {
            console.log('파일 존재\n', files);
            setTimeout(() => {
                files.forEach(file => {
                    const filePath = path.join(__dirname, `../uploads/images/posts/${authorId}`, file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                })
                console.log('파일 삭제 완료');
            }, 10000); // 10초 후 삭제
        }
        */
        await transaction.rollback();
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
    const transaction = await sequelize.transaction();

    try {
        const authorId = await Post.findOne({ where: { id: postId }, attributes: ['author_id'], transaction });
        const userId = authorId.dataValues.author_id;

        const deletedCount = await Post.destroy({ where: { id: postId }, transaction } );
        if (deletedCount === 0) {
            return { error: '해당 게시글을 찾을 수 없습니다.', code: 'POST_NOT_FOUND' };
        }

        const images = await PostImage.findAll({ where: { postId: postId }, transaction })
        if (images.length > 0) {
            await Promise.all(
                images.map(async (image) => {
                    const imageUrl = image.imageUrl;
                    const imageKey = `posts/${userId}/${imageUrl.split('/').pop()}`;

                    await deleteFile(process.env.S3_BUCKET_NAME, imageKey);
                    await image.destroy({ transaction });
                })
            )
        };

        await transaction.commit();

        return {};
    } catch (error) {
        await transaction.rollback();
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