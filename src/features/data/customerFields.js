// features/auth/data/customerFields.js

export const customerFields = [
  {
    type: "text",
    label: "First Name",
    name: "firstName",
    placeholder: "Enter Your First Name"
  },
  {
    type: "text",
    label: "Last Name",
    name: "lastName",
    placeholder: "Enter Your Last Name"
  },
  {
    type: "date",
    label: "Date of Birth",
    name: "dob"
  },
  {
    type: "select",
    label: "Gender",
    name: "gender",
    placeholder: "Select Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "", label: "Prefer not to say" }
    ]
  },
  {
    type: "text",
    label: "Address Line 1",
    name: "addressLine1",
    placeholder: "House No/Flat No, Building Name, Street Name"
  },
  {
    type: "select",
    label: "State",
    name: "stateId",
    placeholder: "Select State"
  },
  {
    type: "select",
    label: "District",
    name: "districtId",
    placeholder: "Select District"
  },
  {
    type: "select",
    label: "City",
    name: "cityId",
    placeholder: "Select City"
  },
  {
    type: "select",
    label: "Area",
    name: "areaId",
    placeholder: "Select Area"
  },
  {
    type: "number",
    label: "Budget",
    name: "budget",
    placeholder: "Enter maximum budget amount"
  }
];