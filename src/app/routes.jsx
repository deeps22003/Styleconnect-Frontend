import {BrowserRouter,Routes,Route} from "react-router-dom";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CustomerRegistration } from "../features/auth/CustomerRegistration";
import { ExpertRegistration } from "../features/auth/ExpertRegistration";
import { LoginPage } from "../features/auth/LoginPage";
import ROUTES from "../routes/routePaths";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { CustomerDashboard } from "../features/users/CustomerDashboard";
import { SessionManager } from "../components/session/SessionManager"
// import { isAuthenticated } from "../utils/authStorage";
export const AppRoutes=()=>{
    return(
        <BrowserRouter>
            <SessionManager /> 
            <Routes>
                {/*Public routes*/}
                <Route path={ROUTES.HOME} element={<h1>StyleConnect Home</h1>} />
               <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
               <Route path={ROUTES.CUSTOMER_REGISTER} element={<CustomerRegistration/>} />
               <Route path={ROUTES.EXPERT_REGISTER} element={<ExpertRegistration/>} />
               <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>

               {/* Protected Routes*/}
               <Route
                path={ROUTES.CUSTOMER_DASHBOARD}
                element={<ProtectedRoute allowedRoles={[1]}>
                    <CustomerDashboard/>
                </ProtectedRoute>}
                />

                {/* <Route
                path={ROUTES.CUSTOMER_DASHBOARD}
                element={<CustomerDashboard/>}
                /> */}

                {/* <Route
                path={ROUTES.EXPERT_DASHBOARD}
                element={<ExpertDashboard />}
                /> */}


            </Routes>
        </BrowserRouter>
    )
}