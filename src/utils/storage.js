export const saveToken = (token) => {
  localStorage.setItem("orienco-admin-dashboard", token);
};

export const getToken = () => {
  return localStorage.getItem("orienco-admin-dashboard");
};

export const removeToken = () => {
  localStorage.removeItem("orienco-admin-dashboard");
};
