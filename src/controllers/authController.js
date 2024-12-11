//const authService = require('../services/authService');

exports.signup = async (req, res, next) => {
    try{
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
}