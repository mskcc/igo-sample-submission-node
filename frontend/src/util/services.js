import axios from 'axios'
import { Config } from '../config.js'


axios.defaults.withCredentials = true;

// Add a request interceptor
// axios.interceptors.request.use(
//   config => {
//     // config.withCredentials= true    
//     return config
//   }
// )
// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        // Do something with response data
        if (response.data.data) {
            response.payload = response.data.data
        }
        return response
    },
    function (error) {

        if (error.response) {
            error.payload = error.response.data
            // console(error.payload)
            if (error.response.status === 401) {
                //   console.log("intercepted 401")
                // Automatically redirect client to the login page
                window.location.href = `${Config.LOGIN_PAGE_URL}/${Config.HOME_PAGE_PATH}`;
            }
        }
        // Do something with response error
        return Promise.reject(error)
    }
)


export const getAdditionalRows = (data) => {
    const url = `${Config.NODE_API_ROOT}/upload/additionalRows`;
    return axios.post(url, { ...data })
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}

export const downloadGrid = data => {
    const url = `${Config.NODE_API_ROOT}/upload/export`;
    return axios.post(url, {...data})
        .then((resp) => {
            console.log(resp)
            return resp;
        }).catch((error) => {
            console.log(error)
            throw error
        }).then((resp) => { return resp })

}


export const getSubmission = id => {
    const url = `${Config.NODE_API_ROOT}/submission/${id}`;
    return axios.get(url)
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}
export const getSubmissionsSince = time => {
    const url = `${Config.NODE_API_ROOT}/submission/since/${time}`;

    return axios.get(url)
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}



export const downloadSubmission = id => {
    const url = `${Config.NODE_API_ROOT}/submission/download/${id}`;
    return axios.get(url)
        .then((resp) => {
            console.log(resp)
            return resp;
        }).catch((error) => {
            console.log(error)
            throw error
        }).then((resp) => { return resp })

}

export const createSubmission = data => {
    const url = `${Config.NODE_API_ROOT}/submission/create`;
    return axios.post(url, { ...data })
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}


export const updateSubmission = (data) => {
    const url = `${Config.NODE_API_ROOT}/submission/update`;
    return axios.post(url, { ...data })
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}

export const unsubmitSubmission = id => {
    const url = `${Config.NODE_API_ROOT}/submission/unsubmit`;
    return axios.post(url, { id: id })
        .then((resp) => {
            return resp;
        }).catch((error) => {
            throw error
        }).then((resp) => { return resp })

}
export const submitSubmission = data => {
    const url = `${Config.NODE_API_ROOT}/submission/submit`;
    return axios.post(url, { ...data })
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

