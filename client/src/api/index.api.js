import { requestApi } from "./axios";

import { updateFailure, updateStart, updateSuccess } from "../redux/user/userSlice";

const serviceApi = {
    signup: async (formData) => {
        const res = await requestApi.post('auth/signup', formData)
        const data = await res.data
        return data
    },
    signin: async (formData) => {
        const res = await requestApi.post('auth/signin', formData)
        const data = await res.data
        return data
    },
    updateUser: async (userID,formData, dispatch) => {
        dispatch(updateStart())
        const res = await requestApi.put(`user/update/${userID}`, formData)
        const data = res.data

        console.log(data)

    }

}

export default serviceApi