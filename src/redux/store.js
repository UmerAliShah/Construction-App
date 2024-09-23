import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/counterSlice';
import counterReducer from './counterSlice';

const store = configureStore({
	reducer: {
		auth: counterReducer,
	},
});

export default store;
