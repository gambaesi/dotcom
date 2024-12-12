const authService = require('../services/authService');

exports.signup = async (req, res, next) => {
    try{
        const { email, password, name, ...optionalData } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: '필수 입력값이 누락되었습니다.' });
        }

        const result = await authService.createUser({ email, password, name, ...optionalData });

        // 중복된 이메일 처리
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.status(201).json({ message: '회원 가입이 완료되었습니다.', user: result});
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
        }

        const result = await authService.login({ email, password });

        // 이메일이나 비밀번호가 틀린 경우
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.status(201).json({ message: '로그인에 성공했습니다.', user: result});
    } catch (error) {
        next(error);
    }
}

exports.logout = (req, res, next) => {
    try {
        res.status(200).json({ message: '성공적으로 로그아웃되었습니다.' });
    } catch (error) {
        next(error);
    }
}