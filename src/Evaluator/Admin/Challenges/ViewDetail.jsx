/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef, useEffect } from "react";
import "./ViewSelectedChallenges.scss";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { encryptGlobal } from "../../../constants/encryptDecrypt";
import axios from "axios";

import { Button } from "../../../stories/Button";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import LinkComponent from "./pages/LinkComponent";

import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import { Col, Container, Row } from "reactstrap";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import Select from "./pages/Select";
import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../../../helpers/Utils";
const ViewDetail = (props) => {
  const { search } = useLocation();
 
  const currentUser = getCurrentUser("current_user");
  const [teamResponse, setTeamResponse] = React.useState([]);
  const [images, setImages] = React.useState([]);

  const { t } = useTranslation();
  const [isReject, setIsreject] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [reasonSec, setReasonSec] = React.useState("");

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
    if (props?.ideaDetails) {
      setTeamResponse(props?.ideaDetails);
      setImages(JSON.parse(props?.ideaDetails.prototype_image));
    }
  }, [props]);

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
    // this function accept / reject the Idea //

    const body = JSON.stringify({
     status: handledText == "accept" ? "SELECTEDROUND1" : "REJECTEDROUND1",
      rejected_reason: handledText == "reject" ? reason : "",
      rejected_reasonSecond: handledText == "reject" ? reasonSec : "",
    });
    const challId = encryptGlobal(
      JSON.stringify(props?.ideaDetails?.challenge_response_id)
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
        props?.setIsDetail(false);
        props?.handleclickcall();
       
      })
      .catch(function (error) {
        openNotificationWithIcon("error", error?.response?.data?.message);
      });
  };

  const handleReject = () => {
    if (reason && reasonSec) {
      handleAlert("reject");
      setIsreject(false);
    }
  };
  const [pdfLoader, setPdfLoader] = React.useState(false);

  const componentRef = useRef();

 
  return (
    <div>
      {teamResponse ? (
        <>
         
          <div className="row idea_detail_card">
            <div className="col-12 p-0">
              <div className="row">
                <div className="col-lg-6">
                  <Row>
                    <Col>
                      <h4 className="mb-md-4 mb-3">
                        Theme :
                        <span className="text-capitalize">
                          {props?.ideaDetails?.theme?.toLowerCase() || ""}
                        </span>
                      </h4>
                    </Col>
                    <Col>
                      <h4 className="mb-md-4 mb-3">
                        CID :
                        <span className="text-capitalize">
                          {props?.ideaDetails.challenge_response_id || ""}
                        </span>
                      </h4>
                    </Col>
                  </Row>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div className="ms-auto me-sm-3 p-0">
                    <Button
                      btnClass="primary"
                      size="small"
                      label="Back to List"
                      onClick={() => props?.setIsDetail(false)}
                    />
                  </div>
                  <div className="ms-auto me-sm-3 p-0">
                    <Button
                      btnClass={props?.currentRow > 1 ? "primary" : "default"}
                      size="small"
                      label={"Previous"}
                      onClick={() => props?.handlePrev()}
                      disabled={props?.currentRow == 1}
                    />
                  </div>
                  <div className="ms-auto me-sm-3 p-0">
                    <Button
                      btnClass={
                        props?.dataLength != props?.currentRow
                          ? "primary"
                          : "default"
                      }
                      size="small"
                      label={"Next"}
                      onClick={() => props?.handleNext()}
                      disabled={props?.dataLength == props?.currentRow}
                    />
                  </div>
                 
                </div>
                <div className="col-lg-12 mt-1">
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
                            <span style={{fontWeight:'bold'}}>College Type :</span>
                            <span>
                              &nbsp;
                              {teamResponse.college_type}
                            </span>
                            <br />
                            <span style={{fontWeight:'bold'}}>College Name :</span>
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
                          
                            <span style={{fontWeight:'bold'}}>Team Members :</span>
                            <span>
                              &nbsp;
                              {teamResponse &&
                                teamResponse.team_members &&
                                teamResponse.team_members.join(", ")}
                            </span>
                            <br />

                            <span style={{fontWeight:'bold'}}>District :</span>
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
                              JSON.parse(teamResponse.stage).length - 1 && ", "}
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
                      8. How unique is your idea compared to existing solutions?
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
                        marginBottom: "1rem",
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
                                JSON.parse(teamResponse.confident).length - 1 &&
                                ", "}
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
                      14. Upload images/documents & video links related to your
                      Idea.(total size limit : 10 MB)
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
          

            {props?.ideaDetails?.status === "SUBMITTED" &&
              props?.ideaDetails?.verified_status !== null &&
              props?.ideaDetails?.verified_status !== "" && (
                <div className="col-lg-4 order-lg-1 order-0 p-2 h-100 mt-3 status_info_col">
                  <div className="level-status-card card border p-md-5 p-3 mb-3 me-lg-0 me-md-3">
                    {props?.ideaDetails?.evaluation_status ? (
                      <p
                        style={{ fontSize: "1.2rem" }}
                        className={`${
                          props?.ideaDetails?.evaluation_status ==
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
                        {props?.ideaDetails?.evaluation_status ==
                        "SELECTEDROUND1"
                          ? "Accepted"
                          : "Rejected"}
                      </p>
                    ) : (
                      ""
                    )}

                    {props?.ideaDetails?.evaluated_name ? (
                      <p className="text-center">
                        <span className="text-bold">Evaluated By : </span>{" "}
                        {props?.ideaDetails?.evaluated_name || ""}
                      </p>
                    ) : (
                      ""
                    )}

                   
                    {props?.ideaDetails?.evaluation_status ==
                      "REJECTEDROUND1" && (
                      <>
                        <p className="text-center">
                          <span className="text-bold">Rejected Reason 1: </span>{" "}
                          {props?.ideaDetails?.rejected_reason || ""}
                        </p>
                        <p className="text-center">
                          <span className="text-bold">Rejected Reason 2: </span>{" "}
                          {props?.ideaDetails?.rejected_reasonSecond || ""}
                        </p>
                      </>
                    )}
                    {props?.ideaDetails?.evaluation_status ? (
                      props?.ideaDetails?.evaluation_status ==
                      "SELECTEDROUND1" ? (
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
                      ) : (
                        <button
                          className="btn px-5 py-2 btn-success"
                          onClick={() => {
                            handleAlert("accept");
                            setReason("");
                            setReasonSec("");
                          }}
                        >
                          <span>Accept</span>
                        </button>
                      )
                    ) : (
                      <>
                        {props?.names !== "Draft" && (
                          <>
                            <button
                              className="btn px-5 py-2 btn-danger mb-2"
                              onClick={() => {
                                setIsreject(true);
                                setReason("");
                                setReasonSec("");
                              }}
                            >
                              <span>Reject</span>
                            </button>
                            <button
                              className="btn px-5 py-2 btn-success mb-2"
                              onClick={() => {
                                handleAlert("accept");
                                setReason("");
                                setReasonSec("");
                              }}
                            >
                              <span>Accept</span>
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
          </div>

          <div>
            <Button
              btnClass="primary"
              size="small"
              label="Back"
              onClick={() => {
                props?.setIsDetail(false);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <h2 className="my-auto text-center mt-5">Details Not Available.</h2>
          <div className="text-center mt-5">
            <Button
              btnClass="primary"
              size="small"
              label="Back"
              onClick={() => {
                props?.setIsDetail(false);
              }}
            />
          </div>
        </>
      )}
      <Modal
        show={isReject}
        onHide={() => setIsreject(false)}
        {...props}
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
          maxHeight: window.innerWidth < 768 ? '80vh' : '60vh',
          height: window.innerWidth < 768 ? '80vh' : '60vh',    
      }} >
          <div className="my-3 text-center">
            <h3 className="mb-sm-4 mb-2">
              Please Select the reason for rejection.
            </h3>
            <Col>
              <Col className="m-5">
                <p className="text-left">
                  <b>1. Novelty & Usefulness</b>{" "}
                  <span required style={{ color: "red" }}>
                    *
                  </span>
                </p>
                <Select
                  list={selectData}
                  setValue={setReason}
                  placeHolder="Please Select Reject Reason 1"
                  value={reason}
                />
              </Col>
              <Col className="m-5">
                <p className="text-left">
                  <b>
                    2. Does the submission show any evidence of efforts put in
                    to complete the project?
                  </b>{" "}
                  <span required style={{ color: "red" }}>
                    *
                  </span>
                </p>
                <Select
                  list={reasondata2}
                  setValue={setReasonSec}
                  placeHolder="Please Select Reject Reason 2"
                  value={reasonSec}
                />
              </Col>
            </Col>
          </div>
          <div className="text-center">
            <Button
              label={"Reject"}
              btnClass={reason && reasonSec ? "primary" : "default"}
              size="small "
              onClick={() => handleReject()}
              disabled={!(reason && reasonSec)}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewDetail;
