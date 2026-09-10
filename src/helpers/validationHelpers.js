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