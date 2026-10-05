
import { useEffect, useState } from "react"
import { loginUser } from "../../services/authService";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { FormTextField } from "../../components/form/FormTextField";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";
import { getAuthData, saveAuthData } from "../../utils/authStorage";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardRoute } from "../../helpers/getDashboardRoute";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./authSlice";
import { RegistrationNavbar } from "../../components/navigation/RegistrationNavbar";
import { Typography } from "@mui/material";
import ROUTES from "../../routes/routePaths";
import { Navbar } from "../../components/landing/Navbar";
import { clearBookingFlow } from "../../store/slices/expertSlice";

const credentialData={
    credential:"",
    password:""
    }
export const LoginPage=()=>{
    const[credentials,setCredentials]=useState(credentialData);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {selectedExpert,bookingIntent}=useSelector((state)=>state.experts)
    useEffect(()=>{
        const user=getAuthData();
        console.log("Current user : ",user);
    },[]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCredentials((prev) => ({
            ...prev,
            [name]:value
        }));

        setErrorMessage("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setErrorMessage("");

            const response = await loginUser(credentials);

            const userData = response.data;

            saveAuthData(response.data);

            dispatch(loginSuccess(response.data));

            if (selectedExpert && bookingIntent) {
                if (userData.roleId === 1) {
                    dispatch(clearBookingFlow());

                    navigate(
                        `/experts/${selectedExpert.expertId}`,
                        { replace: true }
                    );

                    return;
                }

                setErrorMessage(
                    "Only customers can book appointments."
                );

                dispatch(clearBookingFlow());

                navigate(
                    getDashboardRoute(userData.roleId),
                    { replace: true }
                );
            } else {
                navigate(
                    getDashboardRoute(userData.roleId),
                    { replace: true }
                );
            }
        } catch (error) {
                console.log("Login failed:", error);

                setErrorMessage(
                    error.response?.data?.Message ||
                    "Invalid credentials"
                );
            }
    };


    const handleBack=()=>{
        navigate(ROUTES.HOME)
    }

    return(
        <RegistrationLayout>
            <Navbar
                   logo="StyleConnect"
                   showNavigation={false}
                   showBackButton={true}
                   showAuthActions={false}
                   />
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

                {errorMessage && (
                    <Typography
                        color="error"
                        variant="body2"
                        sx={{ mt: 1 }}
                    >
                        {errorMessage}
                    </Typography>
                )}

                <PrimaryButton type="submit" onClick={handleLogin}>
                    Login
                </PrimaryButton>
                <Typography
                    variant="body2"
                    sx={{
                        mt: 2,
                        textAlign: "center",
                    }}
                >
                    Don't have an account?{" "}
                    <Link
                        to={ROUTES.REGISTER}
                        style={{
                            color: "#8B5CF6",
                            fontWeight: 600,
                            textDecoration: "none",
                        }}
                    >
                        Register Here
                    </Link>
                </Typography>
           </FormCard>
        </RegistrationLayout>
    )


}