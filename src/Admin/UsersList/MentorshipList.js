/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "reactstrap";
import { openNotificationWithIcon } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { URL, KEY } from "../../constants/defaultValues.js";
import {
  AlertOctagon,
  PlusCircle,
  Check,
} from "feather-icons-react/build/IconComponents";
import { getNormalHeaders, getCurrentUser } from "../../helpers/Utils";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import logout from "../../assets/img/logout.png";
import DataTable, { Alignment } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

import { useDispatch } from "react-redux";
import { encryptGlobal } from "../../constants/encryptDecrypt.js";
import { MaskedEmail, MaskedMobile } from "../../RegPage/MaskedData.js";
import ToggleButton from "./Toggle";

const MentorshipList = (props) => {
  const dispatch = useDispatch();
  const [tableData, settableData] = React.useState([]);
  const navigate = useNavigate();

  const currentUser = getCurrentUser("current_user");

  useEffect(() => {
    handleideaList();
  }, []);

  const handleideaList = () => {
    // This function fetches Institution latest news list  from the API //

    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/mentorships`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          settableData(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleResetapi = (item) => {
    // console.log(item,"itemof rest");
    // This function fetches Institution latest news list  from the API //
    const body = JSON.stringify({
      user_id: item.user.user_id,
    });
    var config = {
      method: "put",
      url: process.env.REACT_APP_API_BASE_URL + `/mentorships/resetPassword`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        if (response.status === 202) {
          openNotificationWithIcon(
            "success",
            "Password Updated to Mobile Number Successfully"
          );
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleStatusUpdateInAdmin = async (data, id) => {
    // where we can update the admin status //
    // where id = admin id //
    // where data = status //
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    const upad = encryptGlobal(JSON.stringify(id));
    await axios
      .put(`${URL.updateMentorshipStatus + "/" + upad}`, data, axiosConfig)
      .then((user) => console.log(user))
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleStatus = (status, id, type, all) => {
    const stats = "Mentorship";
    // where we can update the status Active to InActive //
    // where id = student id / mentor id  / admin id / evaluator  id//
    // where status = status //
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-submit",
        cancelButton: "btn btn-cancel",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "<h4>Are you sure?</h4>",
        text: `You are attempting to ${
          status.toLowerCase() === "active" ? "Activate" : "Inactivate"
        } ${stats}.`,
        imageUrl: `${logout}`,
        confirmButtonText: status,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          if (type && type === "student") {
            props.studentStatusUpdate({ status }, id);
            setTimeout(() => {
              props.getStudentListAction(studentDist);
            }, 500);
          } else {
            const obj = {
              full_name: all?.user?.full_name,
              status,
            };
            await handleStatusUpdateInAdmin(obj, id);

            setTimeout(() => {
              handleideaList();
            }, 500);
          }
          swalWithBootstrapButtons.fire(
            `${stats} Status has been changed!`,
            "Successfully Updated.",
            "success"
          );
        }
      });
  };
  const handleDeleteMentorship = (items) => {
    // here we can delete the team //
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-submit",
        cancelButton: "btn btn-cancel",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "<h4>Are you sure?</h4>",
        text: "Do you really want to delete this user, This process cannot be undone.",
        imageUrl: `${logout}`,
        confirmButtonText: "Delete",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const resId = encryptGlobal(JSON.stringify(items.mentorship_id));
          var config = {
            method: "delete",
            url: process.env.REACT_APP_API_BASE_URL + "/mentorships/" + resId,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          };
          axios(config)
            .then(function (response) {
              if (response.status === 200) {
                openNotificationWithIcon(
                  "success",
                  "Mentorship Deleted Successfully"
                );
                setTimeout(() => {
                  handleideaList();
                }, 500);
              } else {
                openNotificationWithIcon("error", "Opps! Something Wrong");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
  };
  const handleEditMentorshipUser = (data) => {
    navigate("/admin-mentorship-edit", {
      state: {
        full_name: data?.user?.full_name,
        college_name: data?.college_name,
        mobile: data?.mobile,
        mentorship_id: data?.mentorship_id,
        username: data?.user?.username,
        area_of_expertise: data?.areas_of_expertise,
      },
    });
  };
  const handleResetMentorshipUser = (item) => {
    // here we can reset password as  user_id //
    // here data = student_id //
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-submit",
        cancelButton: "btn btn-cancel",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "<h4>Are you sure?</h4>",
        text: "You are attempting to reset the password",
        imageUrl: `${logout}`,
        confirmButtonText: "Reset Password",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleResetapi(item);
        }
      })
      .catch((err) => console.log(err.response));
  };
  async function handleStatusOfChat(item, value) {
    // console.log(item,"item","value",value);
    // This function updates status with the  type and value //
    const updatedValue = value === 1 ? "1" : "0";
    const body = {
      chatbox: updatedValue,
    };

    const popParam = encryptGlobal(JSON.stringify(item.mentorship_id));

    let config = {
      method: "put",
      url: process.env.REACT_APP_API_BASE_URL + `/mentorships/${popParam}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: JSON.stringify(body),
    };
    await axios(config)
      .then(function (response) {
        if (response.status === 200) {
          if (value === 0) {
            openNotificationWithIcon(
              "success",
              "ChatBox Disabled successfully"
            );
          } else {
            openNotificationWithIcon("success", "ChatBox Enabled successfully");
          }

          setTimeout(() => {
            handleideaList();
          }, 500);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const StudentsData = {
    data: tableData && tableData.length > 0 ? tableData : [],
    columns: [
      {
        name: "No",
        selector: (row, key) => key + 1,
        sortable: true,
        center: true,
        cellExport: (row) => row.index,
        width: "5rem",
      },
      {
        name: "Mentorship Name",
        selector: (row) => row?.user?.full_name,
        center: true,
        cellExport: (row) => row?.user?.full_name,
        sortable: true,
        width: "13rem",
      },
      {
        name: "Email",
        center: true,

        selector: (row) => <MaskedEmail email={row?.user?.username} />,
        cellExport: (row) => row?.user?.username,
        sortable: true,
        width: "13rem",
      },
      {
        name: "Mobile",
        center: true,

        selector: (row) => <MaskedMobile mobile={row?.mobile} />,
        cellExport: (row) => row?.mobile,
        sortable: true,
        width: "10rem",
      },

      {
        name: "Status",
        center: true,
        sortable: true,
        cell: (row) => [
          <span
            key={row.mentorship_id}
            className={`${
              row.status === "ACTIVE" ? "badge bg-success" : "badge bg-danger"
            }`}
          >
            {row.status}
          </span>,
        ],
        width: "8rem",
      },
      {
        name: "ChatBox Activation",
        width: "10rem",
        center: true,

        cell: (record) => (
          <ToggleButton
            isEnabled={record.chatbox === 1 || record.chatbox === "1"}
            onToggle={(newStatus) =>
              handleStatusOfChat(record, newStatus, "chatbox")
            }
          />
        ),
      },
      {
        name: "Actions",
        center: true,
        sortable: false,
        width: "25rem",
        cell: (record) => [
          <div key={record?.id}></div>,
          <>
            <div
              key={record}
              onClick={() => handleEditMentorshipUser(record)}
              style={{ marginRight: "8px" }}
            >
              <a className="badge badge-md bg-info">
                <i data-feather="edit" className="feather-edit" />
              </a>
            </div>
            <div
              key={record}
              onClick={() => handleResetMentorshipUser(record)}
              style={{ marginRight: "8px" }}
            >
              <a className="badge badge-md bg-success">
                <FontAwesomeIcon icon={faKey} className="me-1" />
              </a>
            </div>
            <div
              key={record}
              onClick={() => handleDeleteMentorship(record)}
              style={{ marginRight: "8px" }}
            >
              <a className="badge badge-md bg-danger">
                <i data-feather="trash-2" className="feather-trash-2" />
              </a>
            </div>
            {/* <div key={record} style={{ marginRight: "8px" }}>
              <ToggleButton
                isEnabled={record.chatbox === 1 || record.chatbox === "1"}
                onToggle={(newStatus) =>
                  handleStatusOfChat(record, newStatus, "chatbox")
                }
              />
            </div> */}

            <div
              key={record.id}
              style={{ marginRight: "10px" }}
              onClick={() => {
                let status =
                  record?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                handleStatus(
                  status,
                  record?.mentorship_id,
                  "mentorship",
                  record
                );
              }}
            >
              {record?.status === "ACTIVE" ? (
                <button className="btn btn-light">
                  {" "}
                  Inactivate
                  <AlertOctagon
                    className="ms-1"
                    style={{ height: 15, width: 15 }}
                  />
                </button>
              ) : (
                <button className="btn btn-success">
                  Activate
                  <Check className="ms-1" style={{ height: 15, width: 15 }} />
                </button>
              )}
            </div>
          </>,
        ],
      },
    ],
  };
  const customStyles = {
    head: {
      style: {
        fontSize: "1em", // Adjust as needed
      },
    },
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Mentorship List</h4>
            </div>
          </div>
        </div>
        <Container className="ticket-page mb-50 userlist">
          <Row>
            <Container className="ticket-page mb-50 userlist">
              <Row className="mt-0">
                <Row
                  className="align-items-center"
                  style={{ paddingLeft: "0" }}
                >
                  <Col className="d-flex justify-content-end">
                    <div className="text-center">
                      <button
                        className="btn btn-info"
                        onClick={() => navigate("/add-mentorship")}
                      >
                        <PlusCircle
                          className="me-2"
                          style={{ color: "white" }}
                        />
                        <b>Add Mentorship</b>
                      </button>
                    </div>
                  </Col>
                </Row>
                <div className="bg-white border card pt-3 mt-5">
                  <DataTableExtensions
                    print={false}
                    export={false}
                    {...StudentsData}
                  >
                    <DataTable
                      data={tableData || []}
                      defaultSortField="id"
                      customStyles={customStyles}
                      defaultSortAsc={false}
                      pagination
                      highlightOnHover
                      fixedHeader
                      subHeaderAlign={Alignment.Center}
                    />
                  </DataTableExtensions>
                </div>
              </Row>
            </Container>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MentorshipList;
