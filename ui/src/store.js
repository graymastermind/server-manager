

import reducer from './reducer';
import { createStore } from 'redux';

const initialState = {
	servers: []
};

const store = createStore(reducer, initialState);

export default store;