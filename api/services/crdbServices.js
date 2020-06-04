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
const CRDB_DB_URL = process.env.CRDB_DB_UR;

const getCrdbConnection = () => {
  return new Promise((resolve, reject) => {
    try {
      oracledb
        .getConnection({
          user: CRDB_DB_USER,
          password: CRDB_DB_PW,
          connectString: CRDB_DB_URL,
        })
        .then(function (connection) {
          resolve(connection);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    } catch (err) {
      console.log(err);
    }
  });
};

const formatCrdb = (resp) => {
  getCrdbConnection();
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

// def get_mrn(connection, cmo_id):
//     """
//     Method to get 'MRN' and 'DMP_ID' from CRDB
//     :param connection
//     :param cmo_id
//     :returns MRN, DMP_ID
//     """
//     try:
//         sql = """
//               SELECT pt_mrn, dmp_id FROM crdb_cmo_loj_dmp_map
//               WHERE cmo_id = :p_cmo_id
//               """
//         # Allocate Cursor
//         cursor = connection.cursor()
//         cursor.execute(sql, p_cmo_id=cmo_id)
//         mrn = None
//         dmp_id = None
//         for row in cursor:
//             mrn, dmp_id = row
//             # we need only first record. break loop after first iteration is done.
//             break
//         add_to_logs("get mrn -> mrn and dmp_id: {}, {}".format(mrn, dmp_id))
//         cursor.close()
//         return mrn, dmp_id
//     except Exception as e:
//         add_error_to_logs("Error: CRDB query failed. {}".format(repr(e)), "api")
//         return None, None

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
            console.log(result.rows);
            connection.close();
            resolve(result);
          })
          .catch(function (error) {
            console.log(error);
            connection.close();
            reject(error);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
