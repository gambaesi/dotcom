const figlet = require('figlet');
const chalk = require('chalk');
const app = require('./app'); // app.js에서 Express 앱 가져오기

// 서버 실행
figlet('dotcom', (figletError, data) => {
    if (figletError) {
        console.error(chalk.red('Figlet Error:'), figletError.message || figletError);
        return;
    }
    console.log(chalk.blue.bold(data));

    // 포트 가져와서 서버 실행
    const PORT = app.get('port');
    app.listen(PORT, () => {
        console.info(chalk.yellow.bold(PORT), chalk.yellow.bold('PORT 준비 완료'));
    });
});