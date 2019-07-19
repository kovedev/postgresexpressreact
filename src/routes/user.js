import { Router } from 'express';
import asyncMiddleware from './utils/asyncMiddleware';

const router = Router();

router.get('/', asyncMiddleware(async (req, res) => {
    const users = await req.context.models.User.findAll();
    return res.json({success: true, users, response: "All users found!"});
}));

router.get('/:userId', asyncMiddleware(async (req, res) => {
    const user = await req.context.models.User.findByPk(
        req.params.userId,
    );
    return res.json({success: user?true:null, user, response: user?"User found!":"User not found!"});
}));

router.post('/', asyncMiddleware(async (req, res) => {
    const user = await req.context.models.User.create({
        username: req.body.username,
    });
    return res.json({success: true,  user, response: "User created!"});
}))

/**
 * @api {put} /users/:userId Update user
 * @apiName UpdateUser
 * @apiGroup Users
 * 
 * @apiExample {curl} Example usage:
 *  curl -X PUT -d '{"username": "Jenny"}' -H "Content-Type: application/json" localhost:4040/users/1 
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
    return res.json({success: true, user, response: "User updated!"});
}))

/**
 * @api {delete} /users/:userId Delete user
 * @apiName DeleteUser
 * @apiGroup Users
 * 
 * @apiExample {curl} Example usage:
 *  curl -X "DELETE" localhost:4040/users/1
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