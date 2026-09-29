import {BrowserRouter,Routes,Route} from "react-router-dom";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CustomerRegistration } from "../features/auth/CustomerRegistration";
import { ExpertRegistration } from "../features/auth/ExpertRegistration";
import { LoginPage } from "../features/auth/LoginPage";
import ROUTES from "../routes/routePaths";
import { ProtectedRoute } from "../routes/ProtectedRoute";
import { CustomerDashboard } from "../features/users/CustomerDashboard";
import { SessionManager } from "../components/session/SessionManager"
import { HomePage } from "../features/public/HomePage";
import { ExpertsPage } from "../features/public/ExpertsPage";
import { ExpertProfilePage } from "../features/public/ExpertsProfilePage";
import { ExpertsLandingPage } from "../features/public/ExpertsLandingPage";
// import { isAuthenticated } from "../utils/authStorage";

export const AppRoutes=()=>{
    return(
        <BrowserRouter>
            <SessionManager /> 
            <Routes>
                {/*Public routes*/}
                <Route path={ROUTES.HOME} element={<HomePage/>}/>
               <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
               <Route path={ROUTES.CUSTOMER_REGISTER} element={<CustomerRegistration/>} />
               <Route path={ROUTES.EXPERT_REGISTER} element={<ExpertRegistration/>} />
               <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
               <Route path={ROUTES.EXPERTS} element={<ExpertsPage/>} />
               <Route path={ROUTES.EXPERT_PROFILE} element={<ExpertProfilePage />} />
               <Route path={ROUTES.EXPERT_LANDING} element={<ExpertsLandingPage/>}/>
               <Route path={ROUTES.CATEGORY_EXPERTS} element={<ExpertsPage/>}/>

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