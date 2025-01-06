const express = require('express');
const router = express.Router();
const { signup, login, logout, refreshAccessToken, socialLogin } = require('../controllers/authController');

const validate = require('../middleware/validate');
const { signUpSchema, loginSchema } = require('../validation/userValidation');

const passport = require('passport');

// 회원가입
router.post('/signup', validate(signUpSchema), signup);
router.post('/signup/social');

// 로그인
router.post('/login', validate(loginSchema), login);

// 카카오
router.get('/kakao', passport.authenticate('kakao'));
// Passport가 카카오 인증 URL로 리다이렉트 시킴, 포스트맨에서 테스트 불가
// https://kauth.kakao.com/oauth/authorize?client_id=56d43b98865bdcb8981758c02a9ffbf6&redirect_uri=http://localhost:3051/auth/kakao/callback&response_type=code
router.get('/kakao/callback', passport.authenticate('kakao', { session: false }), socialLogin);

// 로그아웃
router.post('/logout', logout);

// 새로운 엑세스 토큰 발급
router.post('/refresh-token', refreshAccessToken);

module.exports = router;