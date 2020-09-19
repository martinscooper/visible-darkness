import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { Network } from './reducers/network';

export const configureStore = () => {
  const store = createStore(
    combineReducers({ network: Network }),
    applyMiddleware(logger),
  );

  return store;
};
