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
import { stateList, districtList, collegeType } from "../../../RegPage/ORGData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMale,
  faFemale,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import ReactApexChart from "react-apexcharts";
import { openNotificationWithIcon } from "../../../helpers/Utils";

const TeacherProgressDetailed = () => {
  const navigate = useNavigate();
  const [district, setdistrict] = React.useState("");
  const [selectstate, setSelectState] = React.useState("");
  const [category, setCategory] = useState("");
  const [isDownload, setIsDownload] = useState(false);
  const categoryList = ["All Types", ...collegeType];
  const [chartTableData, setChartTableData] = useState([]);
  const [chartTableData1, setChartTableData1] = useState([]);
  const [filterType, setFilterType] = useState("");

  const filterOptions = ["Registered", "Not Registered"];
  const newstateList = ["All States", ...stateList];
  // const categoryData =
  //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];
  const [mentorDetailedReportsData, setmentorDetailedReportsData] = useState(
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
  const [registeredChartData, setRegisteredChartData] = useState(null);
  const [downloadData, setDownloadData] = useState(null);
  const csvLinkRefNotRegistered = useRef();

  const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
    useState(null);
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
  // const fiterDistData = districtList["Andhra Pradesh"];
  const fiterDistData = [...districtList["Andhra Pradesh"]];
  fiterDistData.unshift("All Districts");

  useEffect(() => {
    fetchChartTableData();
    const newDate = new Date();
    const formattedDate = `${newDate.getUTCDate()}/${
      1 + newDate.getMonth()
    }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    setNewFormat(formattedDate);
  }, [selectstate]);
  const [totalCount, setTotalCount] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteresData, setFilteresData] = useState([]);
  const tableHeaders = [
    {
      label: "District Name",
      key: "district",
    },
    {
      label: "Total Registered Institutions",
      key: "instReg",
    },
    {
      label: "Engineering Colleges",
      key: "EngineeringColleges_Count",
    },
    {
      label: "Polytechnic College",
      key: "PolytechnicColleges_Count",
    },
    {
      label: "Degree Colleges",
      key: "DegreeColleges_Count",
    },
    {
      label: "Govt Junior College",
      key: "GovtJuniorCollege_Count",
    },
    {
      label: "Govt ITI College",
      key: "GovtITICollege_Count",
    },
    {
      label: "Govt Polytechnic College",
      key: "GovtPolytechnicCollege_Count",
    },
    {
      label: "Govt Degree College",
      key: "GovtDegreeCollege_Count",
    },
    {
      label: "Social Welfare College",
      key: "SocialWelfareCollege_Count",
    },
    {
      label: "Tribal Welfare College",
      key: "TribalWelfareCollege_Count",
    },
    {
      label: "Private College",
      key: "PrivateCollege_Count",
    },
    {
      label: "Others",
      key: "Other_Count",
    },
  ];
  const teacherDetailsHeaders = [
    {
      label: "Institution User Full Name",
      key: "full_names",
    },
    {
      label: "Email Address",
      key: "usernames",
    },
    {
      label: "Mobile Number",
      key: "mobile",
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
      label: "District",
      key: "district",
    },
    {
      label: "Date of Registration",
      key: "created_at",
    },
    {
      label: "Total Institution Users",
      key: "instuser_Count",
    },
  ];

  const notRegHeaders = [
    {
      label: "District",
      key: "district",
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
      label: "College Town",
      key: "college_town",
    },
    {
      label: "No of Students Registered",
      key: "studentRegCount",
    },
  ];

  // const chartOption = {
  //   maintainAspectRatio: false,
  //   legend: {
  //     position: "bottom",
  //     labels: {
  //       fontColor: "black",
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       labels: {
  //         generateLabels: function (chart) {
  //           return chart.data.labels.map(function (label, i) {
  //             const value = chart.data.datasets[0].data[i];
  //             const backgroundColor = chart.data.datasets[0].backgroundColor[i];
  //             return {
  //               text: label + ": " + value,
  //               fillStyle: backgroundColor,
  //             };
  //           });
  //         },
  //       },
  //     },
  //   },
  // };

  var options = {
    chart: {
      height: 700,
      width: 1000,
      type: "bar",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#4361ee", "#888ea8"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    series: [
      {
        name: "Registered Institutions",
        data: series1,
      },
    ],
    yaxis: {
      beginAtZero: true,
      ticks: {
        stepSize: 10,
      },
      labels: {
        formatter: (val) => {
          return val / 1;
        },
      },
    },

    xaxis: {
      categories: barChart1Data.labels,
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

    legend: {
      position: "top",
      horizontalAlign: "left",
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
              return totalCount.totalReg;
            },
          },
        },
      },
    },
    series: [
      Math.round((totalCount.courseCompleted * 100) / totalCount.totalReg),
      Math.round((totalCount.courseINcompleted * 100) / totalCount.totalReg),
      Math.round(
        ((totalCount.totalReg -
          (totalCount.courseCompleted + totalCount.courseINcompleted)) *
          100) /
          totalCount.totalReg
      ),
    ],
    labels: ["Completed", "InProgress", "NotStarted"],
  };

  const handleDownload = () => {
    if (!district || !category || !filterType) {
      notification.warning({
        message:
          "Please select District, FilterType and College Type before Downloading Reports.",
      });
      return;
    }
    setIsDownload(true);
    fetchData(filterType);
  };
  const fetchData = (item) => {
    const apiRes = encryptGlobal(
      JSON.stringify({
        district: district,
        college_type: category,
      })
    );
    const apiNotReg = encryptGlobal(
      JSON.stringify({
        district: district,
        college_type: category,
      })
    );
    const url =
      item === "Registered"
        ? `/reports/instRegList?Data=${apiRes}`
        : item === "Not Registered"
        ? `/reports/instNonRegList?Data=${apiNotReg}`
        : "";
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          if (item === "Registered") {
            const Data = response?.data?.data || [];

            const formattedData = Data.map((item) => ({
              ...item,
              mobile: item.mobiles.join(", "),
            }));

            setFilteredData(formattedData);
            setDownloadData(formattedData);
            if (response?.data.count > 0) {
              openNotificationWithIcon(
                "success",
                `${filterType} Report Downloaded Successfully`
              );
            } else {
              openNotificationWithIcon("error", "No Data Found");
            }
            // csvLinkRef.current.link.click();
          } else if (item === "Not Registered") {
            setFilteresData(response?.data?.data || []);
            setDownloadNotRegisteredData(response?.data?.data || []);
            if (response?.data.count > 0) {
              openNotificationWithIcon(
                "success",
                `${filterType} Report Downloaded Successfully`
              );
            } else {
              openNotificationWithIcon("error", "No Data Found");
            }
            // csvLinkRefNotRegistered.current.link.click();
          }
          // console.log(response, "22");

          // const chartTable = response?.data?.data || [];

          // setChartTableData1(chartTable);
          // // console.log(chartTableData1,"data");
          // if (response.data.count > 0) {
          //   openNotificationWithIcon(
          //     'success',
          //     "Report Downloaded Successfully"
          //   );
          // } else {
          //   openNotificationWithIcon('error', 'No Data Found');
          // }
          // csvLinkRef.current.link.click();
          setIsDownload(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setIsDownload(false);
      });
  };
  // useEffect(() => {
  //   if (chartTableData1.length > 0) {
  //     console.log("Performing operation with the updated data.");
  //     csvLinkRef.current.link.click();

  //   }
  // }, [chartTableData1]);
  useEffect(() => {
    if (filteredData.length > 0) {
      setDownloadData(filteredData);
      csvLinkRef.current.link.click();
    }
    if (filteresData.length > 0) {
      setDownloadNotRegisteredData(filteresData);
      csvLinkRefNotRegistered.current.link.click();
      console.log("Performing operation with the updated data.");
    }
  }, [filteredData, filteresData]);
  const fetchChartTableData = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + "/reports/instsummary",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          const chartTableData = response?.data?.data || [];
          // added for download report //
          const updatedChartTableData = chartTableData.map((item) => {
            if (item.GovtDegreeCollege_Count === undefined)
              item.GovtDegreeCollege_Count = 0;
            if (item.GovtPolytechnicCollege_Count === undefined)
              item.GovtPolytechnicCollege_Count = 0;
            if (item.GovtITICollege_Count === undefined)
              item.GovtITICollege_Count = 0;
            if (item.GovtJuniorCollege_Count === undefined)
              item.GovtJuniorCollege_Count = 0;
            if (item.GovtTribalWelfareResidentialCollege_Count === undefined)
              item.GovtTribalWelfareResidentialCollege_Count = 0;
            if (item.GovtSocialWelfareResidentialCollege_Count === undefined)
              item.GovtSocialWelfareResidentialCollege_Count = 0;
            if (item.PrivateDegreeCollege_Count === undefined)
              item.PrivateDegreeCollege_Count = 0;
            if (item.PrivatePolytechnicCollege_Count === undefined)
              item.PrivatePolytechnicCollege_Count = 0;
            if (item.PrivateITICollege_Count === undefined)
              item.PrivateITICollege_Count = 0;
            if (item.PrivateJuniorCollege_Count === undefined)
              item.PrivateJuniorCollege_Count = 0;
            if (item.EngineeringColleges_Count === undefined)
              item.EngineeringColleges_Count = 0;
            if (item.PolytechnicColleges_Count === undefined)
              item.PolytechnicColleges_Count = 0;
            if (item.DegreeColleges_Count === undefined)
              item.DegreeColleges_Count = 0;
            if (item.Other_Count === undefined) item.Other_Count = 0;

            return item;
          });
          const totals = updatedChartTableData.reduce(
            (acc, curr) => {
              acc.district = "Total";
              (acc.instReg += curr.instReg || 0),
                (acc.GovtDegreeCollege_Count +=
                  curr.GovtDegreeCollege_Count || 0),
                (acc.GovtPolytechnicCollege_Count +=
                  curr.GovtPolytechnicCollege_Count || 0),
                (acc.GovtITICollege_Count += curr.GovtITICollege_Count || 0),
                (acc.GovtJuniorCollege_Count +=
                  curr.GovtJuniorCollege_Count || 0),
                (acc.GovtTribalWelfareResidentialCollege_Count +=
                  curr.GovtTribalWelfareResidentialCollege_Count || 0);
              (acc.GovtSocialWelfareResidentialCollege_Count +=
                curr.GovtSocialWelfareResidentialCollege_Count || 0),
                (acc.PrivateDegreeCollege_Count +=
                  curr.PrivateDegreeCollege_Count || 0),
                (acc.PrivatePolytechnicCollege_Count +=
                  curr.PrivatePolytechnicCollege_Count || 0),
                (acc.PrivateITICollege_Count +=
                  curr.PrivateITICollege_Count || 0),
                (acc.PrivateJuniorCollege_Count +=
                  curr.PrivateJuniorCollege_Count || 0);
              (acc.EngineeringColleges_Count +=
                curr.EngineeringColleges_Count || 0);
              (acc.PolytechnicColleges_Count +=
                curr.PolytechnicColleges_Count || 0);
              (acc.DegreeColleges_Count += curr.DegreeColleges_Count || 0);
              acc.Other_Count += curr.Other_Count || 0;

              return acc;
            },
            {
              district: "None",
              instReg: 0,
              GovtDegreeCollege_Count: 0,
              GovtPolytechnicCollege_Count: 0,
              GovtITICollege_Count: 0,
              GovtJuniorCollege_Count: 0,
              GovtTribalWelfareResidentialCollege_Count: 0,
              GovtSocialWelfareResidentialCollege_Count: 0,
              PrivateDegreeCollege_Count: 0,
              PrivatePolytechnicCollege_Count: 0,
              PrivateITICollege_Count: 0,
              PrivateJuniorCollege_Count: 0,
              EngineeringColleges_Count: 0,
              PolytechnicColleges_Count: 0,
              DegreeColleges_Count: 0,
              Other_Count: 0,
            }
          );

          const chartTableDataWithTotals = [...updatedChartTableData, totals];
          const GraphfilteredData = updatedChartTableData.filter(
            (item) => item.state !== "Total"
          );
          setChartTableData(chartTableDataWithTotals);
          setDownloadTableData(chartTableDataWithTotals);
          const barData = {
            labels: GraphfilteredData.map((item) => item.district),
            datasets: [
              {
                label: "Registered Institutions",
                data: GraphfilteredData.map((item) => item.instReg),
                backgroundColor: "#ffa31a",
              },
            ],
          };

          setRegisteredChartData({
            labels: [
              "Govt - Degree College",
              "Govt - Polytechnic College",
              "Govt - ITI College",
              "Govt - Junior College",
              "Govt - Tribal Welfare Residential College",
              "Govt - Social Welfare Residential College",
              "Private - Degree College",
              "Private - Polytechnic College",
              "Private - ITI College",
              "Private - Junior College",
              "Engineering Colleges",
              "Polytechnic Colleges",
              "Degree Colleges",
              "Other",
            ],
            datasets: [
              {
                data: [
                  totals.GovtDegreeCollege_Count,
                  totals.GovtPolytechnicCollege_Count,
                  totals.GovtITICollege_Count,
                  totals.GovtJuniorCollege_Count,
                  totals.GovtTribalWelfareResidentialCollege_Count,
                  totals.GovtSocialWelfareResidentialCollege_Count,
                  totals.PrivateDegreeCollege_Count,
                  totals.PrivatePolytechnicCollege_Count,
                  totals.PrivateITICollege_Count,
                  totals.PrivateJuniorCollege_Count,
                  totals.EngineeringColleges_Count,
                  totals.PolytechnicColleges_Count,
                  totals.DegreeColleges_Count,
                  totals.Other_Count,
                ],
                backgroundColor: [
                  "#85e085",
                  "#ffcc80",
                  "#A0522D",
                  "#8bcaf4",
                  "#ff99af",
                  "#ff0000",
                  "#800000",
                  "#da9100",
                  "#800080",
                  "#4682B4",
                  "#FFD700",
                  "#7601fb",
                  "#39ff14",
                  "#a50b5e",
                  "#f75394",
                ],
                hoverBackgroundColor: [
                  "#85e085",
                  "#ffcc80",
                  "#A0522D",
                  "#8bcaf4",
                  "#ff99af",
                  "#ff0000",
                  "#800000",
                  "#da9100",
                  "#800080",
                  "#4682B4",
                  "#FFD700",
                  "#7601fb",
                  "#39ff14",
                  "#a50b5e",
                  "#f75394",
                ],
              },
            ],
          });

          setBarChart1Data(barData);
          setseries1(barData.datasets[0].data);

          // const newcombinedArray = [...combinedArray,total];
          // setDownloadTableData(newcombinedArray);
          setTotalCount(totals);
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };
  const chartOption = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false, // Ensure legend is completely hidden
      },
      tooltip: {
        enabled: true, // Tooltips will still work on hover
      },
    },
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Institutions</h4>
              <h6>Registration Status Report</h6>
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
              <Col md={3}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={filterOptions}
                    setValue={setFilterType}
                    placeHolder={"Select Filter"}
                    value={filterType}
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
              {chartTableData.length > 0 && (
                <>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                      <div className="card flex-fill default-cover w-100 mb-4">
                        <div
                          className="card-header d-flex justify-content-between align-items-center"
                          style={{ borderBottom: "none", paddingBottom: 0 }}
                        >
                          <h4 className="card-title mb-0">
                            District wise Registered Institution Stats
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
                                    No of Reg Institutions
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt - Degree College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt - Polytechnic College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt - ITI College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt - Junior College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt - Tribal Welfare Residential College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt - Social Welfare Residential College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Private - Degree College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Private - Polytechnic College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Private - ITI College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Private - Junior College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Engineering Colleges
                                  </th>{" "}
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Polytechnic Colleges
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Degree Colleges
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Other
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-center">
                                {chartTableData.map((item, index) => (
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
                                    <td>{item.instReg}</td>
                                    <td>
                                      {item.GovtDegreeCollege_Count
                                        ? item.GovtDegreeCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.GovtPolytechnicCollege_Count
                                        ? item.GovtPolytechnicCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.GovtITICollege_Count
                                        ? item.GovtITICollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.GovtJuniorCollege_Count
                                        ? item.GovtJuniorCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.GovtTribalWelfareResidentialCollege_Count
                                        ? item.GovtTribalWelfareResidentialCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.GovtSocialWelfareResidentialCollege_Count
                                        ? item.GovtSocialWelfareResidentialCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.PrivateDegreeCollege_Count
                                        ? item.PrivateDegreeCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.PrivatePolytechnicCollege_Count
                                        ? item.PrivatePolytechnicCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.PrivateITICollege_Count
                                        ? item.PrivateITICollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.PrivateJuniorCollege_Count
                                        ? item.PrivateJuniorCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.EngineeringColleges_Count
                                        ? item.EngineeringColleges_Count
                                        : "0"}
                                    </td>{" "}
                                    <td>
                                      {item.PolytechnicColleges_Count
                                        ? item.PolytechnicColleges_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.DegreeColleges_Count
                                        ? item.DegreeColleges_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.Other_Count
                                        ? item.Other_Count
                                        : "0"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">
                          Registered Institutions As of {newFormat}
                        </h5>
                      </div>
                      <div className="card-body">
                        <div id="s-col-stacked" />
                        <ReactApexChart
                          options={options}
                          series={options.series}
                          type="bar"
                          // type="area"
                          height={400}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                      <div className="card flex-fill default-cover w-100 mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h4 className="card-title mb-0">Data Analytics</h4>
                        </div>
                        {/* <div className="card-body">
                        <div className="row">
                          <div className="col-md-12 text-center mt-3">
                            <p>
                              <b>
                                Overall Category wise Registered Institutions As of{" "}
                                {newFormat}
                              </b>
                            </p>
                          </div>
                          <div className="col-md-12 doughnut-chart-container">
                            {registeredChartData && (
                              <Doughnut
                                data={registeredChartData}
                                options={chartOption}
                              />
                            )}
                          </div>
                         
                        </div>
                      </div> */}
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-12 text-center mt-3">
                              <p style={{ fontSize: "24px" }}>
                                <b>
                                  Overall Category wise Registered Institutions
                                  As of {newFormat}
                                </b>
                              </p>
                            </div>

                            {/* Labels with counts (Formatted using chart options legend) */}
                            <div className="col-md-6 d-flex align-items-center justify-content-center">
                              {registeredChartData &&
                                registeredChartData.labels && (
                                  <ul className="list-unstyled">
                                    {registeredChartData.labels.map(
                                      (label, index) => (
                                        <li key={index} className="mb-2">
                                          <span
                                            className="badge"
                                            style={{
                                              backgroundColor:
                                                registeredChartData.datasets[0]
                                                  .backgroundColor[index],
                                              color: "#fff",
                                              padding: "5px 10px",
                                              borderRadius: "5px",
                                              marginRight: "10px",
                                              minWidth: "100px",
                                              display: "inline-block",
                                              textAlign: "center",
                                              fontSize: "16px",
                                            }}
                                          >
                                            {label}
                                          </span>
                                          <b style={{ fontSize: "16px" }}>
                                            :{" "}
                                            {
                                              registeredChartData.datasets[0]
                                                .data[index]
                                            }
                                          </b>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                            </div>

                            {/* Doughnut Chart */}
                            <div className="col-md-6 doughnut-chart-container">
                              {registeredChartData && (
                                //         <Doughnut
                                //             data={registeredChartData}
                                //             height={300}
                                //             width={300}
                                // options={chartOption}

                                //         />
                                <div
                                  style={{ width: "400px", height: "400px" }}
                                >
                                  <Doughnut
                                    data={registeredChartData}
                                    options={chartOption}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {downloadTableData && (
                <CSVLink
                  data={downloadTableData}
                  headers={tableHeaders}
                  filename={`InstitutionRegistrationSummaryReport_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRefTable}
                >
                  Download Table CSV
                </CSVLink>
              )}

              {downloadData && (
                <CSVLink
                  data={downloadData}
                  headers={teacherDetailsHeaders}
                  filename={`Institution_${filterType}Report_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRef}
                  // onDownloaded={() => {
                  //     setIsDownloading(false);
                  //     setDownloadComplete(true);
                  // }}
                >
                  Download CSV
                </CSVLink>
              )}
              {downloadNotRegisteredData && (
                <CSVLink
                  data={downloadNotRegisteredData}
                  headers={notRegHeaders}
                  filename={`Institution_${filterType}Report_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRefNotRegistered}
                  // onDownloaded={() => {
                  //     setIsDownloading(false);
                  //     setDownloadComplete(true);
                  // }}
                >
                  Download Not Registered CSV
                </CSVLink>
              )}
              {/* {chartTableData1 && (
                <CSVLink
                  headers={teacherDetailsHeaders}
                  data={chartTableData1}
                  filename={`InstitutionRegistrationDetailedReport_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRef}
                >
                  Download Teacherdetailed CSV
                </CSVLink>
              )} */}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TeacherProgressDetailed;
