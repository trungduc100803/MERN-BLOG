import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashboardPost from '../components/DashboardPost'
import DashUsers from '../components/DashUsers'

const Dashboard = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')
    useEffect(() => {
        //lay params tu url de active tab
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search])
    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className="md:w-56">
                {/* Sidebar */}
                <DashSidebar />
            </div>
            {/* Profile */}
            {
                tab === 'profile' && <DashProfile />
            }
            {/* post */}
            {
                tab === 'posts' && <DashboardPost />
            }
            {/* users */}
            {
                tab === 'users' && <DashUsers />
            }
        </div>
    )
}

export default Dashboard
