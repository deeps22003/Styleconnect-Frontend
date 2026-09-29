import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FormTextField } from "../../components/form/FormTextField";
import { FormSelect } from "../../components/form/FormSelect";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { FormProgress } from "../../components/form/FormProgress";
import { Navbar } from "../../components/landing/Navbar";

import { registerFields } from "../data/registerFields";

import { validateFields,validateRole } from "../../helpers/formValidator";

const userInfo = {
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "",
};

export const RegisterPage = () => {
  const [userData, setUserData] = useState(userInfo);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]:value,
    }));

    // Remove error when user starts editing
    setErrors((prev) => ({
      ...prev,
      [name]:"",
    }));
  };

  const handleNext = () => {
    const validationErrors = validateFields(
      registerFields,
      userData
    );

    validationErrors.role = validateRole(
      userData.role
    );

    setErrors(validationErrors);

    const isValid = !Object.values(
      validationErrors
    ).some(Boolean);

    if (!isValid) return;

    navigate(`/register/${userData.role}`, {
      state: userData,
    });
  };

  return (
    <RegistrationLayout>
      <Navbar
        logo="StyleConnect"
        showNavigation={false}
        showBackButton={true}
        showAuthActions={false}
      />

      <FormCard>
        <FormProgress
          step={1}
          totalSteps={2}
        />

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
            error={!!errors[field.name]}
            helperText={errors[field.name]}
          />
        ))}

        <FormSelect
          label="I am registering as"
          name="role"
          value={userData.role}
          onChange={handleChange}
          error={!!errors.role}
          helperText={
            errors.role ||
            "More roles, like Salon Partner, are coming soon."
          }
          options={[
            {
              value: "customer",
              label: "Customer",
            },
            {
              value: "expert",
              label: "Expert",
            },
          ]}
          placeholder="Select a role"
        />

        <PrimaryButton onClick={handleNext}>
          Next
        </PrimaryButton>
      </FormCard>
    </RegistrationLayout>
  );
};