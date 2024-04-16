import { Button, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon } from 'react-icons/fa'



import { routes } from "../routes"


const Header = () => {
    const { pathname } = useLocation()
    return (
        <Navbar className="border-b-2">
            <Link to={'/'} className="self-center whitespace-nowrap text-sm sm:text-xl dark:text-white font-semibold">
                <span className="px-2 mr-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">TD's</span>
                Blog
            </Link>

            <form className=" ">
                <TextInput
                    className="w-64 hidden lg:inline"
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                />
            </form>

            <Button className="w-12 h-10 lg:hidden" pill color={'gray'}>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button color='gray' className="w-12 h-10 hidden sm:inline" pill>
                    <FaMoon />
                </Button>

                <Link to={routes.signIn}>
                    <Button gradientDuoTone={'purpleToBlue'} outline>
                        Sign In
                    </Button>
                </Link>
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
