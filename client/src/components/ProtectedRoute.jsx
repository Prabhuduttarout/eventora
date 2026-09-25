import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"

function ProtectedRoute({children}) {
    const {user} = useAuthContext();
    if(user == null) return <Navigate to="/login" replace={true}/>
    return children
}

export default ProtectedRoute
