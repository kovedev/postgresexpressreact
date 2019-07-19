import { Router } from 'express';
import asyncMiddleware from './utils/asyncMiddleware';

const router = Router();;

/**
 * @api {get} /items/ Request all Items
 * @apiName GetItems
 * @apiGroup Items
 *
 * @apiExample {curl} Example usage:
 *  curl localhost:4040/items/ 
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} items  Items array.
 * @apiSuccess {string} response  Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
{"success":true,"items":[{"id":1,"name":"Javel","date":"2019-07-17T11:49:44.780Z","createdAt":"2019-07-17T11:49:44.781Z","updatedAt":"2019-07-17T11:49:44.781Z"}
 * 
 */
router.get('/', asyncMiddleware(async (req, res, next) => { 
    const items = await req.context.models.Item.findAll();
    return res.json({success: true, items, response: "All items found!"});
}));

/**
 * @api {get} /items/:itemId Request item
 * @apiName GetItem
 * @apiGroup Items
 *
 * @apiExample {curl} Example usage:
 *  curl localhost:4040/items/1
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
router.get('/:itemId', asyncMiddleware(async (req, res) => {
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
 * @apiExample {curl} Example usage:
 *  curl -d '{"name": "Mace"}' -H "Content-Type: application/json" localhost:4040/items/
 * 
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} item Item object.
 * @apiSuccess {string} response Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
 * {"success":true,"item":{"date":"2019-07-17T11:55:10.563Z","id":2,"name":"Mace","updatedAt":"2019-07-17T11:59:32.813Z","createdAt":"2019-07-17T11:59:32.813Z"},"response":"Item posted!"}
 */
router.post('/', asyncMiddleware(async (req, res) => {
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
 * @apiExample {curl} Example usage:
 *  curl -X "DELETE" localhost:4040/items/1
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {string} response Response message.
 * 
 * @apiExample {object} Success-Response
 * HTTP/1.1 200 OK
 * {"success":true,"item":{"date":"2019-07-17T11:55:10.563Z","id":2,"name":"Mace","updatedAt":"2019-07-17T11:59:32.813Z","createdAt":"2019-07-17T11:59:32.813Z"},"response":"Item posted!"}
 {"success":true,"response":"Item deleted!"}
 */
router.delete('/:itemId', asyncMiddleware(async (req, res) => {
    const result = await req.context.models.Item.destroy({
        where: { id: req.params.itemId },
    });
    return res.json({success: result?true:false, response: result?"Item deleted!":"Item not found!"})
}))

export default router;