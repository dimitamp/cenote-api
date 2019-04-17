/* eslint-disable no-restricted-syntax, no-await-in-loop */
const express = require('express');
const { NProducer } = require('sinek');
const uuid = require('uuid/v4');

const { Project } = require('../models');
const { flattenJSON, isObject } = require('../utils');

const router = express.Router({ mergeParams: true });
const config = { noptions: { 'metadata.broker.list': process.env.KAFKA_SERVERS, 'socket.keepalive.enable': true } };
const producer = new NProducer(config, null, 'auto');
producer.on('error', error => error.message !== 'broker transport failure' && console.error(error));
producer.connect();

/**
 * @apiDefine ProjectNotFoundError
 * @apiError ProjectNotFoundError The id of the Project was not found.
 * @apiErrorExample {json} ProjectNotFoundError:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "ProjectNotFoundError"
 *     }
 */
/**
* @apiDefine NoCredentialsSentError
* @apiError NoCredentialsSentError No key credentials sent.
* @apiErrorExample {json} NoCredentialsSentError:
*     HTTP/1.1 403 Forbidden
*     {
*       "error": "NoCredentialsSentError"
*     }
*/
/**
* @apiDefine KeyNotAuthorizedError
* @apiError KeyNotAuthorizedError Key hasn't authorization.
* @apiErrorExample {json} KeyNotAuthorizedError:
*     HTTP/1.1 401 Unauthorized
*     {
*       "error": "KeyNotAuthorizedError"
*     }
*/
/**
* @apiDefine NoDataSentError
* @apiError NoDataSentError No data sent.
* @apiErrorExample {json} NoDataSentError:
*     HTTP/1.1 400 Bad Request
*     {
*       "error": "NoDataSentError"
*     }
*/
/**
* @apiDefine InvalidCollectionNameError
* @apiError InvalidCollectionNameError Wrong collection name used.
* @apiErrorExample {json} InvalidCollectionNameError:
*     HTTP/1.1 400 Bad Request
*     {
*       "error": "InvalidCollectionNameError"
*     }
*/
/**
* @apiDefine InvalidPropertyNameError
* @apiError InvalidPropertyNameError Wrong property name used.
* @apiErrorExample {json} InvalidPropertyNameError:
*     HTTP/1.1 400 Bad Request
*     {
*       "error": "InvalidPropertyNameError"
*     }
*/
/**
* @api {post} /projects/:PROJECT_ID/events/:EVENT_COLLECTION?writeKey=:WRITE_KEY&MASTER_KEY=:MASTER_KEY Record events
* @apiVersion 0.1.0
* @apiName RecordEvents
* @apiGroup Events
* @apiParam {String} PROJECT_ID Project's unique ID.
* @apiParam {String} EVENT_COLLECTION The event collection name.<br/><strong><u>Note:</u></strong> Event collection names must start with a
* letter and can contain only lowercase letters and numbers.
* @apiParam {String} WRITE_KEY/MASTER_KEY Key for authorized write.
* @apiParam {Object/Object[]} payload Event data.<br/><strong><u>Note:</u></strong> Property names must start with a
* letter and can contain only lowercase letters and numbers.<br/><strong><u>Note:</u></strong> Nested properties will be flattened using
* '$' as separator.
* @apiParamExample {json} payload Example:
*"payload": [{
*   "data": {
*       "current": 7.5,
*       "voltage": 10000,
*       "note": "That's weird."
*   },
*   "timestamp": 1549622362
*}]
* @apiSuccess (Accepted 202) {String} message Success Message.
* @apiSuccessExample {json} Success-Response:
*     HTTP/1.1 202 ACCEPTED
*     {
*       "message": "Event Sent."
*     }
* @apiUse ProjectNotFoundError
* @apiUse NoCredentialsSentError
* @apiUse KeyNotAuthorizedError
* @apiUse NoDataSentError
* @apiUse InvalidCollectionNameError
* @apiUse InvalidPropertyNameError
*/
router.post('/:EVENT_COLLECTION', (req, res) => Project.findOne({ projectId: req.params.PROJECT_ID }, {}, { lean: true }, (err2, project) => {
  if (!/^[a-z]+[a-z0-9]*$/g.test(req.params.EVENT_COLLECTION)) {
    return res.status(400).json({
      message: 'Event collection names must start with a letter and can contain only lowercase letters and numbers.',
      error: 'InvalidCollectionNameError',
    });
  }
  let { payload } = req.body;
  if (!payload) return res.status(400).json({ error: 'NoDataSentError' });
  if (Object.keys(flattenJSON(payload)).some(propertyName => propertyName.split('💩').some(el => !/^[a-z]+[a-z0-9]*$/g.test(el)))) {
    return res.status(400).json({
      message: 'Property names must start with a letter and can contain only lowercase letters and numbers.',
      error: 'InvalidPropertyNameError',
    });
  }
  if (err2 || !project) return res.status(404).json({ error: 'ProjectNotFoundError' });
  const { writeKey, masterKey } = req.query;
  if (!writeKey && !masterKey) return res.status(403).json({ error: 'NoCredentialsSentError' });
  if (!(writeKey === project.writeKey || masterKey === project.masterKey)) return res.status(401).json({ message: 'KeyNotAuthorizedError' });
  const cenote = {
    created_at: Date.now(),
    id: uuid(),
    url: `/projects/${req.params.PROJECT_ID}/events/${req.params.EVENT_COLLECTION.replace(/-/g, '').toLowerCase()}`,
  };
  if (!Array.isArray(payload)) payload = [payload];
  const allDataResponses = [];
  return (async () => {
    for (const dato of payload) {
      const { data, timestamp } = dato;
      if (!data || !isObject(data)) return res.status(400).json({ error: 'NoDataSentError' });
      if (timestamp && Number.isInteger(timestamp) && timestamp <= Date.now()) cenote.timestamp = new Date(timestamp).toISOString();
      cenote.id = uuid();
      try {
        await producer.send(process.env.KAFKA_TOPIC, JSON.stringify({ data, cenote }));
        allDataResponses.push({ message: 'Events sent.' });
      } catch (error) {
        allDataResponses.push({ message: 'An error occurred.', error });
      }
    }
    if (allDataResponses.every(el => el.message = 'Event sent.')) return res.status(202).json({ message: 'Events sent.' });
    return res.status(500).json(allDataResponses);
  })();
}));

module.exports = router;
