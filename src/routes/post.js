const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { createPost, updatePostById, softDeletePostById, getPostById, getPosts } = require('../controllers/postController');

const validate = require('../middleware/validate');
const { createPostSchema, updatePostSchema } = require('../validation/postValidation');

// 인증 미들웨어
router.use(authenticateToken);

// 게시글 생성, 수정, 삭제, 조회, 목록 조회
router.post('/', validate(createPostSchema), createPost);
router.patch('/:id', validate(updatePostSchema), updatePostById);
router.delete('/:id', softDeletePostById);
router.get('/:id', getPostById);
router.get('/', getPosts);

module.exports = router;