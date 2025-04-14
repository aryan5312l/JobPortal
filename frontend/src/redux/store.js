import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice'
import jobSlice from './jobSlice'
import companySlice from './companySlice'
import bookmarkReducer from './bookmarkSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        job: jobSlice,
        comapny: companySlice,
        bookmark: bookmarkReducer,
    }
})
export default store;