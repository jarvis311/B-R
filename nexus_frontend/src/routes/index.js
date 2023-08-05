/* eslint-disable react-hooks/exhaustive-deps */
import { useRoutes, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, lazy } from "react";
import Loadable from "ui-component/Loadable";
import MainRoutes from "./MainRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";
import { checkPermissions } from "utils/checkPermissions";
import { useSelector } from "react-redux";
const AuthLogin3 = Loadable(
  lazy(() => import("views/pages/authentication/authentication3/Login3"))
);
// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loading, moduleList } = useSelector((state) => state.module);

  const checkUserLogin = useCallback(() => {
    if (userDetails === null) {
      navigate("/pages/login");
    }
    else {
      
      const isPermitted = checkPermissions(pathname, "read",moduleList);
    
      if (!loading && isPermitted === false) {
        navigate("/unauthorized");
      }
    }
  }, [navigate, userDetails]);

  useEffect(() => {
    checkUserLogin();
  }, [pathname,loading]);

  return useRoutes([
    userDetails ? { ...MainRoutes } : { path: "*", element: <AuthLogin3 /> },
    AuthenticationRoutes,
  ]);
}
