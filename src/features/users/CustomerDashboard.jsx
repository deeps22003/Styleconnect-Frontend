import { useSelector } from "react-redux"
import { Navbar } from "../../components/landing/Navbar"
import { RegistrationLayout } from "../../components/layout/RegistrationLayout"
export const CustomerDashboard=()=>{
    const user=useSelector(
        (state)=>state.auth.user
    )
    return(
        <RegistrationLayout>
        <Navbar
         logo="StyleConnect"
         showNavigation={true}
         showBackButton={false}
        showAuthActions={false}
        />
        <h1>Welcome {user?.fullName}</h1>
        </RegistrationLayout>
    )
}