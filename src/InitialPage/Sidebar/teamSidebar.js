/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation } from "react-router-dom";
import SidebarData  from "../../core/json/siderbar_data";
import { getCurrentUser } from "../../helpers/Utils";

const Sidebar = () => {
  const Location = useLocation();
  const currentUser = getCurrentUser("current_user");
  const role = currentUser?.data[0]?.role;
  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const filterByRole = (items, role) => {
    return items?.filter((item) => item.role === role || !item.role);
  };
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
                      {filterByRole(mainLabel?.submenuItems, role)?.map(
                        (title, i) => {
                          let link_array = [];
                          filterByRole(title?.submenuItems, role)?.forEach(
                            (link) => {
                              link_array.push(link?.link);
                              if (link?.submenu) {
                                filterByRole(link?.submenuItems, role)?.forEach(
                                  (item) => {
                                    link_array.push(item?.link);
                                  }
                                );
                              }
                            }
                          );
                          title.links = link_array;

                          return (
                            <React.Fragment key={i}>
                              <li
                                className={`submenu ${
                                  !title?.submenu &&
                                  Location.pathname === title?.link
                                    ? "custom-active-hassubroute-false"
                                    : ""
                                }`}
                              >
                                <Link
                                  to={title?.link}
                                  onClick={() => toggleSidebar(title?.label)}
                                  className={`${
                                    subOpen === title?.label ? "subdrop" : ""
                                  } ${
                                    title?.links?.includes(Location.pathname)
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
                                      subOpen === title?.label
                                        ? "block"
                                        : "none",
                                  }}
                                >
                                  {filterByRole(title?.submenuItems, role)?.map(
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
                                              .includes(Location.pathname) ||
                                            item?.link === Location.pathname
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
                                          {filterByRole(
                                            item?.submenuItems,
                                            role
                                          )?.map((items, subIndex) => (
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
                                                      Location.pathname
                                                    ) ||
                                                  items?.link ===
                                                    Location.pathname
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {items?.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </li>
                            </React.Fragment>
                          );
                        }
                      )}

                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Sidebar;
