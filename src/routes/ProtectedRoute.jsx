    import { Navigate } from "react-router-dom"
    import { getUserRole, isAuthenticated } from "../utils/authStorage"
    import ROUTES from "./routePaths"

    export const ProtectedRoute=({children,allowedRoles})=>{

        if(!isAuthenticated()){
            return <Navigate to={ROUTES.LOGIN} replace/>
        }

        const roleId=getUserRole();
        if(!allowedRoles.includes(roleId)){
            return <Navigate to="/unauthorized" replace/> 
        }


        return children;
    }