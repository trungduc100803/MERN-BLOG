import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: state => {
            state.error = null
            state.loading = true
        },
        signInSuccess: (state, actions) => {
            state.currentUser = actions.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, actions) => {
            state.loading = false
            state.error = actions.payload
        },
        updateStart: state => {
            state.loading = true
            state.error = null
        },
        updateSuccess: (state, actions) => {
            state.currentUser = actions.payload
            state.loading = false
            state.error = null
        },
        updateFailure: (state, actions) => {
            state.loading = false
            state.error = actions.payload
        },
        deleteUserStart: (state) => {
            state.error = null
            state.loading = true
        },
        deleteUserFailure: (state, actions) => {
            state.loading = false
            state.error = actions.payload
        },
        deleteUserSuccess: (state) => {
            state.loading = false
            state.error = null
            state.currentUser = null
        }



    }
})


export const { signInStart, signInSuccess, 
    signInFailure, updateFailure, 
    updateStart, updateSuccess,
    deleteUserFailure, deleteUserStart,
    deleteUserSuccess
 } = userSlice.actions
export default userSlice.reducer