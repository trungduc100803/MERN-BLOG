import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

import { routes } from '../routes'

const PrivateRoute = () => {
    const { currentUser } = useSelector(state => state.user)
    return currentUser ? <Outlet /> : <Navigate to={routes.signIn} />
}

export default PrivateRoute
