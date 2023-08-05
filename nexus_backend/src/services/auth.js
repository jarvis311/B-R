const jwt = require('jsonwebtoken');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const secretOrPrivateKey = process.env.JWT_SECRET;

generateToken = (payload, callback) => {
    return jwt.sign(payload, secretOrPrivateKey);
};

isVerifiedToken = (token) => {
    try {
        return jwt.verify(token, secretOrPrivateKey);
    } catch (err) {
        return false;
    }
}

module.exports = {
    generateToken,
    isVerifiedToken,
};