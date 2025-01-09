const passport = require('passport');
const { Strategy: KaKaoStrategy } = require('passport-kakao');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = require('../config/jwt');
const SocialAccount = require('../models/socialAccount');
const User = require('../models/user');
const { sequelize } = require('../models');

async function createNewUser(profile) {
    const transaction = await sequelize.transaction();

    try {
        // users INSERT
        const newUser = await User.create({
            email: `${profile.id}@kakao`,
            password: '',
            name: profile.username,
        }, { transaction });

        // social_acount INSERT
        await SocialAccount.create({
            socialId: profile.id,
            provider: profile.provider,
            userId: newUser.id,
        }, { transaction });

        await transaction.commit();

        return newUser;
    } catch (error) {
        await transaction.rollback();

        throw error;
    }
}

function generateTokens(user) {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET_KEY,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        JWT_SECRET_KEY,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
}

module.exports = () => {
    passport.use(new KaKaoStrategy({
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: process.env.KAKAO_REDIRECT_URI
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            if (!profile || !profile.id || !profile.provider) {
                const error = new Error('카카오 프로필 정보가 유효하지 않습니다.');
                error.status = 400;
                error.name = 'KAKAO_PROFILE_ERROR';
                throw error;
            }

            const existingUser = await SocialAccount.findOne({ where: { socialId: profile.id, provider: 'kakao' } });
            const user = existingUser || await createNewUser(profile);

            const tokens = generateTokens(user);

            done(null, tokens);
        } catch (error) {
            done(error, null);
        }
    }))
}