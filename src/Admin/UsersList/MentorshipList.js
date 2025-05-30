/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "reactstrap";
import { openNotificationWithIcon } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";

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
import AddADmins from "./AddAdmin";

import { useDispatch } from "react-redux";
import { encryptGlobal } from "../../constants/encryptDecrypt.js";
import { MaskedEmail, MaskedMobile } from "../../RegPage/MaskedData.js";

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

  const handleStatus = (status, id, type,all) => {
    const stats= "Mentorship";
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
mentorship_id:data?.mentorship_id,
        username: data?.user?.username,
        area_of_expertise: data?.areas_of_expertise,

      },
    });
  };
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
        width: "10rem",
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
        width: "12rem",
      },
      {
        name: "Actions",
        center: true,
        sortable: false,
        width: "20rem",
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
              onClick={() => handleDeleteMentorship(record)}
              style={{ marginRight: "8px" }}
            >
              <a className="badge badge-md bg-danger">
                <i data-feather="trash-2" className="feather-trash-2" />
              </a>
            </div>
            <div
              key={record.id}
              style={{ marginRight: "10px" }}
              onClick={() => {
                let status =
                  record?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                handleStatus(status, record?.mentorship_id,"mentorship", record);
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
          {/* <div className="page-btn">
                        <button
                            type="button"
                            className="btn btn-info"
                            onClick={() =>
                                setRegisterModalShow(true)
                            }
                        >
                            <PlusCircle className="me-2" style={{color:"white"}} /><b>Add New Admin</b>
                        </button>
                    </div> */}
        </div>
        <Container className="ticket-page mb-50 userlist">
          <Row>
            <Container fluid>
              <div className="card pt-3 mt-2">
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
            </Container>
            {/* {registerModalShow &&
                
                    <AddADmins
                        show={registerModalShow}
                        setShow={setRegisterModalShow}
                        onHide={() => setRegisterModalShow(false)}
                    />
              } */}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MentorshipList;
