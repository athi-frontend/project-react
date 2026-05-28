'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { rootState, AppDispatch } from '@/store/store'
import { ApiMenu } from '@/types/components/layout/sidebar'

interface MenuState {
  slug: string | null
  user_id: number | null
  role_id: number | null
  menu_id:number|null
  menuData: ApiMenu[]
  profileData:{}
}

const initialState: MenuState = {
  slug: null,
  user_id: null,
  role_id: null,
  menu_id:null,
  profileData:{},
  menuData: [],
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCurrentSlug: (
      state,
      action: PayloadAction<{ slug: string }>
    ) => {
      state.slug = action.payload.slug
    },
    setUserData: (
      state,
      action: PayloadAction<{ user_id: number; role_id: number | null }>
    ) => {
      state.user_id = action.payload.user_id
      state.role_id = action.payload.role_id
    },
      setCurrentMenuId: (
      state,
      action: PayloadAction<{ menu_id: number|null}>
    ) => {
      state.menu_id = action.payload.menu_id
    },
      setProfileData: (
      state,
      action: PayloadAction<{ user_id: number; role_id: number | null }>
    ) => {
      state.profileData = action.payload
    },
    setMenuData: (
      state,
      action: PayloadAction<ApiMenu[]>
    ) => {
      state.menuData = action.payload
    },
  },
})

export const { setUserData, setMenuData ,setProfileData ,setCurrentMenuId, setCurrentSlug} = menuSlice.actions

export const selectUserId = (state: { menu: MenuState }) => state.menu.user_id
export const selectRoleId = (state: { menu: MenuState }) => state.menu.role_id
export const selectCurrentMenuId = (state: { menu: MenuState }) => state.menu.menu_id
export const selectMenuData = (state: { menu: MenuState }) => state.menu.menuData
export const selectProfileData = (state: { menu: MenuState }) => state.menu.profileData
export const selectCurrentSlug = (state: { menu: MenuState }) => state.menu.slug


export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<rootState> = useSelector

export default menuSlice.reducer
