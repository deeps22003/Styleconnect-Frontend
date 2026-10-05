const API_ENDPOINTS = {
  AUTH: {
    REGISTER_USER: "/api/Auth/register",
    LOGIN_USER: "/api/Auth/login",
    REFRESH_ACCESS_TOKEN: "/api/Auth/refresh-token",
    LOGOUT_USER: "/api/Auth/logout",
    SEND_PASSWORD_RESET_OTP: "/api/Auth/send-reset-otp",
    VERIFY_PASSWORD_RESET_OTP: "/api/Auth/verify-reset-otp",
    RESET_USER_PASSWORD: "/api/Auth/reset-password",
    
  },

  CATEGORY: {
    GET_CATEGORIES: "/api/Category",
    CREATE_CATEGORY: "/api/Category",
    UPDATE_CATEGORY: (categoryId) =>
      `/api/Category/${categoryId}`,
    DELETE_CATEGORY: (categoryId) =>
      `/api/Category/${categoryId}`,
    RESTORE_CATEGORY: (categoryId) =>
      `/api/Category/restore/${categoryId}`,
  },

  EXPERT_CATEGORY: {
    ADD_EXPERT_CATEGORY: "/api/ExpertCategory",
    UPDATE_EXPERT_CATEGORIES: "/api/ExpertCategory",
    GET_EXPERT_CATEGORIES: (expertId) =>
      `/api/ExpertCategory/${expertId}`,
  },

  ROLE: {
    GET_ROLES: "/api/Role",
    CREATE_ROLE: "/api/Role",
    UPDATE_ROLE: (roleId) =>
      `/api/Role/${roleId}`,
    DELETE_ROLE: (roleId) =>
      `/api/Role/${roleId}`,
    RESTORE_ROLE: (roleId) =>
      `/api/Role/restore/${roleId}`,
  },

  SAVED_EXPERTS: {
    SAVE_EXPERT: "/api/SavedExperts",
    GET_SAVED_EXPERTS_BY_CUSTOMER: (customerId) =>
      `/api/SavedExperts/customer/${customerId}`,
    REMOVE_SAVED_EXPERT: (savedExpertId) =>
      `/api/SavedExperts/${savedExpertId}`,
  },
  EXPERTS:{
    GET_ALLEXPERTS:"/api/Experts",
    GET_EXPERT_BY_ID:(expertId)=>`/api/Experts/${expertId}`
  },
  CUSTOMERS:{
    GET_CUSTOMER_BY_ID:(customerId)=>`/api/Customers/${customerId}`,
    GET_CUSTOMER_BY_USERID:(userId)=>`api/Customers/user/${userId}`
  },
  LOCATION:{
    GET_STATES:"/api/Locations/states",
    GET_DISTRICTS_BY_STATEID:(stateId)=> `/api/Locations/states/${stateId}/districts`,
    GET_CITIES_BY_DISTRICTID:(districtId)=>`/api/Locations/districts/${districtId}/cities`,
    GET_AREAS_BY_CITYID:(cityId)=>`/api/Locations/cities/${cityId}/areas`,
    CREATE_ADDRESS:"/api/Address"
  },
  APPOINTMENTS: {
  GET_CUSTOMER_APPOINTMENTS: (userId) =>
    `api/Appointments/Customer/${userId}`,

  GET_EXPERT_APPOINTMENTS: (expertId) =>
    `api/Appointments/Expert/${expertId}`,

  GET_USER_APPOINTMENTS: (userType, userId) =>`api/Appointments/${userType}/${userId}`,

  CREATE_OR_UPDATE_APPOINTMENT:
    "api/CreateorUpdateAppointment",

  UPDATE_APPOINTMENT_STATUS: (appointmentId) =>
    `api/GetAppointmentStatus/${appointmentId}`,

  CANCEL_APPOINTMENT: (appointmentId) =>
    `api/GetAppointmentCancle/${appointmentId}`,
},
FEEDBACK: {
  CREATE_OR_UPDATE_FEEDBACK:
    "api/AddFeedbackRating",

  GET_FEEDBACK_BY_APPOINTMENT: (appointmentId) =>
    `api/GetFeedbackRating/${appointmentId}`,

  GET_FEEDBACK_BY_EXPERT: (expertId) =>
    `api/FeedbackRating/GetFeedbackRatingByExpert/${expertId}`,
},
};

export default API_ENDPOINTS;