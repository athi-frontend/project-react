export interface AuthState {
  accessToken: string | null
  idToken: string | null
  rbacToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  TenantId: null | string | number
}

export const initialState: AuthState = {
  accessToken: null,
  idToken: null,
  rbacToken: null,
  isAuthenticated: false,
  isLoading: true,
  TenantId: null,
}

export interface TokenPayload {
  accessToken: string | null
  idToken: string | null
  rbacToken: string | null
}

export interface AuthConfig {
  accessToken: string | null
  idToken: string | null
  rbacToken: string | null
}

export const getAuthErrorMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.includes('username')) return 'Invalid email'
  if (lowerMessage.includes('password')) return 'Invalid password'
  return 'Invalid credentials'
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: {
    access_token: string
    id_token: string
    rbac_token: string
    refresh_token: string
  }
}

export interface RootState {
  auth: AuthState
}

export interface LoginError {
  message: string
}
