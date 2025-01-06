const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const { JWT_SECRET_KEY } = require('../config/jwt');

const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.error('토큰이 제공되지 않았습니다.', 'TOKEN_NOT_PROVIDED', 401);
        }

        jwt.verify(token, JWT_SECRET_KEY, (error, user) => {
            if (error) {
                return res.error('인증된 사용자만 접근 가능한 라우트입니다.', 'FORBIDDEN_ACCESS', 403);
            }
            req.user = user;
            console.log(chalk.cyanBright(`인증 완료 ${JSON.stringify(req.user)}`));
            next();
        });
    } catch (error) {
        next(error);
    }
}

module.exports = authenticateToken;