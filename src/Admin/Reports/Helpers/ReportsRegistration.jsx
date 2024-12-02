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
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    
    // const fullStatesNames = useSelector(
    //     (state) => newstateList
    // );
    const fullDistNames =newstateList;
    // const fiterDistData = districtList["Telangana"];
    const fiterDistData = [...districtList["Telangana"]];
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
            label: 'District',
            key: 'district'
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
       
    ];
 
    useEffect(() => {
      
        fetchChartTableData();
    }, []);

   

    const chartOption = {
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
                    const totals = chartTableData.reduce(
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
                      const chartTableDataWithTotals = [...chartTableData, totals];
                      setChartTableData(chartTableDataWithTotals);
                      setDownloadTableData(chartTableDataWithTotals);
                    // console.log(chartTableData, "table data");

                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
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
                               
                                <Col md={2}>
                                    <div className="my-2 d-md-block d-flex justify-content-center">
                                        <Select
                                            list={fiterDistData}
                                            setValue={setRegTeachersdistrict}
                                            placeHolder={'Select District'}
                                            value={RegTeachersdistrict}
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
                                    <div className="row">
                                   
                                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                                    <div className="card flex-fill default-cover w-100 mb-4">
                                        <div className="card-header d-flex justify-content-between align-items-center">
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
                                                            <th>#</th>
                                                            <th>District Name</th>
                                                            <th style={{whiteSpace: 'wrap'}}>No of Students Reg</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Govt Junior College</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Govt Polytechnic College</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Govt ITI College</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Govt Degree College</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Social Welfare College</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Tribal Welfare College</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Private College</th>
                                                            <th style={{whiteSpace: 'wrap'}}>Other</th>


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
                                                                    <td style={{maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis",color: "crimson"}}>
                                                                        {item.district}
                                                                    </td>
                                                                    <td>
                                                                        {item.studentReg}
                                                                    </td>
                                                                    <td>
                                                                        {item.GovtJuniorCollege_Count ? item.GovtJuniorCollege_Count :"0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.GovtPolytechnicCollege_Count ? item.GovtPolytechnicCollege_Count :"0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.GovtITICollege_Count ? item.GovtITICollege_Count :"0"}
                                                                    </td>
                                                                  
                                                                    <td>
                                                                        {item.GovtDegreeCollege_Count ? item.GovtDegreeCollege_Count :"0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.SocialWelfareCollege_Count ? item.SocialWelfareCollege_Count :"0"}
                                                                    </td>
                                                                    <td>
                                                                        {item.TribalWelfareCollege_Count ? item.TribalWelfareCollege_Count :"0" }
                                                                    </td> <td>
                                                                        {item.PrivateCollege_Count ? item.PrivateCollege_Count :"0"}
                                                                    </td> <td>
                                                                        {item.Other_Count ? item.Other_Count :"0"}
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
                                    </div>
                                )}
                              
                                {downloadTableData && (
                                    <CSVLink
                                        data={downloadTableData}
                                        headers={summaryHeaders}
                                        filename={`MentorSummaryTable_${newFormat}.csv`}
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
                                        filename={`TeacherReport_${newFormat}.csv`}
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
