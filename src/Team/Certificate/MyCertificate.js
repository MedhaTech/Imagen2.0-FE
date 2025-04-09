/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useRef, useState, useEffect } from "react";
import { Card, Row, Col } from "reactstrap";
// import Layout from '../Layout';
import { Button } from "../../stories/Button";
// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
// import { getInstructions } from '../store/evaluator/action';
import { getCurrentUser, getNormalHeaders } from "../../helpers/Utils";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
// import TCertificate from "./Content";
import jsPDF from "jspdf";
import CourseCertificate from "../../assets/img/finalCourse1.jpg";
import IdeaCertificate from "../../assets/img/FinalIdea1.jpg";
import L2Certificate from "../../assets/img/FinalL11.jpg";

import users from "../../assets/img/Silver.png";
import user1 from "../../assets/img/bronze.png";
import user2 from "../../assets/img/Gold.png";
import { useTranslation } from "react-i18next";

import {
   
    updateStudentBadges,
    updateStudentCertificate,
  } from "../../redux/studentRegistration/actions";
import { Link } from "react-router-dom";
import { getLanguage } from "../../constants/languageOptions";
import { URL, KEY } from "../../constants/defaultValues";

import { encryptGlobal } from "../../constants/encryptDecrypt";
const Instructions = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
  const pdfRef = useRef(null);
  const currentUser = getCurrentUser("current_user");

  const handleCertificateDownload = () => {
    
    const fullName = currentUser?.data[0]?.full_name;
    const collegeName = data?.college_name;
    const finalCollegeName = data?.college_name.length > 34
    ? data?.college_name.slice(0, 34) + "..."
    : data?.college_name;
    const doc = new jsPDF("l", "mm", [298, 211]);
    doc.addImage(CourseCertificate, "JPEG", 0, 0, 298, 211);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor("white");

   
    const fullNameWidth = (doc.getStringUnitWidth(fullName) * doc.getFontSize()) / doc.internal.scaleFactor;
    const x = (298 - fullNameWidth) / 2;
    const y = 110;  
    doc.text(fullName, x, y);

    const collegeNameWidth =
    (doc.getStringUnitWidth(collegeName) * doc.getFontSize()) / doc.internal.scaleFactor;
  const collegeNameY = y + 15; 
  const leftMargin = 85;
  doc.text(finalCollegeName, leftMargin, collegeNameY);

    const certName = `${fullName.replace(/\s+/g, "_")}.pdf`;
    doc.save(certName);
    cerificateData();
   
  };
  const handleCertificateDownload1 = () => {
    const content = pdfRef.current;
    const fullName = currentUser?.data[0]?.full_name;
    const collegeName = data?.college_name;
    const finalCollegeName = data?.college_name.length > 44
      ? data?.college_name.slice(0, 44) + "..."
      : data?.college_name;
    const doc = new jsPDF("l", "mm", [298, 211]);

    doc.addImage(IdeaCertificate, "JPEG", 0, 0, 298, 211);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor("white");

    
    const fullNameWidth = (doc.getStringUnitWidth(fullName) * doc.getFontSize()) / doc.internal.scaleFactor;
    const x = (298 - fullNameWidth) / 2;
    const y = 111;  
    doc.text(fullName, x, y);

    const collegeNameWidth =
    (doc.getStringUnitWidth(finalCollegeName) * doc.getFontSize()) / doc.internal.scaleFactor;
  const collegeNameY = y + 15; 
  const leftMargin = 85;
  doc.text(finalCollegeName, leftMargin, collegeNameY);

    const certName = `${fullName.replace(/\s+/g, "_")}.pdf`;
    doc.save(certName);
  };
  const handleCertificateDownload2 = () => {
   
    const fullName = currentUser?.data[0]?.full_name;
    const collegeName = data?.college_name;
    const doc = new jsPDF("l", "mm", [298, 211]);
    const finalCollegeName = data?.college_name.length > 34
    ? data?.college_name.slice(0, 34) + "..."
    : data?.college_name;
    doc.addImage(L2Certificate, "JPEG", 0, 0, 298, 211);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor("#FFD700");

   
    const fullNameWidth = (doc.getStringUnitWidth(fullName) * doc.getFontSize()) / doc.internal.scaleFactor;
    const x = (298 - fullNameWidth) / 2;
    const y = 107;  
    doc.text(fullName, x, y);

    const collegeNameWidth =
    (doc.getStringUnitWidth(collegeName) * doc.getFontSize()) / doc.internal.scaleFactor;
  const collegeNameY = y + 15; 
  const leftMargin = 85;
  doc.text(finalCollegeName, leftMargin, collegeNameY);
  

    const certName = `${fullName.replace(/\s+/g, "_")}.pdf`;
    doc.save(certName);
   
  };
  const currentUser1 = getCurrentUser("current_user");
  const userID = currentUser?.data[0]?.user_id;
  const [postSurveyStatus, setPostSurveyStatus] = useState("");
  const [ideaStatus, setIdeaStatus] = useState("");

  const [resList, setResList] = useState("");
  const [status, setStatus] = useState("");
  const [score, setScore] = useState("");
  const [surveyDates, setSurveyDates] = useState(null);
  const [courseDate, setCourseDate] = useState(null);
  const [course, setCourse] = useState(false);
  const [data, setData] = useState({});

  const language = useSelector(
    (state) => state?.studentRegistration?.studentLanguage
  );
  const user = currentUser.data[0]?.student_id;
  // console.log(courseDate,"course");
   useEffect(() => {
      mentorViewApi();
    }, [user]);
  useEffect(() => {
    stuCoursePercent();
      Ideas();
    submittedApi();
    // certificateApi();
    apiData(language);
  }, []);
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
        //   console.log(response, "res");
          setData(response?.data?.data[0]);
          }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
 
  
  const apiData = (language) => {
    const locale = getLanguage(language);

    let enDataone = encryptGlobal("4");
    let axiosConfig = getNormalHeaders(KEY.User_API_Key);

    let enParamData = encryptGlobal(
      JSON.stringify({
        role: "STUDENT",
        locale,
        user_id: userID,
      })
    );
    axiosConfig["params"] = {
      Data: enParamData,
    };

    axios
      .get(`${URL.getPostSurveyList}/${enDataone}`, axiosConfig)
      .then((postSurveyRes) => {
        if (postSurveyRes?.status == 200) {
          // console.log(postSurveyRes,"response");
          setPostSurveyStatus(postSurveyRes.data.data[0].progress);
        }
      })
      .catch((err) => {
        return err.response;
      });
  };
  const cerificateData = () => {
   
    let enParamData = encryptGlobal(
      JSON.stringify(
      currentUser?.data[0]?.user_id,
      )
    );
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/students/${enParamData}/studentCertificate`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          console.log(response, "res");
          // setData(response?.data?.data[0]);
          }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const certificateApi = () => {
    const Param = encryptGlobal(JSON.stringify(currentUser?.data[0]?.user_id));
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/students/certificateDates/${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.data.length > 0) {
            const postSurveyDate =
              response?.data?.data[0]?.postSurvey[0]?.created_at;
            const courseDateValue =
              response?.data?.data[0]?.course[0]?.created_at;

            setSurveyDates(postSurveyDate || null);
            setCourseDate(courseDateValue || null);
          } else {
            console.log("No data available:", response.data.data);
            setSurveyDates(null);
            setCourseDate(null);
          }
        }
      })
      .catch(function (error) {
        // if (error.response.status === 404) {
        //   //   seterror4( true);
        // }
      });
  };
  const TeamId = currentUser?.data[0]?.type_id === 0 ? currentUser?.data[0]?.student_id : currentUser?.data[0]?.type_id;
  const submittedApi = () => {
    const Param = encryptGlobal(
        JSON.stringify({
            student_id: TeamId
          })
    );
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/submittedDetails?Data=${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response.data.data);
          if (response.data.data && response.data.data.length > 0) {
            const data = response.data.data[0];

            setIdeaStatus(response?.data?.data[0]?.status);
          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
          //   seterror4( true);
        }
      });
  };

  const stuCoursePercent = () => {
    const corseApi = encryptGlobal(
      JSON.stringify({
        user_id: currentUser?.data[0]?.user_id,
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/dashboard/stuCourseStats?Data=${corseApi}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response,"111");
          const per =
            response.data.data[0].topics_completed_count ===
            response.data.data[0].all_topics_count;
          setCourse(per);
        } else {
          setCourse(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const Ideas = async (resList) => {
    const corseApi1 = encryptGlobal(
      JSON.stringify({
        student_id: TeamId
      })
    );
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/students/IsCertificate?Data=${corseApi1}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    await axios(config)
      .then(function (response) {
        if (response.status === 200) {
          const res = response.data.data[0];
          // console.log(response,"res");
          setScore(res.score);

          setStatus(res.status);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
// console.log(course,"cc",ideaStatus,"idea");

const isEligible = status === "SUBMITTED" && score !== null && score >= 6.5;
//   const handleCertificateDownload1 = () => {
//     handlePrintCertificate();
//   };
  const componentRef = useRef();
  const handlePrintCertificate = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${currentUser?.data[0]?.full_name}`,
  });
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
              <div
                className="employee-grid-profile"
                style={{ height: "300px" }}
              >
                <div className="profile-info">
                  <img
                    src={users}
                    alt="Profile"
                    style={{ width: "150px", height: "150px" }}
                  />
                     <h5>For Course Completion</h5>
                  <div style={{ textAlign: "left", marginTop: "1rem" }}>
                    <Link
                      to="#"
                      className="btn btn-lg text-bold"
                      style={{
                        // backgroundColor: "#007e33",
                        backgroundColor: course === true ? "#007e33" : "#aaa",
                        color: "#fff",
                        padding: "1rem",
                        borderRadius: "20px",
                      }}
                      disabled={!(course === true)}
                    //   onClick={handleCertificateDownload}
                      onClick={course === true ? handleCertificateDownload : (e) => e.preventDefault()}
                    >
                      👉 DOWNLOAD CERTIFICATE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
              <div
                className="employee-grid-profile"
                style={{ height: "300px" }}
              >
                <div className="profile-info">
                  <img
                    src={user1}
                    alt="Profile"
                    style={{ width: "150px", height: "150px" }}
                  />
                  <h5>For Successful Idea Submission</h5>
                  <div style={{ textAlign: "left", marginTop: "1rem" }}>
                    <Link
                      to="#"
                      className="btn btn-lg text-bold"
                      style={{
                        // backgroundColor: "#007e33",
                        backgroundColor: ideaStatus === "SUBMITTED" ? "#007e33" : "#aaa",
                        color: "#fff",
                        padding: "1rem",
                        borderRadius: "20px",
                      }}
                      disabled={ideaStatus !== "SUBMITTED"}
                    //   onClick={handleCertificateDownload1}
                      onClick={ideaStatus === "SUBMITTED" ? handleCertificateDownload1 : (e) => e.preventDefault()}
                    >
                      👉 DOWNLOAD CERTIFICATE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
              <div
                className="employee-grid-profile"
                style={{ height: "300px" }}
              >
                <div className="profile-info">
                  <img
                    src={user2}
                    alt="Profile"
                    style={{ width: "150px", height: "150px" }}
                  />
                  <h5>For Being Selected For Phase 2</h5>
                  <div style={{ textAlign: "left", marginTop: "1rem" }}>
                    <Link
                      to="#"
                      className="btn btn-lg text-bold"
                      style={{
                        // backgroundColor: "#007e33",
                        backgroundColor: isEligible ? "#007e33" : "#aaa",
                        color: "#fff",
                        padding: "1rem",
                        borderRadius: "20px",
                      }}
                      onClick={isEligible ? handleCertificateDownload2 : (e) => e.preventDefault()}
                    >
                      👉 DOWNLOAD CERTIFICATE
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Instructions;
