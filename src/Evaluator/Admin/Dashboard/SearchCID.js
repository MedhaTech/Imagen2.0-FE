/* eslint-disable no-useless-escape */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef, useEffect } from "react";
import "../Evaluation/ViewSelectedIdea/ViewSelectedideas.scss";
import { Button } from "../../../stories/Button";
// import LinkComponent from '../Pages/LinkComponent';
import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../../../helpers/Utils";
import { useTranslation } from "react-i18next";
import { Card } from "react-bootstrap";

import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Modal } from "react-bootstrap";
import axios from "axios";
import Select from "../Evaluation/Pages/Select";
import { useNavigate, useLocation } from "react-router-dom";
import RatedCard from "./RatedCard";
import jsPDF from "jspdf";
import { FaDownload, FaHourglassHalf } from "react-icons/fa";
// import DetailToDownload from '../../Challenges/DetailToDownload';
import html2canvas from "html2canvas";
import { Row, Col, Form, Label } from "reactstrap";
import { useReactToPrint } from "react-to-print";
import { encryptGlobal } from "../../../constants/encryptDecrypt";
import LinkComponent from "../Challenges/pages/LinkComponent";
const SearchCID = () => {
  const { t } = useTranslation();
  // const multiOrg = localStorage.getItem("multiOrgData");
  const navigate = useNavigate();
  const location = useLocation();
  const { multiOrgData, diesCode } = location.state || {};
  // const level = new URLSearchParams(search).get('level');
  const currentUser = getCurrentUser("current_user");
  const [teamResponse, setTeamResponse] = React.useState({});
  const [images,setImages] = React.useState([]);

  const [isReject, setIsreject] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [reasonSec, setReasonSec] = React.useState("");
  // console.log(teamResponse,"data");
  // console.log(multiOrgData, "11", diesCode, "22");
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
    if (multiOrgData) {
      setTeamResponse(multiOrgData);
      setImages(JSON.parse(multiOrgData.prototype_image));
    }
  }, [multiOrgData]);

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

  const handleL1Round = (handledText) => {
    const currentTime = new Date().toLocaleString();

    const body = JSON.stringify({
      status: handledText == "accept" ? "SELECTEDROUND1" : "REJECTEDROUND1",
      team_id: teamResponse?.team_id,
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
      multiOrgData?.team_name ? multiOrgData?.team_name : "temp"
    }_IdeaSubmission`,
  });

  const files = teamResponse?.prototype_image
    ? teamResponse?.prototype_image.split(",")
    : [];
  // const downloadFile = (item) => {
  //   fetch(item)
  //     .then((response) => {
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(new Blob([blob]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       const parts = item.split("/");
  //       link.setAttribute("download", parts[parts.length - 1]);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.parentNode.removeChild(link);
  //     })
  //     .catch((error) => {
  //       console.error("Error downloading file:", error);
  //     });
  // };
  const downloadFile = (item) => {
    // const link = document.createElement('a');
    // link.href = item;
    // link.download = 'upload.pdf';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    fetch(item)
      .then((response) => {
        // Convert the response to a blob
        return response.blob();
      })
      .then((blob) => {
        // Create a download link
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        const fileName = item.split("/");
        // .pop().replace(/[\[\]"]/g, "");
        link.setAttribute("download", fileName);
        document.body.appendChild(link);

        // const parts = item.split("/");
        // link.setAttribute("download", parts[parts.length - 1]);
        link.click();
        window.URL.revokeObjectURL(url); // Clean up the URL object
        document.body.removeChild(link);
        console.log("Downloading file from:", item, fileName, "filename");
        // link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };
  console.log(typeof(images), "Image");
 
  return (
    <div className="page-wrapper">
      <div className="content">
        {teamResponse ? (
          <>
            <div style={{ display: "none" }}>
              {/* <DetailToDownload
                            ref={componentRef}
                            ideaDetails={props?.ideaDetails}
                            teamResponse={teamResponse}
                            level={'Draft'}
                        /> */}
            </div>
            {/* <div id="pdfId" style={{ display: 'none' }}>
                        <DetailToDownload
                            ideaDetails={props?.ideaDetails}
                            teamResponse={teamResponse}
                            level={level}
                        />
                    </div> */}
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
                    <div className="mx-2 pointer d-flex align-items-center">
                      {/* {!pdfLoader ? (
                                            <FaDownload
                                                size={22}
                                                onClick={async () => {
                                                    await downloadPDF();
                                                }}
                                            />
                                        ) : (
                                            <FaHourglassHalf size={22} />
                                        )} */}
                      {/* Add */}
                      {/* <FaDownload
                                            size={22}
                                            onClick={handlePrint}
                                        /> */}
                    </div>
                  </div>
                  <div className="col-lg-12 mt-3">
                    <Row className="col-lg-12">
                      <Col className="md-6">
                        <Card
                          bg="white"
                          text="dark"
                          className="mb-2"
                          style={{ height: "150px" }}
                        >
                          <Card.Body>
                            <label
                              htmlFor="teams"
                              className=""
                              style={{ fontSize: "16px" }}
                            >
                              <b>Organization Details</b>
                            </label>
                            <Card.Text
                              style={{
                                marginTop: "10px",
                                marginBottom: "20px",
                              }}
                            >
                              {/* {regInst} */}
                              <span>Organization Code :</span>
                              <span>
                                &nbsp;
                                {teamResponse?.organization_code}
                              </span>
                              <br />
                              <span>Organization Name :</span>
                              <span>
                                &nbsp;
                                {teamResponse?.organization_name}
                              </span>
                              <br />

                              <span>District :</span>
                              <span>
                                &nbsp;
                                {teamResponse?.district}
                              </span>
                              <br />
                              <span>State :</span>
                              <span>
                                &nbsp;
                                {teamResponse?.state}
                              </span>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col className="md-6">
                        <Card
                          bg="white"
                          text="dark"
                          className="mb-2"
                          style={{ height: "150px" }}
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
                              {/* {regInst} */}
                              <span>Team Name :</span>
                              <span>
                                &nbsp;
                                {teamResponse?.team_name}
                              </span>
                              <br />
                              <span>Team Members :</span>
                              <span>
                                &nbsp;
                                {teamResponse &&
                                  teamResponse.team_members &&
                                  teamResponse.team_members.join(", ")}
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
                          fontSize: "1.2rem",
                        }}
                      >
                        Idea Submission Language
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "50px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.language}
                      </p>
                    </div>
                  </div>
                </div>
                <h4>Section-1: Problem Identification</h4>
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
                        1.Theme
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
                        2.Focus Area
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
                        {teamResponse.focus_area}
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
                        3. Title of your idea (Think of a proper name. Don't
                        describe the solution or problem statement here.)
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
                        4. Write down your Problem statement
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
                        {teamResponse.problem_statement}
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
                        5. List the Causes of the problem
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
                        {teamResponse.causes}
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
                        6. List the Effects of the problem
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
                        {teamResponse.effects}
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
                        7. In which places in your community did you find this
                        problem?
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
                        {teamResponse.community}
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
                        8. Who all are facing this problem?
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
                        {teamResponse.facing}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <h4>Section-2: Solution & User Analysis</h4>
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
                        9. Describe the solution to the problem your team found.
                        Explain your solution clearly - how does it work, who is
                        it helping, and how will it solve the problem.
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
                        {teamResponse.solution}
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
                        10. Apart from your teacher, how many
                        people/stakeholders did you speak to to understand or
                        improve your problem or solution?
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
                        {teamResponse.stakeholders}
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
                        11. Pick the actions your team did in your problem
                        solving journey (You can choose multiple options)
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
                        {teamResponse.problem_solving &&
                          JSON.parse(teamResponse.problem_solving).map(
                            (item, index) => (
                              <span key={index}>
                                {item}
                                {index !==
                                  JSON.parse(teamResponse.problem_solving)
                                    .length -
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
                        12. Mention the feedback that your team got and the
                        changes you have made, if any, to your problem or
                        solution.
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
                        {teamResponse.feedback}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                <h4>Section-3: Prototyping</h4>
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
                        13. Descriptive Document/Image of your prototype
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
                      {
                        <LinkComponent item={images} />
                      }
                      {/* {files.length > 0 &&
                        files.map((item, i) => (
                          <div key={i}>
                            <a
                              key={i}
                              className="badge mb-2 bg-info p-3 ms-3"
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => downloadFile(item)}
                            >
                              {item.split("/").pop()}
                            </a>
                          </div>
                        ))} */}
                      {/* {files.length > 0 &&
        files.map((item, i) => {
          const fileName = item.split("/").pop().replace(/[\[\]"]/g, "");
          return (
            <div key={i}>
              <a
                className="badge mb-2 bg-info p-3 ms-3"
                onClick={() => downloadFile(item)}
                style={{ cursor: "pointer" }}
               
              >
                {fileName}
              </a>
            </div>
          );
        })} */}
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
                        14. Clear Video Explaining your Solution
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
                        15. Did your team complete and submit the workbook to
                        your school Guide teacher?
                      </b>
                    </div>
                    <div
                      className="bg-white p-3 mb-3"
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        height: "50px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        {teamResponse.workbook}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4 order-lg-1 order-0 p-2 h-100 mt-3 status_info_col"
                //              style={{
                //   position: "relative",
                // }}
              >
                {multiOrgData?.verified_status !== "" &&
                  multiOrgData?.verified_status !== null && (
                    <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                      {multiOrgData?.evaluation_status ? (
                        <p
                          style={{ fontSize: "1.2rem" }}
                          className={`${
                            multiOrgData?.evaluation_status == "SELECTEDROUND1"
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
                          {multiOrgData?.evaluation_status == "SELECTEDROUND1"
                            ? "Accepted"
                            : "Rejected"}
                        </p>
                      ) : (
                        ""
                      )}

                      {multiOrgData?.evaluated_name ? (
                        <p className="text-center">
                          <span className="text-bold">Evaluated By : </span>{" "}
                          {multiOrgData?.evaluated_name || ""}
                        </p>
                      ) : (
                        ""
                      )}
                      {/* {multiOrgData?.evaluator_ratings && (
  <div className="row mb-1 mt-2">
    <div className="col-5">
      <p className="my-0 fw-bold">Evaluated By :</p>
    </div>
    <div className="col-7">
      {multiOrgData.evaluator_ratings.map((rating, i) => (
        <p className="my-0 text-muted" key={i}>
          {`${i + 1}: ${rating.rated_evaluated_name}`}
        </p>
      ))}
    </div>
  </div>
)} */}
                      {/* 
                      {multiOrgData?.evaluator_ratings && (
  <div className="text-center">
    <p className="text-bold">Evaluated By:</p>
    {multiOrgData.evaluator_ratings.map((rating, i) => (
      <p className="my-0 text-muted" key={i}>
        {i + 1}: {rating.rated_evaluated_name}
      </p>
    ))}
  </div>
)} */}

                      {multiOrgData?.evaluation_status == "REJECTEDROUND1" && (
                        <>
                          <p className="text-center">
                            <span className="text-bold">
                              Rejected Reason 1 :{" "}
                            </span>{" "}
                            {multiOrgData?.rejected_reason || ""}
                          </p>
                          <p className="text-center">
                            <span className="text-bold">
                              Rejected Reason 2 :{" "}
                            </span>{" "}
                            {multiOrgData?.rejected_reasonSecond || ""}
                          </p>
                        </>
                      )}
                      {/* Added */}
                      {multiOrgData?.verified_status !== "" &&
                        multiOrgData?.verified_status !== null && (
                          <>
                            {/* Check if evaluation_status is null */}
                            {multiOrgData?.evaluation_status == null ? (
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
                            ) : multiOrgData?.evaluation_status ===
                                "SELECTEDROUND1" &&
                              multiOrgData?.evaluator_ratings?.length === 0 ? (
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
                            ) : multiOrgData?.evaluation_status ===
                                "REJECTEDROUND1" &&
                              multiOrgData?.evaluator_ratings?.length === 0 ? (
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

                {multiOrgData?.evaluator_ratings.length > 0 && (
                  <RatedCard details={multiOrgData} />
                )}
                  {(multiOrgData?.final_result === "0" ||  multiOrgData?.final_result === "1" )&& (
                   <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                      {multiOrgData?.final_result ? (
                        <p
                          style={{ fontSize: "1.2rem" }}
                          className={`${
                            multiOrgData?.final_result == "0"
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
                          {multiOrgData?.final_result == "0"
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
              <p
                style={{ fontSize: "1rem", margin: "1rem" }}
                className="fw-bold"
              >
                Submitted By :{" "}
                {teamResponse.initiated_name
                  ? teamResponse.initiated_name
                  : "-"}
              </p>
              <p
                style={{ fontSize: "1rem", margin: "1rem" }}
                className="fw-bold"
              >
                Submitted At :{" "}
                {teamResponse.submitted_at
                  ? moment(teamResponse.submitted_at).format("DD-MM-YYYY")
                  : "-"}
              </p>
            </div>
            <br />
            <div style={{ display: "flex" }}>
              {/* <p
                            style={{ fontSize: '1.5rem', margin: '1rem' }}
                            className="fw-bold"
                        >
                            Verified By :{' '}
                            {teamResponse.verified_name
                                ? teamResponse.verified_name
                                : '-'}
                        </p> */}
              <p
                style={{ fontSize: "1rem", margin: "1rem" }}
                className="fw-bold"
              >
                Verified At :{" "}
                {teamResponse.verified_at
                  ? moment(teamResponse.verified_at).format("DD-MM-YYYY ")
                  : "-"}
              </p>
            </div>
            <div></div>
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
          // {...props}
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

          <Modal.Body>
            <div className="my-3 text-center">
              <h4 className="mb-sm-4 mb-1">
                Please Select the reason for rejection.
              </h4>
              <Col>
                <Col className="m-3">
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
                <Col className="m-3">
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

export default SearchCID;
