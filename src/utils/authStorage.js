import { refreshToken } from "../services/authService";

const AUTH_KEY="authData";

export const saveAuthData=(data)=>{
    localStorage.setItem(AUTH_KEY,JSON.stringify(data));
};

export const getAuthData=()=>{
    const data=localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data):null;
};

export const clearAuthData=()=>{
    localStorage.removeItem(AUTH_KEY);
};

export const getAccessToken = () => {
    const authData = getAuthData();

    return authData?.accessToken || null;
};

export const isAuthenticated=()=>{
    return !!getAccessToken();
};

export const getUserRole = () => {
  const authData = getAuthData();

  return authData?.roleId || null;
};

export const updateAccessData = (newData) => {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify(newData)
  );
};

export const getRefreshToken = () => {
  const authData = getAuthData();

  return authData?.refreshToken || null;
};

export const updateTokens=({
    accessToken,refreshToken,expiryInMinutes
})=>{
    const authData=getAuthData();
    if(!authData) return;

    saveAuthData({
        ...authData,
        accessToken,
        refreshToken,
        expiryInMinutes
    });
};

