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
        }
    }
})


export const { signInStart, signInSuccess, signInFailure } = userSlice.actions
export default userSlice.reducer