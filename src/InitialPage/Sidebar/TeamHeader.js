/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Search, Settings, User, XCircle } from "react-feather";
import { all_routes } from "../../Router/all_routes";
import { logout } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../helpers/Utils";
import { useTranslation } from "react-i18next";
import logoutIcon from "../../assets/img/icons/log-out.svg";
import logo from "../../assets/img/logo.png";
// import logo from "../../assets/img/logo-Student.png";
import female from "../../assets/img/Female_Profile.png";
import male from "../../assets/img/Male_Profile.png";
import user from "../../assets/img/user.png";
import team from "../../assets/img/icons/team2.png";
import "./styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import Avatar from 'react-string-avatar';
import { encryptGlobal } from "../../constants/encryptDecrypt";
import axios from "axios";

const Header = () => {
  const route = all_routes;
  const [toggle, SetToggle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentUser = getCurrentUser("current_user");
  const presurvey = localStorage.getItem("stupresurveystatus");
  // console.log(presurvey,"status");
  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };
  const [data, setData] = useState([]);
  const user = currentUser.data[0]?.student_id;
  useEffect(() => {
    mentorViewApi();
  }, [user]);

  const mentorViewApi = () => {
    let supId;
    if (typeof user !== "string") {
      supId = encryptGlobal(JSON.stringify(user));
    } else {
      supId = encryptGlobal(user);
    }
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/students/${supId}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "res");
          setData(response.data.data[0]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
  const { t } = useTranslation();

  const navigate = useNavigate();
  const handleLogout = (e) => {
    logout(navigate, t, "STUDENT");
    e.preventDefault();
  };
  const handleLogout1 = (e) => {
    logout(navigate, t, "STUDENT");
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

  const getProfileImage = (gender) => {
    switch (gender) {
      case "MALE":
        return male;
      case "FEMALE":
        return female;
      case "Female":
        return female;
      case "Male":
        return male;
      case "OTHERS":
        return user;
      case "Prefer Not to Mention":
        return user;
      default:
        return team;
    }
  };

  const fullName = data?.full_name;
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
          <img src={logo} alt="Logo" className="responsive-image" />

          {/*<Link to="/dashboard" className="logo logo-normal">
            <ImageWithBasePath src="assets/img/logo.png" alt="img" />
          </Link>
          <Link to="/dashboard" className="logo logo-white">
            <ImageWithBasePath src="assets/img/logo-white.png" alt="img" />
          </Link>
          <Link to="/dashboard" className="logo-small">
            <ImageWithBasePath src="assets/img/logo-small.png" alt="img" />
          </Link>*/}
          <Link
            id="toggle_btn"
            to="#"
            style={{
              display:
                pathname.includes("tasks") || pathname.includes("pos")
                  ? "none"
                  : pathname.includes("compose")
                    ? "none"
                    : "",
            }}
            onClick={handlesidebar}
          >
            <FeatherIcon icon="chevrons-left" className="feather-16" />
          </Link>
        </div>
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
          {/* Search */}
          {/* <li className="nav-item nav-searchinputs">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <Search />
              </Link>
              <form action="#" className="dropdown">
                <div
                  className="searchinputs dropdown-toggle"
                  id="dropdownMenuClickable"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="false"
                >
                  <input type="text" placeholder="Search" />
                  <div className="search-addon">
                    <span>
                      <XCircle className="feather-14" />
                    </span>
                  </div>
                </div>
                <div
                  className="dropdown-menu search-dropdown"
                  aria-labelledby="dropdownMenuClickable"
                >
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="search" className="feather-16" />
                      </span>
                      Recent Searches
                    </h6>
                    <ul className="search-tags">
                      <li>
                        <Link to="#">Products</Link>
                      </li>
                      <li>
                        <Link to="#">Sales</Link>
                      </li>
                      <li>
                        <Link to="#">Applications</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="help-circle" className="feather-16" />
                      </span>
                      Help
                    </h6>
                    <p>
                      How to Change Product Volume from 0 to 200 on Inventory
                      management
                    </p>
                    <p>Change Product Name</p>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="user" className="feather-16" />
                      </span>
                      Customers
                    </h6>
                    <ul className="customers">
                      <li>
                        <Link to="#">
                          Aron Varu
                          <ImageWithBasePath
                            src="assets/img/profiles/avator1.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Jonita
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Aaron
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-10.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </li> */}
          {/* /Search */}

          {/* Select Store 
          <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
            <Link
              to="#"
              className="dropdown-toggle nav-link select-store"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                <span className="user-detail">
                  <span className="user-name">{selectedLanguage}</span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to="#" className="dropdown-item" onClick={() => handleLanguageChange('English')}>
                English
              </Link>
              <Link to="#" className="dropdown-item" onClick={() => handleLanguageChange('Hindi')}>
                Hindi
              </Link>
              <Link to="#" className="dropdown-item" onClick={() => handleLanguageChange('Telugu')}>
                Telugu
              </Link>
              <Link to="#" className="dropdown-item" onClick={() => handleLanguageChange('Tamil')}>
                Tamil
              </Link>
            </div>
          </li> 
          {/* /Select Store */}

          {/* Flag */}
          {/* <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
            <Link
              className="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              to="#"
              role="button"
            >
            
              <ImageWithBasePath
                src="assets/img/flags/us.png"
                alt="img"
                height={16}
              />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to="#" className="dropdown-item active">
                <ImageWithBasePath
                  src="assets/img/flags/us.png"
                  alt="img"
                  height={16}
                />
                English
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/fr.png"
                  alt="img"
                  height={16}
                />{" "}
                French
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/es.png"
                  alt="img"
                  height={16}
                />{" "}
                Spanish
              </Link>
              <Link to="#" className="dropdown-item">
                <ImageWithBasePath
                  src="assets/img/flags/de.png"
                  alt="img"
                  height={16}
                />{" "}
                German
              </Link>
            </div>
          </li> */}
          {/* /Flag */}
          <li className="nav-item nav-item-box">
            <Link
              to="#"
              id="btnFullscreen"
              onClick={() => toggleFullscreen()}
              className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
            >
              {/* <i data-feather="maximize" /> */}
              {
                isFullscreen ? <FeatherIcon icon="minimize" /> : <FeatherIcon icon="maximize" />
              }
              {/* <FeatherIcon icon="maximize" /> */}
            </Link>
          </li>
          {/* <li className="nav-item nav-item-box">
            <Link to="/email">
              <FeatherIcon icon="mail" />
              <span className="badge rounded-pill">1</span>
            </Link>
          </li> */}
          {/* Notifications 
          <li className="nav-item dropdown nav-item-box">*/}
          {/* <Link
              to="#"
              className="dropdown-toggle nav-link"
              data-bs-toggle="dropdown"
            >
              <FeatherIcon icon="bell" />
              <span className="badge rounded-pill">2</span>
            </Link> */}
          {/* <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <span className="notification-title">Notifications</span>
                <Link to="#" className="clear-noti">
                  {" "}
                  Clear All{" "}
                </Link>
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  <li className="notification-message active">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-02.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">John Doe</span> added
                            new task{" "}
                            <span className="noti-title">
                              Patient appointment booking
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              4 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-03.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Tarah Shropshire</span>{" "}
                            changed the task name{" "}
                            <span className="noti-title">
                              Appointment booking with payment gateway
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              6 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-06.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Misty Tison</span>{" "}
                            added{" "}
                            <span className="noti-title">Domenic Houston</span>{" "}
                            and <span className="noti-title">Claire Mapes</span>{" "}
                            to project{" "}
                            <span className="noti-title">
                              Doctor available module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              8 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-17.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Rolland Webber</span>{" "}
                            completed task{" "}
                            <span className="noti-title">
                              Patient and Doctor video conferencing
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              12 mins ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                  <li className="notification-message">
                    <Link to="/activities">
                      <div className="media d-flex">
                        <span className="avatar flex-shrink-0">
                          <ImageWithBasePath
                            alt="img"
                            src="assets/img/profiles/avatar-13.jpg"
                          />
                        </span>
                        <div className="media-body flex-grow-1">
                          <p className="noti-details">
                            <span className="noti-title">Bernardo Galaviz</span>{" "}
                            added new task{" "}
                            <span className="noti-title">
                              Private chat module
                            </span>
                          </p>
                          <p className="noti-time">
                            <span className="notification-time">
                              2 days ago
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                <Link to="/activities">View all Notifications</Link>
              </div>
            </div> 
          </li>*/}
          {/* /Notifications */}
          {/* <li className="nav-item nav-item-box">
            <Link to="/general-settings">
              <FeatherIcon icon="settings" />
            </Link>
          </li> */}
          {currentUser?.data[0]?.role === "TEAM" ? (
            <li className="nav-item dropdown has-arrow main-drop ">
              <Link
                to="#"
                className="dropdown-toggle nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                    {/* <ImageWithBasePath
                    src="assets/img/profiles/avator1.jpg"
                    alt="img"
                    className="img-fluid"
                  /> */}
                    {/* <img
                      src={getProfileImage(currentUser?.data[0]?.gender)}
                      alt="Profile"
                    /> */}
                    {/* <img src={team} alt="Team" id="blah" /> */}
          <Avatar initials={data?.full_name.split(' ').map(w => w.charAt(0)).join('')} bgColor="#36adf2" textColor="black" roundShape="true" pictureResolution={256}  height={100}  width={110}></Avatar>

                  </span>
                  <span className="user-detail">
                    <span className="user-name"> {capitalizedFullName}</span>
                    <span className="user-role">
                      {currentUser?.data[0]?.role}
                    </span>
                  </span>
                </span>
              </Link>
              <div className="dropdown-menu menu-drop-user">
                <div className="profilename">
                  <div className="profileset">
                    <span className="user-img">
                      {/* <img src={team} alt="Team" id="blah" /> */}
          <Avatar initials={data?.full_name.split(' ').map(w => w.charAt(0)).join('')} bgColor="#36adf2" textColor="black" roundShape="true" pictureResolution={256}  height={100}  width={110}></Avatar>

                      <span className="status online" />
                    </span>
                    <div className="profilesets">
                      <h6>{capitalizedFullName}</h6>
                      <h5>{currentUser?.data[0]?.role}</h5>
                    </div>
                  </div>
                  <hr className="m-0" />
                  <Link className="dropdown-item" to="/team-profile">
                    <User className="me-2" /> <h6>My Profile</h6>
                  </Link>
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
          ) : (
            <li className="nav-item dropdown has-arrow main-drop ">
              <Link
                to="#"
                className="dropdown-toggle nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                    {/* <ImageWithBasePath
                  src="assets/img/profiles/avator1.jpg"
                  alt="img"
                  className="img-fluid"
                /> */}
                    {/* <img
                      src={getProfileImage(currentUser?.data[0]?.Gender)}
                      alt="Profile"
                    /> */}
                    <Avatar
  initials={data.full_name ? data.full_name.split(' ').map(w => w.charAt(0)).join('') : ''}
  bgColor="#36adf2"
  textColor="black"
  // roundShape="true"
  pictureResolution={256}
  height={40}
  width={40}
/>

                  </span>
                  <span className="user-detail">
                    <span className="user-name"> {capitalizedFullName}</span>
                    <span className="user-role">
                      {currentUser?.data[0]?.role}
                    </span>
                  </span>
                </span>
              </Link>
              <div className="dropdown-menu menu-drop-user">
                <div className="profilename">
                  <div className="profileset">
                    <span className="user-img">
                      {/* <img
                        src={getProfileImage(currentUser?.data[0]?.Gender)}
                        alt="Profile"
                      /> */}
         <Avatar
  initials={data.full_name ? data.full_name.split(' ').map(w => w.charAt(0)).join('') : ''}
  bgColor="#36adf2"
  textColor="black"
  // roundShape="true"
  pictureResolution={256}
  height={40}
  width={40}
/>

                      <span className="status online" />
                    </span>
                    <div className="profilesets">
                      <h6>{capitalizedFullName}</h6>
                      <h5>{currentUser?.data[0]?.role}</h5>
                    </div>
                  </div>
                  <hr className="m-0" />
                  {/* <Link className="dropdown-item" to="/profiles">
                    <User className="me-2" /> My Profile
                  </Link> */}
                  {currentUser?.data[0]?.role === "TEAM" ? (
                    <Link className="dropdown-item" to="/team-profile">
                      <FontAwesomeIcon icon={faUser} /><h6>My Profile</h6>
                    </Link>
                  ) : presurvey == "COMPLETED" ? (
                    <>
                      <Link className="dropdown-item" to="/student-profile">
                        <FontAwesomeIcon icon={faUser} /><h6>My Profile</h6>
                      </Link>
                      <Link className="dropdown-item" to="/student-changePassword">
                        <FontAwesomeIcon icon={faKey} /><h6>Change Password</h6>
                      </Link>
                    </>
                  ) : null}
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
          )}
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        {currentUser?.data[0]?.role === "TEAM" ? (
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
              {currentUser?.data[0]?.role === "TEAM" ? (
                <Link className="dropdown-item" to="/team-profile">
                  My Profile
                </Link>
              ) : presurvey == "COMPLETED" ? (
                <Link className="dropdown-item" to="/student-profile">
                  My Profile
                </Link>
              ) : null}
              {/* <Link className="dropdown-item" to="generalsettings">
              Settings
            </Link> */}
              <Link
                className="dropdown-item"
                to="signin"
                onClick={handleLogout1}
              >
                Logout
              </Link>
            </div>
          </div>
        ) : (
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
              {/* <Link className="dropdown-item" to="/profiles">
                My Profile
              </Link> */}
              {currentUser?.data[0]?.role === "TEAM" ? (
                <Link className="dropdown-item" to="/team-profile">
                  My Profile
                </Link>
              ) : presurvey == "COMPLETED" ? (
                <>
                  <Link className="dropdown-item" to="/student-profile">
                    My Profile
                  </Link>
                  <Link className="dropdown-item" to="/student-changePassword">
                    Change Password
                  </Link>
                </>
              ) : null}
              {/* <Link className="dropdown-item" to="generalsettings">
            Settings
          </Link> */}
              <Link
                className="dropdown-item"
                to="signin"
                onClick={handleLogout1}
              >
                Logout
              </Link>
            </div>
          </div>
        )}
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;
