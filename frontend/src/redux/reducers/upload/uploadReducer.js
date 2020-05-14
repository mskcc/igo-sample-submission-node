import { combineReducers } from 'redux';

import formReducer from './formReducer';
import gridReducer from './gridReducer';

export default combineReducers({
  form: formReducer,
  grid: gridReducer,
});
