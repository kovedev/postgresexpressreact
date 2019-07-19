import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncMiddleware from './utils/asyncMiddleware';
import config from '../../config/default.json';

const router = Router();

/**
 * @api {post} /auth/ Authenticate
 * @apiName CreateUser
 * @apiGroup Auth
 * 
 * @apiExample {curl} Example usage:
 *  curl -d '{"email": "james@rocket.pkm", "password":"james123"}' -H "Content-Type: application/json" localhost:5000/api/auth/
 * 
 * @apiParam {string} email User email.
 * @apiParam {string} password User password.
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {string} token string.
 * @apiSuccess {object} user User object.
 * @apiSuccess {string} response  Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
 * {"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTYzNTMyODg2LCJleHAiOjE1NjM1MzY0ODZ9.857WO_F2NejVprexWGSMyTUfH1OfL2H3HyCpDzpI6jY","user":{"username":"James","email":"james@rocket.pkm","id":2,"createdAt":"2019-07-19T10:39:01.352Z","updatedAt":"2019-07-19T10:39:01.352Z"},"response":"Logged in!"}
 * 
 */
router.post('/', asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;
    const user = await req.context.models.User.findOne({
        where: { email: email }
    });

    if(!user)
        return res.status(400).json({ success: false, response: 'User does not exist'});

    bcrypt.compare(password, user.password)
    .then(isMatch => {
        if(!isMatch) 
            return res.status(400).json({ success: false, response: 'Invalid credentials'});
        jwt.sign(
            { id: user.id },
            config.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
                if(err) throw err;
                return res.json({
                    success: true, 
                    token: token,
                    user: {
                        username:user.username, 
                        email: user.email, 
                        id: user.id, 
                        createdAt: user.createdAt, 
                        updatedAt: user.updatedAt
                    }, 
                    response: "Logged in!"
                });
            }
        )
    })
}));

export default router;