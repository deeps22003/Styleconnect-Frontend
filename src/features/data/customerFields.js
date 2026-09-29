import {
  validateFirstName,
  validateLastName,
  validateDOB,
  validateGender,
  validateAddressLine,
  validateState,
  validateDistrict,
  validateCity,
  validateArea,
} from "../../helpers/validationHelpers";

export const customerFields = [
  {
    type: "text",
    label: "First Name",
    name: "firstName",
    placeholder: "Enter Your First Name",
    validate: validateFirstName,
  },
  {
    type: "text",
    label: "Last Name",
    name: "lastName",
    placeholder: "Enter Your Last Name",
    validate: validateLastName,
  },
  {
    type: "date",
    label: "Date of Birth",
    name: "dob",
    validate: validateDOB,
  },
  {
    type: "select",
    label: "Gender",
    name: "gender",
    placeholder: "Select Gender",
    validate: validateGender,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "", label: "Prefer not to say" },
    ],
  },
  {
    type: "text",
    label: "Address Line 1",
    name: "addressLine1",
    placeholder:
      "House No/Flat No, Building Name, Street Name",
    validate: validateAddressLine,
  },
  {
    type: "select",
    label: "State",
    name: "stateId",
    placeholder: "Select State",
    validate: validateState,
  },
  {
    type: "select",
    label: "District",
    name: "districtId",
    placeholder: "Select District",
    validate: validateDistrict,
  },
  {
    type: "select",
    label: "City",
    name: "cityId",
    placeholder: "Select City",
    validate: validateCity,
  },
  {
    type: "select",
    label: "Area",
    name: "areaId",
    placeholder: "Select Area",
    validate: validateArea,
  },
   {
    type: "number",
    label: "Budget",
    name: "budget",
    placeholder: "Enter maximum budget amount"
  }
];
