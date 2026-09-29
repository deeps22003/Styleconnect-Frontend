
import { useEffect, useState } from "react"
import { loginUser } from "../../services/authService";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { FormTextField } from "../../components/form/FormTextField";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";
import { getAuthData, saveAuthData } from "../../utils/authStorage";
import { useNavigate } from "react-router-dom";
import { getDashboardRoute } from "../../helpers/getDashboardRoute";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./authSlice";
import { RegistrationNavbar } from "../../components/navigation/RegistrationNavbar";

const credentialData={
    credential:"",
    password:""
    }
export const LoginPage=()=>{
    const[credentials,setCredentials]=useState(credentialData);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    useEffect(()=>{
        const user=getAuthData();
        console.log("Current user : ",user);
    },[]);

    const handleChange=(e)=>{
        const{name,value}=e.target;
        setCredentials((prev)=>({
            ...prev,
            [name]:value
        }))
    };

    const handleLogin=async(e)=>{
        e.preventDefault();
        try{
            const response=await loginUser(credentials);
            const userData=response.data;
            saveAuthData(response.data);
            console.log("Login success : ",response.data);

            console.log("Route:", getDashboardRoute(userData.roleId));

            dispatch(loginSuccess(response.data));
            navigate(getDashboardRoute(userData.roleId));
           
        }
        catch(error){
            console.log("Login failed : ",error);
        }
    }

    // const handleBack=()=>{
    //     navigate()
    // }

    return(
        <RegistrationLayout>
            <RegistrationNavbar  backLabel="Back to home" />
           <FormCard>
            <RegistrationHeader 
              heading="Login"
              caption="Login with your credentials to explore the application"
            />
                <FormTextField
                label="Email"
                name="credential"
                type="email"
                value={credentials.credential}
                onChange={handleChange}
                placeholder="Enter the email to login"
                />
                <FormTextField
                label="Password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter the password"
                />

                <PrimaryButton type="submit" onClick={handleLogin}>
                    Login
                </PrimaryButton>
           </FormCard>
        </RegistrationLayout>
    )


}