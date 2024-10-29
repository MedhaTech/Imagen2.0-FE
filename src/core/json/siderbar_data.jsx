/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React,{useState,useEffect} from "react";
// import { useTranslation } from "react-i18next";
import * as Icon from "react-feather";
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
const SidebarData = () => {
  // const { t } = useTranslation();
  const presurvey = localStorage.getItem("stupresurveystatus") ;
  console.log(presurvey,"status");
  const currentUser = getCurrentUser('current_user');
  const TeamId = currentUser?.data[0]?.team_id;
  const [link, setLink] = useState('/instruction');
  const submittedApi = () => {
    const Param = encryptGlobal(
      JSON.stringify({
        team_id: TeamId,
      })
    );
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/submittedDetails?Data=${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response.data.data);
          if (response.data.data && response.data.data.length > 0) {
            const data = response.data.data[0];
            if (response.data.data[0].status === 'SUBMITTED') {
              setLink('/idea');
            } else {
              setLink('/instruction');
            } 

          } 
        } 
      })
      .catch(function (error) {
        if (error.response.status === 404) {
        //   seterror4( true);
        } 

      });
  };
useEffect(() => {
    submittedApi();
}, []);

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
          label:"Manage Team",
          link: "/student-team",
          icon: <Icon.Grid />,
          showSubRoute: false,
          role: "STUDENT",
          submenu: false,
        },
        {
          label:"Course",
          link: `/studentcourseMenu`,
          icon: <Icon.Monitor />,
          showSubRoute: false,
          submenu: false,
        },

        {
          label: "Idea Submission",
          // link: "/idea",
          link:link,

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
          label: "Support",
          link: "/student-support",
          icon: <Icon.Inbox />,
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
