/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { Search, Settings, User, XCircle } from "react-feather";
import { useTranslation } from "react-i18next";
import { logout } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../helpers/Utils";
import logoutIcon from "../../assets/img/icons/log-out.svg";
import logo from "../../assets/img/newts.png";
import { useLocation } from "react-router-dom";

import axios from "axios";
import { openNotificationWithIcon } from "../../helpers/Utils.js";

import { encryptGlobal } from "../../constants/encryptDecrypt";
import Icon from "../../assets/img/favicon.png";

const EadmiHeader = () => {
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useTranslation();
    const location = useLocation();
    useEffect(() => {
      // Auto-close sidebar when route changes
      document.querySelector(".main-wrapper")?.classList?.remove("slide-nav");
      document.querySelector(".sidebar-overlay")?.classList?.remove("opened");
      document.querySelector("html")?.classList?.remove("menu-opened");
    }, [location.pathname]);
  const currentUser = getCurrentUser("current_user");
  const [diesCode, setDiesCode] = useState("");

  const handleOnChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const trimmedValue = numericValue.trim();

    setDiesCode(trimmedValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!diesCode.trim()) {
        e.preventDefault();
        openNotificationWithIcon("error", "Please Enter CID");
      } else {
        e.preventDefault();
        handleSearch(diesCode);
      }
    }
  };
  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };
  const navigate = useNavigate();
  const handleLogout = (e) => {
    logout(navigate, t, "EADMIN");
    e.preventDefault();
  };

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

  const handleSearch = (diesCode) => {
    const popParam = encryptGlobal(diesCode);
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL + `/challenge_response/${popParam}`,
      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then(async function (response) {
        if (response.status == 200) {
          const multiOrgData = response?.data?.data[0];
          
          navigate("/search-cid", {
            state: { multiOrgData },
          });
          window.location.reload();

          setDiesCode("");
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 404) {
          setDiesCode("");
          openNotificationWithIcon("error", "No Data Found");
        }
      });
  };
  return (
    <>
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <img src={logo} alt="Logo" className="responsive-image" />
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
          <li className="nav-item nav-searchinputs">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <Search />
              </Link>
              <form action="#" className="dropdown">
                <div className="searchinputs" data-bs-auto-close="false">
                  <input
                    type="text"
                    placeholder="Enter CID"
                    onChange={(e) => handleOnChange(e)}
                    value={diesCode}
                    onKeyDown={handleKeyDown}
                    name="organization_code"
                  />
                  <div className="search-addon">
                    <span>
                      <XCircle className="feather-14" />
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </li>

          <li className="nav-item nav-item-box">
            <Link
              to="#"
              id="btnFullscreen"
              onClick={() => toggleFullscreen()}
              className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
{isFullscreen ? (
                      <FeatherIcon icon="minimize" />
                    ) : (
                      <FeatherIcon icon="maximize" />
                    )}
            </Link>
          </li>

          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
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
                    {currentUser?.data[0]?.full_name}
                  </span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                    {/* <img src={avtar} alt="Avtar" /> */}
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6> {currentUser?.data[0]?.full_name}</h6>
                  </div>
                </div>
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
            <Link className="dropdown-item" to="" onClick={handleLogout}>
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default EadmiHeader;
