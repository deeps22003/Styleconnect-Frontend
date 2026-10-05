const ROUTES = {
  HOME: "/",

  LOGIN: "/login",

  REGISTER: "/register",
  CUSTOMER_REGISTER: "/register/customer",
  EXPERT_REGISTER: "/register/expert",
  EXPERTS : "/experts",

  CUSTOMER_DASHBOARD:"/customer/dashboard",
  EXPERT_DASHBOARD:"/expert/dashboard",

  CUSTOMERAPPOINTMENT_DASHBOARD:"/customer/appointments/dashboard",
  EXPERTAPPOINTMENT_DASHBOARD:"/expert/appointments/dashboard",

  EXPERT_PROFILE: "/experts/:expertId",
  EXPERT_LANDING:"/for-experts",
  CATEGORY_EXPERTS: "/categories/:categoryId",
};

export default ROUTES;