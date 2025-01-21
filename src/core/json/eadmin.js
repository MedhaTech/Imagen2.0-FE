/* eslint-disable indent */
import React from "react";

import * as Icon from "react-feather";

const EAdminSidebarData = () => {
  return [
    {
      label: "Eadmin",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Inventory",
      submenuItems: [
        {
          label: "Eadmin Dashboard",
          link: "/eadmin/evaluationStatus",
          icon: <Icon.Grid />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "Challenges",
          link: "/eadmin/dashboard",
          icon: <Icon.Home />,
          showSubRoute: false,
          submenu: false,
        },

        {
          label: "Evaluation Config",
          link: "/eadmin/evaluationProcess",
          icon: <Icon.Star />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "Evaluator",
          link: "/eadmin/evaluator",
          icon: <Icon.FilePlus />,
          showSubRoute: false,
          submenu: false,
        },
        {
            label: "Reports",
            link: "/reports-card",
            icon: <Icon.Database />,
            showSubRoute: false,
            submenu: false,
          },
     
      ],
    },
  ];
};

export default EAdminSidebarData;
