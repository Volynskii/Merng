const {AuthenticationError} = require('apollo-server');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRET = process.env.SECRET;

module.exports = (context) => {
    // context = { ... headers }
    const authHeader = context.req.headers.authorization;
    if (authHeader) {
        // Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET);
                return user;
            } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};
