const passport = require('passport');
const kakaoStrategy = require('./kakaoStrategy');

module.exports = () => {
    kakaoStrategy();
};