/* eslint-disable indent */
import React from "react";

import * as Icon from "react-feather";
import { MdChatBubbleOutline } from "react-icons/md";
import { getCurrentUser } from "../../helpers/Utils";
import { SiGooglemeet } from "react-icons/si";
const MentorShipSidebarData = () => {
   const currentUser = getCurrentUser("current_user");
 
const ChatId =currentUser?.data[0]?.chatbox ;
  return( [
    {
      label:"Mentor",
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
          label:"Milestone",
          link: "/mentor-milestone",
          icon: <Icon.Award />,
          showSubRoute: false,
          submenu: false,
        },
          {
          label:"Schedule Call",
          link: "/schedule-calls",
          icon: <SiGooglemeet />,
          showSubRoute: false,
          submenu: false,
        },
      
         ...(ChatId === 1 || ChatId === "1"
        ? [
            {
              label: "Chat Box",
              link: "/mentor-chatbox",
              icon: <MdChatBubbleOutline />,
              showSubRoute: false,
              submenu: false,
            },
          ]
        : []),
         {
          label:"Teams",
          link: "/mentor-teams",
          icon: <Icon.Users />,
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
      
        
      ],
    },
   
  ]
);
};

export default MentorShipSidebarData;
