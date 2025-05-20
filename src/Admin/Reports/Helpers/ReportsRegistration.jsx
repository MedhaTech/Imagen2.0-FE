/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import { Button } from '../../../stories/Button';
import { CSVLink } from 'react-csv';
import {
    openNotificationWithIcon,
    getCurrentUser
} from '../../../helpers/Utils';
import {
    getDistrictData,
    getStateData,
    getFetchDistData
} from '../../../redux/studentRegistration/actions';
import { ArrowRight  } from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from 'react-redux';
import Select from '../Helpers/Select';
import { Chart } from "primereact/chart";
import { useNavigate , Link } from 'react-router-dom';
import axios from 'axios';
import '../reports.scss';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, 
  } from 'chart.js';
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement // Register ArcElement
  );
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import { stateList, districtList,collegeType } from "../../../RegPage/ORGData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMale, faFemale, faSchool } from '@fortawesome/free-solid-svg-icons';
import ReactApexChart from "react-apexcharts";

// import { categoryValue } from '../../Schools/constentText';

const ReportsRegistration = () => {
    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');
    const [RegTeachersState, setRegTeachersState] = React.useState('');
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState('');
    const [category, setCategory] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const categoryList = ['All Types', ...collegeType];
    const newstateList = ["All States", ...stateList];
    const [studentFilterData, setStudentFilterData] = useState(
        []
      );
    // const categoryData =
    //     categoryValue[process.env.REACT_APP_LOCAL_LANGUAGE_CODE];

    const [downloadData, setDownloadData] = useState(null);
    const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
        useState(null);
    const [chartTableData, setChartTableData] = useState([]);
    const csvLinkRefTable = useRef();
    const csvLinkRef = useRef();
    const csvLinkRefNotRegistered = useRef();
    const dispatch = useDispatch();
    const currentUser = getCurrentUser('current_user');
    const [registeredGenderChartData, setRegisteredGenderChartData] =
        useState(null);
    const [registeredChartData, setRegisteredChartData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [newFormat, setNewFormat] = useState('');
    const [series1, setseries1] = useState([]);
    const [series2, setseries2] = useState([]);
      const [totalCount, setTotalCount] = useState([]);
    
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    
    // const fullStatesNames = useSelector(
    //     (state) => newstateList
    // );
    const fullDistNames =newstateList;
    // const fiterDistData = districtList["Andhra Pradesh"];
    const fiterDistData = [...districtList["Andhra Pradesh"]];
    fiterDistData.unshift("All Districts");
    
    const [downloadTableData, setDownloadTableData] = useState(null);
    const summaryHeaders = [
        {
            label: 'District Name',
            key: 'district'
        },
        {
            label: 'No of Students Registered',
            key: 'studentReg'
        },
        {
            label: 'Govt Junior College',
            key: 'GovtJuniorCollege_Count'
        },
        {
            label: 'Govt ITI College',
            key: 'GovtITICollege_Count'
        },
        {
            label: 'Govt Polytechnic College',
            key: 'GovtPolytechnicCollege_Count'
        },
        {
            label: 'Govt Degree College',
            key: 'GovtDegreeCollege_Count'
        },
        {
            label: 'Social Welfare College',
            key: 'SocialWelfareCollege_Count'
        },
        {
            label: 'Tribal Welfare College',
            key: 'TribalWelfareCollege_Count'
        },
        {
            label: 'Private College',
            key: 'PrivateCollege_Count'
        },
        {
            label: 'Others',
            key: 'Other_Count'
        }
    ];
    const RegHeaders = [
        {
            label: 'Student Full Name',
            key: 'full_name'
        },
        {
            label: 'Gender',
            key: 'gender'
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
            label: 'College Town',
            key: 'college_town'
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
            label: 'Institution District',
            key: 'district'
        },
        {
            label: 'Branch/Group/Stream',
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
       
    ];
 
    useEffect(() => {
      
        fetchChartTableData();
    }, []);

   

    // const chartOptions = {
    //     maintainAspectRatio: false,
    //     legend: {
    //         position: 'bottom',
    //         labels: {
    //             fontColor: 'black'
    //         }
    //     },
    //     legend: {
    //         display: false // Hide legend inside the chart
    //     },
    //     plugins: {
    //         legend: {
    //             labels: {
    //                 generateLabels: function (chart) {
    //                     return chart.data.labels.map(function (label, i) {
    //                         const value = chart.data.datasets[0].data[i];
    //                         const backgroundColor =
    //                             chart.data.datasets[0].backgroundColor[i];
    //                         return {
    //                             text: label + ': ' + value,
    //                             fillStyle: backgroundColor
    //                         };
    //                     });
    //                 }
    //             }
    //         }
    //     }
    // };
    const chartOptions = {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            labels: {
                fontColor: 'black'
            }
        },
        plugins: {
            legend: {
                labels: {
                    generateLabels: function (chart) {
                        return chart.data.labels.map(function (label, i) {
                            const value = chart.data.datasets[0].data[i];
                            const backgroundColor =
                                chart.data.datasets[0].backgroundColor[i];
                            return {
                                text: label + ': ' + value,
                                fillStyle: backgroundColor
                            };
                        });
                    }
                }
            }
        }
    };
    // const options = {
    //     maintainAspectRatio: false,
    //     responsive: true,
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //             ticks: {
    //                 stepSize: 10
    //             },
    //             title: {
    //                 display: true,
    //                 text: 'Number of Registered ATL and Non ATL Schools',
    //                 color: 'blue'
    //             }
    //         },
    //         x: {
    //             grid: {
    //                 display: true,
    //                 drawBorder: true,
    //                 color: 'rgba(0, 0, 0, 0.2)',
    //                 lineWidth: 0.5
    //             },
    //             title: {
    //                 display: true,
    //                 text: 'States',
    //                 color: 'blue'
    //             },
    //             ticks: {
    //                 maxRotation: 80,
    //                 autoSkip: false
    //                 //maxTicksLimit: 10,
    //             }
    //         }
    //     }
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
            name: "Registered Students",
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
  
    
      const handleDownload = () => {
        if (
            !RegTeachersdistrict ||
            !category
        ) {
            notification.warning({
                message:
                    'Please select District and College Type before Downloading Reports.'
            });
            return;
        }
        setIsDownloading(true);
        fetchData();
    };
    const fetchData = () => {
        const param = encryptGlobal(
            JSON.stringify({
                district: RegTeachersdistrict,
                college_type: category
            })
        );

      
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + `/reports/studentRegList?Data=${param}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    // console.log(response,"22");
                    const Data = response?.data?.data || [];
                    setFilteredData(response?.data?.data || []);
            setDownloadData(response?.data?.data || []);
            if (response?.data.count > 0) {
                openNotificationWithIcon(
                  "success",
                  `Report Downloaded Successfully`
                );
              } else {
                openNotificationWithIcon("error", "No Data Found");
              }
                    setIsDownloading(false);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
                setIsDownloading(false);
            });
    };

  

    useEffect(() => {
        if (filteredData.length > 0) {
            setDownloadData(filteredData);
            csvLinkRef.current.link.click();
        }
    }, [filteredData]);

    useEffect(() => {
        if (downloadComplete) {
            setDownloadComplete(false);

            setRegTeachersdistrict('');

        }
        const newDate = new Date();
        const formattedDate = `${newDate.getUTCDate()}/${
            1 + newDate.getMonth()
        }/${newDate.getFullYear()} ${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
        setNewFormat(formattedDate);
    }, [downloadComplete]);

    const fetchChartTableData = () => {
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/reports/studentsummary',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const chartTableData = response?.data?.data || [];
                     // added for download report //
          const updatedChartTableData = chartTableData.map(item => {
            if (item.PrivateCollege_Count === undefined) item.PrivateCollege_Count = 0;
            if (item.GovtJuniorCollege_Count === undefined) item.GovtJuniorCollege_Count = 0;
            if (item.GovtPolytechnicCollege_Count === undefined) item.GovtPolytechnicCollege_Count = 0;
            if (item.GovtDegreeCollege_Count === undefined) item.GovtDegreeCollege_Count = 0;
            if (item.SocialWelfareCollege_Count === undefined) item.SocialWelfareCollege_Count = 0;
            if (item.TribalWelfareCollege_Count === undefined) item.TribalWelfareCollege_Count = 0;
            if (item.GovtITICollege_Count === undefined) item.GovtITICollege_Count = 0;
            if (item.Other_Count === undefined) item.Other_Count = 0;
          
            return item;
          });
                    const totals = updatedChartTableData.reduce(
                        (acc, curr) => {
                            acc.district = "Total";
                          (acc.studentReg += curr.studentReg || 0),
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
                          studentReg:0,
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
                            label: "Registered Students",
                            data: GraphfilteredData.map((item) => item.studentReg),
                            backgroundColor: "#ffa31a",
                          }
            
                        ],
                      };
                   
                      setRegisteredChartData({
                        labels: [
                          "Govt Junior College ",
                          "Govt ITI College ",
                          "Govt Polytechnic College ",
                          "Govt Degree College ",
                          "Social Welfare College ",
                          "Tribal Welfare College ",
                          "Private College",
                          "Other ",
                        ],
                        datasets: [
                          {
                            data: [
                              totals.GovtJuniorCollege_Count,
                              totals.GovtITICollege_Count,
                              totals.GovtPolytechnicCollege_Count,
                              totals.GovtDegreeCollege_Count,
                              totals.SocialWelfareCollege_Count,
                              totals.TribalWelfareCollege_Count,
                              totals.PrivateCollege_Count,
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
                            ],
                          },
                        ],
                      });
                      
                      setBarChart1Data(barData);
                      console.log(barData,"barData");
                      setseries1(barData.datasets[0].data);
                    // console.log(chartTableData, "table data");
          setTotalCount(totals);


                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
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
    
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Students</h4>
                            <h6>Registration Status Reports</h6>
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
                                            setValue={setRegTeachersdistrict}
                                            placeHolder={'Select District'}
                                            value={RegTeachersdistrict}
                                        />
                                    </div>
                                </Col>
                               
                                <Col md={3}>
                                    <div className="my-2 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={categoryList}
                                            setValue={setCategory}
                                            placeHolder={'Select College Type'}
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
                                        disabled={isDownloading}
                                        className="btn btn-primary"
                                    >
                                        {
                                            isDownloading
                                                ? 'Downloading'
                                                : 'Download Report'
                                        }
                                    </button>
                                </Col>
                            </Row>
                            <div className="chart mt-2 mb-2">
                                {chartTableData.length > 0 && (
                                    <><div className="row">

                                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                                        <div className="card flex-fill default-cover w-100 mb-2">
                                            <div className="card-header d-flex justify-content-between align-items-center" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                                <h4 className="card-title mb-0">District wise Students Registration Stats</h4>
                                                <div className="dropdown">
                                                    <Link to="#" className="view-all d-flex align-items-center">
                                                        <button
                                                            className="btn mx-2 btn-primary"
                                                            type="button"
                                                            onClick={() => {
                                                                if (downloadTableData) {
                                                                    // setIsDownloading(true);
                                                                    setDownloadTableData(
                                                                        null
                                                                    );
                                                                    csvLinkRefTable.current.link.click();
                                                                }
                                                            } }
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
                                                                <th style={{ color: "#36A2EB" }}>District <br />Name</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>No of <br />Students <br />Reg</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Govt <br />Junior <br /> College</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Govt <br />ITI <br />College</th>

                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Govt <br />Polytechnic<br /> College</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Govt <br />Degree <br />College</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Social <br />Welfare <br />College</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Tribal <br />Welfare <br />College</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Private <br />College</th>
                                                                <th style={{ whiteSpace: 'wrap', color: "#36A2EB", }}>Other</th>


                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {chartTableData.map((item, index) => (
                                                                <tr
                                                                    key={index}
                                                                >
                                                                    <td>
                                                                        {index + 1}
                                                                    </td>
                                                                    <td style={{ textAlign: "left", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", color: "crimson" }}>
                                                                        {item.district}
                                                                    </td>
                                                                    <td>
                                                                        {item.studentReg}
                                                                    </td>
                                                                    <td>
                                                                        {item.GovtJuniorCollege_Count ? item.GovtJuniorCollege_Count : "0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.GovtITICollege_Count ? item.GovtITICollege_Count : "0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.GovtPolytechnicCollege_Count ? item.GovtPolytechnicCollege_Count : "0"}
                                                                    </td>
                                                                   

                                                                    <td>
                                                                        {item.GovtDegreeCollege_Count ? item.GovtDegreeCollege_Count : "0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.SocialWelfareCollege_Count ? item.SocialWelfareCollege_Count : "0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.TribalWelfareCollege_Count ? item.TribalWelfareCollege_Count : "0"}
                                                                    </td> <td>
                                                                        {item.PrivateCollege_Count ? item.PrivateCollege_Count : "0"}
                                                                    </td> <td>
                                                                        {item.Other_Count ? item.Other_Count : "0"}
                                                                    </td>
                                                                </tr>
                                                            )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div><div className="col-md-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="card-title">
                                                    Registered Students As of{" "}
                                                    {newFormat}
                                                </h5>
                                            </div>
                                            <div className="card-body">
                                                <div id="s-col-stacked" />
                                                <ReactApexChart
                                                    options={options}
                                                    series={options.series}
                                                    type="bar"
                                                    // type="area"
                                                    height={400} />
                                            </div>
                                        </div>
                                    </div><div className="row">
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
                                                                    Overall Category wise Registered Students As of{" "}
                                                                    {newFormat}
                                                                </b>
                                                            </p>
                                                        </div>
                                                        <div className="col-md-12 doughnut-chart-container">
                                                            {registeredChartData && (
                                                                <Doughnut
                                                                    data={registeredChartData}
                                                                    options={chartOption} 
                                                                    height={400}
                                                                    />
                                                            )}
                                                        </div>

                                                    </div>
                                                </div> */}
                                                
                                                <div className="card-body">
    <div className="row">
        <div className="col-md-12 text-center mt-3">
            <p style={{fontSize:"24px"}}>
                <b>
                    Overall Category wise Registered Students As of{" "}
                    {newFormat}
                </b>
            </p>
        </div>

        {/* Labels with counts (Formatted using chart options legend) */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
            {registeredChartData && registeredChartData.labels && (
                <ul className="list-unstyled">
                    {registeredChartData.labels.map((label, index) => (
                        <li key={index} className="mb-2">
                            <span
                                className="badge"
                                style={{
                                    backgroundColor: registeredChartData.datasets[0].backgroundColor[index],
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
                            <b style={{fontSize:"16px"}}>: {registeredChartData.datasets[0].data[index]}</b>
                        </li>
                    ))}
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
        <div style={{ width: "400px", height: "400px" }}> 
        <Doughnut data={registeredChartData} options={chartOption} />
    </div>
            )}
        </div>
    </div>
</div>

                                            </div>
                                        </div>
                                    </div></>
                                )}
                              
                                {downloadTableData && (
                                    <CSVLink
                                        data={downloadTableData}
                                        headers={summaryHeaders}
                                        filename={`StudentRegistrationSummaryReport_${newFormat}.csv`}
                                        className="hidden"
                                        ref={csvLinkRefTable}
                                        // onDownloaded={() => {
                                        //     setIsDownloading(false);
                                        //     setDownloadComplete(true);
                                        // }}
                                    >
                                        Download Table CSV
                                    </CSVLink>
                                )}
                                {downloadData && (
                                    <CSVLink
                                        data={downloadData}
                                        headers={RegHeaders}
                                        filename={`StudentRegistrationDetailedReport_${newFormat}.csv`}
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
                               
                            </div>
                        </div>
                </Container>
            </div>
        </div>
        
    );
};
export default ReportsRegistration;
