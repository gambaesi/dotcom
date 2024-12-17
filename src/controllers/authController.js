const authService = require('../services/authService');

exports.signup = async (req, res, next) => {
    try{
        const { email, password, name, ...optionalData } = req.body;

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

        const { accessToken, refreshToken } = result;

        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.success('로그인에 성공했습니다.', {} , 200);
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

exports.refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.error('리프레시 토큰이 없습니다.', 'MISSING_REFRESH_TOKEN', 400);
        }

        const result = await authService.refreshAccessToken(refreshToken);

        if (result.error) {
            return res.error(result.error, result.code || 'INVALID_REFRESH_TOKEN', 401);
        }

        res.setHeader('Authorization', `Bearer ${result.newAccessToken}`);

        return res.success('액세스 토큰이 재발급되었습니다.', {}, 200);
    } catch (error) {
        next(error);
    }
}