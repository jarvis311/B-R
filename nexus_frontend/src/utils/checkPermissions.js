export const checkPermissions = (pathname, permission,moduleList) => {
  let route = pathname.replace(/^\//, '');
  route = route.split("/")
  const userDetails = JSON.parse(localStorage.getItem("user"));
  let isPermitted = false;

  if (userDetails.is_global === 1) {
    return true
  }
 
  if (moduleList) {
    for (let module of moduleList) {
      if (route[0] === module.index) {
        if (module.roles.includes(permission)) {
          isPermitted = true;
        }
        if (route && route[1]) {
          let permissions = route[1] === "add" || route[1] === "edit" ? "write" : "";
          if (permissions && module.roles.includes(permissions)) {
            isPermitted = true;
          }
          else {
            isPermitted = false;
          }
        }

      }
    }
  }
  return isPermitted;
}