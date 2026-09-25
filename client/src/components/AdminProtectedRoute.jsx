import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"
import Unauthorized from "../pages/Unauthorized";

function AdminProtectedRoute({children}) {
    const {user} = useAuthContext();
    if(user == null) return <Navigate to="/login" replace={true}/>
    else if(user.role !== 'admin') return <Unauthorized/> 
    return children
}

export default AdminProtectedRoute
