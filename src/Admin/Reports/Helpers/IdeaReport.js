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
import { stateList, districtList, collegeType } from "../../../RegPage/ORGData";
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
import * as XLSX from "xlsx";

const IdeaReport = () => {
  const navigate = useNavigate();
  const [district, setdistrict] = React.useState("");
  const [isloader, setIsloader] = useState(true);
  const [selectstate, setSelectState] = React.useState("");
  const [category, setCategory] = useState("");
  const [isDownload, setIsDownload] = useState(false);
  const [sdg, setSdg] = React.useState("");
  const [chartTableData, setChartTableData] = useState([]);

  const categoryList = ["All Types", ...collegeType];
  const fiterDistData = [...districtList["Andhra Pradesh"]];
  fiterDistData.unshift("All Districts");
  const newThemesList = ["All Themes", ...themesList];

  useEffect(() => {
    setdistrict("");
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
      label: "Total Submitted Ideas",
      key: "totalSubmited",
    },
    {
      label: "Smart Automation",
      key: "SmartAutomation",
    },
    {
      label: "Fitness and Sports",
      key: "FitnessandSports",
    },
    {
      label: "Heritage and Culture",
      key: "HeritageandCulture",
    },
    {
      label: "MedTech or BioTech or HealthTech",
      key: "MedTechorBioTechorHealthTech",
    },
    {
      label: "Agriculture, and Rural Development",
      key: "AgricultureandRuralDevelopment",
    },
    {
      label: "Smart Vehicles",
      key: "SmartVehicles",
    },
    {
      label: "Transportation and Logistics",
      key: "TransportationandLogistics",
    },
    {
      label: "Robotics and Drones",
      key: "RoboticsandDrones",
    },
    {
      label: "Clean and Green Technology",
      key: "CleanandGreenTechnology",
    },
    {
      label: "Tourism",
      key: "Tourism",
    },
    {
      label: "Renewable and sustainable Energy",
      key: "RenewableandsustainableEnergy",
    },
    {
      label: "Blockchain and Cybersecurity",
      key: "BlockchainandCybersecurity",
    },
    {
      label: "Smart Education",
      key: "SmartEducation",
    },
    {
      label: "Disaster Management",
      key: "DisasterManagement",
    },
    {
      label: "Toys and Games",
      key: "ToysandGames",
    },
    {
      label: "Miscellaneous",
      key: "Miscellaneous",
    },
    {
      label: "Space Technology",
      key: "SpaceTechnology",
    },
    {
      label: "Financial Inclusion and FinTech",
      key: "FinancialInclusionandFinTech",
    },
    {
      label: "Rural Innovation and Development",
      key: "RuralInnovationandDevelopment",
    },
    {
      label: "Public Governance and CivicTech",
      key: "PublicGovernanceandCivicTech",
    },
  ];
  const teacherDetailsHeaders = [
    {
      label: "Student Full Name",
      key: "studentfullname",
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
      label: "Branch",
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

    // {
    //   label: "Student Names",
    //   key: "names",
    // },
    {
      label: "Which category does your idea belong to?",
      key: "theme",
    },
    {
      label: "Describe your  idea (in one sentence)",
      key: "idea_describe",
    },
    {
      label: "Give a title to your idea ",
      key: "title",
    },
    {
      label: "What problem does your idea solve?",
      key: "solve",
    },
    {
      label: "Who are your target customers/users? ",
      key: "customer",
    },
    {
      label: "Explain your idea in detail",
      key: "detail",
    },
    {
      label: "What stage is your idea currently at?",
      key: "stage",
    },
    {
      label: "How unique is your idea compared to existing solutions?",
      key: "unique",
    },
    {
      label: "Who are your competitors or similar ideas? ",
      key: "similar",
    },
    {
      label: "How will your idea make revenue or sustain itself?",
      key: "revenue",
    },
    {
      label: "What impact will your idea have on society or the environment?",
      key: "society",
    },
    {
      label:
        "How confident are you in your ability to implement your idea with your current skill set?",
      key: "confident",
    },
    {
      label:
        "What additional support and resources would you need to implement or get started with your idea ?",
      key: "support",
    },
    {
      label:
        "Upload images/documents & video links related to your Idea.*  (total size   limit : 10 MB)",
      key: "prototype_image",
    },
    {
      label: "Upload documents & video links of your prototype.",
      key: "prototype_link",
    },
  ];

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(studentDetailedReportsData); // Converts the JSON data to a sheet
    const wb = XLSX.utils.book_new(); // Creates a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1"); // Appends the sheet to the workbook
    XLSX.writeFile(wb, `SubmittedIdeasDetailedReport_${newFormat}.xlsx`); // Triggers download of the Excel file
  };

  // var chartOption = {
  //   chart: {
  //     height: 500,
  //     type: "donut",
  //     toolbar: {
  //       show: false,
  //     },
  //   },
  //   colors: [
  //     "#dc143c",
  //     "#ff99af",
  //     "#ff0000",
  //     "#800000",
  //     "#648c11",
  //     "#00ffff",
  //     "#0000ff",
  //     "#800080",
  //     "#ffa07a",
  //     "#ffff00",
  //     "#e8f48c",
  //     "#08e8de",
  //     "#002147",
  //     "#1d2951",
  //     "#997a8d",
  //     "#4f3a3c",
  //     "#843f5b",
  //     "#ff004f ",
  //     "#da9100",
  //     "#fbab60",
  //     "#592720",
  //   ],
  //   labels: [
  //     "Smart Automation",
  //     "Fitness and Sports",
  //     "Heritage and Culture",
  //     "MedTech or BioTech or HealthTech",
  //     "Agriculture, and Rural Development",
  //     "Smart Vehicles",
  //     "Transportation and Logistics",
  //     "Robotics and Drones",
  //     "Clean and Green Technology",
  //     "Tourism",
  //     "Renewable and sustainable Energy",
  //     "Blockchain and Cybersecurity",
  //     "Smart Education",
  //     "Disaster Management",
  //     "Toys and Games",
  //     "Miscellaneous",
  //     "Space Technology",
  //     "Financial Inclusion and FinTech",
  //     "Rural Innovation and Development",
  //     "Public Governance and CivicTech",
  //     "Others",
  //   ],
  //   series: [
  //     totalCount.SmartAutomation,
  //     totalCount.FitnessandSports,
  //     totalCount.HeritageandCulture,
  //     totalCount.MedTechorBioTechorHealthTech,
  //     totalCount.AgricultureandRuralDevelopment,
  //     totalCount.SmartVehicles,
  //     totalCount.TransportationandLogistics,
  //     totalCount.RoboticsandDrones,
  //     totalCount.CleanandGreenTechnology,
  //     totalCount.Tourism,
  //     totalCount.RenewableandsustainableEnergy,
  //     totalCount.BlockchainandCybersecurity,
  //     totalCount.SmartEducation,
  //     totalCount.DisasterManagement,
  //     totalCount.ToysandGames,
  //     totalCount.Miscellaneous,
  //     totalCount.SpaceTechnology,
  //     totalCount.FinancialInclusionandFinTech,
  //     totalCount.RuralInnovationandDevelopment,
  //     totalCount.PublicGovernanceandCivicTech,
  //     totalCount.OTHERS,
  //   ],
  //   legend: {
  //     position: "top",
  //     horizontalAlign: "center",
  //   },
  //   responsive: [
  //     {
  //       breakpoint: 480,
  //       options: {
  //         chart: {
  //           width: 200,
  //         },
  //         legend: {
  //           position: "bottom",
  //         },
  //       },
  //     },
  //   ],
  // };
  const chartOption = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            display: false // Ensure legend is completely hidden
        },
        tooltip: {
            enabled: true // Tooltips will still work on hover
        }
    }
};
  const handleDownload = () => {
    if (!district || !category || !sdg) {
      notification.warning({
        message: "Select District, College Type and Theme to download report.",
      });
      return;
    }
    setIsDownload(true);
    fetchData();
  };
  useEffect(() => {
    if (studentDetailedReportsData.length > 0) {
      console.log("Performing operation with the updated data.");
      handleExport();
      // csvLinkRef.current.link.click();
    }
  }, [studentDetailedReportsData]);
  // console.log(studentDetailedReportsData,"data");
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
          // console.log(response,"filter");
          const IdeaData = response.data.data[0].summary || [];
    
          const newdatalist = IdeaData.map((item) => {
            return {
              District: item.district,
              "College Name": item.college_name,
              "College Type": item.college_type,
              //"Student Name": item.studentfullname,
              "Pilot":item.Pilot,
              "Crew-1":item.teamMembers === null ? '':item.teamMembers[0],
              "Crew-2":item.teamMembers === null ? '':item.teamMembers[1] === null ? '':item.teamMembers[1],
              "Crew-3":item.teamMembers === null ? '':item.teamMembers[2] === null ? '':item.teamMembers[2],
              "Initiated Name":item.initiatedName,
              Theme: item.theme,
              // "Describe the category your idea belongs to":item.others !== undefined ? item.others : "",
              "Describe your idea (in one sentence).": item.idea_describe,
              "Give a title to your idea.": item.title,
              "What problem does your idea solve?": item.solve,
              "Who are your target customers/users?": item.customer,
              "Explain your idea in detail": item.detail,
              "What stage is your idea currently at?": item.stage,
              "How unique is your idea compared to existing solutions?":
                item.unique,

              "Who are your competitors or similar ideas?": item.similar,
              "How will your idea make revenue or sustain itself?":
                item.revenue,
              "What impact will your idea have on society or the environment?":
                item.society,
              "How confident are you in your ability to implement your idea with your current skill set?":
                item.confident,
              "What additional support and resources would you need to implement or get started with your idea ?":
                item.support,
              "Upload images/documents & video links related to your(total size limit : 10 MB)":
                item.prototype_image,
              "Upload images/documents & video links related to your Idea.(total size limit : 10 MB)":
                item.prototype_link,
              "Idea Submission Status": item.status,
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
                (acc.SmartAutomation += item.SmartAutomation);
              acc.FitnessandSports += item.FitnessandSports;
              acc.HeritageandCulture += item.HeritageandCulture;
              acc.MedTechorBioTechorHealthTech +=
                item.MedTechorBioTechorHealthTech;
              acc.AgricultureandRuralDevelopment +=
                item.AgricultureandRuralDevelopment;
              acc.SmartVehicles += item.SmartVehicles;
              acc.TransportationandLogistics += item.TransportationandLogistics;
              acc.RoboticsandDrones += item.RoboticsandDrones;
              acc.CleanandGreenTechnology += item.CleanandGreenTechnology;
              acc.Tourism += item.Tourism;
              acc.RenewableandsustainableEnergy +=
                item.RenewableandsustainableEnergy;
              acc.BlockchainandCybersecurity += item.BlockchainandCybersecurity;
              acc.SmartEducation += item.SmartEducation;
              acc.DisasterManagement += item.DisasterManagement;
              acc.ToysandGames += item.ToysandGames;
              acc.Miscellaneous += item.Miscellaneous;
              acc.SpaceTechnology += item.SpaceTechnology;
              acc.FinancialInclusionandFinTech +=
                item.FinancialInclusionandFinTech;
              acc.RuralInnovationandDevelopment +=
                item.RuralInnovationandDevelopment;
              acc.PublicGovernanceandCivicTech +=
                item.PublicGovernanceandCivicTech;
              acc.OTHERS += item.OTHERS;
              return acc;
            },
            {
              totalSubmited: 0,
              SmartAutomation: 0,
              FitnessandSports: 0,
              HeritageandCulture: 0,
              MedTechorBioTechorHealthTech: 0,
              AgricultureandRuralDevelopment: 0,
              SmartVehicles: 0,
              TransportationandLogistics: 0,
              RoboticsandDrones: 0,
              CleanandGreenTechnology: 0,
              Tourism: 0,
              RenewableandsustainableEnergy: 0,
              BlockchainandCybersecurity: 0,
              SmartEducation: 0,
              DisasterManagement: 0,
              ToysandGames: 0,
              Miscellaneous: 0,
              SpaceTechnology: 0,
              FinancialInclusionandFinTech: 0,
              RuralInnovationandDevelopment: 0,
              PublicGovernanceandCivicTech: 0,
              OTHERS: 0,
              //
            }
          );

          const doughnutData = {
            labels: [
              "Smart Automation",
              "Fitness and Sports",
              "Heritage and Culture",
              "MedTech or BioTech or HealthTech",
              "Agriculture, and Rural Development",
              "Smart Vehicles",
              "Transportation and Logistics",
              "Robotics and Drones",
              "Clean and Green Technology",
              "Tourism",
              "Renewable and sustainable Energy",
              "Blockchain and Cybersecurity",
              "Smart Education",
              "Disaster Management",
              "Toys and Games",
              "Miscellaneous",
              "Space Technology",
              "Financial Inclusion and FinTech",
              "Rural Innovation and Development",
              "Public Governance and CivicTech",
              "Others",
            ],
            datasets: [
              {
                data: [
                  total.SmartAutomation,
                  total.FitnessandSports,
                  total.HeritageandCulture,
                  total.MedTechorBioTechorHealthTech,
                  total.AgricultureandRuralDevelopment,
                  total.SmartVehicles,
                  total.TransportationandLogistics,
                  total.RoboticsandDrones,
                  total.CleanandGreenTechnology,
                  total.Tourism,
                  total.RenewableandsustainableEnergy,
                  total.BlockchainandCybersecurity,
                  total.SmartEducation,
                  total.DisasterManagement,
                  total.ToysandGames,
                  total.Miscellaneous,
                  total.SpaceTechnology,
                  total.FinancialInclusionandFinTech,
                  total.RuralInnovationandDevelopment,
                  total.PublicGovernanceandCivicTech,
                  total.OTHERS,
                ],
                // "#ff9999",
                backgroundColor: [
                  "#fa8072",
                  "#ff99af",
                  "#ff7f50",
                  "#dea5a4",
                  "#648c11",
                  "#d1bea8",
                  "#b768a2",
                  "#800080",
                  "#ffa07a",
                  "#9ab973 ",
                  "#72a0c1",
                  "#c08081",
                  "#002147",
                  "#b38b6d",
                  "#997a8d",
                  "#ff9999",
                  "#843f5b",
                  "#ff004f ",
                  "#da9100",
                  "#fbab60",
                  "#bf4f51",
                ],
                hoverBackgroundColor: [
                  "#fa8072",
                  "#ff99af",
                  "#ff7f50",
                  "#dea5a4",
                  "#648c11",
                  "#d1bea8",
                  "#b768a2",
                  "#800080",
                  "#ffa07a",
                  "#9ab973 ",
                  "#72a0c1",
                  "#c08081",
                  "#002147",
                  "#b38b6d",
                  "#997a8d",
                  "#ff9999",
                  "#843f5b",
                  "#ff004f ",
                  "#da9100",
                  "#fbab60",
                  "#bf4f51",
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
      {/* <h4
        className="m-2"
        style={{
          position: "sticky",
          top: "70px",
          zIndex: 1000,
          padding: "10px",
          backgroundColor: "white",
          display: "inline-block",
          color: "#fe9f43",
          fontSize: "16px",
        }}
      >
        Reports
      </h4> */}
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Submitted Ideas Detailed Report</h4>
              <h6>
                Idea Details - Theme,Title,
                Prototype Info & Attachments
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
                  <div>
                    {/* <div className="row"> */}

                    {/* <div className="row"> */}
                    <div className="col-sm-12 col-md-6 col-xl-12 d-flex">
                      <div className="card flex-fill default-cover w-100 mb-4">
                        <div
                          className="card-header d-flex justify-content-between align-items-center"
                          style={{ borderBottom: "none", paddingBottom: 0 }}
                        >
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
                          <div
                            className="table-responsive"
                            style={{
                              overflowY: "auto",
                              scrollbarWidth: "none", // For Firefox
                              msOverflowStyle: "none", // For Internet Explorer
                            }}
                          >
                            <table
                              className="table table-striped table-bordered responsive"
                              // className="table table-border recent-transactions"
                            >
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
                                    Total Submitted Ideas
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Smart Automation
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Fitness and Sports
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Heritage and Culture
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    MedTech or BioTech or HealthTech
                                  </th>

                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Agriculture, and Rural Development
                                  </th>

                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Smart Vehicles
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Transportation and Logistics
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Robotics and Drones
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Clean and Green Technology
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Tourism
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Renewable and sustainable Energy
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Blockchain and Cybersecurity
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Smart Education
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Disaster Management
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Toys and Games
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Miscellaneous
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Space Technology
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                    }}
                                  >
                                    Financial Inclusion and FinTech
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Rural Innovation and Development
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Public Governance and CivicTech
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
                                    <td>{item.SmartAutomation}</td>
                                    <td>{item.FitnessandSports}</td>
                                    <td>{item.HeritageandCulture}</td>
                                    <td>{item.MedTechorBioTechorHealthTech}</td>
                                    <td>
                                      {item.AgricultureandRuralDevelopment}
                                    </td>
                                    <td>{item.SmartVehicles}</td>
                                    <td>{item.TransportationandLogistics}</td>
                                    <td>{item.RoboticsandDrones}</td>
                                    <td>{item.CleanandGreenTechnology}</td>
                                    <td>{item.Tourism}</td>
                                    <td>
                                      {item.RenewableandsustainableEnergy}
                                    </td>
                                    <td>{item.BlockchainandCybersecurity}</td>
                                    <td>{item.SmartEducation}</td>
                                    <td>{item.DisasterManagement}</td>
                                    <td>{item.ToysandGames}</td>
                                    <td>{item.Miscellaneous}</td>
                                    <td>{item.SpaceTechnology}</td>
                                    <td>{item.FinancialInclusionandFinTech}</td>
                                    <td>
                                      {item.RuralInnovationandDevelopment}
                                    </td>
                                    <td>{item.PublicGovernanceandCivicTech}</td>
                                    <td>{item.OTHERS}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td>{combinedArray?.length + 1}</td>
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
                                    {totalCount.SmartAutomation}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.FitnessandSports}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.HeritageandCulture}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.MedTechorBioTechorHealthTech}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.AgricultureandRuralDevelopment}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.SmartVehicles}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.TransportationandLogistics}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.RoboticsandDrones}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.CleanandGreenTechnology}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.Tourism}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.RenewableandsustainableEnergy}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.BlockchainandCybersecurity}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.SmartEducation}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.DisasterManagement}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.ToysandGames}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.Miscellaneous}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.SpaceTechnology}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.FinancialInclusionandFinTech}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.RuralInnovationandDevelopment}
                                  </td>
                                  <td style={{ color: "crimson" }}>
                                    {totalCount.PublicGovernanceandCivicTech}
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
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                        <div
                          className="card flex-fill default-cover w-100 mb-4"
                        >
                           <div className="card-header d-flex justify-content-between align-items-center">
                                                    <h4 className="card-title mb-0">Data Analytics</h4>
                                                  
                                                </div>
                          {/* </div> */}
                          {/* <div className="card-body">
                            <div className="row">
                              <div className="col-sm-12 text-center ">
                                <h4 className="card-title mb-2">
                                  Theme-Wise Ideas Submissions as of {newFormat}
                                </h4>
                                {doughnutChartData && (
                                  <div id="donut-chart">
                                    <Doughnut
                                    data={doughnutChartData}
                                      options={chartOption}
                                      // series={chartOption.series}
                                      // type="donut"
                                      // height={330}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div> */}
                             
                                                                          <div className="card-body">
                              <div className="row">
                                  <div className="col-md-12 text-center mt-3 mb-2">
                                      <p style={{fontSize:"20px"}}>
                                          <b>
                                              Overall Theme-Wise  Submitted Ideas As of{" "}
                                              {newFormat}
                                          </b>
                                      </p>
                                  </div>
                          
                                  {/* Labels with counts (Formatted using chart options legend) */}
                                  <div className="col-md-6 d-flex align-items-center justify-content-center">
                                      {/* {doughnutChartData && doughnutChartData.labels && (
                                          <ul className="list-unstyled">
                                              {doughnutChartData.labels.map((label, index) => (
                                                  <li key={index} className="mb-2">
                                                      <span
                                                          className="badge"
                                                          style={{
                                                              backgroundColor: doughnutChartData.datasets[0].backgroundColor[index],
                                                              color: "#fff",
                                                              padding: "5px 10px",
                                                              borderRadius: "5px",
                                                              marginRight: "10px",
                                                              minWidth: "100px",
                                                              display: "inline-block",
                                                              textAlign: "center",
                                                              fontSize:"16px"
                                                              
                                                          }}
                                                      >
                                                          {label}
                                                      </span>
                                                      <b style={{fontSize:"16px"}}>: {doughnutChartData.datasets[0].data[index]}</b>
                                                  </li>
                                              ))}
                                          </ul>
                                      )} */}
                                      {doughnutChartData && doughnutChartData.labels && (
  <ul className="list-unstyled d-flex flex-wrap">
    {doughnutChartData.labels.map((label, index) => (
      <li key={index} 
          className="mb-2 d-flex align-items-center" 
          style={{ width: "50%" }}> 
        <span
          className="badge"
          style={{
            backgroundColor: doughnutChartData.datasets[0].backgroundColor[index],
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            marginRight: "10px",
            minWidth: "100px",
            display: "inline-block",
            textAlign: "center",
            fontSize: "12px"
          }}
        >
          {label}
        </span>
        <b style={{ fontSize: "12px" }}>: {doughnutChartData.datasets[0].data[index]}</b>
      </li>
    ))}
  </ul>
)}

                                  </div>
                          
                                  {/* Doughnut Chart */}
                                  <div className="col-md-6 doughnut-chart-container">
                                      {doughnutChartData && (
                                  <div style={{ width: "400px", height: "400px" }}> 
                                  <Doughnut data={doughnutChartData} options={chartOption} />
                              </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  // </div>
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
            ) : (
              <div className="spinner-border text-info" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default IdeaReport;
