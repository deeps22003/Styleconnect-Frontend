import ROUTES from "../routes/routePaths";
export const getDashboardRoute = (roleId) => {
  switch (roleId) {
    case 1:
      return ROUTES.CUSTOMER_DASHBOARD;

    case 2:
      return ROUTES.EXPERT_DASHBOARD;

    default:
      return ROUTES.LOGIN;
  }
};