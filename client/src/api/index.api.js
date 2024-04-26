import { requestApi } from "./axios";

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
    }

}

export default serviceApi