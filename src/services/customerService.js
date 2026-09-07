// services/customerService.js

export const registerCustomer = async (
  data
) => {
  console.log(
    "Customer Registration Payload:",
    data
  );

  return data;
};