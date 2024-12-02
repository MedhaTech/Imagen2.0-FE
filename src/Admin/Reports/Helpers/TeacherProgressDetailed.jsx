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
  // const fiterDistData = districtList["Telangana"];
  const fiterDistData = [...districtList["Telangana"]];
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
      label: 'Institution User Full Name',
      key: 'full_name'
  },
  {
      label: 'Email Address',
      key: 'username'
  },
  {
      label: 'Mobile Number',
      key: 'mobile'
  },
  {
      label: 'College Type',
      key: 'college_type'
  },
  {
      label: 'College Name',
      key: 'college_name'
  },
    {
      label: "District",
      key: "district",
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
    labels: ["Male", "Female", "Others"],
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
    if (!district || !category) {
      notification.warning({
        message:
           'Please select District and College Type before Downloading Reports.'
      });
      return;
    }
    setIsDownload(true);
    fetchData();
  };
  const fetchData = () => {
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
        `/reports/instRegList?Data=${apiRes}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "22");

          const chartTable = response?.data?.data || [];
        
          setChartTableData1(chartTable);
          // console.log(chartTableData1,"data");
          if (response.data.count > 0) {
            openNotificationWithIcon(
              'success',
              "Report Downloaded Successfully"
            );
          } else {
            openNotificationWithIcon('error', 'No Data Found');
          }
          // csvLinkRef.current.link.click();
          setIsDownload(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setIsDownload(false);
      });
  };
  useEffect(() => {
    if (chartTableData1.length > 0) {
      console.log("Performing operation with the updated data.");
      csvLinkRef.current.link.click();

    }
  }, [chartTableData1]);
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
        //   console.log(response, "whole");
          const chartTableData = response?.data?.data || [];
          const totals = chartTableData.reduce(
            (acc, curr) => {
                acc.district = "Total";
              (acc.instReg += curr.instReg || 0),
                (acc.GovtJuniorCollege_Count += curr.GovtJuniorCollege_Count || 0),
                acc.GovtITICollege_Count += curr.GovtITICollege_Count || 0;
                (acc.GovtPolytechnicCollege_Count += curr.GovtPolytechnicCollege_Count || 0),
                (acc.GovtDegreeCollege_Count += curr.GovtDegreeCollege_Count || 0),
                (acc.SocialWelfareCollege_Count +=
                    curr.SocialWelfareCollege_Count || 0),
                (acc.TribalWelfareCollege_Count += curr.TribalWelfareCollege_Count || 0),
                (acc.PrivateCollege_Count += curr.PrivateCollege_Count || 0);
                (acc.Other_Count += curr.Other_Count || 0);

               
              return acc;
            },
            {
              district: "None",
              instReg:0,
              GovtJuniorCollege_Count:0,
              GovtPolytechnicCollege_Count:0,
              GovtDegreeCollege_Count:0,
              SocialWelfareCollege_Count: 0,
              TribalWelfareCollege_Count:0,
              GovtITICollege_Count: 0,
              PrivateCollege_Count:0,
              Other_Count:0,
            }
          );
          // console.log(totals,"1");
          const chartTableDataWithTotals = [...chartTableData, totals];
          setChartTableData(chartTableDataWithTotals);
          setDownloadTableData(chartTableDataWithTotals);

          // const newcombinedArray = [...combinedArray,total];
          // setDownloadTableData(newcombinedArray);
          // setTotalCount(total);
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
              <h4> Institutions</h4>
              <h6>Registered status Report</h6>
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
            <div className="chart mt-2 mb-2">
              {chartTableData.length > 0 && (
                <>
                  <div className="row">
                    {/* <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                                <div className="card flex-fill default-cover w-100 mb-4">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Data Analytics</h4>
                                        <div className="dropdown">
                                        <Link to="#" className="view-all d-flex align-items-center">
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
                                                    Students as per Gender{' '}{newFormat}
                                                    </b>
                                                </p>
                                                {doughnutChartData && (
                                                    <div id="donut-chart" >
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
                                                        Teachers Course Status As of{' '}
                                                        {newFormat}
                                                    </b>
                                                </p>
                                                {totalCount && (
                                                    <div id="radial-chart" >
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
                            </div> */}
                  </div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                      <div className="card flex-fill default-cover w-100 mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
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
                            <table className="table table-borderless recent-transactions">
                              <thead>
                                <tr>
                                  <th style={{ color: "#36A2EB" }}>#</th>
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
                                    Govt Junior College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt Polytechnic College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Govt ITI College
                                  </th>
                                  <th style={{ whiteSpace: "wrap",  color: "#36A2EB" }}>
                                    Govt Degree College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Social Welfare College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Tribal Welfare College
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Private College
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
                                      {item.GovtJuniorCollege_Count
                                        ? item.GovtJuniorCollege_Count
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
                                      {item.GovtDegreeCollege_Count
                                        ? item.GovtDegreeCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.SocialWelfareCollege_Count
                                        ? item.SocialWelfareCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.TribalWelfareCollege_Count
                                        ? item.TribalWelfareCollege_Count
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.PrivateCollege_Count
                                        ? item.PrivateCollege_Count
                                        : "0"}
                                    </td>{" "}
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
                </>
              )}

              {downloadTableData && (
                <CSVLink
                  data={downloadTableData}
                  headers={tableHeaders}
                  filename={`InstitutionDetailedSummaryReport_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRefTable}
                >
                  Download Table CSV
                </CSVLink>
              )}

              {chartTableData1 && (
                <CSVLink
                  headers={teacherDetailsHeaders}
                  data={chartTableData1}
                  filename={`InstitutionProgressDetailedReport_${newFormat}.csv`}
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

export default TeacherProgressDetailed;
