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

const InstProgressDetailed = () => {
  const navigate = useNavigate();
  const [district, setdistrict] = React.useState("");
  const [selectstate, setSelectState] = React.useState("");
  const [category, setCategory] = useState("");
  const [isDownload, setIsDownload] = useState(false);
  const categoryList = ["All Types", ...collegeType];
  const [chartTableData, setChartTableData] = useState([]);
  const [chartTableData1, setChartTableData1] = useState([]);

  // const filterOptions = ["Registered", "Not Registered"];
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
  const [isloader, setIsloader] = useState(false);

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
  const [seriesa, setseriesa] = useState([]);
    const [seriesb, setseriesb] = useState([]);
  const [filterType, setFilterType] = useState("");

  const [barChart1Data, setBarChart1Data] = useState({
    labels: [],
    datasets: [],
  });
  const [barChartNew, setBarChartNew] = useState({
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

  const tableHeaders = [
    {
      label: "District Name",
      key: "district",
    },
    {
      label: "Total Registered Institutions",
      key: "insReg",
    },
    {
      label: "Total Registered Students",
      key: "studentReg",
    },
    {
      label: "Total Teams Created",
      key: "teamCount",
    },
   
  ];
  const teacherDetailsHeaders = [
    {
      label: 'Institution User Full Name',
      key: 'full_names'
  },
  {
      label: 'Email Address',
      key: 'usernames'
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
    {
      label: "Total Registered Institution Users",
      key: "users_count",
    },
    {
      label: "Total Registered Students",
      key: "total_student",
    },
    {
      label: "Total Teams Created",
      key: "team_count",
    },
    {
      label: 'No.of Students Course Completed',
      key: 'completed_count'
  },
  {
      label: 'No.of Students Course Inprogress',
      key: 'in_progress_count'
  },
  {
      label: 'No.of Students Course Not Started',
      key: 'course_not_started'
  },
  {
      label: 'No.of Teams Idea Submitted',
      key: 'submit_count'
  },
  {
      label: 'No.of Teams Idea in Draft',
      key: 'draft_count'
  },
  {
      label: 'No.of Teams Idea Not Initiated',
      key: 'initiated_status'
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
    colors: ["rgb(0, 143, 251)", "rgb(0, 227, 150)",'rgb(254, 176, 25)',],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    series: [
      {
        name: "# Institutions",
        data: seriesa,
      },
      {
        name: "# Teams",
        data: seriesb,
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
      categories: barChartNew.labels,
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
        `/reports/instdetailsreport?Data=${apiRes}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "22");

          const StuIdeaDraftCountMap = response.data.data[0].StuIdeaDraftCount.reduce(
            (map, item) => {
              map[item.college_name] = item.draftcout;
              return map;
            },
            {}
          );

          const StuIdeaSubCountMap = response.data.data[0].StuIdeaSubCount.reduce(
            (map, item) => {
              map[item.college_name] = item.submittedcout;
              return map;
            },
            {}
          );
          const StudentCourseCmpMap = response.data.data[0].StudentCourseCmp
          .reduce(
            (map, item) => {
              map[item.college_name] = item.countop;

              return map;
            },
            {}
          );

          const StudentCourseINproMap = response.data.data[0].StudentCourseINpro
          .reduce(
            (map, item) => {
              map[item.
                college_name
                ] = item.countIN;
              return map;
            },
            {}
          );
          // const studentCountMap = response.data.data[0].studentCount
          // .reduce(
          //   (map, item) => {
          //     map[item.
          //       college_name
          //       ] = item.stuCount;
          //     return map;
          //   },
          //   {}
          // );
          const studentCountMap = response.data.data[0].studentCount.reduce((map, item) => {
            map[item.college_name] = {
              stuCount: item.stuCount,
              teamCount: item.teamCount
            };
            return map;
          }, {});
         
          const newdatalist = response.data.data[0].summary.map((item) => {
            const collegeName = item.college_name;
            const draftCount = StuIdeaDraftCountMap[collegeName] || 0;
            const submitCount = StuIdeaSubCountMap[collegeName] || 0;
            // const totalStudents = studentCountMap[collegeName] || 0;
            const totalStudents = studentCountMap[collegeName]?.stuCount || 0;
            const teamCount = studentCountMap[collegeName]?.teamCount || 0;
            const completedCount = StudentCourseCmpMap[collegeName] || 0;
            const inProgressCount = StudentCourseINproMap[collegeName] || 0;
            const notInitiatedCount = teamCount - (draftCount + submitCount);
            const courseNotStartedCount = totalStudents - (completedCount + inProgressCount);
            return {
              ...item,
              mobile : item.mobiles.join(", "),
              draft_count: draftCount || 0,
    submit_count: submitCount || 0,
    initiated_status: notInitiatedCount  || 0 ,
    total_student:totalStudents || 0,
    team_count: teamCount || 0,
    completed_count: completedCount || 0,
    in_progress_count: inProgressCount || 0,
    course_not_started: courseNotStartedCount  || 0 ,
            };
          });
      
          setmentorDetailedReportsData(newdatalist);
          if (response.data.data[0]?.summary?.length > 0) {
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
    if (mentorDetailedReportsData.length > 0) {
      // console.log(mentorDetailedReportsData,"full");
      console.log("Performing operation with the updated data.");
      csvLinkRef.current.link.click();

    }
  }, [mentorDetailedReportsData]);
  const fetchChartTableData = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + "/reports/instdetailstable",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          // console.log(response, "whole");
          setIsloader(true);
          const chartTableData = response?.data?.data || [];
          const totals = chartTableData.reduce(
            (acc, curr) => {
                acc.district = "Total";
              (acc.insReg += curr.insReg || 0),
              (acc.studentReg += curr.studentReg || 0);
              (acc.teamCount += curr.teamCount || 0);

              return acc;
            },
            {
              district: "None",
              teamCount:0,
              insReg:0,
              studentReg:0,
            }
          );
        //   const barData = {
        //     labels: combinedArray.map((item) => item.state),
        //     datasets: [
        //         {
        //             label: 'No.of Students Enrolled',
        //             data: combinedArray.map(
        //                 (item) => item.totalStudents
        //             ),
        //             backgroundColor: 'rgba(255, 0, 0, 0.6)'
        //         },
        //         {
        //             label: 'No. of Teams created',
        //             data: combinedArray.map(
        //                 (item) => item.totalTeams
        //             ),
        //             backgroundColor: 'rgba(75, 162, 192, 0.6)'
        //         }
        //     ]
        // };
        // setseries2(barData.datasets[0].data);
        // setseries1(barData.datasets[1].data);

        const barDataA = {
            labels: chartTableData.map((item) => item.district),
            datasets: [
                {
                    label: "No.of Registered Institutions Enrolled",
                    data: chartTableData.map((item) => item.insReg),
                    backgroundColor: "rgb(0, 143, 251)",
                },
              
                {
                  label: "No. of Registered Teams Enrolled",
                  data: chartTableData.map((item) => (item.teamCount)),
                  backgroundColor: 'rgb(254, 176, 25)',
              },
              {
                label: "No. of Registered Students Enrolled",
                data: chartTableData.map((item) => (item.studentReg)),
                backgroundColor: "rgb(0, 227, 150)",
            },
            ],
        };
        ["rgb(0, 143, 251)", "rgb(0, 227, 150)",'rgb(254, 176, 25)',],
        setseriesa(barDataA.datasets[0].data);
        setseriesb(barDataA.datasets[1].data);
        setseries2(barDataA.datasets[2].data);

          // console.log(totals,"1");
          // setBarChart1Data(barData);
                    setBarChartNew(barDataA);
          const chartTableDataWithTotals = [...chartTableData, totals];
          setChartTableData(chartTableDataWithTotals);
          setDownloadTableData(chartTableDataWithTotals);

         
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
              <h6>Progress Report</h6>
              <h5 className="mt-3"><span style={{color:"red"}}>Note : </span>Downloaded Report show the Counts of Individual Institution-wise Stats</h5>

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
              {/* <Col md={3}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={filterOptions}
                    setValue={setFilterType}
                    placeHolder={"Select Filter"}
                    value={filterType}
                  />
                </div>
              </Col> */}
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
                        <div className="card-header d-flex justify-content-between align-items-center"style={{ borderBottom: 'none',paddingBottom: 0 }}>
                          <div>
                          <h4 className="card-title mb-0">
                            District wise Institution Progress Stats
                          </h4>
                          <br/>
              <h6><span style={{color:"red"}}>Note : </span>Summary table show the Counts of Each District-wise stats</h6>
</div>

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
                                  <th style={{ color: "#36A2EB"}}>
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
                                     
                                     No of Teams Created
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                     No of Reg Students
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
                                    <td>{item.insReg ? item.insReg :"0"}</td>
                                    <td>
                                      {item.teamCount
                                        ? item.teamCount
                                        : "0"}
                                    </td>
                                    <td>
                                      {item.studentReg
                                        ? item.studentReg
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
                                            <h5 className="card-title">Institutions, Teams, Students Enrolled As of{' '}
                                                {newFormat}</h5>
                                        </div>
                                        <div className="card-body">
                                            <div id="s-line-area" />
                                            <ReactApexChart
                                                options={options}
                                                series={options.series}
                                                type="bar"
                                                height={400}
                                            />
                                        </div>
                                    </div>
                                </div>
                </>
              )}

              {downloadTableData && (
                <CSVLink
                  data={downloadTableData}
                  headers={tableHeaders}
                  filename={`InstitutionProgressSummaryReport_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRefTable}
                >
                  Download Table CSV
                </CSVLink>
              )}

              {mentorDetailedReportsData && (
                <CSVLink
                  headers={teacherDetailsHeaders}
                  data={mentorDetailedReportsData}
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

export default InstProgressDetailed;
