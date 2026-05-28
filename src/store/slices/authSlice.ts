'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState, TokenPayload } from '@/types/modules/auth/login'

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<TokenPayload>) => {
      state.accessToken = action.payload.accessToken
      state.idToken = action.payload.idToken
      state.rbacToken = action.payload.rbacToken
      state.isAuthenticated = !!action.payload.accessToken
      state.isLoading = false
      if (action.payload.accessToken) {
        localStorage.setItem('token', action.payload.accessToken)
      } else {
        localStorage.removeItem('token')
      }
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('token')
      state.accessToken = token
      state.isAuthenticated = !!token
      state.isLoading = false
    },
    setTenantId: (state, action) => {
      state.TenantId = action.payload.tenant_id
    },
    logout: (state) => {
      state.accessToken = null
      state.idToken = null
      state.rbacToken = null
      state.isAuthenticated = false
      state.isLoading = false
      localStorage.removeItem('token')
    },
  },
})

export const { setTokens, checkAuth, setTenantId, logout } = authSlice.actions
export default authSlice.reducer
