import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";

import { FormTextField } from "../../components/form/FormTextField";
import { FormSelect } from "../../components/form/FormSelect";
import { RegistrationNavbar } from "../../components/navigation/RegistrationNavbar";
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";

import { customerFields } from "../data/customerFields";

import { states, districts, cities, areas } from "../../mocks/address/locationData";

import { filterByParentId } from "../../helpers/locationHelpers";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { FormProgress } from "../../components/form/FormProgress";
import { registerCustomer } from "../../services/customerService";
import { registerUser } from "../../services/authService";

const customerData = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  budget: "",
  addressLine1: "",
  stateId: "",
  districtId: "",
  cityId: "",
  areaId: "",
};

export const CustomerRegistration = () => {
  const location = useLocation();
  const credentials = location.state || {};

  const [customer, setCustomer] = useState(customerData);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]:value,
    }));
  };

  const hierarchy = {
    stateId: ["districtId", "cityId", "areaId"],
    districtId: ["cityId", "areaId"],
    cityId: ["areaId"],
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => {
      const updated = {
        ...prev,
        [name]:value,
      };

      hierarchy[name]?.forEach((field) => {
        updated[field] = "";
      });

      return updated;
    });
  };

  const handleSubmit = async () => {
  const payload = {
    user: {
      email: credentials.email,
      phoneNumber: credentials.phone,
      password: credentials.password,
      roleId: 1,
    },

    userProfile: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      gender: customer.gender,
      dateOfBirth: customer.dob,

      // Temporary
      addressId: 2,

      profileImage: "",
    },

    customer: {
      budget: Number(customer.budget),
    },

    expert: null,
  };

  try {
    const response =
      await registerUser(payload);

    console.log(
      "Registration Successful"
    );

    console.log(response);
  } catch (error) {
  console.error("Full Error:", error);

  console.log(
    "Response Data:",
    error.response?.data
  );

  console.log(
    "Status:",
    error.response?.status
  );
}
};

  const filteredDistricts = filterByParentId(
    districts,
    "stateId",
    customer.stateId
  );

  const filteredCities = filterByParentId(
    cities,
    "districtId",
    customer.districtId
  );

  const filteredAreas = filterByParentId(
    areas,
    "cityId",
    customer.cityId
  );

  const selectConfig = {
    stateId: {
      options: states,
      onChange: handleAddressChange,
    },

    districtId: {
      options: filteredDistricts,
      onChange: handleAddressChange,
    },

    cityId: {
      options: filteredCities,
      onChange: handleAddressChange,
    },

    areaId: {
      options: filteredAreas,
      onChange: handleAddressChange,
    },
  };

  return (
    <RegistrationLayout>
      <RegistrationNavbar onBack={handleBack} />

      <FormCard>
         <FormProgress step={2} totalSteps={2} />
         
        <RegistrationHeader
          heading="Tell us about you"
          caption="This helps us recommend the right experts and offers."
        />

        <Grid container spacing={2}>
          {customerFields.map((field) => (
            <Grid
              key={field.name}
              size={{
                xs: 12,
                sm: field.name === "addressLine1" ? 12 : 6,
              }}
            >
              {field.type === "select" ? (
                <FormSelect
                  label={field.label}
                  name={field.name}
                  value={customer[field.name]}
                  onChange={
                    selectConfig[field.name]?.onChange ||
                    handleChange
                  }
                  options={
                    selectConfig[field.name]?.options ||
                    field.options ||
                    []
                  }
                  placeholder={field.placeholder}
                />
              ) : (
                <FormTextField
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={customer[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              )}
            </Grid>
          ))}
        </Grid>
        
        <PrimaryButton 
        type="submit"
        onClick={handleSubmit}
        >
          Complete Registration
        </PrimaryButton>
      </FormCard>
    </RegistrationLayout>
  );
};