import { Router } from 'express';
import asyncMiddleware from './utils/asyncMiddleware';
import auth from './utils/auth';

const router = Router();;

/**
 * @api {get} /items/ Request all Items
 * @apiName GetItems
 * @apiGroup Items
 * 
 * @apiParam {header} x-auth-token JWT token.
 *
 * @apiExample {curl} Example usage:
 *  curl -H "x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTYzNTM1NDg5LCJleHAiOjE1NjM1MzkwODl9.riROh98O0py_TN2HbyDsjyDl1j9PBIGz5Y_Fazs48_c" localhost:5000/api/items/
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} items  Items array.
 * @apiSuccess {string} response  Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
{"success":true,"items":[{"id":1,"name":"Javel","date":"2019-07-17T11:49:44.780Z","createdAt":"2019-07-17T11:49:44.781Z","updatedAt":"2019-07-17T11:49:44.781Z}]}
 *
 */
router.get('/', auth, asyncMiddleware(async (req, res, next) => {
    const items = await req.context.models.Item.findAll();
    return res.json({success: true, items, response: "All items found!"});
}));

/**
 * @api {get} /items/:itemId Request item
 * @apiName GetItem
 * @apiGroup Items
 * 
 * @apiParam {header} x-auth-token JWT token.
 *
 * @apiExample {curl} Example usage:
 *  curl -H "x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTYzNTM1NDg5LCJleHAiOjE1NjM1MzkwODl9.riROh98O0py_TN2HbyDsjyDl1j9PBIGz5Y_Fazs48_c" localhost:5000/api/items/1
 * 
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} item Item object.
 * @apiSuccess {string} response Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
{"success":true,"item":{"id":1,"name":"Javel","date":"2019-07-17T11:55:10.706Z","createdAt":"2019-07-17T11:55:10.707Z","updatedAt":"2019-07-17T11:55:10.707Z"},"response":"Item found!"}
 * 
 */
router.get('/:itemId', auth, asyncMiddleware(async (req, res) => {
    const item = await req.context.models.Item.findByPk(
        req.params.itemId,
    );
    return res.json({success: item?true:false, item, response: item?"Item found!":"Item not found!"});
}));

/**
 * @api {post} /items/ Post item
 * @apiName PostItem
 * @apiGroup Items
 *
 * @apiParam {header} x-auth-token JWT token.
 * 
 * @apiExample {curl} Example usage:
 *  curl -d '{"name": "Mace"}' -H "Content-Type: application/json" -H "x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTYzNTM1NDg5LCJleHAiOjE1NjM1MzkwODl9.riROh98O0py_TN2HbyDsjyDl1j9PBIGz5Y_Fazs48_c" localhost:5000/api/items/
 * 
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} item Item object.
 * @apiSuccess {string} response Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
 * {"success":true,"item":{"date":"2019-07-17T11:55:10.563Z","id":2,"name":"Mace","updatedAt":"2019-07-17T11:59:32.813Z","createdAt":"2019-07-17T11:59:32.813Z"},"response":"Item posted!"}
 */
router.post('/', auth, asyncMiddleware(async (req, res) => {
    const item = await req.context.models.Item.create({
        name: req.body.name
    });
    return res.json({success: true, item, response: "Item posted!"})
}))

/**
 * @api {delete} /items/:itemId Delete item
 * @apiName DeleteItem
 * @apiGroup Items
 * 
 * @apiParam {header} x-auth-token JWT token.
 * 
 * @apiExample {curl} Example usage:
 *  curl -X "DELETE" -H "x-auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTYzNTM1NDg5LCJleHAiOjE1NjM1MzkwODl9.riROh98O0py_TN2HbyDsjyDl1j9PBIGz5Y_Fazs48_c" localhost:5000/api/items/1
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {string} response Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
 * {"success":true,"item":{"date":"2019-07-17T11:55:10.563Z","id":2,"name":"Mace","updatedAt":"2019-07-17T11:59:32.813Z","createdAt":"2019-07-17T11:59:32.813Z"},"response":"Item posted!"}
 {"success":true,"response":"Item deleted!"}
 */
router.delete('/:itemId', auth, asyncMiddleware(async (req, res) => {
    const result = await req.context.models.Item.destroy({
        where: { id: req.params.itemId },
    });
    return res.json({success: result?true:false, response: result?"Item deleted!":"Item not found!"})
}))

export default router;