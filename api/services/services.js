const https = require('https');
import axios from 'axios';
var _ = require('lodash');
const { logger } = require('../util/winston');

const LIMS_AUTH = {
    username: process.env.LIMS_USER,
    password: process.env.LIMS_PASSWORD,
};
const LIMS_URL = process.env.LIMS_URL;
const DMP_URL = process.env.DMP_URL;
const ONCO_URL = process.env.ONCO_URL;


const AXIOS_TIMEOUT = parseInt(process.env.AXIOS_TIMEOUT);

// LIMS is authorized. Avoids certificate verification & "unable to verify the first certificate in nodejs" errors
const agent = new https.Agent({
    rejectUnauthorized: false,
});

const axiosConfig = {
    timeout: AXIOS_TIMEOUT,
    httpsAgent: agent,
};

const info = (url) => logger.info(`Successfully retrieved response from ${url}`);
const errorlog = (url) => logger.error(url);

const formatData = function (resp) {
    const data = resp.data || [];
    return data;
};
const formatBarcodes = function (resp) {
    const data = resp.data || [];
    let barcodes = {};
    data.map((element) => {
        barcodes[element.barcodId] = element.barcodeTag;
    });
    return barcodes;
};

const formatDataMaterialsOrApps = function (resp) {
    const data = resp.data[0] || [];
    return data;
};

const formatOncoData = function (resp) {
    if (_.isEmpty(resp)) {
        return [];
    } else {
        let oncotree = [];
        let values = [{}];
        let duplicates = [];
        resp.data.map((record) => {
            let value = record.name;
            if (values.includes(value)) {
                let unique_value = `${record.name} (${record.tissue})`;
                if (!duplicates.includes(value)) {
                    duplicates.append(value);
                    oncotree.push(`${unique_value} – ID: ${record.code}`);
                }
            } else {
                oncotree.push(`${record.name} – ID: ${record.code}`);
                values[value] = `${record.name} (${record.tissue})`;
            }
        });
        for (let single_record in oncotree) {
            let single_value = single_record.value;
            if (duplicates.includes(single_value)) {
                single_record.value = values[single_value];
            }
        }
        oncotree = oncotree.sort();
        oncotree.unshift('Normal');
        return oncotree;
    }
};

exports.getPicklist = (listname) => {
    const url = `${LIMS_URL}/getPickListValues?list=${listname}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            if (resp.data && resp.data[0] && resp.data[0].includes('ERROR')) {
                errorlog(url);
                return [];
            }
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
};

exports.getBarcodes = () => {
    const url = `${LIMS_URL}/getBarcodeList?user=${process.env.API_USER}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatBarcodes(resp);
        });
};

exports.getMaterials = (application) => {
    const application_encoded = encodeURIComponent(application);
    const url = `${LIMS_URL}/getIntakeTerms?recipe=${application_encoded}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatDataMaterialsOrApps(resp);
        });
};

exports.getApplications = (material) => {
    const url = `${LIMS_URL}/getIntakeTerms?type=${material.replace('/', '_PIPI_SLASH_')}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatDataMaterialsOrApps(resp);
        });
};
exports.getColumns = (material, application) => {
    const application_encoded = encodeURIComponent(application);
    logger.info(`encoded application: ${application_encoded}`)
    const url = `${LIMS_URL}/getIntakeTerms?type=${material.replace('/', '_PIPI_SLASH_')}&recipe=${application_encoded}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
};
exports.submit = (bankedSample) => {
    const url = `${LIMS_URL}/setBankedSample`;
    logger.info(`Sending request to ${url}`);
    return axios
        .post(
            url,
            {},
            {
                auth: { ...LIMS_AUTH },
                httpsAgent: agent,
                ...axiosConfig,
                params: { ...bankedSample },
            }
        )
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            if (error.response) {
                throw error.response.data;
            } else {
                throw error;
            }
        })
        .then((resp) => {
            return formatData(resp);
        });
};

exports.submitBulk = (bankedSamples) => {
    const url = `${LIMS_URL}/setBankedSamples`;
    logger.info(`Sending bulk request to ${url} for ${bankedSamples.length} samples`);
    
    // Format the request body according to the LimsRest bulk endpoint format
    const requestBody = {
        samples: bankedSamples
    };
    
    return axios
        .post(
            url,
            requestBody,
            {
                auth: { ...LIMS_AUTH },
                httpsAgent: agent,
                ...axiosConfig,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            if (error.response) {
                throw error.response.data;
            } else {
                throw error;
            }
        })
        .then((resp) => {
            return formatData(resp);
        });
};

exports.getOnco = () => {
    const url = ONCO_URL;
    logger.info('Sending request to OncoTree');
    return axios
        .get(url)
        .then((resp) => {
            logger.info('Successfully retrieved response from OncoTree');
            return resp;
        })
        .catch((error) => {
            logger.error('Error retrieving response from OncoTree');
            return {};
        })
        .then((resp) => {
            return formatOncoData(resp);
        });
};

exports.loadBankedSamples = (queryType, query) => {
    const url = `${LIMS_URL}/getBankedSamples?${queryType}=${query}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            auth: { ...LIMS_AUTH },
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            return error;
        })
        .then((resp) => {
            return formatData(resp);
        });
};

//  PROMOTE
exports.promote = (data) => {
    const url = `${LIMS_URL}/promoteBankedSample`;
    logger.info(`Sending request to ${url}`);
    return axios
        .post(
            url,
            {},
            {
                auth: { ...LIMS_AUTH },
                httpsAgent: agent,
                ...axiosConfig,
                params: { ...data },
            }
        )
        .then((resp) => {
            info(url);

            return resp;
        })
        .catch((error) => {
            errorlog(url);
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw error;
        })
        .then((resp) => {
            return formatData(resp);
        });
};

//  DMP
exports.getAvailableProjectsFromDmp = (date) => {
    const url = `${DMP_URL}/getCMOTrackingIdList?date=${date}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            return error;
        })
        .then((resp) => {
            return formatData(resp);
        });
};

// DMP
exports.getProjectFromDmp = (trackingId) => {
    const url = `${DMP_URL}/getCMOSampleRequestDetails?trackingId=${trackingId}`;
    logger.info(`Sending request to ${url}`);
    return axios
        .get(url, {
            ...axiosConfig,
        })
        .then((resp) => {
            info(url);
            return resp;
        })
        .catch((error) => {
            errorlog(url);
            return error;
        })
        .then((resp) => {
            return formatData(resp);
        });
};
