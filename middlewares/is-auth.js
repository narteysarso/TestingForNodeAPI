const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authorizationHeader = req.get("Authorization");
    if (!authorizationHeader) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
    }
    const token = authorizationHeader.split(' ')[1];
    let verfiedToken
    try {
        verfiedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!verfiedToken) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
    }

    req.userId = verfiedToken.userId;
    next();
}