import { Alert, Button, Label, TextInput } from "flowbite-react"
import { Link } from "react-router-dom"
import { routes } from "../routes"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"


import { signInSuccess } from "../redux/user/userSlice"
import serviceApi from "../api/index.api"
import OAuth from "../components/OAuth"

const SignIn = () => {
    const [formData, setFormData] = useState({})
    const [errMessage, setErrMessage] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.email || !formData.password) {
            setErrMessage("Please fill out all fields")
        }
        try {

            const data = await serviceApi.signin(formData)
            if (data.success) {
                dispatch(signInSuccess(data.user))
                navigate('/')
            }
        } catch (error) {

        }

    }

    return (
        <div className="min-h-screen mt-20">
            <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
                {/* left */}
                <div className="flex-1">
                    <Link to={'/'} className="self-center  text-sm sm:text-4xl dark:text-white font-bold">
                        <span className="px-2 mr-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">TD's</span>
                        Blog
                    </Link>
                    <p className="text-sm mt-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto consequatur aut aspernatur reprehenderit voluptatem doloremque, beatae, quia sint facilis, sunt eaque quod. Fugiat amet nemo explicabo odit officiis tenetur alias!</p>
                </div>

                {/* right */}
                <div className=" flex-1">
                    <form onSubmit={handleSubmit} className="flex flex-col  gap-4">
                        <div className="">
                            <Label value="Your email" />
                            <TextInput
                                type="email"
                                placeholder="Email"
                                id="email"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="">
                            <Label value="Your password" />
                            <TextInput
                                type="password"
                                placeholder="Password"
                                id="password"
                                onChange={handleChange}
                            />
                        </div>

                        <Button
                            gradientDuoTone={"purpleToPink"}
                            type="submit"
                        >
                            Sign In
                        </Button>
                        <OAuth />
                    </form>
                    <div className="flex gap-2 text-sm mt-5">
                        <span>Dont have an account?</span>
                        <Link className="text-blue-500" to={routes.signUp}>
                            Sign Up
                        </Link>
                    </div>

                    {
                        errMessage && (
                            <Alert className="mt-5" color={'failure'} >
                                {errMessage}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SignIn
