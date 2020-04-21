import axios from 'axios'
import { Config } from '../config.js'

export const getSubmission = id => {
    const url = `${Config.NODE_API_ROOT}/submission/${id}`;
    console.log("info", `Sending request to ${url}`);
    return axios.get(url)
        .then((resp) => {
           
            console.log(resp)
            console.log("info", `Successfully retrieved response from ${url}`);
            return resp;
        }).catch((error) => {
            console.log("info", `Error retrieving response from ${url}`)
            throw error
        }).then((resp) => { return resp })

}