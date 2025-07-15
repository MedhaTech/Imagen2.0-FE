/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useTranslation } from "react-i18next";
import { logout } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../helpers/Utils";
import logoutIcon from "../../assets/img/icons/log-out.svg";
import logo from "../../assets/img/newts.png";

import Icon from "../../assets/img/favicon.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey,faUser } from '@fortawesome/free-solid-svg-icons';
import  "./styles.css";
const MentorHeader = () => {
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useTranslation();
  const currentUser = getCurrentUser("current_user");
  const presurvey = localStorage.getItem("presurveystatus") ;
  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };
  const navigate = useNavigate();
  const handleLogout = (e) => {
    logout(navigate, t, "MENTOR");
    e.preventDefault();
  };
  const handleLogout1 = (e) => {
    logout(navigate, t, "MENTOR");
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseover = (e) => {
      e.stopPropagation();

      const body = document.body;
      const toggleBtn = document.getElementById("toggle_btn");

      if (
        body.classList.contains("mini-sidebar") &&
        isElementVisible(toggleBtn)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("mouseover", handleMouseover);

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
    };
  }, []);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current) => !current);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const sidebarOverlay = () => {
    document?.querySelector(".main-wrapper")?.classList?.toggle("slide-nav");
    document?.querySelector(".sidebar-overlay")?.classList?.toggle("opened");
    document?.querySelector("html")?.classList?.toggle("menu-opened");
  };

  let pathname = location.pathname;

  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-one",
  ];
  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }

  const toggleFullscreen = (elem) => {
    elem = elem || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };
 
  const fullName = currentUser?.data[0]?.full_name;
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const capitalizedFullName = capitalizeFirstLetter(fullName);
  const imageStyleDesktop = {
    padding: "0.7rem",
    maxWidth: "100%",
    height: "auto",
  };

  const imageStyleMobile = {
    padding: "0.7rem",
    marginLeft: "1rem",
    maxWidth: "50%",
    height: "auto",
  };
  const getImageStyle = () => {
    return window.innerWidth < 768 ? imageStyleMobile : imageStyleDesktop;
  };
  const [imageStyle, setImageStyle] = React.useState(getImageStyle);

  useEffect(() => {
    const handleResize = () => {
      setImageStyle(getImageStyle());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    
    <>
    
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <img src={logo} alt="Team" className="responsive-image" />

          
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
         

          <li className="nav-item nav-item-box">
            <Link
              to="#"
              id="btnFullscreen"
              onClick={() => toggleFullscreen()}
              className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
              {
                    isFullscreen ? <FeatherIcon icon="minimize" /> : <FeatherIcon icon="maximize" />
                }
            </Link>
          </li>

          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="/mentorprofile"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                <span className="user-letter">
                 
                           <img src={Icon} alt="Team" id="blah" />

                </span>
                <span className="user-detail">
                  <span className="user-name">
                    {" "}
                    {capitalizedFullName}
                  </span>
                  <span className="user-role">Institution</span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                  <img src={Icon} alt="Team" id="blah" />

                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6>{capitalizedFullName}</h6>
                    <h5>Institution</h5>
                  </div>
                </div>
                {(presurvey != "INCOMPLETED") ? (
                <>
                <hr className="m-0" />
                <Link
                  className="dropdown-item"
                  to={"/mentorprofile"}
                >
                  <FontAwesomeIcon icon={faUser} /> <h6>My Profile</h6> 
                </Link>
                <hr className="m-0" />
                <Link
                  className="dropdown-item"
                  to={"/mentorchangepwd"}
                >
                  <FontAwesomeIcon icon={faKey} /> <h6>Change Password</h6> 
                </Link>
                </>
                ): null}
                <hr className="m-0" />
                <Link
                  className="dropdown-item logout pb-0"
                  to=""
                  onClick={handleLogout}
                >
                
                  <img src={logoutIcon} alt="LogoutIcon" />
                  Logout
                </Link>
              </div>
            </div>
          </li>
        </ul>
       
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
          {(presurvey != "INCOMPLETED") ? (
            <>
              <Link
                className="dropdown-item"
                to={"/mentorprofile"}
              >
                My Profile
              </Link>
             
              <Link className="dropdown-item" to={"/mentorchangepwd"}>
                Change Password
              </Link>
            </>
          ):null}
            <Link className="dropdown-item" to="signin" onClick={handleLogout1}>
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
    
  );
};

export default MentorHeader;
