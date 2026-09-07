import {BrowserRouter,Routes,Route} from "react-router-dom";
import { RegisterPage } from "../features/auth/RegisterPage";
import { CustomerRegistration } from "../features/auth/CustomerRegistration";
import { ExpertRegistration } from "../features/auth/ExpertRegistration";
export const AppRoutes=()=>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>StyleConnect Home</h1>} />
               <Route path="/register" element={<RegisterPage/>}/>
               <Route path="/register/customer" element={<CustomerRegistration/>} />
               <Route path="register/expert" element={<ExpertRegistration/>} />
            </Routes>
        </BrowserRouter>
    )
}