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
    console.log(error);
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
export const getHeaderValues = page => {
  const url = `${Config.NODE_API_ROOT}/${page}/headerValues`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};
export const getPicklist = name => {
  const url = `${Config.NODE_API_ROOT}/upload/picklist?picklist=${name}`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const grid = data => {
  const url = `${Config.NODE_API_ROOT}/upload/grid`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const mrnToCid = data => {
  const url = `${Config.NODE_API_ROOT}/upload/mrnToCid`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const verifyCmoId = data => {
  const url = `${Config.NODE_API_ROOT}/upload/verifyCmoId`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};
export const patientIdToCid = data => {
  const url = `${Config.NODE_API_ROOT}/upload/patientIdToCid`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const verifyDmpId = data => {
  const url = `${Config.NODE_API_ROOT}/upload/verifyDmpId`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const getAdditionalRows = data => {
  const url = `${Config.NODE_API_ROOT}/upload/additionalRows`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const downloadGrid = data => {
  const url = `${Config.NODE_API_ROOT}/upload/export`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const getSubmissions = gridType => {
  const url = `${Config.NODE_API_ROOT}/submission/grid/${gridType}`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const getSubmission = (id, gridType) => {
  const url = `${Config.NODE_API_ROOT}/submission/get/${id}/${gridType}`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};
export const getSubmissionsSince = time => {
  const url = `${Config.NODE_API_ROOT}/submission/since/${time}`;

  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const downloadSubmission = id => {
  const url = `${Config.NODE_API_ROOT}/submission/download/${id}`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const createSubmission = data => {
  const url = `${Config.NODE_API_ROOT}/submission/create`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const updateSubmission = data => {
  const url = `${Config.NODE_API_ROOT}/submission/update`;
  console.log(data);
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const unsubmitSubmission = id => {
  const url = `${Config.NODE_API_ROOT}/submission/unsubmit`;
  return axios
    .post(url, { id: id })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const submitSubmission = data => {
  const url = `${Config.NODE_API_ROOT}/submission/submit`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const deleteSubmission = id => {
  const url = `${Config.NODE_API_ROOT}/submission/delete`;
  return axios
    .post(url, { id: id })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

//  PROMOTE
export const promoteGrid = () => {
  const url = `${Config.NODE_API_ROOT}/promote/grid`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const loadBankedSamples = (queryType, query) => {
  const url = `${Config.NODE_API_ROOT}/promote/load`;
  return axios
    .post(url, { queryType, query })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const promote = data => {
  const url = `${Config.NODE_API_ROOT}/promote/promote`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const dryrun = data => {
  const url = `${Config.NODE_API_ROOT}/promote/dryrun`;
  return axios
    .post(url, { ...data })
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

//  PROMOTE END

//  USER
export const logout = data => {
  const url = `${Config.AUTH_URL}/api/auth/logout`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};

export const fetchUser = data => {
  const url = `${Config.AUTH_URL}/api/session/user`;
  return axios
    .get(url)
    .then(resp => {
      return resp;
    })
    .catch(error => {
      throw error;
    })
    .then(resp => {
      return resp;
    });
};
//  USER END
