export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  return "";
};

export const validatePhone = (phone) => {
  if (!phone.trim()) {
    return "Phone number is required";
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(phone)) {
    return "Phone number must contain 10 digits";
  }

  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return "Password must contain uppercase, lowercase, number and special character";
  }

  return "";
};

export const validateConfirmPassword = (
  password,
  confirmPassword
) => {
  if (!confirmPassword) {
    return "Confirm Password is required";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
};

export const validateRole = (role) => {
  if (!role) {
    return "Please select a role";
  }

  return "";
};

export const validateFirstName = (
  firstName
) => {
  if (!firstName.trim()) {
    return "First name is required";
  }

  if (firstName.trim().length < 2) {
    return "First name must contain at least 2 characters";
  }

  const regex = /^[A-Za-z ]+$/;

  if (!regex.test(firstName)) {
    return "Only letters are allowed";
  }

  return "";
};

export const validateLastName = (
  lastName
) => {
  if (!lastName.trim()) {
    return "Last name is required";
  }

  if (lastName.trim().length < 2) {
    return "Last name must contain at least 2 characters";
  }

  const regex = /^[A-Za-z ]+$/;

  if (!regex.test(lastName)) {
    return "Only letters are allowed";
  }

  return "";
};

export const validateGender = (
  gender
) => {
  if (!gender) {
    return "Please select gender";
  }

  return "";
};

export const validateDOB = (dob) => {
  if (!dob) {
    return "Date of birth is required";
  }
  return "";
};

export const validateAddressLine = (
  address
) => {
  if (!address.trim()) {
    return "Address is required";
  }

  if (address.trim().length < 5) {
    return "Enter a valid address";
  }

  return "";
};

export const validateState = (
  stateId
) => {
  if (!stateId) {
    return "Please select a state";
  }

  return "";
};

export const validateDistrict = (
  districtId
) => {
  if (!districtId) {
    return "Please select a district";
  }

  return "";
};

export const validateCity = (
  cityId
) => {
  if (!cityId) {
    return "Please select a city";
  }

  return "";
};

export const validateArea = (
  areaId
) => {
  if (!areaId) {
    return "Please select an area";
  }

  return "";
};

export const validateHourlyCharges = (
  charges
) => {
  if (!charges) {
    return "Hourly charges are required";
  }

  if (Number(charges) <= 0) {
    return "Hourly charges must be greater than 0";
  }

  return "";
};

export const validateExperience = (
  experience
) => {
  if (!experience) {
    return "Experience is required";
  }

  const years =
    Number(experience);

  if (years < 0) {
    return "Experience cannot be negative";
  }

  if (years > 60) {
    return "Enter a valid experience";
  }

  return "";
};

export const validateServices = (
  services
) => {
  if (
    !services ||
    services.length === 0
  ) {
    return "Select at least one service";
  }

  return "";
};