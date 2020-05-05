import { combineReducers } from 'redux'
import { localizeReducer } from 'react-localize-redux'

import uploadReducer from './upload/uploadReducer'
import submissionsReducer from './submissions/submissionsReducer'
import promoteReducer from './promote/promoteReducer'
import commonReducer from './common/commonReducer'
import userReducer from './user/userReducer'
import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import sessionStorage from 'redux-persist/lib/storage/session' // defaults to localStorage for web and AsyncStorage for react-native
import { Config } from '../../config.js'

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['upload', 'user', 'submissions'],
}

const appReducer = combineReducers({
  upload: uploadReducer,
  common: commonReducer,
  user: userReducer,
  submissions: submissionsReducer,
  promote: promoteReducer,
  localize: localizeReducer,
})

const rootReducer = (state, action) => {
  if (action.user) {
    state = {
      ...state,
      user: { ...action.user }
    }
  }

  if (action.type === 'LOGOUT') {
    console.log('goodbye')
    localStorage.clear()
    state = {
      upload: undefined,
      user: undefined,
      common: undefined,
      localize: state.localize,
    }
    window.location.href = `${Config.LOGIN_PAGE_URL}/${Config.HOME_PAGE_PATH}`;

  }

  return appReducer(state, action)
}

export default persistReducer(persistConfig, rootReducer)
