import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";

import { FormTextField } from "../../components/form/FormTextField";
import { FormSelect } from "../../components/form/FormSelect";
import { FormCheckboxGroup } from "../../components/form/FormCheckBoxGroup";

import { RegistrationNavbar } from "../../components/navigation/RegistrationNavbar";
import { RegistrationHeader } from "../../components/headers/RegistrationHeader";

import { expertFields } from "../data/expertFields";

import {
  states,
  districts,
  cities,
  areas
} from "../../mocks/address/locationData";

import { filterByParentId } from "../../helpers/locationHelpers";
import { RegistrationLayout } from "../../components/layout/RegistrationLayout";
import { FormCard } from "../../components/layout/FormCard";
import { FormProgress } from "../../components/form/FormProgress";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { registerExpert } from "../../services/expertService";

const services = [
  "Bridal Makeup",
  "Hair Styling",
  "Mehendi",
  "Nail Art",
  "Saree Draping",
  "Party Makeup",
  "Skin Care",
  "Men's Grooming"
];

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
  services: []
};

export const ExpertRegistration = () => {
  const location = useLocation();
  const credentials = location.state || {};

  const [expert, setExpert] = useState(expertData);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setExpert((prev) => ({
      ...prev,
      [name]:value
    }));
  };

  const hierarchy = {
    stateId: ["districtId", "cityId", "areaId"],
    districtId: ["cityId", "areaId"],
    cityId: ["areaId"]
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setExpert((prev) => {
      const updated = {
        ...prev,
       [name]: value
      };

      hierarchy[name]?.forEach((field) => {
        updated[field] = "";
      });

      return updated;
    });
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;

    setExpert((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, value]
        : prev.services.filter(
          (service) => service !== value
        )
    }));
  };

  const handleSubmit = async() => {
      const payload = {
        ...credentials,
        ...customer
      };

      await registerExpert(payload)
};

  const filteredDistricts = filterByParentId(
    districts,
    "stateId",
    expert.stateId
  );

  const filteredCities = filterByParentId(
    cities,
    "districtId",
    expert.districtId
  );

  const filteredAreas = filterByParentId(
    areas,
    "cityId",
    expert.cityId
  );

  const selectConfig = {
    stateId: {
      options: states,
      onChange: handleAddressChange
    },

    districtId: {
      options: filteredDistricts,
      onChange: handleAddressChange
    },

    cityId: {
      options: filteredCities,
      onChange: handleAddressChange
    },

    areaId: {
      options: filteredAreas,
      onChange: handleAddressChange
    }
  };

  return (
    <RegistrationLayout>
      <RegistrationNavbar onBack={handleBack} />

      <FormCard>
         <FormProgress step={2} totalSteps={2} /> 
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
                sm: field.name === "addressLine1" ? 12 : 6
              }}
            >
              {field.type === "select" ? (
                <FormSelect
                  label={field.label}
                  name={field.name}
                  value={expert[field.name]}
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
                  value={expert[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <FormCheckboxGroup
          label="Services You Offer"
          options={services}
          values={expert.services}
          onChange={handleServiceChange}
        />

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