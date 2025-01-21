/* eslint-disable indent */
import React from "react";

import * as Icon from "react-feather";

const EvaluatorSidebarData = () => {
  return [
    {
      label: "Evaluator",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Inventory",
      submenuItems: [
        {
          label: "Instructions",
          link: "/evaluator/instructions",
          icon: <Icon.Grid />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "L1 - Evaluation",
          link: "/evaluator/submitted-ideas",
          icon: <Icon.Home />,
          showSubRoute: false,
          submenu: false,
        },

        {
          label:"L2 - Evaluation",
          link: "/evaluator2/submitted-ideas",
          icon: <Icon.Star />,
          showSubRoute: false,
          submenu: false,
        },
        {
            label:"L1 Evaluated Ideas",
          link: "/evaluator/evaluated-ideas",
          icon: <Icon.FilePlus />,
          showSubRoute: false,
          submenu: false,
        },
        {
            label:"L2 Evaluated Ideas",
            link: "/evaluator/evaluated-ideasL2",
            icon: <Icon.Database />,
            showSubRoute: false,
            submenu: false,
          },
     
      ],
    },
  ];
};

export default EvaluatorSidebarData;
