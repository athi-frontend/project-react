import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThemeTypes } from '@/types/common'
import { DefaultMode } from '@/config/constants'

interface ThemeState {
  mode: string
  theme: { [key: string]: ThemeTypes }
}

const initialState: ThemeState = {
  mode: DefaultMode,
  theme: {},
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setCustomTheme: (
      state,
      action: PayloadAction<{ theme: string; themeData?: ThemeTypes }>
    ) => {
      const { theme, themeData } = action.payload
      if (themeData) {
        state.theme[theme] = { ...themeData }
        state.mode = theme
      } else {
        state.mode = theme
      }
    },
  },
})

export const { setCustomTheme } = themeSlice.actions

export default themeSlice.reducer
