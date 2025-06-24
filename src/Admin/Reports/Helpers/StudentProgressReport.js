/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { CSVLink } from "react-csv";
import { getCurrentUser } from "../../../helpers/Utils";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import Select from "../Helpers/Select";
import axios from "axios";

import { notification } from "antd";
import { encryptGlobal } from "../../../constants/encryptDecrypt";
import { stateList, districtList, collegeType } from "../../../RegPage/ORGData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import ReactApexChart from "react-apexcharts";
import { openNotificationWithIcon } from "../../../helpers/Utils";

const StudentProgress = () => {
  const navigate = useNavigate();
  const [district, setdistrict] = React.useState("");
  const [category, setCategory] = useState("");
  const [isDownload, setIsDownload] = useState(false);
  const categoryList = ["All Types", ...collegeType];
  const newstateList = ["All States", ...stateList];
 
  const [studentDetailedReportsData, setstudentDetailedReportsData] = useState(
    []
  );
  const [doughnutChartData, setDoughnutChartData] = useState(null);
  const currentUser = getCurrentUser("current_user");
  const csvLinkRef = useRef();
  const csvLinkRefTable = useRef();
  const dispatch = useDispatch();
  const [combinedArray, setCombinedArray] = useState([]);
  const [downloadTableData, setDownloadTableData] = useState([]);
  const [newFormat, setNewFormat] = useState("");
 
  const [series1, setseries1] = useState([]);
  const [series2, setseries2] = useState([]);
  const [series3, setseries3] = useState([]);
  const [series4, setseries4] = useState([]);
  const [series5, setseries5] = useState([]);
  const [series6, setseries6] = useState([]);
  const [series7, setseries7] = useState([]);
  const [doughnutChartDataBar, setDoughnutChartDataBar] = useState(null);
  const [isloader, setIsloader] = useState(false);

  const [barChart1Data, setBarChart1Data] = useState({
    labels: [],
    datasets: [],
  });
  const [barChart3Data, setBarChart3Data] = useState({
    labels: [],
    datasets: [],
  });
  const [barChart2Data, setBarChart2Data] = useState({
    labels: [],
    datasets: [],
  });
 
  const fiterDistData = [...districtList["Andhra Pradesh"]];
  fiterDistData.unshift("All Districts");

  useEffect(() => {
    fetchChartTableData();
    const newDate = new Date();
    const formattedDate = `${newDate.getUTCDate()}/${
      1 + newDate.getMonth()
    }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    setNewFormat(formattedDate);
  }, []);
  const [totalCount, setTotalCount] = useState([]);

  const tableHeaders = [
    {
      label: "District Name",
      key: "district",
    },
   
    {
      label: "Total No.Of Students enrolled",
      key: "totalStudents",
    },
    {
      label: "No.Of Students completed the Course",
      key: "courseCompleted",
    },
    {
      label: "No.Of Students course In Progress",
      key: "courseINprogesss",
    },
    {
      label: "No.Of students NOT STARTED Course",
      key: "courseNotStarted",
    },
    {
      label: "Course Completion Percentage",
      key: "coursePercentage",
    },
    {
      label: "No.of Teams Submitted Ideas",
      key: "submittedCount",
    },
    {
      label: "No.of Teams Ideas in Draft",
      key: "draftCount",
    },
    {
      label: "No.of Teams Not Stated Idea Submission",
      key: "ideaNotStarted",
    },
  ];
  const teacherDetailsHeaders = [
    {
      label: "Student Full Name",
      key: "studentfullname",
    },
    {
      label: "Gender",
      key: "gender",
    },
    {
      label: "Email Address",
      key: "email",
    },
    {
      label: "Mobile Number",
      key: "mobile",
    },
    {
      label: "College Town",
      key: "college_town",
    },
    {
      label: "College Type",
      key: "college_type",
    },
    {
      label: "College Name",
      key: "college_name",
    },
    {
      label: "Institution District",
      key: "district",
    },
    {
      label: "Branch/Group/Stream",
      key: "branch",
    },
    {
      label: "Roll Number",
      key: "roll_number",
    },
    {
      label: "Year of Study",
      key: "year_of_study",
    },
    {
      label: "Pre Survey Status",
      key: "pre_survey_status",
    },
    {
      label: "Pre Survey Completed Date",
      key: "created_at",
    },
    {
      label: "Course Completion%",
      key: "course_per",
    },
    {
      label: "Course Completion Date",
      key: "course_created_at",
    },
    {
      label: "Course Status",
      key: "user_count",
    },
    {
      label: "Idea Status",
      key: "Idea_status",
    },
    {
      label: "Idea Submitted Date",
      key: "submitted_at",
    },
    {
      label: "Post Survey Status",
      key: "post_survey_status",
    },
    {
      label: "Post Survey Completed Date",
      key: "post_created_at",
    },
  ];
  var chartOption = {
    chart: {
      height: 330,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ["#36A2EB", "#FF6384", "rgb(254, 176, 25)"],
    labels: [
      "Submitted Ideas",
      "In Draft Ideas",
      "Not Started Idea Submission",
    ],
    series: [
      totalCount.submittedCount,
      totalCount.draftCount,
      totalCount.ideaNotStarted,
    ],
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

 

  var sColStacked = {
    chart: {
      height: 700,
      width: 1000,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ["rgb(255, 69, 96)", "rgb(254, 176, 25)", "rgb(0, 227, 150)"],

    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    series: [
      {
        name: "#Not started",
        data: series3,
      },
      {
        name: "#InProgress",
        data: series4,
      },
      {
        name: "#Completed",
        data: series5,
      },
    ],
    xaxis: {
      categories: barChart2Data.labels,
      labels: {
        style: {
          fontSize: "10px",
        },
        formatter: (val) => {
          // Shorten long labels or wrap them by breaking lines
          if (val.length > 15) return val.substring(0, 15) + "..."; // Adjust as necessary
          return val;
        },
      },
      ticks: {
        maxRotation: 80,
        minRotation: 45,
        autoSkip: false,
      },
    },
    yaxis: {
      beginAtZero: true,
      ticks: {
        stepSize: 20,
      },
      labels: {
        formatter: (val) => {
          return val / 1;
        },
      },
    },

    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    fill: {
      opacity: 1,
    },
  };

 

  var radialChart = {
    chart: {
      height: 350,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: [
      "rgba(255, 0, 0, 0.6)",
      "rgba(255, 255, 0, 0.6)",
      "rgba(0, 128, 0, 0.6)",
    ],
    labels: ["Not Started ", "In Progress", "Completed"],
    series: [
      totalCount.courseNotStarted,
      totalCount.courseINprogesss,
      totalCount.courseCompleted,
    ],
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const handleDownload = () => {
    if (!district || !category) {
      notification.warning({
        message:
          "Please select District and College Type before Downloading Reports.",
      });
      return;
    }
    setIsDownload(true);
    fetchData();
  };
  useEffect(() => {
    if (studentDetailedReportsData.length > 0) {
      csvLinkRef.current.link.click();
    }
  }, [studentDetailedReportsData]);
  const fetchData = () => {
   // This function filters  data based on selected district, college_type

    const apiRes = encryptGlobal(
      JSON.stringify({
        district: district,
        college_type: category,
      })
    );
    const config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/reports/studentdetailsreport?Data=${apiRes}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
         
          const preSurveyMap = response.data.data[0].preSurvey.reduce(
            (map, item) => {
              map[item.user_id] = {
                pre_survey_status: item.pre_survey_status,
                created_at: item.created_at,
              };
              return map;
            },
            {}
          );

          
          const postSurveyMap = response.data.data[0].postSurvey.reduce(
            (map, item) => {
              map[item.user_id] = {
                post_survey_status: item.post_survey_status,
                created_at: item.created_at,
              };
              return map;
            },
            {}
          );

        
          const ideaStatusDataMap = response.data.data[0].ideaStatusData.reduce(
            (map, item) => {
              map[item.student_id] = {
                status: item.status,
                submitted_at: item.submitted_at,
              };
              return map;
            },
            {}
          );

          const userTopicDataMap = response.data.data[0].userTopicData.reduce(
            (map, item) => {
              map[item.user_id] = {
                user_count: item.user_count,
                created_at: item.created_at,
              };
              return map;
            },
           
            {}
          );

          const newdatalist = response.data.data[0].summary.map((item) => {
            return {
              ...item,
              pre_survey_status:
                preSurveyMap[item.user_id]?.pre_survey_status || "Not started",
              created_at: preSurveyMap[item.user_id]?.created_at
                ? new Date(
                    preSurveyMap[item.user_id].created_at
                  ).toLocaleDateString("en-GB")
                : null,
              post_survey_status:
                postSurveyMap[item.user_id]?.post_survey_status ||
                "Not started",
              post_created_at: postSurveyMap[item.user_id]?.created_at
                ? new Date(
                    postSurveyMap[item.user_id].created_at
                  ).toLocaleDateString("en-GB")
                : null,

                Idea_status: item.type === 0 ?
                ideaStatusDataMap[item.student_id]?.status || "Not Initiated" : ideaStatusDataMap[item.type]?.status || "Not Initiated",
            
  
  submitted_at:
  item.type === 0
    ? ideaStatusDataMap[item.student_id]?.submitted_at
      ? new Date(ideaStatusDataMap[item.student_id].submitted_at).toLocaleDateString("en-GB")
      : null
    : ideaStatusDataMap[item.type]?.submitted_at
      ? new Date(ideaStatusDataMap[item.type].submitted_at).toLocaleDateString("en-GB")
      : null,

                course_created_at: userTopicDataMap[item.user_id]?.created_at
                ? new Date(
                  userTopicDataMap[item.user_id].created_at
                  ).toLocaleDateString("en-GB")
                : null,
              user_count:
                userTopicDataMap[item.user_id]?.user_count === undefined
                  ? "Not Started"
                  : userTopicDataMap[item.user_id]?.user_count === 26
                  ? "Completed"
                  : "In Progress",
              course_per:
                userTopicDataMap[item.user_id] &&
                typeof userTopicDataMap[item.user_id]?.user_count === "number"
                  ? `${Math.round(
                      (userTopicDataMap[item.user_id]?.user_count / 26) * 100
                    )}%`
                  : `0%`,
            };
          });
          setstudentDetailedReportsData(newdatalist);
          if (response.data.data[0].summary.length > 0) {
            openNotificationWithIcon(
              "success",
              "Report Downloaded Successfully"
            );
          } else {
            openNotificationWithIcon("error", "No Data Found");
          }
         
          setIsDownload(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setIsDownload(false);
      });
  };

  const fetchChartTableData = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + "/reports/studentdetailstable",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          setIsloader(true);
          const summary = response.data.data[0].summary;

          const courseCompleted = response.data.data[0].courseCompleted;
          const courseINprogesss = response.data.data[0].courseINprogesss;
          const draftCount = response.data.data[0].draftCount;
          const submittedCount = response.data.data[0].submittedCount;

          const combinedArray = summary.map((summaryItem) => {
            const district = summaryItem.district;
            const draftCountItem = draftCount.find(
              (item) => item.district === district
            );
            const submittedCountItem = submittedCount.find(
              (item) => item.district === district
            );

            const courseCompletedItem = courseCompleted.find(
              (item) => item.district === district
            );
            const courseINprogesssItem = courseINprogesss.find(
              (item) => item.district === district
            );
            const ideaNotStarted =
              summaryItem.totalstudent -
              ((submittedCountItem ? submittedCountItem.submittedCount : 0) +
                (draftCountItem ? draftCountItem.draftCount : 0));
            const courseNotStarted =
              summaryItem.totalstudent -
              ((courseCompletedItem
                ? courseCompletedItem.studentCourseCMP
                : 0) +
                (courseINprogesssItem
                  ? courseINprogesssItem.studentCourseIN
                  : 0));

            const coursePercentage =
              summaryItem && summaryItem.totalstudent > 0
                ? Math.round(
                    ((courseCompletedItem
                      ? courseCompletedItem.studentCourseCMP
                      : 0) /
                      summaryItem.totalstudent) *
                      100
                  )
                : 0;

            return {
              district,
              draftCount: draftCountItem ? draftCountItem.draftCount : 0,
              submittedCount: submittedCountItem
                ? submittedCountItem.submittedCount
                : 0,
              ideaNotStarted,
              coursePercentage,
              totalStudents: summaryItem ? summaryItem.totalstudent : 0,
              courseCompleted: courseCompletedItem
                ? courseCompletedItem.studentCourseCMP
                : 0,
              courseINprogesss: courseINprogesssItem
                ? courseINprogesssItem.studentCourseIN
                : 0,
              courseNotStarted,
            };
          });
          const total = combinedArray.reduce(
            (acc, item) => {
              acc.district = "Total";
              acc.totalStudents += item.totalStudents;
              acc.courseCompleted += item.courseCompleted;
              acc.courseINprogesss += item.courseINprogesss;
              acc.courseNotStarted =
                acc.totalStudents -
                (acc.courseCompleted + acc.courseINprogesss);
              acc.draftCount += item.draftCount;
              acc.submittedCount += item.submittedCount;
              acc.ideaNotStarted =
                acc.totalStudents - (acc.submittedCount + acc.draftCount);
              return acc;
            },
            {
              district: "None",
              totalTeams: 0,
              totalStudents: 0,
              draftCount: 0,
              submittedCount: 0,
              ideaNotStarted: 0,
              courseCompleted: 0,
              courseINprogesss: 0,
              courseNotStarted: 0,
            }
          );

          const doughnutData = {
            labels: [
              "Draft Ideas",
              "Submitted Ideas",
              "Not Started Idea Submission",
            ],
            datasets: [
              {
                data: [
                  total.draftCount,
                  total.submittedCount,
                  total.ideaNotStarted,
                ],
                backgroundColor: ["#8bcaf4", "#ff99af"],
                hoverBackgroundColor: ["#36A2EB", "#FF6384"],
              },
            ],
          };
          const doughnutDataGraph = {
            labels: ["In progress", "Completed", "Not Started "],
            datasets: [
              {
                data: [
                  total.courseINprogesss,
                  total.courseCompleted,
                  total.courseNotStarted,
                ],
                backgroundColor: [
                  "rgba(255, 0, 0, 0.6)",
                  "rgba(255, 255, 0, 0.6)",
                  "rgba(0, 128, 0, 0.6)",
                ],
                hoverBackgroundColor: ["#e60026", "#ffae42", "#087830"],
              },
            ],
          };
          const stackedBarChartData = {
            labels: combinedArray.map((item) => item.district),
            datasets: [
              {
                label: "No. of Students not started course",
                data: combinedArray.map((item) => item.courseNotStarted),
                backgroundColor: "rgba(255, 0, 0, 0.6)",
              },
              {
                label: "No. of Students course IN progress",
                data: combinedArray.map((item) => item.courseINprogesss),
                backgroundColor: "rgba(255, 255, 0, 0.6)",
              },
              {
                label: "No. of Students Completed Course",
                data: combinedArray.map((item) => item.courseCompleted),
                backgroundColor: "rgba(0, 128, 0, 0.6)",
              },
            ],
          };

          total.coursePercentage = Math.round(
            (total.courseCompleted / total.totalStudents) * 100
          );
          setseries3(stackedBarChartData.datasets[0].data);
          setseries4(stackedBarChartData.datasets[1].data);
          setseries5(stackedBarChartData.datasets[2].data);
          const newcombinedArray = [...combinedArray, total];
          setCombinedArray(combinedArray);
          setDownloadTableData(newcombinedArray);
          setTotalCount(total);
          setDoughnutChartData(doughnutData);
          setBarChart2Data(stackedBarChartData);

          setDoughnutChartDataBar(doughnutDataGraph);
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Student Detailed Report</h4>
              <h6>
                Student Progress - Presurvey , Course, Teams , Post survey
                Status Report
              </h6>
            </div>
          </div>
          <div className="page-btn">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/reports")}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>

        <Container className="RegReports userlist">
          <div className="reports-data mt-2 mb-2">
            <Row className="align-items-center mt-3 mb-2">
             
              <Col md={3}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={fiterDistData}
                    setValue={setdistrict}
                    placeHolder={"Select District"}
                    value={district}
                  />
                </div>
              </Col>
              <Col md={3}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={categoryList}
                    setValue={setCategory}
                    placeHolder={"Select College Type"}
                    value={category}
                  />
                </div>
              </Col>
              <Col
                md={3}
                className="d-flex align-items-center justify-content-center"
              >
                <button
                  onClick={handleDownload}
                  type="button"
                  disabled={isDownload}
                  className="btn btn-primary"
                >
                  {isDownload ? "Downloading" : "Download Report"}
                </button>
              </Col>
            </Row>
            {isloader ? (
              <div className="chart mt-2 mb-2">
                {combinedArray.length > 0 && (
                  <>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                        <div className="card flex-fill default-cover w-100 mb-4">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">Data Analytics</h4>
                           
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-sm-12 col-md-12 col-xl-6 text-center mt-3">
                                <p>
                                  <b>
                                    Idea Submission Status As of {newFormat}
                                  </b>
                                </p>
                                {doughnutChartData && (
                                  <div id="donut-chart">
                                    <ReactApexChart
                                      options={chartOption}
                                      series={chartOption.series}
                                      type="donut"
                                      height={330}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="col-sm-12 col-md-12 col-xl-6 text-center mt-3">
                                <p>
                                  <b>
                                    Students Course Status As of {newFormat}
                                  </b>
                                </p>
                                {doughnutChartDataBar && (
                                  <div id="radial-chart">
                                    <ReactApexChart
                                      options={radialChart}
                                      series={radialChart.series}
                                      type="donut"
                                      height={350}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                        <div className="card flex-fill default-cover w-100 mb-4">
                          <div
                            className="card-header d-flex justify-content-between align-items-center"
                            style={{ borderBottom: "none", paddingBottom: 0 }}
                          >
                            <h4 className="card-title mb-0">
                              District wise Student Progress Stats
                            </h4>
                            <div className="dropdown">
                              <Link
                                to="#"
                                className="view-all d-flex align-items-center"
                              >
                                <button
                                  className="btn mx-2 btn-primary"
                                  type="button"
                                  onClick={() => {
                                    if (downloadTableData) {
                                      setDownloadTableData(null);
                                      csvLinkRefTable.current.link.click();
                                    }
                                  }}
                                >
                                  Get Statistics
                                </button>
                              </Link>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="table-responsive">
                              <table className="table table-striped table-bordered responsive">
                                <thead>
                                  <tr>
                                    <th style={{ color: "#36A2EB" }}>No</th>
                                    <th style={{ color: "#36A2EB" }}>
                                      District Name
                                    </th>
                                   
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                      }}
                                    >
                                      Students Enrolled
                                    </th>
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faChalkboardTeacher}
                                      />{" "}
                                      Course Completed
                                    </th>
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faChalkboardTeacher}
                                      />{" "}
                                      Course InProgress
                                    </th>
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faChalkboardTeacher}
                                      />{" "}
                                      Course NotStarted{" "}
                                    </th>
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faChalkboardTeacher}
                                      />{" "}
                                      Course Completion%
                                    </th>
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      No of Submitted Ideas
                                    </th>
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      No of Ideas in Draft
                                    </th>
                                    <th
                                      style={{
                                        whiteSpace: "wrap",
                                        color: "#36A2EB",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      No of Ideas Not Started
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="text-center">
                                  {combinedArray.map((item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td
                                        style={{
                                          textAlign: "left",
                                          maxWidth: "150px",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          color: "crimson",
                                        }}
                                      >
                                        {item.district}
                                      </td>
                                      <td>{item.totalStudents}</td>
                                      <td>{item.courseCompleted}</td>
                                      <td>{item.courseINprogesss}</td>
                                      <td>{item.courseNotStarted}</td>
                                      <td>{item.coursePercentage}%</td>
                                      <td>{item.submittedCount}</td>{" "}
                                      <td>{item.draftCount}</td>{" "}
                                      <td>{item.ideaNotStarted}</td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td>{}</td>
                                    <td
                                      style={{
                                        color: "crimson",
                                        textAlign: "left",
                                        maxWidth: "150px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {"Total Count"}
                                    </td>
                                    
                                    <td style={{ color: "crimson" }}>
                                      {totalCount.totalStudents}
                                    </td>
                                    <td style={{ color: "crimson" }}>
                                      {totalCount.courseCompleted}
                                    </td>
                                    <td style={{ color: "crimson" }}>
                                      {totalCount.courseINprogesss}
                                    </td>
                                    <td style={{ color: "crimson" }}>
                                      {totalCount.courseNotStarted}
                                    </td>
                                    <td style={{ color: "crimson" }}>
                                      {Math.round(
                                        (totalCount.courseCompleted /
                                          totalCount.totalStudents) *
                                          100
                                      )}
                                      %
                                    </td>
                                    <td style={{ color: "crimson" }}>
                                      {totalCount.submittedCount}
                                    </td>{" "}
                                    <td style={{ color: "crimson" }}>
                                      {totalCount.draftCount}
                                    </td>{" "}
                                    <td style={{ color: "crimson" }}>
                                      {totalCount.ideaNotStarted}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">
                        Student Course Status As of {newFormat}
                      </h5>
                    </div>
                    <div className="card-body">
                      <div id="s-col-stacked" />
                      <ReactApexChart
                        options={sColStacked}
                        series={sColStacked.series}
                        type="bar"
                        height={400}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="spinner-border text-info" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {downloadTableData && (
              <CSVLink
                data={downloadTableData}
                headers={tableHeaders}
                filename={`StudentSummaryReport_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRefTable}
              >
                Download Table CSV
              </CSVLink>
            )}

            {studentDetailedReportsData && (
              <CSVLink
                headers={teacherDetailsHeaders}
                data={studentDetailedReportsData}
                filename={`StudentDetailedReport_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRef}
              >
                Download Table CSV
              </CSVLink>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default StudentProgress;
