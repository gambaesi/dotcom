/*
config/databas.js
DB 연결을 책임지고, 설정 및 연결 상태를 관리합니다.
*/

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
)

const connectDB = async () => {
    try {
        await sequelize.authenticate(); // DB 연결 확인
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // 연결 실패 시 프로세스 종료
    }
};

module.exports = { sequelize, connectDB };