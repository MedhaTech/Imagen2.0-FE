/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { Button } from "../../../stories/Button";
import { CSVLink } from "react-csv";
import { getCurrentUser } from "../../../helpers/Utils";
import { useNavigate, Link } from "react-router-dom";
import {
  getDistrictData,
  getStateData,
  getFetchDistData,
} from "../../../redux/studentRegistration/actions";
import { ArrowRight } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import Select from "../Helpers/Select";
import axios from "axios";
// import '../reports.scss';
import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { categoryValue } from "../../Schools/constentText";
import { notification } from "antd";
import { encryptGlobal } from "../../../constants/encryptDecrypt";
import { stateList, districtList } from "../../../RegPage/ORGData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMale,
  faFemale,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import ReactApexChart from "react-apexcharts";
import { openNotificationWithIcon } from "../../../helpers/Utils";

const StudentProgress = () => {
  const navigate = useNavigate();
  const [district, setdistrict] = React.useState("");
  const [selectstate, setSelectState] = React.useState("");
  const [category, setCategory] = useState("");
  const [isDownload, setIsDownload] = useState(false);
  const categoryData = ["All Categories", "ATL", "Non ATL"];
  const newstateList = ["All States", ...stateList];
  // const categoryData =
  //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];
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
  const [atl, setAtl] = useState("");
  const [nonAtl, setNonAtl] = useState("");
  const [series1, setseries1] = useState([]);
  const [series2, setseries2] = useState([]);
  const [series3, setseries3] = useState([]);
  const [series4, setseries4] = useState([]);
  const [series5, setseries5] = useState([]);
  const [series6, setseries6] = useState([]);
  const [series7, setseries7] = useState([]);

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
  const fullStatesNames = newstateList;
  const fiterDistData = districtList[selectstate];
  // useEffect(() => {
  //     dispatch(getStateData());
  // }, []);
  useEffect(() => {
    // if (selectstate !== '') {
    //     dispatch(getFetchDistData(selectstate));
    // }
    // setdistrict('');
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
      label: "State Name",
      key: "state",
    },
    {
      label: "Total No.Of TEAMS created",
      key: "totalTeams",
    },
    {
      label: "Total No.Of STUDENTS enrolled",
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
  ];
  const teacherDetailsHeaders = [
    {
      label: "UDISE CODE",
      key: "organization_code",
    },
    {
      label: "School Name",
      key: "organization_name",
    },
    {
      label: "School Type/Category",
      key: "category",
    },
    {
      label: "State",
      key: "state",
    },
    {
      label: "District",
      key: "district",
    },
    // {
    //   label: "City",
    //   key: "city",
    // },
  
    {
      label: "Teacher Name",
      key: "full_name",
    },
    {
      label: "Teacher Email",
      key: "username",
    },
    {
      label: "Teacher Gender",
      key: "gender",
    },
    {
      label: "Teacher Contact",
      key: "mobile",
    },
    {
      label: "Teacher WhatsApp Contact",
      key: "whatapp_mobile",
    },
  
    {
        label: 'Team Name',
        key: 'team_name'
    },
    {
        label: 'Student Name',
        key: 'studentfullname'
    },
    // {
    //     label: 'Student Username',
    //     key: 'Student Username'
    // },
    {
        label: 'Age',
        key: 'Age'
    },
    {
        label: 'Gender',
        key: 'studentgender'
    },
    {
        label: 'Class',
        key: 'Grade'
    },
    {
        label: 'Disability status',
        key: 'disability'
    },
    {
        label: "Pre Survey Status",
        key: "pre_survey_status",
      },
     
      {
        label: "Post Survey Status",
        key: "post_survey_status",
      },
    {
        label: 'Course Status',
        key: 'user_count'
    },
    // {
    //     label: 'No.of Teams Idea Submitted',
    //     key: 'submittedcout'
    // },
    // {
    //     label: 'No.of Teams Idea in Draft',
    //     key: 'draftcout'
    // },
    // {
    //     label: 'No.of Teams Idea NOt Initiated',
    //     key: 'ideanotIN'
    // }
  ];

  // useEffect(() => {
  //     dispatch(getDistrictData());
  //     fetchChartTableData();
  //     const newDate = new Date();
  //     const formattedDate = `${newDate.getUTCDate()}/${
  //         1 + newDate.getMonth()
  //     }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
  //     setNewFormat(formattedDate);
  // }, []);

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
      totalCount.maleStudents,
      totalCount.femaleStudents,
      totalCount.otherStudents,
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

  var options = {
    chart: {
      height: 500,
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["rgb(0, 143, 251)", "rgb(0, 227, 150)"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    series: [
      {
        name: "# Teams",
        data: series1,
      },
      {
        name: "# Students",
        data: series2,
      },
    ],

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

    xaxis: {
      categories: barChart1Data.labels,
      ticks: {
        maxRotation: 80,
        autoSkip: false,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
  };

  var sColStacked = {
    chart: {
      height: 500,
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
      ticks: {
        maxRotation: 80,
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

  var optionsStudent = {
    chart: {
      height: 500,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    colors: ["rgb(0, 143, 251)", "rgb(0, 227, 150)"],
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    series: [
      {
        name: "#NonATL Students",
        type: "column",
        data: series6,
      },
      {
        name: "#ATL Students",
        type: "line",
        data: series7,
      },
    ],
    stroke: {
      width: [0, 4],
    },

    xaxis: {
      categories: barChart3Data.labels,
      ticks: {
        maxRotation: 80,
        autoSkip: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "NonATL Student",
        },
      },
      {
        opposite: true,
        title: {
          text: "ATL Student",
        },
      },
    ],
  };

  var radialChart = {
    chart: {
      height: 350,
      type: "radialBar",
      toolbar: {
        show: false,
      },
    },
    colors: ["rgb(0, 227, 150)", "rgb(254, 176, 25)", "rgb(255, 69, 96)"],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function () {
              return totalCount.totalStudents;
            },
          },
        },
      },
    },
    series: [
      Math.round((totalCount.courseCompleted * 100) / totalCount.totalStudents),
      Math.round(
        (totalCount.courseINprogesss * 100) / totalCount.totalStudents
      ),
      Math.round(
        ((totalCount.totalStudents -
          (totalCount.courseCompleted + totalCount.courseINprogesss)) *
          100) /
          totalCount.totalStudents
      ),
    ],
    labels: ["Completed", "InProgress", "NotStarted"],
  };

  // useEffect(() => {
  //     nonAtlCount();
  // }, []);
  const nonAtlCount = () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL + `/reports/studentATLnonATLcount`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (res) {
        if (res.status === 200) {
          var mentorStuArray = [];
          res &&
            res.data &&
            res.data.data &&
            res.data.data.map((students, index) => {
              var key = index + 1;
              return mentorStuArray.push({ ...students, key });
            });
          setAtl(mentorStuArray);

          // setAtl(response.data.data);
          const barStudentData = {
            labels: mentorStuArray.map((item) => item.state),
            datasets: [
              {
                label: "No.of  ATL Students",
                data: mentorStuArray.map((item) => item.ATL_Student_Count),
                backgroundColor: "rgba(255, 0, 0, 0.6)",
              },
              {
                label: "No.of Non ATL Students",
                data: mentorStuArray.map((item) => item.NONATL_Student_Count),
                backgroundColor: "rgba(75, 162, 192, 0.6)",
              },
            ],
          };
          setBarChart3Data(barStudentData);
          // console.log(barStudentData,"barStudentData");
          setseries7(barStudentData.datasets[0].data);
          setseries6(barStudentData.datasets[1].data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleDownload = () => {
    if (
      !selectstate ||
      //  || !district
      !category
    ) {
      notification.warning({
        message:
          "Please select a state and category type before Downloading Reports.",
      });
      return;
    }
    setIsDownload(true);
    fetchData();
  };
  useEffect(() => {
    if (studentDetailedReportsData.length > 0) {
      console.log("Performing operation with the updated data.");
      csvLinkRef.current.link.click();

    }
  }, [studentDetailedReportsData]);
  const fetchData = () => {
    const apiRes = encryptGlobal(
      JSON.stringify({
        state: selectstate,
        district: district === "" ? "All Districts" : district,
        category: category,
      })
    );
    // console.log(selectstate,district,category);
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
        //   console.log(response, "res");
          // console.log(response.data.data[0].preSurvey,"preSurvey");
          // console.log(response.data.data[0].Username,"Username");
          // console.log(response.data.data[0],"response");
          const preSurveyMap = response.data.data[0].preSurvey.reduce(
            (map, item) => {
              map[item.user_id] = item.pre_survey_status;
              return map;
            },
            {}
          );

          const postSurveyMap = response.data.data[0].postSurvey.reduce(
            (map, item) => {
              map[item.user_id] = item.post_survey_status;
              return map;
            },
            {}
          );
          const mentorMap = response.data.data[0].mentorData.reduce(
            (map, item) => {
              map[item.mentor_id] = item;

              return map;
            },
            {}
          );

          const teamDataMap = response.data.data[0].teamData.reduce(
            (map, item) => {
              map[item.mentor_id] = item;
              return map;
            },
            {}
          );

          const userTopicDataMap = response.data.data[0].userTopicData.reduce(
            (map, item) => {
              map[item.
                mentorUserId
                ] = item.user_count;
              return map;
            },
            {}
          );
          const mentorUsernameMap = response.data.data[0].mentorUsername.reduce(
            (map, item) => {
              map[item.user_id] = item;
              return map;
            },
            {}
          );
         
          const newdatalist = response.data.data[0].summary.map((item) => {
            const mentorData = teamDataMap[item.team_id];
            const mentStats = mentorMap[item.team_id];
            const mentUser =mentorUsernameMap[item.team_id];
 
            return {
              ...item,
              pre_survey_status: preSurveyMap[item.user_id] || "Not started",
              post_survey_status: postSurveyMap[item.user_id] || "Not started",
              username: mentUser?.username,
              user_count: userTopicDataMap[item.user_id] === 0 ? "Not Started" : userTopicDataMap[item.user_id] === 31 ? "Completed" : "In Progress",
              team_name: mentorData?.team_name,
              team_email: mentorData?.team_email,
              mentor_id: mentorData?.mentor_id,
              category: mentStats?.category,
              district: mentStats?.district,

              full_name: mentStats?.full_name,
              gender: mentStats?.gender,
              mobile: mentStats?.mobile,
              organization_code: mentStats?.organization_code,
              organization_name: mentStats?.organization_name,
              state: mentStats?.state,
              whatapp_mobile: mentStats?.whatapp_mobile,
            };
          });
        //   console.log(newdatalist, "fina");
          setstudentDetailedReportsData(newdatalist);
        //   csvLinkRef.current.link.click();
        //   console.log(studentDetailedReportsData,"ttt");
          openNotificationWithIcon("success", "Report Downloaded Successfully");
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
          // console.log(response,"view");
          const summary = response.data.data[0].summary;
          const studentCountDetails = response.data.data[0].studentCountDetails;

          const courseCompleted = response.data.data[0].courseCompleted;
          const courseINprogesss = response.data.data[0].courseINprogesss;

          const combinedArray = summary.map((summaryItem) => {
            const state = summaryItem.state;
            const totalTeams = summaryItem.totalTeams;
            // const teamCountItem = teamCount.find(
            //     (item) => item.state === state
            // );
            const studentCountItem = studentCountDetails.find(
              (item) => item.state === state
            );
            const courseCompletedItem = courseCompleted.find(
              (item) => item.state === state
            );
            const courseINprogesssItem = courseINprogesss.find(
              (item) => item.state === state
            );
            const courseNotStarted =
              summaryItem.totalTeams -
              ((courseCompletedItem
                ? courseCompletedItem.studentCourseCMP
                : 0) +
                (courseINprogesssItem
                  ? courseINprogesssItem.studentCourseIN
                  : 0));
            // console.log(courseNotStarted,"11");

            const coursePercentage =
              studentCountItem && studentCountItem.totalstudent > 0
                ? Math.round(
                    ((courseCompletedItem
                      ? courseCompletedItem.studentCourseCMP
                      : 0) /
                      studentCountItem.totalstudent) *
                      100
                  )
                : 0;
            return {
              state,
              coursePercentage,
              totalTeams,
              totalStudents: studentCountItem
                ? studentCountItem.totalstudent
                : 0,
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
              acc.state = "Total";
              // acc.totalReg += item.totalReg;
              acc.totalTeams += item.totalTeams;
              acc.totalStudents += item.totalStudents;
              // acc.maleStudents += item.maleStudents;
              // acc.femaleStudents += item.femaleStudents;
              // acc.otherStudents += item.otherStudents;
              acc.courseCompleted += item.courseCompleted;
              acc.courseINprogesss += item.courseINprogesss;
              // acc.courseNotStarted += item.courseNotStarted;
              acc.courseNotStarted =
                acc.totalStudents -
                (acc.courseCompleted + acc.courseINprogesss);
              return acc;
            },
            {
              state: "None",
              // totalReg: 0,
              totalTeams: 0,
              totalStudents: 0,

              // maleStudents: 0,
              // femaleStudents: 0,
              // otherStudents : 0,
              courseCompleted: 0,
              courseINprogesss: 0,
              courseNotStarted: 0,
            }
          );
          const doughnutData = {
            labels: ["Male", "Female"],
            datasets: [
              {
                data: [total.maleStudents, total.femaleStudents],
                backgroundColor: ["#8bcaf4", "#ff99af"],
                hoverBackgroundColor: ["#36A2EB", "#FF6384"],
              },
            ],
          };

          const barData = {
            labels: combinedArray.map((item) => item.state),
            datasets: [
              {
                label: "No.of Students Enrolled",
                data: combinedArray.map((item) => item.totalStudents),
                backgroundColor: "rgba(255, 0, 0, 0.6)",
              },
              {
                label: "No. of Teams created",
                data: combinedArray.map((item) => item.totalTeams),
                backgroundColor: "rgba(75, 162, 192, 0.6)",
              },
            ],
          };
          setseries2(barData.datasets[0].data);
          setseries1(barData.datasets[1].data);

          const stackedBarChartData = {
            labels: combinedArray.map((item) => item.state),
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
          setseries3(stackedBarChartData.datasets[0].data);
          setseries4(stackedBarChartData.datasets[1].data);
          setseries5(stackedBarChartData.datasets[2].data);
          const newcombinedArray = [...combinedArray, total];
          setCombinedArray(combinedArray);
          setDownloadTableData(newcombinedArray);
          setDoughnutChartData(doughnutData);
          setBarChart1Data(barData);
          setBarChart2Data(stackedBarChartData);
          setTotalCount(total);
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
                    list={fullStatesNames}
                    setValue={setSelectState}
                    placeHolder={"Select State"}
                    value={selectstate}
                  />
                </div>
              </Col>
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
                    list={categoryData}
                    setValue={setCategory}
                    placeHolder={"Select Category"}
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
            <div className="chart mt-2 mb-2">
              {combinedArray.length > 0 && (
                <>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                      <div className="card flex-fill default-cover w-100 mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h4 className="card-title mb-0">Data Analytics</h4>
                          <div className="dropdown">
                            <Link
                              to="#"
                              className="view-all d-flex align-items-center"
                            >
                              View All
                              <span className="ps-2 d-flex align-items-center">
                                <ArrowRight className="feather-16" />
                              </span>
                            </Link>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-sm-12 col-md-12 col-xl-6 text-center mt-3">
                              <p>
                                <b>
                                  Students as per Idea Submission {newFormat}
                                </b>
                              </p>
                              {/* {doughnutChartData && (
                                                    <div id="donut-chart" >
                                                        <ReactApexChart
                                                        options={chartOption}
                                                        series={chartOption.series}
                                                        type="donut"
                                                        height={330}
                                                        />
                                                    </div>
                                                )} */}
                            </div>
                            <div className="col-sm-12 col-md-12 col-xl-6 text-center mt-3">
                              <p>
                                <b>Students Course Status As of {newFormat}</b>
                              </p>
                              {totalCount && (
                                <div id="radial-chart">
                                  <ReactApexChart
                                    options={radialChart}
                                    series={radialChart.series}
                                    type="radialBar"
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
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h4 className="card-title mb-0">
                            State Student Progress Stats
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
                                    // setIsDownloading(true);
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
                            <table className="table table-borderless recent-transactions">
                              <thead>
                                <tr>
                                  <th style={{ color: "#36A2EB" }}>#</th>
                                  <th style={{ color: "#36A2EB" }}>
                                    State Name
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    #Teams Created
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    #Students Enrolled
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
                                      {item.state}
                                    </td>

                                    <td>{item.totalTeams}</td>
                                    <td>{item.totalStudents}</td>

                                    <td>{item.courseCompleted}</td>
                                    <td>{item.courseINprogesss}</td>
                                    <td>{item.courseNotStarted}</td>
                                    <td>{item.coursePercentage}%</td>
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
                                    {totalCount.totalTeams}
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
                      Teams, Students Enrolled As of {newFormat}
                    </h5>
                  </div>
                  <div className="card-body">
                    <div id="s-line-area" />
                    <ReactApexChart
                      options={options}
                      series={options.series}
                      type="line"
                      height={400}
                    />
                  </div>
                </div>
              </div>
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
              {/* <div className="col-md-12">
                        <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">No.of Students Enrolled from ATL v/s Non ATL Schools{' '}{newFormat}</h5>
                        </div>
                        <div className="card-body">
                            <div id="mixed-chart" />
                            <ReactApexChart
                            options={optionsStudent}
                            series={optionsStudent.series}
                            type="line"
                            height={400}
                            />
                        </div>
                        </div>
                    </div> */}

              {downloadTableData && (
                <CSVLink
                  data={downloadTableData}
                  headers={tableHeaders}
                  filename={`StudentDetailedSummaryReport_${newFormat}.csv`}
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
                  filename={`StudentProgressDetailedReport_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRef}
                >
                  Download Teacherdetailed CSV
                </CSVLink>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default StudentProgress;
