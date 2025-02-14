const express = require('express');
//const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
//const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');

const chalk = require('chalk');
const dayjs = require('dayjs');

const responseMiddleware = require('./middleware/response');

// 환경 변수 로드
dotenv.config();

// passport
const passportConfig = require('./passport');
passportConfig();

// 라우터
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const chatRouter = require("./routes/chat");

// DB 연결 및 설정
const { sequelize } = require('./models');
const { connectDB } = require('./config/database');

// DB 연결 확인
async function initializeDB() {
    try {
        await connectDB();
        await sequelize.sync({ force: false });
        console.log(chalk.yellow.bold('DATABASE CONNECTION SUCCESS'));
    } catch (error) {
        console.error(error);
    }
}
initializeDB();

// 앱 생성
const app = express();

// 포트 설정
app.set('port', process.env.PORT);

// 미들웨어
app.use(cors());

if (process.env.NODE_ENV === 'production') {
    // 보안 모듈은 운영 환경에서만 활성화
    app.use(helmet({
        strictTransportSecurity: false,
        contentSecurityPolicy: false,
        // contentSecurityPolicy: {
        //     directives: {
        //         defaultSrc: ["'self'"],  // 자기 자신만 허용
        //         styleSrc: ["'self'"],    // 자기 자신만 스타일시트 허용
        //         scriptSrc: ["'self'"],   // 자기 자신만 스크립트 허용
        //         imgSrc: ["'self'"],      // 자기 자신만 이미지 허용
        //         // 필요에 따라 추가할 부분 없음
        //     },
        // },
    })); // helmet 옵션이 다양한데, 기본 옵션 중 엄격한 경우가 많음. 상황에 따라 false 필요.
    app.use(hpp());
    // app.use(morgan('combined')); // 개발 시, 'dev'
}
const customMorgan = morgan((tokens, req, res) => {
    return [
        chalk.green.bold(dayjs().format('YYYY-MM-DD HH:mm:ss')),
        chalk.yellow.bold(tokens.method(req, res)),
        chalk.yellow.bold(tokens.url(req, res)),
        chalk.green.bold(tokens.status(req, res)),
        chalk.blue.bold(tokens['response-time'](req, res), 'ms'), '-',
        tokens.res(req, res, 'content-length'),
        chalk.bold(tokens['remote-addr'](req, res))
    ].join(' ');
});
app.use(customMorgan);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
// app.use(session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET_KEY,
//     cookie: {
//         httpOnly: true,
//         secure: false,
//     }
// }));
app.use(passport.initialize());
//app.use(passport.session());
app.use(responseMiddleware);

// 라우터 연결
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/', chatRouter);

// 404 에러 처리 미들웨어
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러 핸들링 미들웨어
app.use((error, req, res, next) => {
    console.log(chalk.red('에러 처리 미들웨어로 도착했어요'));
    console.log(chalk.red('Error Status:'), error?.status);
    console.log(chalk.red('Error Name:'), error?.name);
    console.log(chalk.red('Error Message:'), error?.message);
    console.log(chalk.red('Error Stack:'), error?.stack);

    res.status(error.status || 500).json({
        status: 'error',
        message: error.message || '서버 내부 오류가 발생했습니다.',
        error: error?.name || 'INTERNAL_SERVER_ERROR'
    });
});

module.exports = app; // Express 앱을 내보냄