const express = require('express');
const router = express.Router();
const { signup, login, logout, refreshAccessToken } = require('../controllers/authController');

const validate = require('../middleware/validate');
const { signUpSchema, loginSchema } = require('../validation/userValidation');

// 회원가입
router.post('/signup', validate(signUpSchema), signup);
router.post('/signup/social');

// 로그인
router.post('/login', validate(loginSchema), login);
router.post('/login/social');

// 로그아웃
router.post('/logout', logout);

// 새로운 엑세스 토큰 발급
router.post('/refresh-token', refreshAccessToken);

module.exports = router;