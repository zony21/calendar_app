import { createSlice } from "@reduxjs/toolkit"
import { RootState } from '../store'

const initialState = {
    master: {
        level: 0,
        uid: "",
        displayName: "",
    }
}

const masterSlice = createSlice({
    name: "master",
    initialState,
    reducers: {
        login: (state, action) => {
            state.master = action.payload
        },
        logout: (state) => {
            state.master = {
                level: 0,
                uid: "",
                displayName: "",
            }
        },
    },
})

export const { login, logout } = masterSlice.actions

export const selectMaster = (state: RootState) => state.master.master

export default masterSlice.reducer