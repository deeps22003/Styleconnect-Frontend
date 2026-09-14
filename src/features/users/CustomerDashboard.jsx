import { useSelector } from "react-redux"
export const CustomerDashboard=()=>{
    const user=useSelector(
        (state)=>state.auth.user
    )
    return(
        <h1>Welcome {user?.fullName}</h1>
    )
}