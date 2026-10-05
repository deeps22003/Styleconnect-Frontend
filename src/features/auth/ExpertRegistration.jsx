import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid,Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
 
import { FormTextField } from "../../components/form/FormTextField";
import { FormSelect } from "../../components/form/FormSelect";
import { FormCheckboxGroup } from "../../components/form/FormCheckBoxGroup";
 
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";
 
import { expertFields } from "../data/expertFields";
 
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { FormProgress } from "../../components/form/FormProgress";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
 
import { registerUser } from "../../services/authService";
 
import { fetchCategories } from "../slices/categorySlice";
 
import { fetchStates,fetchAreasByCity,fetchCitiesByDistrict,fetchDistrictsByState,
  clearAreas,clearCities } from "../slices/locationSlice";
import { createAddress } from "../../services/locationService";
 
import { Navbar } from "../../components/landing/Navbar";
import { fetchRoles } from "../slices/roleSlice";
import { validateFields } from "../../helpers/formValidator";
 
const expertData = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  addressLine1: "",
  stateId: "",
  districtId: "",
  cityId: "",
  areaId: "",
  hourlyCharges: "",
  experience: "",
  services: [],
};
 
export const ExpertRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const credentials = location.state || {};
 
  const [expert, setExpert] = useState(expertData);
  const [errors, setErrors] = useState({});
 
  const { categories = [] } = useSelector(
    (state) => state.categories || {}
  );
 
  const {
    states = [],
    districts = [],
    cities = [],
    areas = [],
  } = useSelector((state) => state.location || {});
  const { roles = [] } = useSelector((state) => state.roles || {});
 
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
 
  useEffect(() => {
    if (states.length === 0) {
      dispatch(fetchStates());
    }
  }, [dispatch, states.length]);
  console.log("States:", states);
 
  useEffect(()=>{
    if(roles.length===0){
      dispatch(fetchRoles());
    }
  },[dispatch,roles.length]);
 
  // handling input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
 
    setExpert((prev) => ({
      ...prev,
     [name]: value,
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
 
  // handling address changes
 
  const handleAddressChange = (e) => {
  const { name, value } = e.target;
 
  setExpert((prev) => {
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
  } else if (name === "districtId") {
    dispatch(fetchCitiesByDistrict(value));
 
    dispatch(clearAreas());
  } else if (name === "cityId") {
    dispatch(fetchAreasByCity(value));
  }
};
 
  const handleServiceChange = (e) => {
        const { value, checked } = e.target;
 
        const categoryId = Number(value);
 
        setExpert((prev) => ({
          ...prev,
          services: checked
            ? [...prev.services, categoryId]
            : prev.services.filter(
                (id) => id !== categoryId
              ),
        }));
 
        setErrors((prev) => ({
          ...prev,
          services: "",
        }));
    };
 
  const handleSubmit = async () => {
    const validationErrors = validateFields(
      expertFields,
      expert
    );
 
    validationErrors.services =
      !expert.services.length
        ? "Select at least one service"
    : "";
 
    setErrors(validationErrors);
 
    const hasErrors =
      Object.values(validationErrors).some(
        Boolean
      );
 
    if (hasErrors) {
      return;
    }
 
  try {
    const addressResponse =
      await createAddress({
        areaId: Number(expert.areaId),
        addressLine: expert.addressLine1,
      });
 
    const expertRole = roles.find(
      (role) => role.roleName === "Expert"
    );
 
    const payload = {
      user: {
        email: credentials.email,
        phoneNumber: credentials.phone,
        password: credentials.password,
        roleId: expertRole?.roleId,
      },
 
      userProfile: {
        firstName: expert.firstName,
        lastName: expert.lastName,
        gender: expert.gender,
        dateOfBirth: expert.dob,
 
        addressId:
          addressResponse.addressId,
 
        profileImage: "",
      },
 
      expert: {
        hourlyCharges: Number(
          expert.hourlyCharges
        ),
 
        experience: Number(
          expert.experience
        ),
 
        serviceCategoryIds:
          expert.services,
      },
 
      customer: null,
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
 
  const districtOptions = districts.map(
    (district) => ({
      value: district.districtId,
      label: district.districtName,
    })
  );
 
  const cityOptions = cities.map(
    (city) => ({
      value: city.cityId,
      label: city.cityName,
    })
  );
 
  const areaOptions = areas.map(
    (area) => ({
      value: area.areaId,
      label: area.areaName,
    })
  );
 
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
 
  const serviceOptions =
    categories?.map((category) => ({
      id:
        category.serviceCategoryId ||
        category.id,
 
      name:
        category.categoryName ||
        category.name,
    })) || [];
 
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
          step={2}
          totalSteps={2}
        />
 
        <RegistrationHeader
          heading="Build your expert profile"
          caption="Clients discover you based on this information — make it shine."
        />
 
        <Grid container spacing={2}>
          {expertFields.map((field) => (
            <Grid
              key={field.name}
              size={{
                xs: 12,
                sm:
                  field.name ===
                  "addressLine1"
                    ? 12
                    : 6,
              }}
            >
              {field.type ===
              "select" ? (
                <FormSelect
                  label={field.label}
                  name={field.name}
                  value={
                    expert[field.name]
                  }
                  onChange={
                    selectConfig[
                      field.name
                    ]?.onChange ||
                    handleChange
                  }
                  options={
                    selectConfig[
                      field.name
                    ]?.options ||
                    field.options ||
                    []
                  }
                  placeholder={
                    field.placeholder
                  }
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
                  value={
                    expert[field.name]
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    field.placeholder
                  }
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                />
              )}
            </Grid>
          ))}
        </Grid>
 
        <FormCheckboxGroup
          label="Services You Offer"
          options={serviceOptions}
          values={expert.services}
          onChange={handleServiceChange}
        />
 
        {errors.services && (
          <Typography
            color="error"
            variant="caption"
          >
            {errors.services}
          </Typography>
        )}
 
        <PrimaryButton
          type="button"
          onClick={handleSubmit}
        >
          Complete Registration
        </PrimaryButton>
      </FormCard>
    </RegistrationLayout>
  );
};
