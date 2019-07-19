import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncMiddleware from './utils/asyncMiddleware';
import config from '../../config/default.json';

const router = Router();

/**
 * @api {get} /users/ Get user
 * @apiName GetUsers
 * @apiGroup Users
 */
router.get('/', asyncMiddleware(async (req, res) => {
    const users = await req.context.models.User.findAll({
        attributes: { exclude: ['password'] }
      });
    return res.json({success: true, users, response: "All users found!"});
}));

/**
 * @api {get} /users/:userUd Get user
 * @apiName GetUser
 * @apiGroup Users
 */
router.get('/:userId', asyncMiddleware(async (req, res) => {
    const user = await req.context.models.User.findByPk(
        req.params.userId,
    );
    return res.json({
        success: user?true:null,
        user: {
            username:user.username, 
            email: user.email, 
            id: user.id, 
            createdAt: user.createdAt, 
            updatedAt: user.updatedAt
        }, 
        response: user?"User found!":"User not found!"
    });
}));

/**
 * @api {post} /users/ Create user
 * @apiName CreateUser
 * @apiGroup Users
 * 
 * @apiExample {curl} Example usage:
 *  curl -d '{"username": "Meowth", "email": "meowth@rocket.pkm", "password": "meowth123"}' -H "Content-Type: application/json" localhost:5000/api/users/
 * 
 * @apiParam {string} username User name.
 * @apiParam {string} email User email.
 * @apiParam {string} password User password.
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {object} user  User object.
 * @apiSuccess {string} response  Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
{"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTYzNTMyOTkwLCJleHAiOjE1NjM1MzY1OTB9.gB3nvwYBotp_JJ7fPAQmtOXYMrF3pQUM9AZI0MPMDBs","user":{"username":"Meowth","email":"meowth@rocket.pkm","id":3,"createdAt":"2019-07-19T10:43:10.842Z","updatedAt":"2019-07-19T10:43:10.842Z"},"response":"User created!"}
 * 
 */
router.post('/', asyncMiddleware(async (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, async(err, hash) => {
            const user = await req.context.models.User.create({
                username: req.body.username,
                email: req.body.email,
                password: hash,
            });
    
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
                        response: "User created!"
                    });
                }
            )
        })
    })
}))

/**
 * @api {put} /users/:userId Update user
 * @apiName UpdateUser
 * @apiGroup Users
 * 
 * @apiExample {curl} Example usage:
 *  curl -X PUT -d '{"username": "Jenny"}' -H "Content-Type: application/json" localhost:5000/api/users/1 
 * 
 * @apiParam {string} username User name.
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {object} user  User object.
 * @apiSuccess {string} response  Response message.
 * 
 */
router.put('/:userId', asyncMiddleware(async (req, res) => {
    const user = await req.context.models.User.update({
        username: req.body.username,
    },{ where: { id: req.params.userId }});
    return res.json({
        success: true, 
        user: {
            username:user.username, 
            email: user.email, 
            id: user.id, 
            createdAt: user.createdAt, 
            updatedAt: user.updatedAt
        }, 
        response: "User updated!"});
}))

/**
 * @api {delete} /users/:userId Delete user
 * @apiName DeleteUser
 * @apiGroup Users
 * 
 * @apiExample {curl} Example usage:
 *  curl -X "DELETE" localhost:5000/api/users/1
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {string} response  Response message.
 */
router.delete('/:userId', asyncMiddleware(async (req, res) => {
    const result = await req.context.models.User.destroy({
        where: { id: req.params.userId },
    });
    return res.json({success: true, response: "User deleted!"})
}))

export default router;