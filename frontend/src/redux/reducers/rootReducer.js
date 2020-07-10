import { combineReducers } from 'redux';
import { localizeReducer } from 'react-localize-redux';

import uploadReducer from './upload/uploadReducer';
import submissionsReducer from './submissions/submissionsReducer';
import promoteReducer from './promote/promoteReducer';
import dmpReducer from './dmp/dmpReducer';
import commonReducer from './common/commonReducer';
import userReducer from './user/userReducer';
import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import sessionStorage from 'redux-persist/lib/storage/session'; // defaults to localStorage for web and AsyncStorage for react-native
import { Config } from '../../config.js';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['upload', 'user', 'submissions', 'promote', 'dmp'],
};

const appReducer = combineReducers({
  upload: uploadReducer,
  dmp: dmpReducer,
  common: commonReducer,
  user: userReducer,
  submissions: submissionsReducer,
  promote: promoteReducer,
  localize: localizeReducer,
});

const rootReducer = (state, action) => {
  if (action.user) {
    state = {
      ...state,
      user: { ...action.user },
    };
  }

  if (action.type === 'LOGOUT_SUCCESS' || action.type === 'LOGOUT_FAIL') {
    console.log('goodbye');
    sessionStorage.removeItem('persist:root');
    window.location.href = `${Config.AUTH_URL}/${Config.HOME_PAGE_PATH}`;
  }

  return appReducer(state, action);
};

export default persistReducer(persistConfig, rootReducer);
