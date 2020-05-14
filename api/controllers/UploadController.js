const apiResponse = require('../util/apiResponse');
const { body, query, validationResult } = require('express-validator');
const util = require('../util/helpers');
var _ = require('lodash');
const services = require('../services/services');
import CacheService from '../util/cache';
const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance
const { constants } = require('../util/constants');

/**
 * Initial State, returns header values for submission form.
 *
 * @returns {Object}
 */
exports.headerValues = [
  function (req, res) {
    let containers = constants.containers;
    let applicationsPromise = cache.get('Recipe-Picklist', () =>
      services.getPicklist('Recipe')
    );
    let materialsPromise = cache.get('Exemplar+Sample+Types', () =>
      services.getPicklist('Exemplar+Sample+Types')
    );
    let speciesPromise = cache.get('Species', () =>
      services.getPicklist('Species')
    );

    Promise.all([applicationsPromise, materialsPromise, speciesPromise])
      .then((results) => {
        if (results.some((x) => x.length === 0)) {
          return apiResponse.errorResponse(
            res,
            'Could not retrieve picklists from LIMS.'
          );
        }
        let [applicationsResult, materialsResult, speciesResult] = results;

        let responseObject = {
          applications: applicationsResult,
          materials: materialsResult,
          species: speciesResult,
          containers: containers,
        };
        return apiResponse.successResponseWithData(
          res,
          'Operation success',
          responseObject
        );
      })
      .catch((error) => {
        return apiResponse.errorResponse(
          error,
          'Could not retrieve picklists from LIMS.'
        );
      });
  },
];

/**
 * Returns Materials and Species for application/recipe.
 *
 * @returns {Object}
 */
exports.materialsAndSpecies = [
  query('recipe')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Recipe must be specified.'),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        'Validation error.',
        errors.array()
      );
    } else {
      let recipe = req.query.recipe;
      let speciesResult = util.getSpecies(recipe);
      let materialsPromise = cache.get(recipe + '-Materials', () =>
        services.getMaterials(recipe)
      );

      Promise.all([materialsPromise]).then((results) => {
        if (results.some((x) => x.length === 0)) {
          return apiResponse.errorResponse(
            res,
            `Could not retrieve materials and species for '${recipe}'.`
          );
        }
        let [materialsResult] = results;
        let responseObject = {
          materials: materialsResult,
          species: speciesResult,
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
 * Returns applications/recipes for materials.
 *
 * @returns {Object}
 */
exports.applicationsAndContainers = [
  query('material')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Material must be specified.'),
  function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          'Validation error.',
          errors.array()
        );
      } else {
        let material = req.query.material;
        let containersResult = util.getContainers(material);
        let applicationsPromise = cache.get(material + '-Applications', () =>
          services.getApplications(material)
        );

        Promise.all([applicationsPromise]).then((results) => {
          if (results.some((x) => x.length === 0)) {
            return apiResponse.errorResponse(
              res,
              `Could not retrieve applications and containers for '${material}'.`
            );
          }
          let [applicationsResult] = results;
          let responseObject = {
            applications: applicationsResult,
            containers: containersResult,
          };
          return apiResponse.successResponseWithData(
            res,
            'Operation success',
            responseObject
          );
        });
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.picklist = [
  query('picklist')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Picklist must be specified.'),
  function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          'Validation error.',
          errors.array()
        );
      } else {
        let picklist = req.query.picklist;
        cache
          .get(picklist + '-Picklist', () => services.getPicklist(picklist))
          .then((picklistResult) => {
            if (picklistResult) {
              return apiResponse.successResponseWithData(
                res,
                'Operation success',
                { listname: picklist, picklist: picklistResult }
              );
            } else {
              return apiResponse.errorResponse(
                res,
                `Could not retrieve picklist '${picklist}'.`
              );
            }
          });
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.grid = [
  body('application')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Application must be present.'),
  body('material')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Material must be present.'),
  body('serviceId')
    .isLength({ min: 1 })
    .trim()
    .withMessage('ServiceId must be present.'),
  body('numberOfSamples')
    .isLength({ min: 1 })
    .trim()
    .withMessage('NumberOfSamples must be present.'),
  body('species')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Species must be present.'),
  body('container')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Container must be present.'),
  body('patientIdType').optional(),
  body('groupingChecked').optional(),
  body('altServiceId').optional(),
  // sanitizeBody("*").escape(),
  async function (req, res) {
    // try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        'Validation error.',
        errors.array()
      );
    } else {
      let formValues = req.body;
      let material = formValues.material;
      let application = formValues.application;

      let columnsPromise = cache.get(`${material}-${application}-Columns`, () =>
        services.getColumns(material, application)
      );
      Promise.all([columnsPromise]).then((results) => {
        if (results.some((x) => x.length === 0)) {
          return apiResponse.errorResponse(
            res,
            `Could not retrieve grid for '${material}' and '${application}'.`
          );
        }
        let [columnsResult] = results;
        let gridPromise = util.generateGrid(
          columnsResult,
          res.user.role,
          formValues
        );

        Promise.all([gridPromise])
          .then((results) => {
            if (results.some((x) => x.length === 0)) {
              return apiResponse.errorResponse(
                res,
                `Could not retrieve grid for '${material}' and '${application}'.`
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
    }
  },
];

exports.crdbId = [
  body('patientId')
    .isLength({ min: 1 })
    .trim()
    .withMessage('patientId must be specified.'),
  function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          'Validation error.',
          errors.array()
        );
      } else {
        // remove leading and trailing whitespaces just in case
        let patientId = req.body.patientId.replace(/^\s+|\s+$/g, '');
        let patientIdPromise = services.getCrdbId(patientId);

        Promise.all([patientIdPromise]).then((results) => {
          if (results.some((x) => x.length === 0)) {
            return apiResponse.errorResponse(res, `Could not anonymize ID.`);
          }
          let [patientIdResult] = results;
          let responseObject = {
            ...patientIdResult,
          };
          return apiResponse.successResponseWithData(
            res,
            'Operation success',
            responseObject
          );
        });
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.additionalRows = [
  body('formValues')
    .isJSON()
    .isLength({ min: 1 })
    .trim()
    .withMessage('formValues must be JSON.'),
  body('columnFeatures')
    .isJSON()
    .isLength({ min: 1 })
    .trim()
    .withMessage('columnFeatures must be JSON.'),
  body('prevRowNumber')
    .isInt()
    .isLength({ min: 1 })
    .trim()
    .withMessage('prevRowNumber must be int.'),
  body('newRowNumber')
    .isInt()
    .isLength({ min: 1 })
    .trim()
    .withMessage('newRowNumber must be int.'),
  function (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          'Validation error.',
          errors.array()
        );
      } else {
        let columnFeatures = JSON.parse(req.body.columnFeatures);
        let formValues = JSON.parse(req.body.formValues);
        let prevRowNumber = req.body.prevRowNumber;
        let newRowNumber = req.body.newRowNumber;

        let rowPromise = util.generateAdditionalRows(
          columnFeatures,
          formValues,
          prevRowNumber,
          newRowNumber
        );

        Promise.all([rowPromise]).then((results) => {
          if (results.some((x) => x.length === 0)) {
            return apiResponse.errorResponse(
              res,
              `Could not retrieve autofilled row.`
            );
          }
          let [additionalRows] = results;
          let responseObject = {
            additionalRows,
          };
          return apiResponse.successResponseWithData(
            res,
            'Operation success',
            responseObject
          );
        });
      }
    } catch (err) {
      return apiResponse.errorResponse(res, err);
    }
  },
];

exports.export = [
  body('grid')
    .isJSON()
    .isLength({ min: 1 })
    .trim()
    .withMessage('grid must be JSON.'),
  body('application')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Application must be present.'),
  body('material')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Material must be present.'),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        'Validation error.',
        errors.array()
      );
    }
    let grid = JSON.parse(req.body.grid);
    let material = req.body.material;
    let application = req.body.application;
    let excelData = util.generateGridExcel(grid, res.user.role);

    return apiResponse.successResponseWithData(res, 'Operation success', {
      excelData,
      fileName: `${res.user.username}-Submission-Grid-${material}-${application}`,
    });
  },
];
