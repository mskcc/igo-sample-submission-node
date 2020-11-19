import axios from 'axios';
import { Config } from '../config.js';

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
    function(response) {
        // Do something with response data
        if (response.data.data) {
            response.payload = response.data.data;
            return response;
        }
        if (response.data) {
            response.payload = response.data;
            return response;
        }
        return response;
    },
    function(error) {
        // console.log(error);
        if (error.response) {
            error.payload = error.response.data;
            if (error.response.status === 401) {
                // Automatically redirect client to the login page
                window.location.href = `${Config.AUTH_URL}/${Config.HOME_PAGE_PATH}`;
            }
        }
        // Do something with response error
        return Promise.reject(error);
    }
);
export const getHeaderValues = (page) => {
    const url = `${Config.NODE_API_ROOT}/${page}/headerValues`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};
export const getPicklist = (name) => {
    const url = `${Config.NODE_API_ROOT}/upload/picklist?picklist=${name}`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const grid = (data) => {
    const url = `${Config.NODE_API_ROOT}/upload/grid`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

//  HANDLE PATIENT IDs

export const handlePatientIds = (data) => {
    const url = `${Config.NODE_API_ROOT}/upload/deidentifyIds`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const getAdditionalRows = (data) => {
    const url = `${Config.NODE_API_ROOT}/upload/additionalRows`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const getSubmissions = (submissionType) => {
    const url = `${Config.NODE_API_ROOT}/submission/grid/${submissionType}`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const getSubmission = (id, submissionType) => {
    const url = `${Config.NODE_API_ROOT}/submission/get/${id}/${submissionType}`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};
export const getSubmissionsSince = (time, submissionType) => {
    const url = `${Config.NODE_API_ROOT}/submission/since/${submissionType}/${time}`;

    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};
export const downloadSubmission = (id, submissionType) => {
    const url = `${Config.NODE_API_ROOT}/submission/download?id=${id}&submissionType=${submissionType}`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const createSubmission = (data) => {
    const url = `${Config.NODE_API_ROOT}/submission/create`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const updateSubmission = (data) => {
    const url = `${Config.NODE_API_ROOT}/submission/update`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const unsubmitSubmission = (id, submissionType) => {
    const url = `${Config.NODE_API_ROOT}/submission/unsubmit`;
    return axios
        .post(url, { id: id, type: submissionType })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const submitSubmission = (data) => {
    const url = `${Config.NODE_API_ROOT}/submission/submit`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const deleteSubmission = (id, submissionType) => {
    const url = `${Config.NODE_API_ROOT}/submission/delete`;
    return axios
        .post(url, { id: id, type: submissionType })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

//  PROMOTE
export const promoteGrid = () => {
    const url = `${Config.NODE_API_ROOT}/promote/grid`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const loadBankedSamples = (queryType, query) => {
    const url = `${Config.NODE_API_ROOT}/promote/load`;
    return axios
        .post(url, { queryType, query })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const promote = (data) => {
    const url = `${Config.NODE_API_ROOT}/promote/promote`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const dryrun = (data) => {
    const url = `${Config.NODE_API_ROOT}/promote/dryrun`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

//  PROMOTE END

//  USER
export const logout = (data) => {
    const url = `${Config.AUTH_URL}/api/auth/logout`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const fetchUser = (data) => {
    const url = `${Config.AUTH_URL}/api/session/user`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};
//  USER END

// DMP

export const submitDmpSubmission = (data) => {
    const url = `${Config.NODE_API_ROOT}/dmp/submit`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const updateDmpStatus = () => {
    const url = `${Config.NODE_API_ROOT}/dmp/updateStatus`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const loadFromDmp = (data) => {
    const url = `${Config.NODE_API_ROOT}/dmp/loadFromDmp`;
    return axios
        .post(url, { ...data })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};

export const importSqlSubmissions = () => {
    const url = `${Config.NODE_API_ROOT}/submission/import`;
    return axios
        .get(url)
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            throw error;
        })
        .then((resp) => {
            return resp;
        });
};
