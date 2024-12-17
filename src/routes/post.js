const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { createPost, updatePostById, softDeletePostById, getPostById, getPosts } = require('../controllers/postController');

// 인증 미들웨어
router.use(authenticateToken);

// 게시글 생성, 수정, 삭제, 조회, 목록 조회
router.post('/', createPost);
router.patch('/:id', updatePostById);
router.delete('/:id', softDeletePostById);
router.get('/:id', getPostById);
router.get('/', getPosts);

module.exports = router;