const bcrypt = require('bcrypt');
const User = require('../models/user');

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

        return { id: user.id, email: user.email };
    } catch (error) {
        throw error;
    }
}