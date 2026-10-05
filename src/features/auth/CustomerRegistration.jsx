import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";

import { FormTextField } from "../../components/form/FormTextField";
import { FormSelect } from "../../components/form/FormSelect";
import { RegistrationNavbar } from "../../components/navigation/RegistrationNavbar";
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";

import { customerFields } from "../data/customerFields";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { FormProgress } from "../../components/form/FormProgress";
import { registerUser } from "../../services/authService";
import { Navbar } from "../../components/landing/Navbar";

import { fetchStates,fetchAreasByCity,fetchCitiesByDistrict,fetchDistrictsByState } from "../../store/slices/locationSlice";
import { clearAreas,clearCities } from "../../store/slices/locationSlice";
import { createAddress } from "../../services/locationService";
import { fetchRoles } from "../../store/slices/roleSlice";
import { validateFields } from "../../helpers/formValidator";



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
  const dispatch=useDispatch();
  const {
    states = [],
    districts = [],
    cities = [],
    areas = [],
  } = useSelector((state) => state.location || {});
  const { roles = [] } = useSelector((state) => state.roles || {});
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
  if (states.length === 0) {
    dispatch(fetchStates());
  }
}, [dispatch, states.length]);

useEffect(()=>{
  if(roles.length===0){
    dispatch(fetchRoles());
  }
},[dispatch,roles.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]:value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]:"",
    }));
  };

  const hierarchy = {
    stateId: ["districtId", "cityId", "areaId"],
    districtId: ["cityId", "areaId"],
    cityId: ["areaId"],
  };

 const handleAddressChange =  (e) => {
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

  setErrors((prev) => ({
    ...prev,
   [name]: "",
  }));

  if (name === "stateId") {
    dispatch(fetchDistrictsByState(value));

    dispatch(clearCities());
    dispatch(clearAreas());
  }

  if (name === "districtId") {
    dispatch(fetchCitiesByDistrict(value));

    dispatch(clearAreas());
  }

  if (name === "cityId") {
    dispatch(fetchAreasByCity(value));
  }
};

  const handleSubmit = async () => {
  const validationErrors = validateFields(
    customerFields,
    customer
  );

  setErrors(validationErrors);

  const isValid = !Object.values(
    validationErrors
  ).some(Boolean);

  if (!isValid) {
    return;
  }

  try {
    const addressResponse =
      await createAddress({
        areaId: Number(customer.areaId),
        addressLine:
          customer.addressLine1,
      });

    const customerRole = roles.find(
      (role) =>
        role.roleName === "Customer"
    );

    const payload = {
      user: {
        email: credentials.email,
        phoneNumber:
          credentials.phone,
        password:
          credentials.password,
        roleId:
          customerRole?.roleId,
      },

      userProfile: {
        firstName:
          customer.firstName,
        lastName:
          customer.lastName,
        gender: customer.gender,
        dateOfBirth:
          customer.dob,
        addressId:
          addressResponse.addressId,
        profileImage: "",
      },

      customer: {
        budget: Number(
          customer.budget
        ),
      },

      expert: null,
    };

    const response =
      await registerUser(payload);

    console.log(
      "Registration Successful"
    );

    console.log(response);
  } catch (error) {
    console.error(
      "Full Error:",
      error
    );

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

  

 
  const stateOptions = states.map(
  (state) => ({
    value: state.stateId,
    label: state.stateName,
  })
);

  const districtOptions=districts.map((district)=>({
    value:district.districtId,
    label:district.districtName,
  }));

   const cityOptions=cities.map((city)=>({
    value:city.cityId,
    label:city.cityName,
  }));

   const areaOptions=areas.map((area)=>({
    value:area.areaId,
    label:area.areaName,
  }));

  const selectConfig = {
    stateId: {
      options: stateOptions,
      onChange: handleAddressChange,
    },

    districtId: {
      options: districtOptions,
      onChange: handleAddressChange,
    },

    cityId: {
      options: cityOptions,
      onChange: handleAddressChange,
    },

    areaId: {
      options: areaOptions,
      onChange: handleAddressChange,
    },
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
                    selectConfig[field.name]
                      ?.onChange || handleChange
                  }
                  options={
                    selectConfig[field.name]
                      ?.options ||
                    field.options ||
                    []
                  }
                  placeholder={field.placeholder}
                  error={!!errors[field.name]}
                  helperText={
                    errors[field.name]
                  }
                />
              ) : (
                <FormTextField
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={customer[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
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