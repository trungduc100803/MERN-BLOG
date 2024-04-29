import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowRight, HiDocumentText, HiOutlineUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { signOutSuccess } from '../redux/user/userSlice'
import { routes } from '../routes'

const DashSidebar = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const [tab, setTab] = useState('')
    const {currentUser } = useSelector(state => state.user)
    useEffect(() => {
        //lay params tu url de active tab
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
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
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to={`${routes.dashboard}?tab=profile`}>
                        <Sidebar.Item active={tab === 'profile'} as='div' icon={HiUser} labelColor='dark' label={currentUser.isAdmin ? 'Admin': 'User'} >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {
                        currentUser.isAdmin && (
                        <Link to={`${routes.dashboard}?tab=posts`}>
                            <Sidebar.Item active={tab === 'posts'} as='div' icon={HiDocumentText} >
                                Posts
                            </Sidebar.Item>
                        </Link>
                        )
                    }
                    {
                        currentUser.isAdmin && (
                        <Link to={`${routes.dashboard}?tab=users`}>
                            <Sidebar.Item active={tab === 'users'} as='div' icon={HiOutlineUser} >
                                Users
                            </Sidebar.Item>
                        </Link>
                        )
                    }
                    <Sidebar.Item icon={HiArrowRight} onClick={handleSignOut} className='cursor-pointer'>
                        Sign Out
                    </Sidebar.Item>
                    
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar
