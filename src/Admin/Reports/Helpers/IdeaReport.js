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
// import { categoryValue } from "../../Schools/constentText";
import { notification } from "antd";
import { encryptGlobal } from "../../../constants/encryptDecrypt";
import { stateList, districtList,collegeType } from "../../../RegPage/ORGData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMale,
  faFemale,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import ReactApexChart from "react-apexcharts";
import { openNotificationWithIcon } from "../../../helpers/Utils";
import { themesList } from "../../../Team/IdeaSubmission/themesData";
import moment from "moment/moment";

const IdeaReport = () => {
  const navigate = useNavigate();
  const [district, setdistrict] = React.useState("");
  const [isloader, setIsloader] = useState(true);
  const [selectstate, setSelectState] = React.useState("");
  const [category, setCategory] = useState("");
  const [isDownload, setIsDownload] = useState(false);
  const [sdg, setSdg] = React.useState("");
  const [chartTableData, setChartTableData] = useState([]);

 
  const categoryList = ['All Types', ...collegeType];
  const fiterDistData = [...districtList["Telangana"]];
  fiterDistData.unshift("All Districts");
  const newThemesList = ["All Themes", ...themesList];

  useEffect(() => {
    setdistrict('');
  }, [selectstate]);

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
//   const fullStatesNames = newstateList;
//   const allDistricts = {
//     "All Districts": [...Object.values(districtList).flat()],
//     ...districtList,
//   };
//   const fiterDistData = ["All Districts", ...(allDistricts[selectstate] || [])];
  // const fiterDistData = districtList[selectstate];

  useEffect(() => {
 
    fetchChartTableData();
    const newDate = new Date();
    const formattedDate = `${newDate.getUTCDate()}/${1 + newDate.getMonth()
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
      label: "Total Submitted Ideas",
      key: "totalSubmited",
    },
    {
      label: "Agriculture and Rural Development",
      key: "AgricultureandRuralDevelopment",
    },
    {
      label: "Digital Transformation",
      key: "DigitalTransformation",
    },
    {
      label: "Economic Empowerment",
      key: "EconomicEmpowerment",
    },
    {
      label: "Health and Well-being",
      key: "HealthandWellbeing",
    },
    {
      label: "Quality Education",
      key: "QualityEducation",
    },
    {
      label: "Smart and Resilient Communities",
      key: "SmartandResilientCommunities",
    },
    {
      label: "Sustainable Development and Environment",
      key: "SustainableDevelopmentandEnvironment",
    },
    {
      label: "Others",
      key: "OTHERS",
    },
  ];
  const teacherDetailsHeaders = [
    {
      label: 'Student Full Name',
      key: 'studentfullname'
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
      label: 'Branch',
      key: 'branch'
  },
  {
      label: 'Roll Number',
      key: 'roll_number'
  },
  {
    label: 'Year of Study',
    key: 'year_of_study'
},
   
    // {
    //   label: "Student Names",
    //   key: "names",
    // },
    {
      label: 'Which category does your idea belong to?',
      key: 'theme'
    },
    {
      label: 'Describe your  idea (in one sentence)',
      key: 'idea_describe'
    },
    {
      label: 'Give a title to your idea ',
      key: 'title'
    },
    {
      label: 'What problem does your idea solve?',
      key: 'solve'
    },
    {
      label: 'Who are your target customers/users? ',
      key: 'customer'
    },
    {
      label: 'Explain your idea in detail',
      key: 'detail'
    },
    {
      label: 'What stage is your idea currently at?',
      key: 'stage'
    },
    {
      label: 'How unique is your idea compared to existing solutions?',
      key: 'unique'
    },
    {
      label: 'Who are your competitors or similar ideas? ',
      key: 'similar'
    },
    {
      label: 'How will your idea make revenue or sustain itself?',
      key: 'revenue'
    },
    {
      label: 'What impact will your idea have on society or the environment?',
      key: 'society'
    },
    {
      label: 'How confident are you in your ability to implement your idea with your current skill set?',
      key: 'confident'
    },
    {
      label: 'What additional support and resources would you need to implement or get started with your idea ?',
      key: 'support'
    },
    {
      label: 'Upload images/documents & video links related to your Idea.*  (total size   limit : 50 MB)',
      key: 'prototype_image'
    },
    {
      label: 'Upload documents & video links of your prototype.',
      key: 'prototype_link'
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
    colors: ["#36A2EB",
      "#FF6384",
      "#ff6666",
      "#954535",
      "#a6d608",
      "#b2ffff",
      "#4169e1",
      "#dda0dd",],
    labels: [

      "Agriculture and Rural Development",
      "Digital Transformation",
      "Economic Empowerment",
      "Health and Well-being",
      "Quality Education",
      "Smart and Resilient Communities",
      "Sustainable Development and Environment",
      "Others"
    ],
    series: [
      totalCount.AgricultureandRuralDevelopment,
      totalCount.DigitalTransformation,
      totalCount.EconomicEmpowerment,
      totalCount.HealthandWellbeing,
      totalCount.QualityEducation,
      totalCount.SmartandResilientCommunities,
      totalCount.SustainableDevelopmentandEnvironment,
      totalCount.OTHERS,

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
    if (
      !district ||
      !category ||
      !sdg
    ) {
      notification.warning({
        message:
          "Select District, College Type and Theme to download report.",
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
        district: district,
        college_type: category,
        theme: sdg,
      })
    );
    // console.log(selectstate,district,category);
    const config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/reports/ideadeatilreport?Data=${apiRes}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          console.log(response,"filter");
          const IdeaData=response.data.data[0].summary || [];
        
          const newdatalist = IdeaData.map((item) => {
            return {
              ...item,
          
              theme: item.theme ? item.theme.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              others: item.others ? item.others.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              idea_describe: item.idea_describe
              ? item.idea_describe
              .replace(/,/g, ';').replace(/\n/g, ' ') : '',
              title: item.title ? item.title.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              solve: item.solve ? item.solve.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              customer: item.customer ? item.customer.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              detail: item.detail ? item.detail.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              stage: item.stage ? item.stage.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              unique: item.unique ? item.unique.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              similar: item.similar ? item.similar.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              revenue: item.revenue ? item.revenue.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              society: item.society ? item.society.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              confident: item.confident ? item.confident.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              support: item.support ? item.support.replace(/,/g, ';').replace(/\n/g, ' ') : '',
              prototype_image
: item.prototype_image
? item.prototype_image
.replace(/,/g, ';').replace(/\n/g, ' ') : '',
prototype_link: item.prototype_link ? item.prototype_link.replace(/,/g, ';').replace(/\n/g, ' ') : '',

             
            };
          });

          // console.log(newdatalist,"filter");
          setstudentDetailedReportsData(newdatalist);
          if (response.data.data[0].summary.length > 0) {
            openNotificationWithIcon(
              "success",
              "Report Downloaded Successfully"
            );
          } else {
            openNotificationWithIcon("error", "No Data Found");
          }
          //   csvLinkRef.current.link.click();
          //   console.log(studentDetailedReportsData,"ttt");
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
      url: process.env.REACT_APP_API_BASE_URL + "/reports/ideaReportTable",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          setIsloader(true);
        //   console.log(response, "View Data");
          const combinedArray = response?.data?.data || [];

          const total = combinedArray.reduce(
            (acc, item) => {
              acc.district = "Total";
              (acc.totalSubmited += item.totalSubmited),
                acc.AgricultureandRuralDevelopment +=
                item.AgricultureandRuralDevelopment;
              acc.DigitalTransformation += item.DigitalTransformation;
              acc.EconomicEmpowerment += item.EconomicEmpowerment;
              acc.HealthandWellbeing += item.HealthandWellbeing;
              acc.QualityEducation += item.QualityEducation;
              acc.SustainableDevelopmentandEnvironment +=
                item.SustainableDevelopmentandEnvironment;

              acc.OTHERS += item.OTHERS;

              acc.SmartandResilientCommunities +=
                item.SmartandResilientCommunities;
              return acc;
            },
            {
              totalSubmited: 0,
              AgricultureandRuralDevelopment: 0,
              DigitalTransformation: 0,
              EconomicEmpowerment: 0,
              HealthandWellbeing: 0,
              QualityEducation: 0,
              SmartandResilientCommunities: 0,
              SustainableDevelopmentandEnvironment: 0,
              OTHERS: 0,
              //
            }
          );

          const doughnutData = {
            labels: [
              "Agriculture and Rural Development",
              "Digital Transformation",
              "Economic Empowerment",
              "Health and Well-being",
              "Quality Education",
              "Smart and Resilient Communities",
              "Sustainable Development and Environment",
              "Others",
            ],
            datasets: [
              {
                data: [
                  total.AgricultureandRuralDevelopment,
                  total.DigitalTransformation,
                  total.EconomicEmpowerment,
                  total.HealthandWellbeing,
                  total.QualityEducation,
                  total.SmartandResilientCommunities,
                  total.SustainableDevelopmentandEnvironment,
                  total.Others,
                ],
                backgroundColor: [
                  "#8bcaf4",
                  "#ff99af",
                  "#ff0000",
                  "#800000",
                  "#648c11",
                  "#00ffff",
                  "#0000ff",
                  "#800080",
                ],
                hoverBackgroundColor: [
                  "#36A2EB",
                  "#FF6384",
                  "#ff6666",
                  "#954535",
                  "#a6d608",
                  "#b2ffff",
                  "#4169e1",
                  "#dda0dd",
                ],
              },
            ],
          };

          const newcombinedArray = [...combinedArray, total];
          setCombinedArray(combinedArray);
          setDownloadTableData(newcombinedArray);
          setDoughnutChartData(doughnutData);
          setTotalCount(total);
          // console.log(total,"tt");
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };

  return (
    <div className="page-wrapper">
       <h4 className="m-2" 
        style={{ position: 'sticky', top: '70px', zIndex: 1000, padding: '10px',backgroundColor: 'white', display: 'inline-block' , color: '#fe9f43',fontSize:"16px" }}
        >Reports
        </h4>
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Submitted Ideas Detailed Report</h4>
              <h6>
                Idea Details - Theme, Focusarea, Problem, Solution, Feedback, Prototype Info & Attachments
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
             
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                <Select
                    list={fiterDistData}
                    setValue={setdistrict}
                    placeHolder={"Select District"}
                    value={district}
                  />
                </div>
              </Col>
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                <Select
                    list={categoryList}
                    setValue={setCategory}
                    placeHolder={'Select College Type'}
                    value={category}
                  />
                </div>
              </Col>
              <Col md={3}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={newThemesList}
                    setValue={setSdg}
                    placeHolder={"Select Theme"}
                    value={sdg}
                  />
                </div>
              </Col>
              <Col
                md={2}
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
            {isloader ?
            <div className="chart mt-2 mb-2">
              {combinedArray.length > 0 && (
                <>
                  {/* <div className="row">
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
                                  Theme-Wise Ideas Submissions as of {newFormat}
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
                           
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                      <div className="card flex-fill default-cover w-100 mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h4 className="card-title mb-0">
                            District wise Submitted Ideas Stats
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
                            <table className="table table-border recent-transactions">
                              <thead>
                                <tr>
                                  <th style={{ color: "#36A2EB" }}>#No</th>
                                  <th style={{ color: "#36A2EB" }}>
                                    District Name
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Total Submitted Ideas
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Agriculture and Rural Development
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                  
                                    Digital Transformation
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                  
                                    Economic Empowerment
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                   
                                    Health and Well-being
                                  </th>

                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                   
                                    Quality Education{" "}
                                  </th>

                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Smart and Resilient Communities
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Sustainable Development and Environment
                                  </th>



                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Others
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
                                    <td>{item.totalSubmited}</td>
                                    <td>
                                      {item.AgricultureandRuralDevelopment}
                                    </td>{" "}
                                    <td>{item.DigitalTransformation}</td>
                                    <td>{item.EconomicEmpowerment}</td>
                                    <td>{item.HealthandWellbeing}</td>
                                    <td>{item.QualityEducation}</td>

                                    <td>
                                      {item.SmartandResilientCommunities}
                                    </td>{" "}
                                    <td>
                                      {
                                        item.SustainableDevelopmentandEnvironment
                                      }
                                    </td>
                                    <td>{item.OTHERS}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td>{ }</td>
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
                                    {totalCount.totalSubmited}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.AgricultureandRuralDevelopment}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.DigitalTransformation}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.EconomicEmpowerment}
                                  </td>{" "}
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.HealthandWellbeing}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.QualityEducation}
                                  </td>

                                  <td style={{ color: "crimson" }}>
                                    {totalCount.SmartandResilientCommunities}
                                  </td>{" "}
                                  <td style={{ color: "crimson" }}>
                                    {
                                      totalCount.SustainableDevelopmentandEnvironment
                                    }
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.OTHERS}
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
             
            
            

              {downloadTableData && (
                <CSVLink
                  data={downloadTableData}
                  headers={tableHeaders}
                  filename={`SubmittedIdeasSummaryReport_${newFormat}.csv`}
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
                  filename={`SubmittedIdeasDetailedReport_${newFormat}.csv`}
                  className="hidden"
                  ref={csvLinkRef}
                >
                  Download Idea Detailed CSV
                </CSVLink>
              )}
            </div>
            :
                            <div className="spinner-border text-info" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        }
          </div>
        </Container>
      </div>
    </div>
  );
};

export default IdeaReport;
