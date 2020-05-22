const apiResponse = require('../util/apiResponse');
const { body, validationResult } = require('express-validator');
const services = require('../services/services');
const util = require('../util/helpers');
import CacheService from '../util/cache';
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl);

exports.grid = [
  function (req, res) {
    let columnsPromise = cache.get('ReceiptPromote+Ordering-Picklist', () =>
      services.getPicklist('ReceiptPromote+Ordering')
    );
    Promise.all([columnsPromise]).then((results) => {
      if (results.some((x) => x.length === 0)) {
        return apiResponse.errorResponse(
          res,
          'Could not retrieve promote grid.'
        );
      }
      let [columnsResult] = results;
      let gridPromise = cache.get('Promote-Grid', () =>
        util.generatePromoteGrid(columnsResult)
      );

      Promise.all([gridPromise])
        .then((results) => {
          if (results.some((x) => x.length === 0)) {
            return apiResponse.errorResponse(
              res,
              'Could not retrieve promote grid.'
            );
          }
          let [gridResult] = results;
          return apiResponse.successResponseWithData(
            res,
            'Operation success',
            gridResult
          );
        })
        .catch((reasons) => {
          return apiResponse.errorResponse(res, reasons);
        });
    });
  },
];

exports.load = [
  body('queryType')
    .isString()
    .trim()
    .withMessage(
      'queryType must be specified and one of the following: investigator, serviceId, userId or project.'
    ),
  body('query').isString().trim().withMessage('query must be specified.'),
  function (req, res) {
    // console.log(req.body);
    // try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        'Validation error.',
        errors.array()
      );
    } else {
      // remove leading and trailing whitespaces just in case
      let queryType = req.body.queryType;
      let query = req.body.query;

      // let samplesPromise = cache.get(`BankedSamples-${query}`, () =>
      //   util.loadBankedSamples(queryType, query)
      // );

      let samplesPromise = util.loadBankedSamples(queryType, query);
      Promise.all([samplesPromise]).then((results) => {
        if (!results || results.some((x) => x.length === 0)) {
          return apiResponse.errorResponse(
            res,
            `Could not load samples for ${queryType} = ${query}.`
          );
        }
        let [samples] = results;
        let responseObject = {
          samples,
        };

        return apiResponse.successResponseWithData(
          res,
          'Operation success',
          responseObject
        );
      });
    }
  },
];
/**
 * Submits to LIMS Banked Samples
 *
 * @returns {Object}
 */
exports.promote = [
  body('requestId')
    .optional()
    .isString()
    .withMessage('RequestId must be String.'),
  body('projectId')
    .optional()
    .isString()
    .withMessage('ProjectId must be String.'),
  body('serviceId')
    .optional()
    .isString()
    .withMessage('ServiceId must be String.'),
  body('dryrun').isBoolean().withMessage('dryrun must be Boolean.'),
  body('transactionId').isInt().withMessage('transactionId must be Int.'),
  body('bankedSampleIds')
    .isArray()
    .isLength({ min: 1 })
    .trim()
    .withMessage('bankedSampleId must be JSON array of recordIds.'),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        'Validation error.',
        errors.array()
      );
    }

    // let samples = JSON.parse(req.body.samples);
    let transactionId = req.body.transactionId;
    let requestId = req.body.requestId;
    let projectId = req.body.projectId;
    let serviceId = req.body.serviceId;
    let bankedSampleIds = req.body.bankedSampleIds;
    console.log(bankedSampleIds);
    let dryrun = req.body.dryrun;
    let promotePromise = util.promote(
      transactionId,
      requestId,
      projectId,
      serviceId,
      bankedSampleIds,
      res.user.username,
      dryrun
    );

    // let promotePromise = util.promote(
    //   transactionId,
    //   requestId,
    //   projectId,
    //   [bankedSampleId],
    //   res.user.username,
    //   dry
    // );

    Promise.all([promotePromise])
      .catch(function (err) {
        return apiResponse.errorResponse(res, err);
      })
      .then((results) => {
        console.log(results);
        if (!results || results.some((x) => x.length === 0)) {
          return apiResponse.errorResponse(res, 'Could not promote.');
        }
        let promoteResult;
        if (dryrun) {
          promoteResult = results[0];
          return apiResponse.successResponse(res, promoteResult);
        } else {
          [promoteResult] = results;
          return apiResponse.successResponseWithData(
            res,
            'Operation success',
            promoteResult
          );
        }
        // let bankedIds = updateResult.map((element) => {

        // });
        // let dryRunPromise = util.promote(true,)
      })
      .catch((reasons) => {
        return apiResponse.errorResponse(res, reasons);
      });
  },
];
