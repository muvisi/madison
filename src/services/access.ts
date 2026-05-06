export const useAccess = (allowedDept: string) => {
  const userDepartment = localStorage.getItem("department");
  const currentUsername = localStorage.getItem("username");

  return (
    userDepartment === allowedDept || currentUsername === "admin"
  );

};