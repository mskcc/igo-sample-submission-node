import axios from 'axios'
import { Config } from '../config.js'

export const getSubmission = id => {
    const url = `${Config.NODE_API_ROOT}/submission/${id}`;
    return axios.get(url)
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}

export const deleteSubmission = id => {
    const url = `${Config.NODE_API_ROOT}/submission/delete`;
    return axios.post(url, { id: id })
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}

