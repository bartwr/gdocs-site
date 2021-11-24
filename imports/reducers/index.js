import { combineReducers } from 'redux';
import doc, { findDocument } from './doc';
import folder from './folder';

export default combineReducers({
  doc,
  folder
})
