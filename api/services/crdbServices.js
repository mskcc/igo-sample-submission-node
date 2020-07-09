import axios from 'axios';
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

const formatCrdb = (resp) => {
    let data = {};
    if (resp.data.PRM_JOB_STATUS.toString() === '0') {
        data = {
            patientId: resp.data.PRM_PT_ID,
            sex: resp.data.PRM_PT_GENDER || '',
        };
    } else {
        data = [];
    }
    return data;
};

const formatDbResponse = (resp) => {
    const data = resp.rows[0] || [];
    delete data.PT_MRN;
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
            return formatCrdb(resp);
        });
};

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
                    .execute(
                        'SELECT pt_mrn, dmp_id FROM crdb_cmo_loj_dmp_map WHERE cmo_id = :cmoId',
                        [cmoId]
                    )
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

exports.verifyDmpId = (dmpId) => {
    return new Promise((resolve, reject) => {
        oracledb
            .getConnection({
                user: CRDB_DB_USER,
                password: CRDB_DB_PW,
                connectString: CRDB_DB_URL,
            })
            .then((connection) => {
                connection
                    .execute(
                        'SELECT pt_mrn, cmo_id, dmp_id FROM crdb_cmo_loj_dmp_map WHERE dmp_id = :dmpId',
                        [dmpId]
                    )
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
