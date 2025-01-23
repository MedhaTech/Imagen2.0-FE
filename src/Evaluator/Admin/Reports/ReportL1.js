/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from "react";
// import Layout from '../Pages/Layout';
import { Container, Row, Col, Table } from "reactstrap";
// import { Button } from '../../../stories/Button';
import { CSVLink } from "react-csv";
import {
  openNotificationWithIcon,
  getCurrentUser,
} from "../../../helpers/Utils";

import { useDispatch, useSelector } from "react-redux";
import Select from "../../../Admin/Reports/Helpers/Select.jsx";
import { Bar } from "react-chartjs-2";
// import { cardData } from '../../../Student/Pages/Ideas/SDGData.js';

import axios from "axios";
import "../../../Admin/Reports/reports.scss";
import { Doughnut } from "react-chartjs-2";
import { notification } from "antd";
import { stateList, districtList,collegeType } from "../../../RegPage/ORGData";
import { useNavigate, Link } from "react-router-dom";
import { themesList } from "../../../Team/IdeaSubmission/themesData";
import moment from "moment/moment";
import * as XLSX from 'xlsx';

import { encryptGlobal } from "../../../constants/encryptDecrypt.js";
// import { categoryValue } from '../../Schools/constentText';

const ReportL1 = () => {
  const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState("");
  const [RegTeachersState, setRegTeachersState] = React.useState("");
  const [totalCount, setTotalCount] = useState([]);
  const [totalCountB, setTotalCountB] = useState([]);

  const [sdg, setsdg] = React.useState("");
  const [filterType, setFilterType] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [studentDetailedReportsData, setstudentDetailedReportsData] = useState(
    []
  );
  const [filteredData, setFilteredData] = useState([]);
  const [filteresData, setFilteresData] = useState([]);
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
  const [downloadData, setDownloadData] = useState(null);
  const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
    useState(null);
  const [chartTableData, setChartTableData] = useState([]);
  const [chartTableData2, setChartTableData2] = useState([]);

  const csvLinkRefTable = useRef();
  const csvLinkRefTable2 = useRef();

  const csvLinkRef = useRef();
  const csvLinkRefNotRegistered = useRef();
  const dispatch = useDispatch();
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
      const [status, setstatus] = React.useState('');
  
  const statusdata = ['Accepted', 'Rejected', 'Both'];
  const [downloadTableData, setDownloadTableData] = useState(null);
  const [downloadTableData2, setDownloadTableData2] = useState(null);

  const summaryHeaders = [
    {
      label: "District Name",
      key: "district",
    },
    {
      label: "No of Ideas Submitted",
      key: "totalSubmited",
    },

    {
      label: "No of Ideas Accepted",
      key: "accepted",
    },
    {
      label: "No of Ideas Rejected",
      key: "rejected",
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

    {
      label: "No of Ideas Accepted",
      key: "accepted",
    },
    {
      label: "No of Ideas Rejected",
      key: "rejected",
    },
  ];
  const teacherDetailsHeaders = [
   
    {
      label: "District",
      key: "district",
    },
    {
      label: 'CID',
      key: 'challenge_response_id'
    },
    {
      label: "College Name",
      key: "organization_name",
    },
    {
      label: "College Type",
      key: "category",
    },
   
  
    {
      label: "Student Names",
      key: "names",
    },
    {
      label: 'Theme',
      key: 'theme'
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
      label: 'Upload images/documents & video links related to your Idea.(total size limit : 50 MB)',
      key: 'prototype_image'
    },
    {
      label: 'Upload images/documents & video links related to your Idea.(total size limit : 50 MB)',
      key: 'prototype_link'
    },
  
    {
      label: 'Idea Submission Status',
      key: 'status'
    },
  
    {
      label: 'L1 Status',
      key: 'l1status'
  }
  ];
 const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(studentDetailedReportsData);  // Converts the JSON data to a sheet
    const wb = XLSX.utils.book_new();  // Creates a new workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  // Appends the sheet to the workbook
    XLSX.writeFile(wb, `L1DetailedReport_${newFormat}.xlsx`);  // Triggers download of the Excel file
    
  };
  useEffect(() => {
    fetchChartTableData();
    fetchChartTableData2();
  }, []);
  useEffect(() => {
    if (studentDetailedReportsData.length > 0) {
      console.log("Performing operation with the updated data.");
      // csvLinkRef.current.link.click();
      handleExport();

    }
  }, [studentDetailedReportsData]);
  const handleDownload = () => {
    if (!RegTeachersdistrict  || !category || !sdg || !status) {
      notification.warning({
        message:
        "Select District, College Type, Status and Theme to download report.",
      });
      return;
    }
    setIsDownloading(true);
    fetchData();
  };
  const fetchData = () => {
    // const edist =
    //   RegTeachersdistrict === "" ? "All Districts" : RegTeachersdistrict;
    const param = encryptGlobal(
      JSON.stringify({
        // state: RegTeachersState,
        district: RegTeachersdistrict,
        college_type: category,
        theme: sdg,
        evaluation_status: status !== 'Both'? (status === 'Accepted' ? 'SELECTEDROUND1' : 'REJECTEDROUND1'): 'Both',

      })
    );
    const url = `/reports/L1deatilreport?Data=${param}`;
// console.log(param,"param");
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
          console.log(response,"response Filter");
         
               const mentorAndOrg = response?.data?.data;
        
                 
                  const newdatalist = mentorAndOrg.map((item) => {
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
                                    "Upload images/documents & video links related to your(total size limit : 50 MB)":item.prototype_image,
                                    "Upload images/documents & video links related to your Idea.(total size limit : 50 MB)":item.prototype_link,
                                    "Idea Submission Status":item.status,
                                   
                                    "L1 Status":item.evaluation_status === 'SELECTEDROUND1'  ? 'Accepted': 'Rejected',

                    
                    };

                  });
                  setDownloadData(newdatalist);
                  setstudentDetailedReportsData(newdatalist);
                  if (response.data.data.length > 0) {
                    openNotificationWithIcon(
                        'success',
                        `L1 Status Detailed Reports Downloaded Successfully`
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
      setRegTeachersState("");

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

  const fetchChartTableData = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + "/reports/L1ReportTable1",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser?.data[0]?.token}`,
      },
    };

    axios(config)
      .then((res) => {
        if (res.status === 200) {
        //   console.log(res, "6");
          const chartTableData = res?.data?.data || [];
          const total = chartTableData.reduce(
            (acc, item) => {
              (acc.totalSubmited += item.totalSubmited),
                // (acc.state += item.state);
                (acc.accepted += item.accepted),
                (acc.rejected += item.rejected);

              return acc;
            },
            {
              // state: 0,
              totalSubmited: 0,
              accepted: 0,
              rejected: 0,
            }
          );

          var array = chartTableData;
          array.push({ district: "Total Count", ...total });
          setChartTableData(array);
          setDownloadTableData(chartTableData);
          setTotalCount(total);
        }
      })
      .catch((error) => {
        console.log("API error:", error);
      });
  };
  const fetchChartTableData2 = () => {
    const config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + "/reports/L1ReportTable2",
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
              (acc.totalEvaluated += item.totalEvaluated),
                // (acc.full_name += item.full_name),
                (acc.accepted += item.accepted),
                (acc.rejected += item.rejected);

              return acc;
            },
            {
             
              totalEvaluated: 0,
              accepted: 0,
              rejected: 0,
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
      <h4
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
      </h4>
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>L1 - Report</h4>
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
              <Col md={2}>
                <div className="my-2 d-md-block d-flex justify-content-center">
                  <Select
                    list={statusdata}
                    setValue={setstatus}
                    placeHolder={"Select Status"}
                    value={status}
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
                      <div className="card-header d-flex justify-content-between align-items-center" style={{ borderBottom: 'none',paddingBottom: 0 }}>
                        <h4 className="card-title mb-0">
                        L1 District wise Overview
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
                                    setDownloadTableData(
                                        null
                                    );
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
                          <table className="table  table-striped table-bordered responsive">
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
                                  No.of Submitted Ideas{" "}
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No.of Ideas Accepted in L1
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No.of Ideas Rejected in L1
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
                                    {item.district}
                                  </td>
                                  <td> {item.totalSubmited}</td>
                                  <td>{item.accepted}</td>
                                  <td>{item.rejected}</td>
                                 
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
                  <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                    <div className="card flex-fill default-cover w-100 mb-4">
                      <div className="card-header d-flex justify-content-between align-items-center"  style={{ borderBottom: 'none',paddingBottom: 0 }}>
                        <h4 className="card-title mb-0">
                        L1 Evaluator Overview
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
                                    setDownloadTableData2(
                                        null
                                    );
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
                          <table className="table  table-striped table-bordered responsive">
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
                                   Evaluator
                                   Name
                                </th>
                                <th
                                  style={{
                                    whiteSpace: "wrap",
                                    color: "#36A2EB",
                                    fontWeight: "bold",
                                  }}
                                >
                                  No of Ideas Evaluated{" "}
                                </th>
                                <th
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
                                </th>
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
                                  <td>{item.accepted}</td>
                                  <td>{item.rejected}</td>
                                 
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
                filename={`L1StatusTable_${newFormat}.csv`}
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
                filename={`L1EvaluatorTable_${newFormat}.csv`}
                className="hidden"
                ref={csvLinkRefTable2}
              >
                Download Table CSV
              </CSVLink>
            )}
            {studentDetailedReportsData && (
              <CSVLink
                data={studentDetailedReportsData}
                headers={teacherDetailsHeaders}
                filename={`L1DetailedReport_${newFormat}.csv`}
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
export default ReportL1;
