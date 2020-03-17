import { combineReducers } from 'redux'

import uploadFormReducer from './uploadFormReducer'
import uploadGridReducer from './uploadGridReducer'

export default combineReducers({
  form: uploadFormReducer,
  grid: uploadGridReducer,
})
