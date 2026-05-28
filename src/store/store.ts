'use client'
import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import authReducer from './slices/authSlice'
import menuReducer from './slices/menuSlice'
import decisionReducer from './slices/decisionSlice'

/**
 * Classification: Confidential
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    menu: menuReducer,
    decision: decisionReducer,
  },
})

export type rootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
