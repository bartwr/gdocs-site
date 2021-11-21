import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
import appReducer from '../reducers';

import { App } from './App'

// Get persistentState from localStorage
const persistedState = localStorage.getItem('NIJVER_reduxState')
  ? JSON.parse(localStorage.getItem('NIJVER_reduxState'))
  : {};

// For info on how Redux works,
// see https://react-redux.js.org/tutorials/quick-start
const store = createStore(
  appReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunkMiddleware))
)

// Store Redux state into localStorage
store.subscribe(() => {
  const storeState = store.getState();
  const storeStateToSaveInLocalStorage = {
    doc: storeState.doc
  }
  localStorage.setItem('NIJVER_reduxState', JSON.stringify(storeStateToSaveInLocalStorage))
})

export const AppProvider = (props) => {
  return (
    <Provider store={store}>
      <App>
        {props.children}
      </App>
    </Provider>
  )
}

