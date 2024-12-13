const express = require('express');
const router = express.Router();
const { createPost, updatePostById, softDeletePostById, getPostById, getAllPosts } = require('../controllers/postController');

// 게시글 생성, 수정, 삭제, 조회, 목록 조회
router.post('/', createPost);
router.patch('/:id', updatePostById);
router.delete('/:id', softDeletePostById);
router.get('/:id', getPostById);
router.get('/', getAllPosts);

module.exports = router;