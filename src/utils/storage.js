export const saveToken = (token) => {
  localStorage.setItem("orienco-admin-dashboard", token);
  // Set cookie so Next.js middleware can read it for route protection
  document.cookie = `orienco-rapid-delivery-admin-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getToken = () => {
  return localStorage.getItem("orienco-admin-dashboard");
};

export const removeToken = () => {
  localStorage.removeItem("orienco-admin-dashboard");
  // Remove cookie
  document.cookie = "orienco-rapid-delivery-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
