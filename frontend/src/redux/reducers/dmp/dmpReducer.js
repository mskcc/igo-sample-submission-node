import { combineReducers } from 'redux';

import dmpFormReducer from './dmpFormReducer';
// // import gridReducer from './gridReducer';

export default combineReducers({
  form: dmpFormReducer
  //   grid: gridReducer,
});
