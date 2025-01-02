const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { createPost, updatePostById, softDeletePostById, getPostById, getPosts } = require('../controllers/postController');
const validate = require('../middleware/validate');
const { postIdSchema, createPostSchema, updatePostSchema, getPostsSchema } = require('../validation/postValidation');
//const upload = require('../middleware/multer');
const { upload, uploadToS3Handler } = require('../middleware/s3');

// 인증 미들웨어
router.use(authenticateToken);

// 게시글 생성, 수정, 삭제, 조회, 목록 조회
router.post('/', upload.array('images', 10), uploadToS3Handler, validate(createPostSchema), createPost);
router.patch('/:id', validate(postIdSchema, 'params'), validate(updatePostSchema), updatePostById);
router.delete('/:id', validate(postIdSchema, 'params'), softDeletePostById);
router.get('/:id', validate(postIdSchema, 'params'), getPostById);
router.get('/', validate(getPostsSchema, 'query'), getPosts);

module.exports = router;