/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React,{useState,useEffect} from "react";
import { useTranslation } from "react-i18next";
import * as Icon from "react-feather";
import { encryptGlobal } from '../../constants/encryptDecrypt';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import FeatherIcon from "feather-icons-react";
import { FaComments} from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { logout } from "../../helpers/Utils";

const SidebarData = () => {
  const { t } = useTranslation();
   const navigate = useNavigate();
  const presurvey = localStorage.getItem("stupresurveystatus") ;
  const currentUser = getCurrentUser('current_user');
  const TeamId = currentUser?.data[0]?.type_id === 0 ? currentUser?.data[0]?.student_id : currentUser?.data[0]?.type_id;
  const [link, setLink] = useState('/instruction');
  const submittedApi = () => {
    const Param = encryptGlobal(
      JSON.stringify({
        student_id: TeamId,
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
          if (response.data.data && response.data.data.length > 0) {
            const data = response.data.data[0];
            if (response.data.data[0].status === 'SUBMITTED') {
              setLink('/idea');
              console.log("headerData",response.data.data[0].status);
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
 const handleLogout1 = (e) => {
  // alert("hii");
    logout(navigate, t, "STUDENT");
    e.preventDefault();
  };
  
  return( [
   
    {
      label: "Student",

      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Inventory",
      role: "STUDENT",
      submenuItems: [
        {
          label:"PreSurvey",

          link: "/studentpresurvey",
          icon: <Icon.Edit />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label:"Dashboard",
          link: "/student-dashboard",
          icon: <Icon.Grid />,
          showSubRoute: false,
          role: "STUDENT",
          submenu: false,
        },
        {
          label:"Manage Team",
          link: "/student-team",
          icon: <Icon.UserPlus />,
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
          label: "Discussion Forum",
          link: "/discussion-chat",
          icon:<GoCommentDiscussion />,
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
        {
          label:"Logout",
          onClick: handleLogout1,
          icon: <Icon.LogOut />,
          role: "STUDENT",
          showSubRoute: false,
          submenu: false,
          link: "#"
        },
       
        
        
      ],
    },
  ]
);
};

export default SidebarData;
