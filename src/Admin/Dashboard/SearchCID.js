/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef, useEffect, useState } from "react";
import "../../Evaluator/Admin/Evaluation/ViewSelectedIdea/ViewSelectedideas.scss";

import { Button } from "../../stories/Button";
import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import { useTranslation } from "react-i18next";
import { Card } from "react-bootstrap";
import Select from "react-select";

import Swal from "sweetalert2/dist/sweetalert2.js";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import RatedCard from "../../Evaluator/Admin/Dashboard/RatedCard";
import jsPDF from "jspdf";
import { FaUnlink } from "react-icons/fa";
import html2canvas from "html2canvas";
import { Row, Col, Form, Label } from "reactstrap";
import { useReactToPrint } from "react-to-print";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import LinkComponent from "../../Evaluator/Admin/Challenges/pages/LinkComponent";
const AdminSearchCID = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { multiOrgData} = location.state || {};
  const [multiOrgListData, setMultiOrgListData] = useState(multiOrgData);
  const currentUser = getCurrentUser("current_user");
  const [teamResponse, setTeamResponse] = React.useState({});
  const [images, setImages] = React.useState([]);

  const [isReject, setIsreject] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [reasonSec, setReasonSec] = React.useState("");
  const [mentorshipList, setMentorshipList] = useState([]);

  const [oldCollegeName, setOldCollegeName] = useState(null);

  const selectData = [
    "Not novel - Idea and problem common and already in use.",
    "Not novel - Idea has been 100% plagiarized.",
    "Not useful - Idea does not solve the problem identified / problem & solution not connected.",
    "Not understandable - Idea Submission does not have proper details to make a decision.",
    "Not clear (usefulness)",
    "Not filled - Inaccurate data (form is not filled properly)",
  ];
  const reasondata2 = [
    "Lot of project effort visible.",
    "Some project effort visible.",
    "Zero project effort visible.",
  ];

  useEffect(() => {
    if (multiOrgListData) {
      setTeamResponse(multiOrgListData);
      setImages(JSON.parse(multiOrgListData.prototype_image));
    }
  }, [multiOrgListData]);

  const handleAlert = (handledText) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",

        text:
          handledText === "accept"
            ? "You are attempting to accept this Idea"
            : "You are attempting to reject this Idea",
        showCloseButton: true,
        confirmButtonText: "Confirm",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (result.isConfirmed) {
            handleL1Round(handledText);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Cancelled", "", "error");
        }
      });
  };
  const handleAssignUnAssignApi = (item, userId) => {
    //where we can search through diescode //
    // we can see Registration Details & Mentor Details //

    const body = JSON.stringify({
      mentorship_user_id: item === "UnAssign" ? null : userId,
    });
    const openParam = encryptGlobal(
      JSON.stringify(multiOrgListData?.challenge_response_id)
    );
    var config = {
      method: "put",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/updateEntry/${openParam}`,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: body,
    };

    axios(config)
      .then(async function (response) {
        if (response.status == 200) {
          if(item === "UnAssign"){
             openNotificationWithIcon(
            "success",
            "Mentorship UnAssigned Successfully"
          );
          }else {
          openNotificationWithIcon(
            "success",
            "Mentorship Assigned Successfully"
          );
        }
          handleSearch();
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 404) {
          // setError('Entered Invalid Institution Unique Code');
        }
      });
  };
  const handleSearch = () => {
    const diesCode = multiOrgListData?.challenge_response_id;
    const diesCodeStr = String(diesCode);
    const popParam = encryptGlobal(diesCodeStr);
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
          const multiOrgListData = response?.data?.data[0];
          setMultiOrgListData(multiOrgListData);
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 404) {
          console.log(error);
        }
      });
  };
  const handleL1Round = (handledText) => {
    // this function accept / reject the Idea //

    const currentTime = new Date().toLocaleString();

    const body = JSON.stringify({
      status: handledText == "accept" ? "SELECTEDROUND1" : "REJECTEDROUND1",
      student_id: teamResponse?.student_id,
      evaluated_by: currentUser?.data[0]?.user_id,
      evaluated_at: currentTime,
      rejected_reason: handledText == "reject" ? reason : "",
      rejected_reasonSecond: handledText == "reject" ? reasonSec : "",
    });
    const challId = encryptGlobal(
      JSON.stringify(teamResponse?.challenge_response_id)
    );
    var config = {
      method: "put",
      url: `${
        process.env.REACT_APP_API_BASE_URL_FOR_REPORTS +
        "/challenge_response/" +
        challId
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        openNotificationWithIcon(
          "success",
          response?.data?.message == "OK"
            ? "Idea processed successfully!"
            : response?.data?.message
        );
        navigate("/eadmin/evaluationStatus");
      })
      .catch(function (error) {
        openNotificationWithIcon("error", error?.response?.data?.message);
      });
  };

  const handleReject = () => {
    if (reason) {
      handleAlert("reject");
      setIsreject(false);
    }
  };

  const [pdfLoader, setPdfLoader] = React.useState(false);
  const downloadPDF = async () => {
    setPdfLoader(true);
    const domElement = document.getElementById("pdfId");
    await html2canvas(domElement, {
      onclone: (document) => {
        document.getElementById("pdfId").style.display = "block";
      },
      scale: 1.13,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "px", [2580, 3508]);
      pdf.addImage(
        imgData,
        "JPEG",
        20,
        20,
        2540,
        pdf.internal.pageSize.height,
        undefined,
        "FAST"
      );
      pdf.save(`${new Date().toISOString()}.pdf`);
    });
    setPdfLoader(false);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${
      multiOrgListData?.team_name ? multiOrgListData?.team_name : "temp"
    }_IdeaSubmission`,
  });
  useEffect(() => {
    if (multiOrgListData) {
      AllMentorshipListApi();
    }
  }, [multiOrgListData]);

  const AllMentorshipListApi = () => {
    // this function fetches all college names list related to college type from the API
    const openParams = encryptGlobal(
      JSON.stringify({
        qtype: "names",
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL + `/mentorships?Data=${openParams}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          const apiData = response.data.data || [];
          const collegeNames = apiData.map((item) => ({
            value: item.user_id,
            label: item.full_name,
          }));
          setMentorshipList(collegeNames);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        {teamResponse ? (
          <>
            <div style={{ display: "none" }}></div>

            <div className="row idea_detail_card">
              <div className="col-12 p-0">
                <div className="row">
                  <div className="col-lg-6">
                    <Row>
                      <Col>
                        <h4 className="mb-md-4 mb-3">
                          Theme :
                          <span className="text-capitalize">
                            {teamResponse?.theme?.toLowerCase() || ""}
                          </span>
                        </h4>
                      </Col>
                      <Col>
                        <h4 className="mb-md-4 mb-3">
                          CID :
                          <span className="text-capitalize">
                            {teamResponse?.challenge_response_id || ""}
                          </span>
                        </h4>
                      </Col>
                    </Row>
                  </div>
                  <div className="col-lg-6 d-flex justify-content-end">
                    <div className="mx-2 pointer d-flex align-items-center"></div>
                  </div>
                  <div className="col-lg-12 mt-3">
                    <Row className="col-lg-12">
                      <Col className="md-6">
                        <Card
                          bg="white"
                          text="dark"
                          className="mb-2"
                          style={{ height: "120px" }}
                        >
                          <Card.Body>
                            <label
                              htmlFor="teams"
                              className=""
                              style={{ fontSize: "16px" }}
                            >
                              <b>College Details</b>
                            </label>
                            <Card.Text
                              style={{
                                marginTop: "10px",
                                marginBottom: "20px",
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                College Type :
                              </span>
                              <span>
                                &nbsp;
                                {teamResponse.college_type}
                              </span>
                              <br />
                              <span style={{ fontWeight: "bold" }}>
                                College Name :
                              </span>
                              <span>
                                &nbsp;
                                {teamResponse.college_name}
                              </span>
                              <br />
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col className="md-6">
                        <Card
                          bg="white"
                          text="dark"
                          className="mb-2"
                          style={{ height: "120px" }}
                        >
                          <Card.Body>
                            <label
                              htmlFor="teams"
                              className=""
                              style={{ fontSize: "16px" }}
                            >
                              <b>Team Details</b>
                            </label>
                            <Card.Text
                              style={{
                                marginTop: "10px",
                                marginBottom: "20px",
                              }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                Team Members :
                              </span>
                              <span>
                                &nbsp;
                                {teamResponse &&
                                  teamResponse.team_members &&
                                  teamResponse.team_members.join(", ")}
                              </span>
                              <br />

                              <span style={{ fontWeight: "bold" }}>
                                District :
                              </span>
                              <span>
                                &nbsp;
                                {teamResponse.district}
                              </span>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="col-lg-8 order-lg-0 order-1 p-2 h-100">
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        1. Which category does your idea belong to?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.theme}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        2. Describe your idea (in one sentence).
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.idea_describe}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        3. Give a title to your idea.
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.title}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        4. What problem does your idea solve?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.solve}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        5. Who are your target customers/users?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.customer}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        6. Explain your idea in detail
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.detail}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        7. What stage is your idea currently at?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.stage &&
                          JSON.parse(teamResponse.stage).map((item, index) => (
                            <span key={index}>
                              {item}
                              {index !==
                                JSON.parse(teamResponse.stage).length - 1 &&
                                ", "}
                            </span>
                          ))}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        8. How unique is your idea compared to existing
                        solutions?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.unique &&
                          JSON.parse(teamResponse.unique).map((item, index) => (
                            <span key={index}>
                              {item}
                              {index !==
                                JSON.parse(teamResponse.unique).length - 1 &&
                                ", "}
                            </span>
                          ))}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        9. Who are your competitors or similar ideas?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.similar}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        10. How will your idea make revenue or sustain itself?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.revenue}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        11. What impact will your idea have on society or the
                        environment?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.society}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        12. How confident are you in your ability to implement
                        your idea with your current skill set?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.confident &&
                          JSON.parse(teamResponse.confident).map(
                            (item, index) => (
                              <span key={index}>
                                {item}
                                {index !==
                                  JSON.parse(teamResponse.confident).length -
                                    1 && ", "}
                              </span>
                            )
                          )}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        13. What additional support and resources would you need
                        to implement or get started with your idea ?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      {teamResponse.support}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 order-lg-0 order-1 p-0 h-100">
                  <div
                    // key={index}
                    className="mb-4 my-3 comment-card px-4 py-2 card me-md-3"
                  >
                    <div className="question quiz mb-0">
                      <b
                        style={{
                          fontSize: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        14. Upload images/documents & video links related to
                        your Idea.(total size limit : 10 MB)
                      </b>
                    </div>
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "black",
                      }}
                    >
                      {<LinkComponent item={images} />}
                    </p>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "auto",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        <a
                          href={teamResponse.prototype_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "skyblue" }}
                        >
                          {teamResponse.prototype_link}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 order-lg-1 order-0 p-2 h-100 mt-3 status_info_col">
                {multiOrgListData?.status !== "DRAFT" && (
                  <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                    {multiOrgListData?.evaluation_status ? (
                      <p
                        style={{ fontSize: "1.2rem" }}
                        className={`${
                          multiOrgListData?.evaluation_status ==
                          "SELECTEDROUND1"
                            ? "text-success"
                            : "text-danger"
                        }fs-4 fw-bold text-center`}
                      >
                        <span
                          className="text-info"
                          style={{ fontSize: "1.2rem" }}
                        >
                          L1 :{" "}
                        </span>
                        {multiOrgListData?.evaluation_status == "SELECTEDROUND1"
                          ? "Accepted"
                          : "Rejected"}
                      </p>
                    ) : (
                      ""
                    )}

                    {multiOrgListData?.evaluated_name ? (
                      <p className="text-center">
                        <span className="text-bold">Evaluated By : </span>{" "}
                        {multiOrgListData?.evaluated_name || ""}
                      </p>
                    ) : (
                      ""
                    )}

                    {multiOrgListData?.evaluation_status ==
                      "REJECTEDROUND1" && (
                      <>
                        <p className="text-center">
                          <span className="text-bold">
                            Rejected Reason 1 :{" "}
                          </span>{" "}
                          {multiOrgListData?.rejected_reason || ""}
                        </p>
                        <p className="text-center">
                          <span className="text-bold">
                            Rejected Reason 2 :{" "}
                          </span>{" "}
                          {multiOrgListData?.rejected_reasonSecond || ""}
                        </p>
                      </>
                    )}
                    {/* Added */}
                    {multiOrgListData?.status !== "DRAFT" && (
                      <>
                        {multiOrgListData?.evaluation_status == null ? (
                          <>
                            <button
                              className="btn px-5 py-2 btn-danger"
                              onClick={() => {
                                setIsreject(true);
                                setReason("");
                                setReasonSec("");
                              }}
                            >
                              <span>Reject</span>
                            </button>
                            <button
                              className="btn px-5 py-2 btn-success mt-2"
                              onClick={() => {
                                handleAlert("accept");
                                setReason("");
                                setReasonSec("");
                              }}
                            >
                              <span>Accept</span>
                            </button>
                          </>
                        ) : multiOrgListData?.evaluation_status ===
                            "SELECTEDROUND1" &&
                          multiOrgListData?.evaluator_ratings?.length === 0 ? (
                          <button
                            className="btn px-2 py-2 btn-danger"
                            onClick={() => {
                              setIsreject(true);
                              setReason("");
                              setReasonSec("");
                            }}
                          >
                            <span>Reject</span>
                          </button>
                        ) : multiOrgListData?.evaluation_status ===
                            "REJECTEDROUND1" &&
                          multiOrgListData?.evaluator_ratings.length === 0 ? (
                          <button
                            className="btn px-2 py-2 btn-success"
                            onClick={() => {
                              handleAlert("accept");
                              setReason("");
                              setReasonSec("");
                            }}
                          >
                            <span>Accept</span>
                          </button>
                        ) : null}
                      </>
                    )}
                  </div>
                )}
                <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                  {multiOrgListData?.mentorship_user_id !== null ? (
                    <>
                      <p>
                        Status :{" "}
                        <span style={{ color: "green", fontSize: "1rem" }}>
                          ASSIGNED
                        </span>
                      </p>
                      <p>
                        Full Name :{" "}
                        <span style={{ color: "blue" }}>
                          {multiOrgListData?.mentorship_name}
                        </span>{" "}
                      </p>
                      <button
                        className="btn btn-outline-danger"
                        style={{ width: "130px" }}
                        onClick={() => handleAssignUnAssignApi("UnAssign")}
                      >
                        <FaUnlink className="me-2" />
                        <b>UnAssign</b>
                      </button>
                    </>
                  ) : (
                    <div className={`col-md-12`}>
                      <label htmlFor="college" className="form-label">
                        Assign Mentorship
                      </label>

                      {mentorshipList.length > 0 && (
                        <Select
                          options={mentorshipList}
                          value={oldCollegeName}
                          onChange={(option) => setOldCollegeName(option)}
                          placeholder="Type here to Select Mentorship User"
                          classNamePrefix="react-select"
                        />
                      )}
                      <br />
                      <button
                        className="btn btn-outline-success"
                        style={{ width: "130px" }}
                        onClick={() =>
                          handleAssignUnAssignApi(
                            "Assign",
                            oldCollegeName?.value
                          )
                        }
                        disabled={!oldCollegeName?.value}
                      >
                        <b>Assign</b>
                      </button>
                    </div>
                  )}
                </div>
                {multiOrgListData?.evaluator_ratings.length > 0 && (
                  <RatedCard details={multiOrgListData} />
                )}
                {(multiOrgListData?.final_result === "0" ||
                  multiOrgListData?.final_result === "1") && (
                  <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                    {multiOrgListData?.final_result ? (
                      <p
                        style={{ fontSize: "1.2rem" }}
                        className={`${
                          multiOrgListData?.final_result == "0"
                            ? "text-success"
                            : "text-danger"
                        }fs-4 fw-bold text-center`}
                      >
                        <span
                          className="text-info"
                          style={{ fontSize: "1.2rem" }}
                        >
                          L3 :{" "}
                        </span>
                        {multiOrgListData?.final_result == "0"
                          ? "Runner - Not Promoted"
                          : "Winner - Promoted"}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex" }}>
              {teamResponse.status !== "DRAFT" && (
                <p
                  style={{ fontSize: "1rem", margin: "1rem" }}
                  className="fw-bold"
                >
                  Submitted By :{" "}
                  {teamResponse.initiated_name
                    ? teamResponse.initiated_name
                    : "-"}
                </p>
              )}
            </div>
            <br />
          </>
        ) : (
          <>
            <h2 className="my-auto text-center mt-5">Details Not Available.</h2>
            <div className="text-center mt-5">
              {/* <Button
                            btnClass="primary"
                            size="small"
                            label="Back"
                            onClick={() => {
                                props?.setIsDetail(false);
                            }}
                        /> */}
            </div>
          </>
        )}
        <Modal
          show={isReject}
          onHide={() => setIsreject(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="assign-evaluator ChangePSWModal teacher-register-modal"
          backdrop="static"
          scrollable={true}
        >
          <Modal.Header closeButton onHide={() => setIsreject(false)}>
            <Modal.Title
              id="contained-modal-title-vcenter"
              className="w-100 d-block text-center"
            >
              Reject
            </Modal.Title>
          </Modal.Header>

          <Modal.Body
            style={{
              maxHeight: window.innerWidth < 768 ? "80vh" : "60vh",
              height: window.innerWidth < 768 ? "80vh" : "60vh",
            }}
          >
            <div className="my-3 text-center">
              <h4 className="mb-sm-4 mb-2">
                Please Select the reason for rejection.
              </h4>
              <Col>
                <Col className="m-5">
                  <p style={{ textAlign: "left" }}>
                    <b>1. Novelty & Usefulness</b>
                  </p>
                  <Select
                    list={selectData}
                    setValue={setReason}
                    placeHolder="Please Select Reject Reason"
                    value={reason}
                  />
                </Col>
                <Col className="m-5">
                  <p style={{ textAlign: "left" }}>
                    <b>
                      2. Does the submission show any evidence of efforts put in
                      to complete the project?
                    </b>
                  </p>
                  <Select
                    list={reasondata2}
                    setValue={setReasonSec}
                    placeHolder="Please Select Reject Reason"
                    value={reasonSec}
                  />
                </Col>
              </Col>
            </div>
            <div className="text-center">
              <Button
                label={"Submit"}
                btnClass={reason && reasonSec ? "primary" : "default"}
                size="small "
                onClick={() => handleReject()}
                disabled={!(reason && reasonSec)}
              />
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default AdminSearchCID;
