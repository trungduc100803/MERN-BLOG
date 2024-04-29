import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: 'dark'
}

const themSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: state => {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
        }
    }
})

export default themSlice.reducer
export const { toggleTheme } = themSlice.actions