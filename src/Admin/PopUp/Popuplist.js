/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { useState } from "react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import Layout from '../Layout';
import { Container, Row, Col } from "reactstrap";
import DataTableExtensions from "react-data-table-component-extensions";
import DataTable, { Alignment } from "react-data-table-component";
import { getCurrentUser } from "../../helpers/Utils";
import axios from "axios";
// import { Link } from 'react-router-dom';
import { openNotificationWithIcon } from "../../helpers/Utils";
// import { Button } from '../../stories/Button';
import { useNavigate } from "react-router-dom";
// import { ReactDOM } from 'react-dom';
// import * as ReactDOM from 'react-dom';
import Swal from "sweetalert2/dist/sweetalert2";
import logout from "../../assets/img/logout.png";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import "sweetalert2/src/sweetalert2.scss";
import {
  AlertOctagon,
  PlusCircle,
  Check,
} from "feather-icons-react/build/IconComponents";
const AdminResources = () => {
  const navigate = useNavigate();
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [resList, setResList] = useState([]);
  const [tecList, setTecList] = useState([]);
  // const [reqList, setReqList] = useState(false);

  const currentUser = getCurrentUser("current_user");

  useEffect(() => {
    fetchTecResourceList();
  }, []);
  async function fetchTecResourceList() {
    // const fectchTecParam = encryptGlobal(
    //     JSON.stringify({
    //         role: 'mentor'
    //     })
    // );
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/popup`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
        }
      );
      // if (response.status === 200) {
      //     console.log(response,"11");

      //     setTecList(response.data?.data);
      //     let studentCount = 0;
      //     let institutionCount = 0;

      //     response.data?.data.forEach(item => {
      //         if (item.role === 'Student') studentCount++;
      //         if (item.role === 'Institution') institutionCount++;
      //     });

      //     // Show button only if there is either one Student or one Institution
      //     if ((studentCount === 1 && institutionCount === 0) || (studentCount === 0 && institutionCount === 1)) {
      //         setShowCreateButton(true);
      //     } else {
      //         setShowCreateButton(false);
      //     }
      // }
      if (response.status === 200) {
        console.log(response, "11");

        setTecList(response.data?.data);
        let studentCount = 0;
        let institutionCount = 0;

        if (response.data?.data.length === 0) {
          // Enable the button if no roles exist
          setShowCreateButton(true);
        } else {
          response.data?.data.forEach((item) => {
            if (item.role === "Student") studentCount++;
            if (item.role === "Institution") institutionCount++;
          });

          // Show button if there is exactly one Student or one Institution OR no roles at all
          if (
            (studentCount === 1 && institutionCount === 0) ||
            (studentCount === 0 && institutionCount === 1)
          ) {
            setShowCreateButton(true);
          } else {
            setShowCreateButton(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  const teacherData = {
    data: tecList || [],

    columns: [
      {
        name: "No",
        selector: (row, key) => key + 1,
        sortable: true,
        width: "6rem",
      },
      {
        name: "Role",
        selector: (row) => row.role,
        width: "7rem",
        sortable: true,
        // center: true,
      },
      // {
      //     name: 'State',
      //     selector: (row) => row.
      //     state,
      //     sortable: true,
      //     width: '9rem'
      //     // center: true,
      // },
      // {
      //     name: 'Path',
      //     selector: (row) => row.navigate,
      //     width: '10rem'
      // },

      {
        name: "Status",
        sortable: true,
        cell: (record) => [
            <span
            key={record.popup_id}
            className={`${
              record.on_off === "1" ? "badge bg-success" : "badge bg-danger"
            }`}
          >
            {record.on_off === "1" ? "Enabled" : "Disabled"}
          </span>
        ],
        width: "8rem",
      },
      {
        name: "Attachment",
        width: "8rem",
        cell: (record) => {
          if (record.type === "file") {
            return (
              <a
                href={record.url}
                target="_blank"
                rel="noopener noreferrer"
                className="badge badge-md bg-light"
              >
                <i className="fas fa-file-lines" style={{ color: "blue" }}></i>
              </a>
            );
          } else if (record.type === "link") {
            return (
              <a
                href={record.url}
                target="_blank"
                rel="noopener noreferrer"
                className="badge badge-md bg-light"
              >
                <i
                  className="fa-brands fa-youtube"
                  style={{ color: "red" }}
                ></i>
              </a>
            );
          }
          return null;
        },
      },
    //   {
    //     name: "On/Off Popup",
    //     width: "10rem",
    //     cell: (record) => {
    //       if (record.on_off === "1") {
    //         return (
    //           <button
    //             className="btn btn-success"
    //             onClick={() => {
    //               handleStatus(record, "0");
    //             }}
    //           >
    //             Turned ON
    //             <Check className="ms-1" style={{ height: 15, width: 15 }} />
    //           </button>
    //         );
    //       } else if (record.on_off === "0") {
    //         return (
    //           <button
    //             className="btn btn-light"
    //             onClick={() => {
    //               handleStatus(record, "1");
    //             }}
    //           >
    //             Turned Off
    //             <AlertOctagon
    //               className="ms-1"
    //               style={{ height: 15, width: 15, color: "red" }}
    //             />
    //           </button>
    //         );
    //       }
    //     },
    //   },
      {
        name: "Actions",
        left: true,
        width: "12rem",
        cell: (record) => [
          <>
          
            <div
              key={record}
              onClick={() => handleTecherDelete(record)}
              style={{ marginRight: "8px" }}
            >
              <a className="badge badge-md bg-danger">
                <i data-feather="trash-2" className="feather-trash-2" />
              </a>
            </div>
            {record.on_off === "1" ? (
        <button
          className="btn btn-success"
          onClick={() => handleStatus(record, "0")}
        >
          Turned ON
          <Check className="ms-1" style={{ height: 15, width: 15 }} />
        </button>
      ) : (
        <button
          className="btn btn-light"
          onClick={() => handleStatus(record, "1")}
        >
          Turned Off
          <AlertOctagon
            className="ms-1"
            style={{ height: 15, width: 15, color: "red" }}
          />
        </button>
      )}
          </>,
        ],
      },
    ],
  };
  const handleTecherDelete = (items) => {
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
        text: "Do you really want to delete this item, This process cannot be undone.",
        imageUrl: `${logout}`,
        confirmButtonText: "Delete",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const resId = encryptGlobal(JSON.stringify(items.popup_id));
          var config = {
            method: "delete",
            url: process.env.REACT_APP_API_BASE_URL + "/popup/" + resId,
            headers: {
              "Content-Type": "application/json",
              // Accept: "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          };
          axios(config)
            .then(function (response) {
              if (response.status === 200) {
                openNotificationWithIcon(
                  "success",
                  "PopUp Deleted Successfully"
                );
                setTimeout(() => {
                  fetchTecResourceList();
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

  async function handleStatus(item, value) {
    // alert("hii");
    const body = {
      // role: item.role,
      // type: item.type,
      // url: item.url,
      // state:item.state,
      on_off: value,
    };

    if (item.navigate !== item.navigate) {
      body["navigate"] = item.navigate;
    }
    const popParam = encryptGlobal(JSON.stringify(item.popup_id));

    let config = {
      method: "put",
      url: process.env.REACT_APP_API_BASE_URL + `/popup/${popParam}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: JSON.stringify(body),
    };
    await axios(config)
      .then(function (response) {
        if (response.status === 200) {
          if (value === "0") {
            openNotificationWithIcon("success",  'PopUp Disabled Successfully');
          } else if (value === "1") {
            openNotificationWithIcon("success",  'PopUp Enabled Successfully');
          }
          // openNotificationWithIcon(
          //     'success',
          //     item.on_off === '1' && id === 1
          //         ? 'PopUp successfully Enabled'
          //         : item.on_off === '0' && id === 1
          //         ? 'PopUp successfully Disabled'
          //         : item.on_off === '1' && id === 2
          //         ? 'Idea Submission successfully Enabled'
          //         : item.on_off === '0' && id === 2
          //         ? 'Idea Submission successfully Disabled'
          //         : 'Popup Image upload successfull'
          // );
          setTimeout(() => {
            fetchTecResourceList();
          }, 500);
          // setshowspin(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        // setshowspin(false);
      });
  }
  // useEffect(() => {
  //     fetchResourceList();
  // }, []);
  const handleBack = (e) => {
    // here we can go back to main page //
    // setReqList(false);
  };
  const handleStudentList = async (e) => {
    // alert('hii');
    // here we can see  list of inActive institutions //
    // await fetchResourceList();
  };
  // const fetchResourceList = () => {
  //     try {
  //         const response = axios.get(
  //             `${process.env.REACT_APP_API_BASE_URL}/resource/list?role=student`,
  //             {
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                     Authorization: `Bearer ${currentUser?.data[0]?.token}`
  //                 }
  //             }
  //         );
  //         if (response.status === 200) {
  //             setResList(response.data?.data);
  //         }
  //     } catch (error) {
  //         console.log(error);
  //     }
  // };
  // const fetchResourceList = () => {
  //     const fectchParam = encryptGlobal(
  //         JSON.stringify({
  //             role: 'student'
  //         })
  //     );
  //     var config = {
  //         method: 'get',
  //         url:
  //             process.env.REACT_APP_API_BASE_URL +
  //             `/resource/list?Data=${fectchParam}`,
  //         headers: {
  //             'Content-Type': 'application/json',
  //             Accept: 'application/json',
  //             Authorization: `Bearer ${currentUser.data[0]?.token}`
  //         }
  //     };
  //     axios(config)
  //         .then(function (response) {
  //             if (response.status === 200) {
  //                 setResList(response.data?.data);
  //                 setReqList(true);
  //             }
  //         })
  //         .catch(function (error) {
  //             console.log(error);
  //         });
  // };
  // const resData = {
  //     data: resList || [],
  //     columns: [
  //         {
  //             name: 'No',
  //             selector: (row, key) => key + 1,
  //             sortable: true,
  //             width: '10rem'
  //         },
  //         {
  //             name: 'Role',
  //             selector: (row) => row.role,
  //             width: '15rem'
  //             // center: true,
  //         },
  //         {
  //             name: 'Details',
  //             selector: (row) => row.description,
  //             width: '40rem'
  //         },
  //         // {
  //         //     name: 'Type',
  //         //     selector: 'type',
  //         //     width: '25%'
  //         // },
  //         {
  //             name: 'File/Link',
  //             width: '10rem',
  //             cell: (record) => {
  //                 if (record.type === 'file') {
  //                     return (
  //                         <button className="btn btn-warning  mx-2">
  //                             <a
  //                                 href={record.attachments}
  //                                 target="_blank"
  //                                 rel="noopener noreferrer"
  //                                 style={{ color: 'black' }}
  //                             >
  //                                 Navigate
  //                             </a>
  //                         </button>
  //                     );
  //                 } else if (record.type === 'link') {
  //                     return (
  //                         <button className="btn btn-warning  mx-2">
  //                             <a
  //                                 href={record.attachments}
  //                                 target="_blank"
  //                                 rel="noopener noreferrer"
  //                                 style={{ color: 'black' }}
  //                             >
  //                                 Navigate
  //                             </a>
  //                         </button>
  //                     );
  //                 }
  //                 return null;
  //             }
  //         },
  //         {
  //             name: 'Actions',
  //             center: true,
  //             width: '25rem',
  //             cell: (record) => [
  //                 <>
  //                     <div
  //                         key={record}
  //                         onClick={() => handleEdit(record)}
  //                         style={{ marginRight: '12px' }}
  //                     >
  //                         <div className="btn btn-primary btn-lg mx-2">
  //                             EDIT
  //                         </div>
  //                     </div>

  //                     <div
  //                         key={record}
  //                         onClick={() => handleDelete(record)}
  //                         style={{ marginRight: '12px' }}
  //                     >
  //                         <div className="btn btn-primary btn-lg mx-2">
  //                             DELETE
  //                         </div>
  //                     </div>
  //                 </>
  //             ]
  //         }
  //     ]
  // };
  const handleEdit = (item) => {
    // where we can edit level name, no of evaluation //
    history.push({
      pathname: "/admin/Resources/editResource",
    });
    localStorage.setItem("resID", JSON.stringify(item));
  };

  const handleDelete = (item) => {
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
        text: "Do you really want to delete this item, This process cannot be undone.",
        imageUrl: `${logout}`,
        confirmButtonText: "Delete",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const delParam = encryptGlobal(JSON.stringify(item.resource_id));
          var config = {
            method: "delete",
            url: process.env.REACT_APP_API_BASE_URL + "/resource/" + delParam,
            headers: {
              "Content-Type": "application/json",
              // Accept: "application/json",
              Authorization: `Bearer ${currentUser?.data[0]?.token}`,
            },
          };
          axios(config)
            .then(function (response) {
              if (response.status === 200) {
                openNotificationWithIcon(
                  "success",
                  "Resource Deleted Successfully"
                );
                // fetchResourceList();
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

  const customStyles = {
    rows: {
      style: {
        fontSize: "14px",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>PopUp List</h4>
              <p style={{marginLeft:"10px"}}>
                <span style={{ color: "red", fontWeight: "bold"}}>
                  Note :{" "}
                </span>
                <p style={{ margin: "0", padding: "0" }}>
                  <span style={{ fontWeight: "bold", display: "inline" }}>
                    {" "}
                    1. Only one user-specific popup can be active at a time.
                  </span>
                  To create a new popup, please delete the existing one first.
                </p>
                <p style={{ margin: "0", padding: "0" }}>
                  <span style={{ fontWeight: "bold" }}>
                    {" "}
                    2. Newly created popups are disabled by default.
                  </span>{" "}
                  Click <span style={{ fontWeight: "bold" }}>Turned Off </span>
                  to enable them.
                </p>
              </p>
            </div>
          </div>
          <div className="page-btn">
            {showCreateButton && (
              <button
                type="button"
                className="btn btn-info"
                onClick={() => navigate("/create-popup")}
              >
                <PlusCircle className="me-2" style={{ color: "white" }} />
                <b>Create PopUp</b>
              </button>
            )}
          </div>
        </div>
        <Container className="ticket-page mb-50">
          <Row>
            <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
              <div>
                <DataTableExtensions
                  print={false}
                  export={false}
                  {...teacherData}
                  exportHeaders
                >
                  <DataTable
                    // data={setResList}
                    // noHeader
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
          </Row>
        </Container>
        {/* <h1>hi</h1> */}
      </div>
    </div>
  );
};

export default AdminResources;
