/* eslint-disable react/no-unknown-property */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { Descriptions, Input } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
// import { Col, Row } from 'reactstrap';
import { Button } from "../../stories/Button";
// import Layout from '../Layout';
// import {
//     deleteTempMentorById,
//     teacherResetPassword
// } from '../store/admin/actions';
import { Col, Container, Row, CardBody, CardText } from "reactstrap";
// import './dashboard.scss';
// import { useHistory } from 'react-router-dom';
import jsPDF from "jspdf";
import DataTable, { Alignment } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { URL, KEY } from "../../constants/defaultValues";
import { Link } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import logout from "../../assets/img/logout.png";
import { useDispatch } from "react-redux";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import {
  deleteTempMentorById,
  teacherResetPassword,
} from "../store/admin/actions";
import {
  getCurrentUser,
  getNormalHeaders,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DiescodeScreen = () => {
  // here we can see the registration details //
  const navigate = useNavigate();
  const currentUser = getCurrentUser('current_user');

  const location = useLocation();
  const dispatch = useDispatch();
  //   const multiOrgData = location.state?.multiOrgData;
  const multiOrg = localStorage.getItem("multiOrgData");

  const [mentorTeam, setMentorTeam] = useState([]);
  const [orgData, setOrgData] = useState({});
  const [diesCode, setDiesCode] = useState("");
  const [multiOrgData, setMultiOrgData] = useState({ multiOrg });

    // console.log(JSON.parse(multiOrgData),"mm");
  const [mentorId, setMentorId] = useState("");

  const pdfRef = React.useRef(null);
  const inputField = {
    type: "text",
    className: "defaultInput",
  };
  useEffect(() => {
    // where list = diescode //
    //where organization_code = diescode //
    const list = JSON.parse(localStorage.getItem("diesCode"));
    // console.log(list,"ll");
    setDiesCode(list);
    handleSearch(list);
  }, []);
  const handleSearch = (diesCode) => {
    //where we can search through diescode //
    // we can see Registration Details & Mentor Details //

    const body = JSON.stringify({
      organization_code: diesCode,
    });
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/organizations/checkOrg",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: body,
    };

    axios(config)
      .then(async function (response) {
        if (response.status == 200) {
          setMultiOrgData(response?.data?.data);
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 404) {
          // setError('Entered Invalid Institution Unique Code');
        }
      });
    // e.preventDefault();
  };
  const downloadPDF = () => {
    // where we can download the Registration Details //
    const content = pdfRef.current;
    const doc = new jsPDF("p", "px", [1280, 1020]);
    doc.html(content, {
      callback: function (doc) {
        doc.save("Detail.pdf");
      },
    });
    console.warn(content);
  };
  const handelSelectentor = (data) => {
    setOrgData(data);
    setMentorId(data.mentor.mentor_id);
    if (data.mentor.mentor_id) {
      getMentorIdApi(data.mentor.mentor_id);
    }
  };
  async function getMentorIdApi(id) {
    // Mentor Id  Api//
    // id = Mentor Id //
    let axiosConfig = getNormalHeaders(KEY.User_API_Key);
    let enParamData = encryptGlobal(
      JSON.stringify({
        mentor_id: id,
        status: "ACTIVE",
        ideaStatus: true,
      })
    );
    axiosConfig["params"] = {
      Data: enParamData,
    };

    await axios
      .get(`${URL.getTeamMembersList}`, axiosConfig)
      .then((res) => {
        if (res?.status == 200) {
          var mentorTeamArray = [];
          res &&
            res.data &&
            res.data.data[0] &&
            res.data.data[0].dataValues.length > 0 &&
            res.data &&
            res.data.data[0].dataValues.map((teams, index) => {
              var key = index + 1;
              return mentorTeamArray.push({ ...teams, key });
            });
          setMentorTeam(mentorTeamArray);
        }
      })
      .catch((err) => {
        return err.response;
      });
  }
  const MultipleMentorsData = {
    data: multiOrgData,
    columns: [
      {
        name: "Teacher Name",
        selector: (row) => row?.mentor?.title + "." + row?.mentor?.full_name,
        left: true,
      },
      {
        name: "Email Address",
        selector: (row) => row?.mentor?.user?.username,
        left: true,
      },
      {
        name: "Mobile Number",
        selector: (row) => row?.mentor?.mobile,
        left: true,
      },
      {
        name: "Actions",
        cell: (params) => {
          return [
            <div key={params} onClick={() => handelSelectentor(params)}>
              <div className="btn btn-primary ">view</div>
            </div>,
          ];
        },
        left: true,
      },
    ],
  };
  const customStyles = {
    rows: {
      style: {
        fontSize: "13px",
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
      },
    },
    cells: {
      style: {
        fontSize: "13px",
      },
    },
  };
  const handleRevoke = async (id, type) => {
    const idParam = encryptGlobal(JSON.stringify(id));
    // where id = challenge response id //
    // here we  can see the Revoke button when ever idea is submitted //
    // where type = ideaStatus //
    let submitData = {
      status: type == "DRAFT" ? "SUBMITTED" : "DRAFT",
    };
    var config = {
      method: "put",
      url:
        process.env.REACT_APP_API_BASE_URL +
        "/challenge_response/updateEntry/" +
        idParam,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: submitData,
    };
    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          openNotificationWithIcon(
            "success",
            "Idea Submission Status Successfully Update!",
            ""
          );
          await getMentorIdApi(mentorId);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const MentorsData = {
    data: mentorTeam,
    columns: [
      {
        name: "No",
        selector: (row) => row.key,
        width: "4rem",
      },
      {
        name: "Username",
        selector: (row) => row.user?.username,
        sortable: true,
        center: true,
        width: "8rem",
      },
      {
        name: "Team Name",
        selector: (row) => row.team_name,
        sortable: true,
        center: true,
        width: "10rem",
      },
      {
        name: "#Students",
        selector: (row) => row.student_count,
        center: true,
        width: "8rem",
      },
      {
        name: "Idea Status",
        selector: (row) => row.ideaStatus === null ? "Not Initiated" 
        : row.ideaStatus,
        center: true,
        width: "8rem",
      },
      {
        name: 'Mentor Idea Review',
          selector: (row) =>
  
    row.ideaStatus === "SUBMITTED" && row.ideaAcceptance == "ACCEPTED"
  ? row.ideaAcceptance
  : row.ideaStatus === "DRAFT" && row.ideaAcceptance === "REJECTED" 
    ? row.ideaAcceptance : row.ideaStatus === "DRAFT" || row.ideaStatus === null
    ? "" :"Not yet Reviewed",
        center: true,
        width: '12rem'
    },
      //   {
      //     name: "Mentor Approval",
      //     selector: (row) =>
      //       row.PFAStatus === null
      //         ? ""
      //         : row.PFAStatus === "Pending"
      //         ? "PENDING"
      //         : "APPROVED",
      //     center: true,
      //     width: "20%",
      //   },
      {
        name: "Actions",
        cell: (params) => {
          return [
            <>
              {params.ideaStatus == "SUBMITTED" &&
                (params.ideaAcceptance === null ||
                 params.ideaAcceptance == "" )&&
                 (
                  <Button
                    key={params}
                    //   className={
                    //       isideadisable
                    //           ? `btn btn-success btn-lg mr-5 mx-2`
                    //           : `btn btn-lg mr-5 mx-2`
                    //   }
                    className="btn btn-secondary"
                    label={"Revoke"}
                    size="small"
                    shape="btn-square"
                    onClick={() =>
                      handleRevoke(
                        params.challenge_response_id,
                        params.ideaStatus
                      )
                    }
                    //   disabled={!isideadisable}
                  />
                )}
            </>,
          ];
        },
        width: "8rem",
        center: true,
      },
    ],
  };
  const handleAlert = (id) => {
    // where id = mentor.userid //
    // we can delete the userid //
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-submit",
        cancelButton: "btn btn-cancel",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "<h4>Are you sure?</h4>",
        text: "You are Deleting this Registration",
        imageUrl: `${logout}`,
        confirmButtonText: "Confirm",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          if (result.isConfirmed) {
            await deleteTempMentorById(id);
            window.location.reload();

            setOrgData({});
          }
        }
      });
  };
  const viewDetails = () => {
    // alert("hii"),
    navigate("/diescode-view");
    localStorage.setItem("orgData", JSON.stringify(orgData));
  };
  const handleresetpassword = (data) => {
    //  here we can reset the password as disecode //
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
          dispatch(
            teacherResetPassword({
              username: orgData.mentor?.user?.username,
              mentor_id: data.mentor_id,
              otp: false,
            })

          );
        }
      })
      .catch((err) => console.log(err.response));
  };
  const handleEdit = () => {
    //  here  We can edit the Registration details //
    // Where data = orgData //
    navigate("/diescode-mentor-edit", {
      state: {
        full_name: orgData.mentor?.full_name,
        mobile: orgData.mentor?.mobile,
        username: orgData.mentor?.user?.username,
        mentor_id: orgData.mentor?.mentor_id,
        where: "Dashbord",
        organization_code: orgData.organization_code,
        title: orgData.mentor?.title,
        gender: orgData.mentor?.gender,
        whatapp_mobile: orgData.mentor?.whatapp_mobile,
      },
    });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="dashboard-wrappermy-5 px-5">
          <div className="create-ticket register-block">
            <Row className="mb-3 modal-body-table search-modal-header">
              <div className="dashboard p-2">
                <h4>Teachers List Of Udise Code : {diesCode} </h4>
                <Row className="mb-3 modal-body-table search-modal-header">
                  {multiOrgData.length !== undefined &&
                    multiOrgData.length !== 0 &&
                    multiOrgData[0]?.mentor !== null && (
                      <DataTableExtensions
                        print={false}
                        export={false}
                        {...MultipleMentorsData}
                      >
                        <DataTable
                          data={multiOrgData}
                          noHeader
                          highlightOnHover
                          customStyles={customStyles}
                        />
                      </DataTableExtensions>
                    )}
                </Row>
                <div className="row " style={{ overflow: "auto" }}>
                  <div className=" row  col-6 col-md-12">
                    <div
                      style={{ flex: 1, overflow: "auto" }}
                      className="bg-white rounded col-lg-6 disc-card-search col-6"
                    >
                      {orgData &&
                      orgData?.organization_name &&
                      orgData?.mentor !== null ? (
                        <>
                          <div ref={pdfRef}>
                            <div className="row">
                              <div className="col">
                                <h4 className="text-center m-3 text-primary ">
                                  <span>
                                    {" "}
                                    {orgData?.mentor.title +
                                      "." +
                                      orgData?.mentor.full_name}{" "}
                                  </span>{" "}
                                  Registration Details
                                </h4>
                                <hr />
                              </div>
                            </div>
                            <div className="row ">
                              <div className="col">
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>School Name</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>{orgData.organization_name}</p>
                                  </Col>
                                </Row>
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>State</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>{orgData.state}</p>
                                  </Col>
                                </Row>
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>District</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>{orgData.district}</p>
                                  </Col>
                                </Row>
                                {/* <Row className="pt-3 pb-3">
                                                        <Col
                                                            xs={5}
                                                            sm={5}
                                                            md={5}
                                                            xl={5}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>Pincode</p>
                                                        </Col>
                                                        <Col
                                                            xs={1}
                                                            sm={1}
                                                            md={1}
                                                            xl={1}
                                                        >
                                                            :
                                                        </Col>
                                                        <Col
                                                            xs={6}
                                                            sm={6}
                                                            md={6}
                                                            xl={6}
                                                            className="my-auto profile-detail"
                                                        >
                                                            <p>
                                                                {
                                                                    orgData.pin_code
                                                                }
                                                            </p>
                                                        </Col>
                                                    </Row> */}
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>Teacher Name</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>
                                      {orgData.mentor?.title}.{" "}
                                      {orgData.mentor?.full_name}
                                    </p>
                                  </Col>
                                </Row>
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>Email Id</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>{orgData.mentor?.user?.username}</p>
                                  </Col>
                                </Row>
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>Gender</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>{orgData?.mentor?.gender}</p>
                                  </Col>
                                </Row>
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>Mobile No</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>{orgData?.mentor?.mobile}</p>
                                  </Col>
                                </Row>
                                <Row className="pt-3 pb-3">
                                  <Col
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    xl={5}
                                    className="my-auto profile-detail"
                                  >
                                    <p>WhatsApp Mobile No</p>
                                  </Col>
                                  <Col xs={1} sm={1} md={1} xl={1}>
                                    :
                                  </Col>
                                  <Col
                                    xs={6}
                                    sm={6}
                                    md={6}
                                    xl={6}
                                    className="my-auto profile-detail"
                                  >
                                    <p>{orgData.mentor?.whatapp_mobile}</p>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                          {/* <Row  className="mb-3 modal-body-table search-modal-header"> */}
                          <div className="d-flex justify-content-between flex-column flex-md-row mb-3 ">
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={handleEdit}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline-success"
                              onClick={() =>
                                handleresetpassword({
                                  mentor_id: orgData.mentor.mentor_id,
                                  username: orgData.mentor.user.username,
                                })
                              }
                            >
                              Reset Pwd
                            </button>

                            
                            <button
                              onClick={viewDetails}
                              type="button"
                              className="btn btn-outline-info"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                downloadPDF();
                              }}
                            >
                              Download
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => {
                                handleAlert(orgData.mentor?.user_id);
                              }}
                            >
                              Delete Registration
                            </button>
                          </div>
                          {/* </Row> */}
                          <Row className="mb-2 modal-body-table search-modal-header">
                            <div>
                              <div className="row">
                                <div className="col">
                                  <h4 className="text-center m-3 text-primary">
                                    Enrolled Teams
                                  </h4>
                                 
                                </div>
                              </div>
                              <div>
                                <DataTableExtensions
                                  print={false}
                                  export={false}
                                  {...MentorsData}
                                >
                                  <DataTable
                                    noHeader
                                    defaultSortField="id"
                                    defaultSortAsc={false}
                                    highlightOnHover
                                    customStyles={customStyles}
                                  />
                                </DataTableExtensions>
                              </div>
                            </div>
                          </Row>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiescodeScreen;
