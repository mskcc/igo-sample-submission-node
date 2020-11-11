import { reject } from 'async';
import axios from 'axios';
import { resolve } from 'path';
const { logger } = require('../util/winston');

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const CRDB_URL = process.env.CRDB_URL;
const CRDB_USERNAME = process.env.CRDB_USERNAME;
const CRDB_PASSWORD = process.env.CRDB_PASSWORD;
const CRDB_SERVER_ID = process.env.CRDB_SERVER_ID;
const CRDB_DB_USER = process.env.CRDB_DB_USER;
const CRDB_DB_PW = process.env.CRDB_DB_PW;
const CRDB_DB_URL = process.env.CRDB_DB_URL;

const formatCrdb = (resp, mrn) => {
    let data = {};
    if (resp.data.PRM_JOB_STATUS.toString() === '0') {
        let sex = resp.data.PRM_PT_GENDER || '';
        if (sex === 'Female') sex = 'F';
        if (sex === 'Male') sex = 'M';
        data = {
            crdbOutput: resp.data.PRM_PT_ID,
            dmpId: '',
            mrn: mrn,
            sex: sex,
        };
    } else {
        data = [];
    }

    return data;
};

const formatDbResponse = (resp) => {
    const data = resp.rows;
    data.map((element) => {
        //     { PT_MRN: '********', CMO_ID: 'AAA3AA', DMP_ID: 'P-000000' },
        element.crdbOutput = element['CMO_ID'];
        element.dmpId = element['DMP_ID'];
        element.mrn = element['PT_MRN'];
        delete element.PT_MRN;
        delete element.CMO_ID;
        delete element.DMP_ID;
    });
    return data;
};

exports.getCrdbId = (patientId) => {
    const url = CRDB_URL;
    logger.log('info', 'Sending request to CRDB');
    let data = {
        username: CRDB_USERNAME,
        password: CRDB_PASSWORD,
        mrn: patientId,
        sid: CRDB_SERVER_ID,
    };

    let headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    return axios
        .post(url, { ...data, headers })
        .then((resp) => {
            logger.log('info', 'Successfully retrieved response from CRDB');
            return resp;
        })
        .catch((error) => {
            logger.log('info', 'Error retrieving response from CRDB');
            throw error;
        })
        .then((resp) => {
            return formatCrdb(resp, patientId);
        });
};

exports.getCrdbIds = (patientIds) => {
    return new Promise((resolve, reject) => {
        const url = CRDB_URL;
        logger.log('info', 'Sending request to CRDB');
        let data = {
            username: CRDB_USERNAME,
            password: CRDB_PASSWORD,

            sid: CRDB_SERVER_ID,
        };

        let headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        let result = [];
        let count = 1;
        patientIds.forEach((patientId) => {
            data.mrn = patientId;
            axios
                .post(url, { ...data, headers })
                .then((resp) => {
                    logger.log('info', 'Successfully retrieved response from CRDB');
                    result.push(formatCrdb(resp, patientId));

                    if (count === patientIds.length) resolve(result);
                    count++;
                })
                .catch((error) => {
                    logger.log('info', 'Error retrieving response from CRDB');
                    reject(error.message);
                });
        });
    });
};

exports.crdbDbQuery = (sql, values) => {
    return new Promise((resolve, reject) => {
        oracledb
            .getConnection({
                user: CRDB_DB_USER,
                password: CRDB_DB_PW,
                connectString: CRDB_DB_URL,
            })
            .then((connection) => {
                connection
                    .execute(sql, values)

                    .then((result) => {
                        // connection.close();
                        logger.log('info', 'Successfully retrieved response from CRDB for DB query.');
                        resolve(formatDbResponse(result));
                    })
                    .catch((error) => {
                        connection.close();
                        logger.log('info', 'Error retrieving response from CRDB');
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

//  TODO Refactor DB queries to do WHERE ... IN ...
exports.verifyCmoId = (cmoId) => {
    return new Promise((resolve, reject) => {
        oracledb
            .getConnection({
                user: CRDB_DB_USER,
                password: CRDB_DB_PW,
                connectString: CRDB_DB_URL,
            })
            .then((connection) => {
                connection
                    .execute('SELECT pt_mrn, dmp_id, cmo_id FROM crdb_cmo_loj_dmp_map WHERE cmo_id = :cmoId', [cmoId])

                    .then(function (result) {
                        connection.close();
                        logger.log('info', 'Successfully retrieved response from CRDB for CMO ID query.');
                        resolve(formatDbResponse(result));
                    })
                    .catch(function (error) {
                        connection.close();
                        logger.log('info', 'Error retrieving response from CRDB');
                        reject(error);
                    });
            })

            .catch((error) => {
                reject(error);
            });
    });
};

exports.verifyDmpId = (sql, values) => {
    return new Promise((resolve, reject) => {
        oracledb
            .getConnection({
                user: CRDB_DB_USER,
                password: CRDB_DB_PW,
                connectString: CRDB_DB_URL,
            })
            .then((connection) => {
                connection
                    .execute(sql, values)
                    .then(function (result) {
                        connection.close();
                        logger.log('info', 'Successfully retrieved response from CRDB for DMP ID query.');
                        resolve(formatDbResponse(result));
                    })
                    .catch(function (error) {
                        connection.close();
                        logger.log('info', 'Error retrieving response from CRDB');
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.mrnToDmpId = (mrn) => {
    return new Promise((resolve, reject) => {
        oracledb
            .getConnection({
                user: CRDB_DB_USER,
                password: CRDB_DB_PW,
                connectString: CRDB_DB_URL,
            })
            .then((connection) => {
                connection
                    .execute('SELECT pt_mrn, cmo_id, dmp_id FROM crdb_cmo_loj_dmp_map WHERE pt_mrn = :mrn', [mrn])
                    .then(function (result) {
                        connection.close();
                        logger.log('info', 'Successfully retrieved response from CRDB');
                        resolve(formatDbResponse(result));
                    })
                    .catch(function (error) {
                        connection.close();
                        logger.log('info', 'Error retrieving response from CRDB');
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
};
