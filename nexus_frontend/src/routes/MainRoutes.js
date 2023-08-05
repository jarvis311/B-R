import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import DisplaySchedules from "Components/ManageSchedules/DisplaySchedules";
import DisplayCustomer from "Components/ManageCustomer/DisplayCustomer";
// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("views/utilities/Typography"))
);

const FullCalendar = Loadable(
  lazy(() => import("views/FullCalendar/FullCalendars"))
);
const UtilsColor = Loadable(lazy(() => import("views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
  lazy(() => import("views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("views/utilities/TablerIcons"))
);
const DisplayUser = Loadable(lazy(() => import("views/utilities/DisplayUser")));
const AddUserData = Loadable(lazy(() => import("views/utilities/AddUserData")));
// sample page routing
const SamplePage = Loadable(lazy(() => import("views/sample-page")));
const DisplaySetting = Loadable(
  lazy(() => import("../Components/Settings/DisplaySetting"))
);
const DisplayMenu = Loadable(lazy(() => import("views/utilities/Menus/List")));
const DisplayPage = Loadable(lazy(() => import("views/utilities/Pages/List")));
const DisplayModule = Loadable(
  lazy(() => import("views/utilities/Modules/List"))
);
const DisplayRole = Loadable(lazy(() => import("views/utilities/Roles/List")));
const AddRole = Loadable(lazy(() => import("views/utilities/Roles/AddRole")));
const Unauthorized = Loadable(
  lazy(() => import("views/pages/authentication/Unauthorized"))
);
const DisplayTemplate = Loadable(
  lazy(() => import("views/utilities/Templates/List"))
);
const AddTemplate = Loadable(
  lazy(() => import("views/utilities/Templates/AddTemplate"))
);

const DisplayPlan = Loadable(lazy(() => import("Components/Plan/DisplayPlan")));
const DisplayManageClasses = Loadable(
  lazy(() => import("Components/ManageClasses/DisplayManageClasses"))
);
const DisplayContact = Loadable(
  lazy(() => import("views/utilities/Contacts/List"))
);
const DisplayNewsLetter = Loadable(
  lazy(() => import("views/utilities/NewsLetter/List"))
);
const PaymentCard = Loadable(lazy(() => import("views/PaymentCard")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "dashboard",
      children: [
        {
          path: "",
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: "/Booking-Calendar",
      children: [
        {
          path: "/Booking-Calendar",
          element: <FullCalendar />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-typography",
          element: <UtilsTypography />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-color",
          element: <UtilsColor />,
        },
      ],
    },
    {
      path: "utils",
      children: [
        {
          path: "util-shadow",
          element: <UtilsShadow />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "tabler-icons",
          element: <UtilsTablerIcons />,
        },
      ],
    },
    {
      path: "icons",
      children: [
        {
          path: "material-icons",
          element: <UtilsMaterialIcons />,
        },
      ],
    },
    {
      path: "user",
      children: [
        {
          path: "",
          element: <DisplayUser />,
        },
      ],
    },
    {
      path: "user",
      children: [
        {
          path: "add",
          element: <AddUserData />,
        },
      ],
    },

    {
      path: "setting",
      children: [
        {
          path: "",
          element: <DisplaySetting />,
        },
      ],
    },

    {
      path: "sample-page",
      element: <SamplePage />,
    },
    {
      path: "menu",
      children: [
        {
          path: "",
          element: <DisplayMenu />,
        },
      ],
    },
    {
      path: "plan",
      children: [
        {
          path: "",
          element: <DisplayPlan />,
        },
      ],
    },
    {
      path: "manage-classes",
      children: [
        {
          path: "",
          element: <DisplayManageClasses />,
        },
      ],
    },
    {
      path: "schedule",
      children: [
        {
          path: "",
          element: <DisplaySchedules />,
        },
      ],
    },
    {
      path: "customer",
      children: [
        {
          path: "",
          element: <DisplayCustomer />,
        },
      ],
    },
    {
      path: "page",
      children: [
        {
          path: "",
          element: <DisplayPage />,
        },
      ],
    },
    {
      path: "modules",
      children: [
        {
          path: "",
          element: <DisplayModule />,
        },
      ],
    },
    {
      path: "roles",
      children: [
        {
          path: "add",
          element: <AddRole />,
        },
        {
          path: "edit/:id",
          element: <AddRole editMode={true} />,
        },
        {
          path: "",
          element: <DisplayRole />,
        },
      ],
    },
    {
      path: "templates",
      children: [
        {
          path: "add",
          element: <AddTemplate />,
        },
        {
          path: "edit/:id",
          element: <AddTemplate editMode={true} />,
        },
        {
          path: "",
          element: <DisplayTemplate />,
        },
      ],
    },
    {
      path: "contacts",
      children: [
        {
          path: "",
          element: <DisplayContact />,
        },
      ],
    },
    {
      path: "newsletter",
      children: [
        {
          path: "",
          element: <DisplayNewsLetter />,
        },
      ],
    },
    {
      path: "unauthorized",
      element: <Unauthorized />,
    },
    {
      path: "*",
      element: <DashboardDefault />,
    },
    {
      path: "page",
      children: [
        {
          path: "*",
          element: <DashboardDefault />,
        },
      ],
    },
  ],
};

export default MainRoutes;
