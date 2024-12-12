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