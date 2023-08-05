// assets
import {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUser,
  IconSettings,
  IconMenu,
  IconBoxMultiple,
  IconComponents,
  IconShieldLock
} from "@tabler/icons";
import EventIcon from "@mui/icons-material/Event";

// constant
const icons = {
  EventIcon,
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUser,
  IconSettings,
  IconMenu,
  IconBoxMultiple,
  IconComponents,
  IconShieldLock
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: "utilities",
  title: "Menus",
  type: "group",
  children: [
    {
      id: "util-typography",
      title: "Typography",
      type: "item",
      url: "/utils/util-typography",
      icon: icons.IconTypography,
      breadcrumbs: false,
    },
    {
      id: "util-color",
      title: "Color",
      type: "item",
      url: "/utils/util-color",
      icon: icons.IconPalette,
      breadcrumbs: false,
    },
    {
      id: "util-shadow",
      title: "Shadow",
      type: "item",
      url: "/utils/util-shadow",
      icon: icons.IconShadow,
      breadcrumbs: false,
    },

    {
      id: "icons",
      title: "Icons",
      type: "collapse",
      icon: icons.IconWindmill,
      children: [
        {
          id: "tabler-icons",
          title: "Tabler Icons",
          type: "item",
          url: "/icons/tabler-icons",
          breadcrumbs: false,
        },
        {
          id: "material-icons",
          title: "Material Icons",
          type: "item",
          url: "/icons/material-icons",
          breadcrumbs: false,
        },
      ],
    },
  ],
};

export default utilities;
