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
  // Get appointment by appointment ID
  GET_APPOINTMENT_BY_ID: (appointmentId) =>
    `/Appointments/${appointmentId}`,
 
  // Get appointments by user type and user ID
  GET_USER_APPOINTMENTS: (userType, userId) =>
    `/Appointments/${userType}/${userId}`,
 
  // Create or update appointment
  CREATE_OR_UPDATE_APPOINTMENT:
    "/CreateorUpdateAppointment",
 
  // Update appointment status
  UPDATE_APPOINTMENT_STATUS: (appointmentId) =>
    `/GetAppointmentStatus/${appointmentId}`,
 
  // Cancel appointment
  CANCEL_APPOINTMENT: (appointmentId) =>
    `/GetAppointmentCancle/${appointmentId}`,
},
FEEDBACK: {
  CREATE_OR_UPDATE_FEEDBACK:
    "/CreateorUpdateFeedbackRating",
 
  GET_FEEDBACK_BY_APPOINTMENT: (appointmentId) =>
    `/GetFeedbackRating/${appointmentId}`,
 
  GET_FEEDBACK_BY_EXPERT: (expertId) =>
    `/GetFeedbackRatingByExpert/${expertId}`,
},
 

};

export default API_ENDPOINTS;