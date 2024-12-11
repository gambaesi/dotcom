/*
models/index.js 모델 초기화 및 연결
모델을 동적으로 불러와 Sequelize에 등록합니다.
*/

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');

const db = {};

// 현재 디렉토리의 모델 파일들 불러오기
fs
    .readdirSync(__dirname)
    .filter((file) => file !== 'index.js' && file.endsWith('.js') && file.indexOf('.') !== 0)
    .forEach((file) => {
        const model = require(path.join(__dirname, file));
        db[model.name] = model;
        model.initiate(sequelize);
    });

// 모델 간 관계 설정
Object.keys(db).forEach((modelName) => { // associate 호출
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;