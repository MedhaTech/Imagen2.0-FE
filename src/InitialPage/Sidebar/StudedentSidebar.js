/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState,useMemo } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation, } from "react-router-dom";
import  getStudentSidebarData  from "../../core/json/siderbar_data";
import HorizontalSidebar from "./horizontalSidebar";
import CollapsedSidebar from "./collapsedSidebar";

const StudentSidebar = () => {
  const location = useLocation();
  // console.log(location,"11");

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const presurvey = localStorage.getItem("stupresurveystatus") ;
  // console.log(presurvey,"status");
  const toggleSidebar = (title) => {
    if (title == subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem == subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };
  const SidebarData = useMemo(() => getStudentSidebarData(), []);

  return (
    <div>
      <div className="sidebar " id="sidebar">
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {SidebarData?.map((mainLabel, index) => (
                  <li className="submenu-open" key={index}>
                    <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title, i) => {
                        let link_array = [];
                        title?.submenuItems?.map((link) => {
                          link_array.push(link?.link);
                          if (link?.submenu) {
                            link?.submenuItems?.map((item) => {
                              link_array.push(item?.link);
                            });
                          }
                          return link_array;
                        });
                        title.links = link_array;

                        const isMenuDisabled =
                        presurvey !== "COMPLETED" && title?.label !== "PreSurvey";
                        return (
                          <React.Fragment key={i}>
                            {" "}
                            <li
                              className={`submenu ${
                                !title?.submenu &&
                                location.pathname === title?.link
                                  ? "custom-active-hassubroute-false"
                                  : ""
                              }`}
                            >
                              <Link
                               to={isMenuDisabled ? "#" : title?.link}
                               onClick={() => !isMenuDisabled && toggleSidebar(title?.label)}
                                // to={title?.link}
                                // onClick={() => toggleSidebar(title?.label)}
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(location.pathname)
                                    ? "active"
                                    : ""
                                }`}
                              >
                                {title?.icon}
                                <span className="custom-active-span">
                                  {title?.label}
                                </span>
                                {title?.submenu && (
                                  <span className="menu-arrow" />
                                )}
                              </Link>
                              <ul
                                style={{
                                  display:
                                    subOpen === title?.label ? "block" : "none",
                                }}
                              >
                                {title?.submenuItems?.map(
                                  (item, titleIndex) => (
                                    <li
                                      className="submenu submenu-two"
                                      key={titleIndex}
                                    >
                                      <Link
                                        to={item?.link}
                                        className={`${
                                          item?.submenuItems
                                            ?.map((link) => link.link)
                                            .includes(location.pathname) ||
                                          item?.link === location.pathname
                                            ? "active"
                                            : ""
                                        } ${
                                          subsidebar === item?.label
                                            ? "subdrop"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          toggleSubsidebar(item?.label)
                                        }
                                      >
                                        {item?.label}
                                        {item?.submenu && (
                                          <span className="menu-arrow inside-submenu" />
                                        )}
                                      </Link>
                                      <ul
                                        style={{
                                          display:
                                            subsidebar === item?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item?.submenuItems?.map(
                                          (items, subIndex) => (
                                            <li key={subIndex}>
                                              <Link
                                                to={items?.link}
                                                className={`${
                                                  subsidebar === items?.label
                                                    ? "submenu-two subdrop"
                                                    : "submenu-two"
                                                } ${
                                                  items?.submenuItems
                                                    ?.map((link) => link.link)
                                                    .includes(
                                                      location.pathname
                                                    ) ||
                                                  items?.link ===
                                                    location.pathname
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {items?.label}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
      <HorizontalSidebar />
      <CollapsedSidebar />
    </div>
  );
};

export default StudentSidebar;
