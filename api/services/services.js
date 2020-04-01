const https = require("https");
import axios from "axios";
import { resolve } from "dns";
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

exports.getMaterials = (recipe) => {
    const url = `${LIMS_URL}/getIntakeTerms?recipe=${recipe.replace("/", "_PIPI_SLASH_")}`;
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
        }).then((resp) => { return formatData(resp) })

}



const formatData = function (resp) {
    const data = resp.data || [];
    console.log(data)
    return data;
};
