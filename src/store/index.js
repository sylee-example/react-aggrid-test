import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import gridReducer from './gridSlice'
import socketReducer from './socketSlice'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    grid: gridReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)
