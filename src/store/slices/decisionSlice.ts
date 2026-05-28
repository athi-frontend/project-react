import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { rootState, AppDispatch } from '@/store/store'

interface DecisionState {
  decision_id: number | null
  decision_name: string
}

const initialState: DecisionState = {
  decision_id: null,
  decision_name: '',
}

const decisionSlice = createSlice({
  name: 'decision',
  initialState,
  reducers: {
    setDecision: (
      state,
      action: PayloadAction<{ decision_id: number; decision_name: string }>
    ) => {
      state.decision_id = action.payload.decision_id
      state.decision_name = action.payload.decision_name
    },
  },
})

export const { setDecision } = decisionSlice.actions

export const getDecisionId = (state: { decision: DecisionState }) =>
  state.decision.decision_id
export const getDecisionName = (state: { decision: DecisionState }) =>
  state.decision.decision_name

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<rootState> = useSelector

export default decisionSlice.reducer
