import { Router } from 'express';
import asyncMiddleware from './utils/asyncMiddleware';

const router = Router();

/**
 * @api {get} /messages/ Request all Messages
 * @apiName GetMessages
 * @apiGroup Messages
 *
 * @apiExample {curl} Example usage:
 *  curl localhost:5000/api/messages/ 
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} messages  Message array.
 * @apiSuccess {string} response  Response message.
 */
router.get('/', asyncMiddleware(async (req, res) => {
    const messages = await req.context.models.Message.findAll();
    return res.json({success: true, messages, response: "All messages found!"});
}));

/**
 * @api {get} /messages/:messageId Request message
 * @apiName GetMessage
 * @apiGroup Messages
 *
 * @apiExample {curl} Example usage:
 *  curl localhost:5000/api/messages/1
 * 
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} message Message object.
 * @apiSuccess {string} response Response message.
 */
router.get('/:messageId', asyncMiddleware(async (req, res) => {
    const message = await req.context.models.Message.findByPk(
        req.params.messageId,
    );
    return res.json({success: message?true:false, message, response: message?"Message found!":"Message not found!"});
}));

/**
 * @api {post} /messages/ Request message
 * @apiName PostMessage
 * @apiGroup Messages
 *
 * @apiExample {curl} Example usage:
 *  curl -d '{"text": "Hello world"}' -H "Content-Type: application/json" localhost:5000/api/messages/
 * 
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {array} message Message object.
 * @apiSuccess {string} response Response message.
 */
router.post('/', asyncMiddleware(async (req, res) => {
    const message = await req.context.models.Message.create({
        text: req.body.text,
        userId: req.context.me.id,
    });
    return res.json({success: true, message: message, response: "Message posted!"});
}))

/**
 * @api {delete} /messages/:messageId Delete message
 * @apiName DeleteMessage
 * @apiGroup Messages
 * 
 * @apiExample {curl} Example usage:
 *  curl -X "DELETE" localhost:5000/api/messages/1
 *
 * @apiSuccess {bool} success boolean.
 * @apiSuccess {string} response Response message.
 */
router.delete('/:messageId', asyncMiddleware(async (req, res) => {
    const result = await req.context.models.Message.destroy({
        where: { id: req.params.messageId },
    });
    return res.json({success: result?true:false, response: result?"Message deleted!":"Message not found!"})
}))

export default router;