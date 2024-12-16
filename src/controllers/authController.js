const authService = require('../services/authService');

exports.signup = async (req, res, next) => {
    try{
        const { email, password, name, ...optionalData } = req.body;
        if (!email || !password || !name) {
            return res.error('필수 입력값이 누락되었습니다.', 'MISSING_REQUIRED_FIELDS', 400);
        }

        const result = await authService.createUser({ email, password, name, ...optionalData });

        // 중복된 이메일 처리
        if (result.error) {
            return res.error(result.error, 'DUPLICATE_EMAIL', 400);
        }

        return res.success('회원 가입이 완료되었습니다', { user: result }, 201);
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.error('이메일과 비밀번호를 입력해주세요.', 'MISSING_CREDENTIALS', 400);
        }

        const result = await authService.login({ email, password });

        // 이메일이나 비밀번호가 틀린 경우
        if (result.error) {
            return res.error(result.error, 'INVALID_CREDENTIALS', 400);
        }

        return res.success('로그인에 성공했습니다.', result , 200);
    } catch (error) {
        next(error);
    }
}

exports.logout = (req, res, next) => {
    try {
        return res.success('로그아웃이 완료되었습니다.', null, 204);
    } catch (error) {
        next(error);
    }
}