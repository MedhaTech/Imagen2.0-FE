/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Table } from "reactstrap";
// import { Button } from '../../../stories/Button';
import { CSVLink } from "react-csv";
import { useNavigate, Link } from "react-router-dom";

import {
  openNotificationWithIcon,
  getCurrentUser,
} from "../../../helpers/Utils";
import moment from "moment/moment";

import { useDispatch, useSelector } from "react-redux";
import Select from "../../../Admin/Reports/Helpers/Select.jsx";
import { Bar } from "react-chartjs-2";
// import { cardData } from '../../../Student/Pages/Ideas/SDGData.js';

import axios from "axios";
import "../../../Admin/Reports/reports.scss";
import { Doughnut } from "react-chartjs-2";
import { notification } from "antd";
import { encryptGlobal } from "../../../constants/encryptDecrypt.js";
// import { categoryValue } from '../../Schools/constentText';
import { stateList, districtList,collegeType } from "../../../RegPage/ORGData";
import { themesList } from "../../../Team/IdeaSubmission/themesData";
import * as XLSX from 'xlsx';

const ReportL2 = () => {
  const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState("");
  const [RegTeachersState, setRegTeachersState] = React.useState("");
  const fruits = ["Overall", "Quality", "Feasibility"];
  const [studentDetailedReportsData, setstudentDetailedReportsData] = useState(
    []
  );
  const [sdg, setsdg] = React.useState("");
  const [filterType, setFilterType] = useState("");
  const [category, setCategory] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const filterOptions = ["Registered", "Not Registered"];
  const categoryData = ["All Categories", "ATL", "Non ATL"];
  const categoryDataTn = [
    "All Categories",
   "HSS",
    "HS",
    "Non ATL",
  ];
  // useEffect(() => {
  //   setRegTeachersdistrict("");
  // }, [RegTeachersState]);
  const newThemesList = ["All Themes", ...themesList];
  const newstateList = ["All States", ...stateList];
    const collegeList = ["All Types", ...collegeType];
  
  const fullStatesNames = newstateList;
  const allDistricts = {
    "All Districts": [...Object.values(districtList).flat()],
    ...districtList,
  };
 const fiterDistData = [...districtList["Telangana"]];
      fiterDistData.unshift("All Districts");
    const [totalCountB, setTotalCountB] = useState([]);
  
  const [downloadData, setDownloadData] = useState(null);
  const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
    useState(null);
  const [chartTableData, setChartTableData] = useState([]);
  const [chartTableData2, setChartTableData2] = useState([]);
  const [chartTableData3, setChartTableData3] = useState([]);

  const csvLinkRefTable = useRef();
  const csvLinkRefTable2 = useRef();
  const csvLinkRefTable3 = useRef();

  const csvLinkRef = useRef();
  const csvLinkRefNotRegistered = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = getCurrentUser("current_user");
  const [registeredGenderChartData, setRegisteredGenderChartData] =
    useState(null);
  const [registeredChartData, setRegisteredChartData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [newFormat, setNewFormat] = useState("");
  const [barChart1Data, setBarChart1Data] = useState({
    labels: [],
    datasets: [],
  });

  const [downloadTableData, setDownloadTableData] = useState(null);
  const [downloadTableData2, setDownloadTableData2] = useState(null);
  const [downloadTableData3, setDownloadTableData3] = useState(null);
  const [totalCount, setTotalCount] = useState([]);

  const summaryHeaders = [
    {
      label: "Score Type",
      key: "name",
    },
    {
      label: "1to3",
      key: "1to3",
    },
    {
      label: "3to5",
      key: "3to5",
    },
    {
      label: "5to6",
      key: "5to6",
    },
    {
      label: "6to7",
      key: "6to7",
    },
    {
      label: "7to8",
      key: "7to8",
    },
    {
      label: "8to9",
      key: "8to9",
    },
    {
      label: "9to10",
      key: "9to10",
    },
  ];
  const summaryHeaders2 = [
    {
      label: "Evaluator Name",
      key: "full_name",
    },
    {
      label: "No of Ideas Evaluated",
      key: "totalEvaluated",
    },
  ];
  const summaryHeaders3 = [
    {
      label: "District Name",
      key: "district",
    },
    {
      label: "1to3",
      key: "count_1to3",
    },
    {
      label: "3to5",
      key: "count_3to5",
    },
    {
      label: "5to6",
      key: "count_5to6",
    },
    {
      label: "6to7",
      key: "count_6to7",
    },
    {
      label: "7to8",
      key: "count_7to8",
    },
    {
      label: "8to9",
      key: "count_8to9",
    },
    {
      label: "9to10",
      key: "count_9to10",
    },
  ];
  const teacherDetailsHeaders = [
    // {
    //   label: "UDISE CODE",
    //   key: "organization_code",
    // },
    // {
    //   label: "State",
    //   key: "state",
    // },
    {
      label: "District",
      key: "district",
    },
    {
      label: "CID",
      key: "challenge_response_id",
    },
    {
      label: "College Name",
      key: "college_name",
    },
    {
      label: "College Type",
      key: "college_type",
    },
 
  
  
    {
      label: "Student Names",
      key: "names",
    },
    {
      label: "Theme",
      key: "theme",
    },
    {
      label: 'Describe your idea (in one sentence).',
      key: 'idea_describe'
    },
    {
      label: 'Give a title to your idea.',
      key: 'title'
    },
    {
      label: 'What problem does your idea solve?',
      key: 'solve'
    },
    {
      label: "Who are your target customers/users?",
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
      label: 'Who are your competitors or similar ideas?',
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
      label: ' What additional support and resources would you need to implement or get started with your idea ?',
      key: 'support'
    },
    {
      label: 'Upload images/documents & video links related to your Idea.(total size limit : 10 MB)',
      key: 'prototype_image'
    },
    {
      label: 'Upload images/documents & video links related to your Idea.(total size limit : 10 MB)',
      key: 'prototype_link'
    },
  
   
    {
      label: "Idea Submission Status",
      key: "status",
    },

    {
      label: "Novelty",
      key: "novelty",
    },
    {
      label: "Useful",
      key: "useful",
    },
    {
      label: "Feasibility",
      key: "feasibility",
    },
    {
      label: "Scalability",
      key: "scalability",
    },
    {
      label: "Sustainability",
      key: "sustainability",
    },
    {
      label: "Overall Score",
      key: "overall_score",
    },
    {
      label: "Quality Score",
      key: "quality_score",
    },
    {
      label: "Feasibility Score",
      key: "feasibility_score",
    },
    {
      label: "L3 Status",
      key: "finalstatus",
    },
    {
      label: "Evaluators Count",
      key: "eval_count",
    },
  ];

  useEffect(() => {
    fetchChartTableData();
    fetchChartTableData2();
    fetchChartTableData3();
  }, []);
   const handleExport = () => {
      const ws = XLSX.utils.json_to_sheet(studentDetailedReportsData);  // Converts the JSON data to a sheet
      const wb = XLSX.utils.book_new();  // Creates a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  // Appends the sheet to the workbook
      XLSX.writeFile(wb, `L2DetailedReport_${newFormat}.xlsx`);  // Triggers download of the Excel file
      
    };
  const handleDownload = () => {
    // alert('hii');
    if (!RegTeachersdistrict || !category || !sdg) {
      notification.warning({
        message:
          "Please Select a District,College Type and Theme type before Downloading Reports.",
      });
      return;
    }
    setIsDownloading(true);
    fetchData();
  };
  useEffect(() => {
    if (studentDetailedReportsData.length > 0) {
      console.log("Performing operation with the updated data.");
      handleExport();
      // csvLinkRef.current.link.click();
    }
  }, [studentDetailedReportsData]);

  const fetchData = () => {
    // const eDistParam =
    //     RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
    const api = encryptGlobal(
      JSON.stringify({
        // state: RegTeachersState,
        district: RegTeachersdistrict,
        college_type: category,
        theme: sdg,
      })
    );
    const url = `/reports/L2deatilreport?Data=${api}`;

    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          console.log(response, "response");
          // const mentorAndOrg = response?.data?.data;
        
          const evaluatorRatingValuesMap =
            response.data.data[0].evaluatorRatingValues.reduce((map, item) => {
              map[item.challenge_response_id] = item;
              return map;
            }, {});
         
                 
          const newdatalist = response.data.data[0].summary.map((item) => {
            const rating =
            evaluatorRatingValuesMap[item.challenge_response_id] || {};
          const formatValue = (value) => {
            return value ? parseFloat(value).toFixed(1) : null;
          };
            return {
             
                                                 District:item.district,
                                                 CID:item.challenge_response_id,
                                                 "College Name":item.college_name,
                                   "College Type":item.college_type,
                                               
                                                
                                   "Student Names":item.student_names.join(', '),
                                                  Theme:item.theme,
                                                  "Describe your idea (in one sentence).":item.idea_describe,
                                    "Give a title to your idea.":item.title,
                                    "What problem does your idea solve?":item.solve,
                                    "Who are your target customers/users?":item.customer,
                                    "Explain your idea in detail":item.detail,
                                    "What stage is your idea currently at?":item.stage,
                                    "How unique is your idea compared to existing solutions?":item.unique,
                                    "Who are your competitors or similar ideas?":item.similar,
                                    "How will your idea make revenue or sustain itself?":item.revenue,
                                    "What impact will your idea have on society or the environment?":item.society,
                                    "How confident are you in your ability to implement your idea with your current skill set?":item.confident,
                                    "What additional support and resources would you need to implement or get started with your idea ?":item.support,
                                    "Upload images/documents & video links related to your(total size limit : 10 MB)":item.prototype_image,
                                    "Upload images/documents & video links related to your Idea.(total size limit : 10 MB)":item.prototype_link,
                                    "Idea Submission Status":item.status,
                                                
                                                  "Overall Score": formatValue(rating.overall_score),
  "Novelty Score": formatValue(rating.novelty),
  "Usefulness Score": formatValue(rating.useful),

  "Feasibility Score": formatValue(rating.feasibility),
  "Scalability Score": formatValue(rating.scalability),
  "Sustainability Score": formatValue(rating.sustainability),
  "Evaluators Count": rating.eval_count,
                                                  "L3 Status":item.final_result === null ? "Not Promoted" : "Promoted",

             
            };
          });
          setDownloadData(newdatalist);
          setstudentDetailedReportsData(newdatalist);
          if (response.data.data[0].summary.length > 0) {
            openNotificationWithIcon(
              "success",
              `L2 Status Detailed Reports Downloaded Successfully`
            );
          } else {
            openNotificationWithIcon("error", "No Data Found");
          }

          setIsDownloading(false);
        
        }
      })
      .catch((error) => {
        console.log("API error:", error);
        setIsDownloading(false);
      });
  };

  // useEffect(() => {
  //     if (filteredData.length > 0) {
  //         setDownloadData(filteredData);
  //     }
  // }, [filteredData, downloadNotRegisteredData]);

  useEffect(() => {
    if (downloadComplete) {
      setDownloadComplete(false);
      // setRegTeachersState("");

      setRegTeachersdistrict("");

      // setFilterType('');
      setsdg("");
    }
    const newDate = new Date();
    const formattedDate = `${newDate.getUTCDate()}/${
      1 + newDate.getMonth()
    }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    setNewFormat(formattedDate);
  }, [downloadComplete]);
  const fetchChartTableData3 = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + "/reports/L2ReportTable3",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          // console.log(response, "response");
          const combinedArray = response?.data?.data || [];
          const total = combinedArray.reduce(
            (acc, item) => {
              acc.district = "Total";
              (acc.count_1to3 += item.count_1to3),
                (acc.count_3to5 += item.count_3to5);
              acc.count_5to6 += item.count_5to6;
              acc.count_6to7 += item.count_6to7;
              acc.count_7to8 += item.count_7to8;
              acc.count_8to9 += item.count_8to9;
              acc.count_9to10 += item.count_9to10;
              return acc;
            },
            {
              count_1to3: 0,
              count_3to5: 0,
              count_5to6: 0,
              count_6to7: 0,
              count_7to8: 0,
              count_8to9: 0,
              count_9to10: 0,
            }
          );
          const newcombinedArray = [...combinedArray, total];
          setChartTableData3(newcombinedArray);
          setDownloadTableData3(newcombinedArray);
          setTotalCount(total);
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };
  const fetchChartTableData = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + "/reports/L2ReportTable1",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          // console.log(response,"responsePre");

          const countData = {
            overall: {
              "1to3": 0,
              "3to5": 0,
              "5to6": 0,
              "6to7": 0,
              "7to8": 0,
              "8to9": 0,
              "9to10": 0,
            },
            Quality: {
              "1to3": 0,
              "3to5": 0,
              "5to6": 0,
              "6to7": 0,
              "7to8": 0,
              "8to9": 0,
              "9to10": 0,
            },
            Feasibility: {
              "1to3": 0,
              "3to5": 0,
              "5to6": 0,
              "6to7": 0,
              "7to8": 0,
              "8to9": 0,
              "9to10": 0,
            },
          };
          response.data.data.forEach((item) => {
            ["overall", "Quality", "Feasibility"].forEach((key) => {
              const rating = parseFloat(item[key]);
              if (rating >= 1 && rating <= 3) {
                countData[key]["1to3"]++;
              } else if (rating > 3 && rating <= 5) {
                countData[key]["3to5"]++;
              } else if (rating > 5 && rating <= 6) {
                countData[key]["5to6"]++;
              } else if (rating > 6 && rating <= 7) {
                countData[key]["6to7"]++;
              } else if (rating > 7 && rating <= 8) {
                countData[key]["7to8"]++;
              } else if (rating > 8 && rating <= 9) {
                countData[key]["8to9"]++;
              } else if (rating > 9 && rating <= 10) {
                countData[key]["9to10"]++;
              }
            });
          });
          const overallObj = {
            name: "Overall",
            "1to3": countData.overall["1to3"],
            "3to5": countData.overall["3to5"],
            "5to6": countData.overall["5to6"],
            "6to7": countData.overall["6to7"],
            "7to8": countData.overall["7to8"],
            "8to9": countData.overall["8to9"],
            "9to10": countData.overall["9to10"],
          };
          const QualityObj = {
            name: "Quality",
            "1to3": countData.Quality["1to3"],
            "3to5": countData.Quality["3to5"],
            "5to6": countData.Quality["5to6"],
            "6to7": countData.Quality["6to7"],
            "7to8": countData.Quality["7to8"],
            "8to9": countData.Quality["8to9"],
            "9to10": countData.Quality["9to10"],
          };
          const FeasibilityObj = {
            name: "Feasibility",
            "1to3": countData.Feasibility["1to3"],
            "3to5": countData.Feasibility["3to5"],
            "5to6": countData.Feasibility["5to6"],
            "6to7": countData.Feasibility["6to7"],
            "7to8": countData.Feasibility["7to8"],
            "8to9": countData.Feasibility["8to9"],
            "9to10": countData.Feasibility["9to10"],
          };
          const combineNewarry = [overallObj, QualityObj, FeasibilityObj];
          setChartTableData(combineNewarry);
          setDownloadTableData(combineNewarry);
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };
  const fetchChartTableData2 = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + "/reports/L2ReportTable2",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((res) => {
        if (res.status === 200) {
          const chartTableData2 = res?.data?.data || [];
          const totalB = chartTableData2.reduce(
            (acc, item) => {
              (acc.totalEvaluated += item.totalEvaluated);

              return acc;
            },
            {
             
              totalEvaluated: 0,
            }
          );

          // console.log(res,"22");
          var arrayB = chartTableData2;
          arrayB.push({ full_name: "Total Count", ...totalB });
          setChartTableData2(arrayB);
          setDownloadTableData2(chartTableData2);
          setTotalCountB(totalB);
          // setChartTableData2(chartTableData2);
          // setDownloadTableData2(chartTableData2);
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
              <h4>L2 - Report</h4>
              {/* <h6>List of Teachers registered and their details</h6> */}
            </div>
          </div>
          <div className="page-btn">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/reports-card")}
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>
        <Container className="RegReports userlist">
          <div className="reports-data mt-2 mb-2">
            <Row className="align-items-center mt-3 mb-2">
              {/* <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={fullStatesNames}
                    setValue={setRegTeachersState}
                    placeHolder={"Select State"}
                    value={RegTeachersState}
                  />
                </div>
              </Col> */}
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={fiterDistData}
                    setValue={setRegTeachersdistrict}
                    placeHolder={"Select District"}
                    value={RegTeachersdistrict}
                  />
                </div>
              </Col>
              {/* <Col md={2}>
                  <div className="my-2 d-md-block d-flex justify-content-center">
                    <Select
                      list={filterOptions}
                      setValue={setFilterType}
                      placeHolder={"Select Filter"}
                      value={filterType}
                    />
                  </div>
                </Col> */}
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  {RegTeachersState === "Tamil Nadu" ? (
                    <Select
                      list={categoryDataTn}
                      setValue={setCategory}
                      placeHolder={"Select Category"}
                      value={category}
                    />
                  ) : (
                    <Select
                      list={collegeList}
                      setValue={setCategory}
                      placeHolder={"Select College Type"}
                      value={category}
                    />
                  )}
                </div>
              </Col>
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={newThemesList}
                    setValue={setsdg}
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
                  disabled={isDownloading}
                  className="btn btn-primary"
                >
                  {isDownloading ? "Downloading" : "Download Report"}
                </button>
              </Col>
            </Row>
            <div className="chart mt-2 mb-2">
              {chartTableData.length > 0 && (
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                    <div className="card flex-fill default-cover w-100 mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center"  style={{ borderBottom: 'none',paddingBottom: 0 }}>
                        <h4 className="card-title mb-0">
                        L2 Score Type Wise Stats
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
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  S.No
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Score Type
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  1 to 3{" "}
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  3 to 5
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  5 to 6
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  6 to 7
                                </th>{" "}
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  7 to 8
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  8 to 9
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  9 to 10
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {chartTableData.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td
                                    style={{
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      color: "crimson",
                                    }}
                                  >
                                    {item.name}
                                  </td>
                                  <td>{item["1to3"]}</td>
                                  <td>{item["3to5"]}</td>

                                  <td>{item["5to6"]}</td>

                                  <td>{item["6to7"]}</td>
                                  <td>{item["7to8"]}</td>
                                  <td>{item["8to9"]}</td>
                                  <td>{item["9to10"]}</td>
                                  {/* <td
                                      style={{
                                        maxWidth: "150px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        color: "crimson",
                                      }}
                                    >
                                      {item.state}
                                    </td>
                                    <td> {item.totalSubmited}</td>
                                    <td>{item.accepted}</td>
                                    <td>{item.rejected}</td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {chartTableData3.length > 0 && (
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                    <div className="card flex-fill default-cover w-100 mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center"  style={{ borderBottom: 'none',paddingBottom: 0 }}>
                        <h4 className="card-title mb-0">
                          L2 District wise Overview
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
                                if (downloadTableData3) {
                                  setDownloadTableData3(null);
                                  csvLinkRefTable3.current.link.click();
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
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  S.No
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  District Name
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  1 to 3
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  3 to 5
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  5 to 6
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  6 to 7
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  7 to 8
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  8 to 9
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  9 to 10
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {chartTableData3.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td
                                    style={{
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      color: "crimson",
                                    }}
                                  >
                                    {item.district}
                                  </td>
                                  <td> {item.count_1to3}</td>
                                  <td>{item.count_3to5}</td>
                                  <td>{item.count_5to6}</td>
                                  <td>{item.count_6to7}</td>
                                  <td>{item.count_7to8}</td>
                                  <td>{item.count_8to9}</td>
                                  <td>{item.count_9to10}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {chartTableData2.length > 0 && (
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-xl-4 d-flex">
                    <div className="card flex-fill default-cover w-100 mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center"  style={{ borderBottom: 'none',paddingBottom: 0 }}>
                        <h4 className="card-title mb-0">
                          L2 Evaluator Overview
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
                                if (downloadTableData2) {
                                  setDownloadTableData2(null);
                                  csvLinkRefTable2.current.link.click();
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
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  S.No
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Evaluator Name
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No of Ideas Evaluated
                                </th>
                                {/* <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    No of Ideas Accepted
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    No of Ideas Rejected
                                  </th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {chartTableData2.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td
                                    style={{
                                      maxWidth: "150px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      color: "crimson",
                                    }}
                                  >
                                    {item.full_name}
                                  </td>
                                  <td> {item.totalEvaluated}</td>
                                  {/* <td>{item.accepted}</td> */}
                                  {/* <td>{item.rejected}</td> */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {downloadTableData && (
              <CSVLink
                data={downloadTableData}
                headers={summaryHeaders}
                filename={`L2StatusTable_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRefTable}
              >
                Download Table CSV
              </CSVLink>
            )}

            {downloadTableData2 && (
              <CSVLink
                data={downloadTableData2}
                headers={summaryHeaders2}
                filename={`L2EvaluatorTable_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRefTable2}
              >
                Download Table CSV
              </CSVLink>
            )}
            {downloadTableData3 && (
              <CSVLink
                data={downloadTableData3}
                headers={summaryHeaders3}
                filename={`L2StatewiseTable_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRefTable3}
              >
                Download Table CSV
              </CSVLink>
            )}
            {studentDetailedReportsData && (
              <CSVLink
                data={studentDetailedReportsData}
                headers={teacherDetailsHeaders}
                filename={`L2DetailedReport_${newFormat}.csv`}
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
export default ReportL2;
