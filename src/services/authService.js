const bcrypt = require('bcrypt');
const User = require('../models/user');
const { camelToSnake } = require('../utils/transform');

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
            optionalData.birthDate = new Date(optionalData.birthDate);
        }

        // 유저 생성
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            ...optionalData
        });

        return newUser;
    } catch (error) {
        throw error;
    }
};