import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "../../helpers/validationHelpers";

export const registerFields = [
  {
    label: "Email address",
    name: "email",
    type: "email",
    placeholder: "you@example.com",
    validate: validateEmail,
  },
  {
    label: "Phone number",
    name: "phone",
    type: "tel",
    placeholder: "Enter your phone number",
    validate: validatePhone,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    validate: validatePassword,
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    validate: (value, formData) =>
      validateConfirmPassword(
        formData.password,
        value
      ),
  },
  
];