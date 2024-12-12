const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');

// 회원가입
router.post('/signup', signup);
router.post('/signup/social');

// 로그인
router.post('/login', login);
router.post('/login/social');

// 로그아웃
router.post('/logout', logout);

module.exports = router;