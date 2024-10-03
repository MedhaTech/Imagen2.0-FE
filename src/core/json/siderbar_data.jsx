/* eslint-disable indent */
import React from "react";
// import { useTranslation } from "react-i18next";
import * as Icon from "react-feather";

const SidebarData = () => {
  // const { t } = useTranslation();
  const presurvey = localStorage.getItem("stupresurveystatus") ;
  console.log(presurvey,"status");

  return( [
   
    {
      // label: t("student"),
      label: "Student",

      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Inventory",
      role: "STUDENT",
      submenuItems: [
        {
          label:"PreSurvey",
          // label: t("pre_survey"),

          link: "/studentpresurvey",
          icon: <Icon.Edit />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Student Dashboard",
          link: "/student-dashboard",
          icon: <Icon.Grid />,
          showSubRoute: false,
          role: "STUDENT",
          submenu: false,
        },
        {
          label:"Course",
          link: `/studentcourse/${1}`,
          icon: <Icon.Monitor />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "Idea Submission",
          link: "/idea",
          icon: <Icon.Send />,
          role: "STUDENT",
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Post Survey",
          link: "/studentpostsurvey",
          icon:<Icon.Edit3 />,
          role: "STUDENT",
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "Resources",
          link: "/studentresource",
          icon: <Icon.FilePlus />,
          role: "STUDENT",
          showSubRoute: false,
          submenu: false,
        },
       
        {
          label:"My Certificate",
          link: "/certificate",
          icon: <Icon.Tag />,
          role: "STUDENT",
          showSubRoute: false,
          submenu: false,
        },
      ],
    },
  ]
);
};

export default SidebarData;
