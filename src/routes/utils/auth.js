import jwt from 'jsonwebtoken';
import config from '../../../config/default.json';

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token) res.status(401).json({ success: false, response: 'Missing token, authorization denied!'});

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch(e){
        res.status(400).json({ success: false, response: 'Token expired!' })
    }
}

export default auth;