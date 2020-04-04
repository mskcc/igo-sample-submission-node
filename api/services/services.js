const https = require("https");
import axios from "axios";
var _ = require('lodash');
const { logger } = require("../util/winston");


const LIMS_AUTH = {
    username: process.env.LIMS_USER,
    password: process.env.LIMS_PASSWORD
};
const LIMS_URL = process.env.LIMS_URL;

// LIMS is authorized. Avoids certificate verification & "unable to verify the first certificate in nodejs" errors
const agent = new https.Agent({
    rejectUnauthorized: false
});


const formatData = function (resp) {
    const data = resp.data || [];
    return data;
};

const formatDataMaterialsOrApps = function (resp) {
    const data = resp.data[0] || [];
    return data;
}

const formatOncoData = function (resp) {
    if (_.isEmpty(resp)) { return [] }
    else {
        // console.log(resp)
        let oncotree = []
        let values = [{}]
        let duplicates = []
        resp.data.map((record) => {
            let value = record.name
            if (values.includes(value)) {
                let unique_value = `${record.name} (${record.tissue})`
                if (!duplicates.includes(value)) {
                    duplicates.append(value)
                    oncotree.push(`${unique_value} – ID: ${record.code}`)
                }
            }
            else {
                oncotree.push(`${record.name} – ID: ${record.code}`)
                values[value] = (
                    `${record.name} (${record.tissue})`)
            }
        })
        for (let single_record in oncotree) {
            let single_value = single_record.value
            if (duplicates.includes(single_value)) {
                single_record.value = values[single_value]
            }
        }
        return oncotree.sort()
    }
}


exports.getPicklist = (listname) => {
    const url = `${LIMS_URL}/getPickListValues?list=${listname}`;
    logger.log("info", `Sending request to ${url}`);
    return axios.get(url,
        {
            auth: { ...LIMS_AUTH },
            httpsAgent: agent
        })
        .then((resp) => {
            logger.log("info", `Successfully retrieved response from ${url}`);
            return resp;
        }).catch((error) => {
            logger.log("info", `Error retrieving response from ${url}`)
            return error
        }).then((resp) => { return formatData(resp) })

}

exports.getMaterials = (application) => {
    const url = `${LIMS_URL}/getIntakeTerms?recipe=${application.replace("/", "_PIPI_SLASH_")}`;
    logger.log("info", `Sending request to ${url}`);
    return axios.get(url,
        {
            auth: { ...LIMS_AUTH },
            httpsAgent: agent
        })
        .then((resp) => {

            logger.log("info", `Successfully retrieved response from ${url}`);
            return resp;
        }).catch((error) => {
            logger.log("info", `Error retrieving response from ${url}`)
            return error
        }).then((resp) => { return formatDataMaterialsOrApps(resp) })

}

exports.getApplications = (material) => {
    const url = `${LIMS_URL}/getIntakeTerms?type=${material.replace("/", "_PIPI_SLASH_")}`;
    logger.log("info", `Sending request to ${url}`);
    return axios.get(url,
        {
            auth: { ...LIMS_AUTH },
            httpsAgent: agent
        })
        .then((resp) => {
            logger.log("info", `Successfully retrieved response from ${url}`);
            return resp;
        }).catch((error) => {
            logger.log("info", `Error retrieving response from ${url}`)
            return error
        }).then((resp) => { return formatDataMaterialsOrApps(resp) })

}
exports.getColumns = (material, application) => {
    const url = `${LIMS_URL}/getIntakeTerms?type=${material.replace("/", "_PIPI_SLASH_")}&recipe=${application.replace("/", "_PIPI_SLASH_")}`
    logger.log("info", `Sending request to ${url}`)
    return axios.get(url,
        {
            auth: { ...LIMS_AUTH },
            httpsAgent: agent
        })
        .then((resp) => {
            logger.log("info", `Successfully retrieved response from ${url}`);
            return resp;
        }).catch((error) => {
            logger.log("info", `Error retrieving response from ${url}`)
            return error
        }).then((resp) => { return formatData(resp) })

}


exports.getOnco = () => {
    const url = `http://oncotree.mskcc.org/api/tumorTypes?version=oncotree_candidate_release&flat=true&deprecated=false`
    logger.log("info", `Sending request to ${url}`)
    return axios.get(url)
        .then((resp) => {
            logger.log("info", `Successfully retrieved response from ${url}`);
            return resp;
        }).catch((error) => {
            logger.log("info", `Error retrieving response from ${url}`)
            return error
        }).then((resp) => { return formatOncoData(resp) })

}
