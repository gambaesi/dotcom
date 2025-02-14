const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const User = require('../models/user');
const { JWT_SECRET_KEY, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = require('../config/jwt');

exports.createUser = async ({ email, password, name, ...optionalData }) => {
    try {
        // 이메일 중복 체크
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return { error: '중복된 이메일이 존재합니다.' };
        }
    
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 생년월일 타입
        if (optionalData.birthDate) {
            optionalData.birthDate = dayjs(optionalData.birthDate).toDate();
        }

        // 유저 생성
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            ...optionalData
        });

        const userResponse = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            gender: newUser.gender,
            birthDate: newUser.birthDate,
            phoneNumber: newUser.phoneNumber,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };

        return userResponse;
    } catch (error) {
        throw error;
    }
};

exports.login = async ({ email, password }) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return { error: '등록되지 않은 이메일입니다. 다시 확인해주세요.' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { error: '비밀번호가 일치하지 않습니다. 다시 시도해주세요.' };
        }

        // 액세스 토큰 생성
        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET_KEY,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 리프레시 토큰 생성
        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_SECRET_KEY,
            { expiresIn: JWT_REFRESH_EXPIRES_IN }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
}

exports.refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET_KEY);

        const userId = decoded.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return { error: '사용자를 찾을 수 없습니다.', code: 'USER_NOT_FOUND' };
        }

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET_KEY,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return { newAccessToken };
    } catch (error) {
        throw error;
    }
};