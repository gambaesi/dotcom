// 환경 변수 로드
require('dotenv').config();

// Sequelize 설정 객체
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }, 
};




/*
장보기 리스트

[ 식사 ]
1. 모듬쌈
2. 목살 2 / 삼겹살 1 / 가브리살 1
3. (소고기 채끝살)
4. 참소스 (청양고추, 다진마늘, 고춧가루 챙겨가기)
5. 쌈장
6. 파채
7. 양송이 버섯
8. 소세지
9. (회)
10. 무쌈
11. 햇반
12. 김치
13. 술 (소주, 맥주)
14. 컵라면

[ 그 외 ]
12. 과자
13. 음료수
14. 과일
15. 일회용품 (일회용컵 챙겨가기)

*/