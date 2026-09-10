import { useState } from "react";
import { FormTextField } from "../../components/form/FormTextField";
import { FormSelect } from "../../components/form/FormSelect";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import { RegistrationNavbar } from "../../components/navigation/RegistrationNavbar";
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";
import { registerFields } from "../data/registerFields";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { FormProgress } from "../../components/form/FormProgress";
import { validateEmail,validatePhone,validatePassword,validateConfirmPassword,validateRole } from "../../helpers/validationHelpers";

const userInfo = {
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: ""
};



export const RegisterPage = () => {
    const [userData, setUserData] = useState(userInfo);
    const navigate = useNavigate();
    // const[errors,setErrors]=useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));

    //    setErrors((prev)=>({
    //     ...prev,
    //     [name]:""
    //    }))
    };

    // const validateForm=()=>{
    //     const validationErrors={
    //     email:validateEmail(userData.email),
    //     phone: validatePhone(userData.phone),
    //     password: validatePassword(userData.password),
    //     confirmPassword: validateConfirmPassword(userData.password,userData.confirmPassword),
    //     role: validateRole(userData.role)
    //     }   
    //      setErrors(validationErrors)
    //     return !Object.values(validationErrors).some(Boolean);
    // };
   

    return (
        <RegistrationLayout>
            <RegistrationNavbar backLabel="Back to home" />

            <FormCard>
                <FormProgress step={1} totalSteps={2} />
                <RegistrationHeader
                    heading="Create your account"
                    caption="Start with the basics — you'll add role-specific details next."
                />

                {registerFields.map((field) => (
                    <FormTextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={userData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        // error={!!errors[field.name]}
                        // helperText={errors[field.name]}
                    />
                ))}



                <FormSelect
                    label="I am registering as"
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    helperText= "More roles, like Salon Partner, are coming soon."
                    options={[
                        {
                            value: "customer",
                            label: "Customer"
                        },
                        {
                            value: "expert",
                            label: "Expert"
                        }
                    ]}
                    placeholder="Select a role"
                    // error={!!errors.role}
                />

                <PrimaryButton
                    onClick={() => {
                        // const isValid = validateForm();
                        // if (!isValid) return;
                        if (!userData.role) return;

                        navigate(`/register/${userData.role}`, {
                            state: userData
                        })
                    }}
                >
                    Next
                </PrimaryButton>
            </FormCard>
        </RegistrationLayout>
    );
};