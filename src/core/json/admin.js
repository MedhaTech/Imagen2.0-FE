/* eslint-disable indent */
import React from "react";

import * as Icon from "react-feather";

const AdminSidebarData = () => {
 

  return( [
    {
      label:"Admin",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Inventory",
      submenuItems: [
        {
          label: "Admin Dashboard",
          link: "/admin-dashboard",
          icon: <Icon.Box />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Institution",
          link: "/institution-registration",
          icon: <Icon.Codesandbox />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"PopUp",
          link: "/popup",
          icon: <Icon.Codesandbox />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Resource",
          link: "/adminresources",
          icon: <Icon.Layers />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Latest News",
          link: "/latest-news",
          icon: <Icon.Bookmark />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Students",
          link: "/students",
          icon: <Icon.Users />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Mentors",
          link: "/mentors",
          icon: <Icon.Users />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Teams",
          link: "/teams",
          icon: <Icon.Users />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Admins",
          link: "/admins",
          icon: <Icon.Users />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Reports",
          link: "/reports",
          icon: <Icon.Database />,
          showSubRoute: false,
          submenu: false,
        },
       
      ],
    },
   
  ]
);
};

export default AdminSidebarData;
