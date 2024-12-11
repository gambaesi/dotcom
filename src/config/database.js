const { Sequelize } = require('sequelize');
const config = require('./config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
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