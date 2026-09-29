export const validateFields = (
  fields,
  formData
) => {
  const errors = {};

  fields.forEach((field) => {
    if (field.validate) {
      errors[field.name] =
        field.validate(
          formData[field.name],
          formData
        );
    }
  });

  return errors;
};

export const validateRole = (role) => {
  if (!role) {
    return "Please select a role";
  }

  return "";
};