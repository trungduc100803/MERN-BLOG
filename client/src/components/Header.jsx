import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from "../redux/theme/themSlice"


import { routes } from "../routes"
import { signOutSuccess } from "../redux/user/userSlice"
import { useEffect, useState } from "react"

const Header = () => {
    const { pathname } = useLocation()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user)
    const { theme } = useSelector(state => state.theme)

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')

        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])


    const handleSignOut = async () => {
        try {
            const res = await fetch(`/api/user/signout`, {
                method: "POST"
            })
            const data = await res.json()

            if(!res.ok){
                console.log(data.message)
            }else{
                dispatch(signOutSuccess())
            }

        } catch (error) {
            
        }
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }


    return (
        <Navbar className="border-b-2">
            <Link to={'/'} className="self-center whitespace-nowrap text-sm sm:text-xl dark:text-white font-semibold">
                <span className="px-2 mr-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">TD's</span>
                Blog
            </Link>

            <form className=" " onSubmit={handleSubmitSearch}>
                <TextInput
                    className="w-64 hidden lg:inline"
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </form>

            <Button className="w-12 h-10 lg:hidden" pill color={'gray'}>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button onClick={() => dispatch(toggleTheme())} color='gray' className="w-12 h-10 hidden sm:inline" pill>
                    {theme === 'light' ? <FaMoon /> : <FaSun />}
                </Button>
                {
                    currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="user avatar"
                                    img={currentUser.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className="block text-sm">{currentUser.username}</span>
                                <span className="block text-sm font-medium truncate">{currentUser.email}</span>
                            </Dropdown.Header>
                            <Link to={`${routes.dashboard}?tab=profile`}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to={routes.signIn}>
                            <Button gradientDuoTone={'purpleToBlue'} outline>
                                Sign In
                            </Button>
                        </Link>

                    )
                }
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link as={'div'} active={pathname === routes.home} >
                    <Link to={routes.home}>Home</Link>
                </Navbar.Link>
                <Navbar.Link as={'div'} active={pathname === routes.about} >
                    <Link to={routes.about}>About</Link>
                </Navbar.Link>
                <Navbar.Link as={'div'} active={pathname === routes.projects} >
                    <Link to={routes.projects}>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
