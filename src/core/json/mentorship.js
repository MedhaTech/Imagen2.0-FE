/* eslint-disable indent */
import React from "react";

import * as Icon from "react-feather";
import { MdChatBubbleOutline } from "react-icons/md";
const MentorShipSidebarData = () => {
 

  return( [
    {
      label:"Mentorship",
      submenuOpen: true,
      showSubRoute: false,
      submenuHdr: "Inventory",
      submenuItems: [
        {
          label: "Dashboard",
          link: "/mentorship-dashboard",
          icon: <Icon.Box />,
          showSubRoute: false,
          submenu: false,
        },
        {
          label: "Chat Box",
          link: "/mentor-chatbox",
          icon: <MdChatBubbleOutline />,
          showSubRoute: false,
          submenu: false,
        },
          {
          label:"Resource",
          link: "/mentor-resource",
          icon: <Icon.FilePlus />,
          showSubRoute: false,
          submenu: false,
        },
        // {
        //   label:"PopUp",
        //   link: "/popup",
        //   icon: <Icon.Star />,
        //   showSubRoute: false,
        //   submenu: false,
        // },
      
        // {
        //   label:"Latest News",
        //   link: "/latest-news",
        //   icon: <Icon.Bell />,
        //   showSubRoute: false,
        //   submenu: false,
        // },
        // {
        //   label: "Support",
        //   link: "/admin-support",
        //   icon: <Icon.Inbox />,
        //   showSubRoute: false,
        //   submenu: false,
        // },
       
        // {
        //   label:"Students",
        //   link: "/students",
        //   icon: <Icon.UserCheck />,
        //   showSubRoute: false,
        //   submenu: false,
        // },
       
        // {
        //   label:"Institutions",
        //   link: "/institution-users-list",
        //   icon: <Icon.UserPlus />,
        //   showSubRoute: false,
        //   submenu: false,
        // },
        // {
        //   label:"Admins",
        //   link: "/admins",
        //   icon: <Icon.User />,
        //   showSubRoute: false,
        //   submenu: false,
        // },
        // {
        //   label:"Reports",
        //   link: "/reports",
        //   icon: <Icon.Database />,
        //   showSubRoute: false,
        //   submenu: false,
        // },
       
       
      ],
    },
   
  ]
);
};

export default MentorShipSidebarData;
