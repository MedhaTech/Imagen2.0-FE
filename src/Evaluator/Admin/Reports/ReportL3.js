/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect, useRef } from 'react';
// import Layout from '../Pages/Layout';
import { Container, Row, Col, Table } from 'reactstrap';
// import { Button } from '../../../stories/Button';
import { CSVLink } from 'react-csv';
import { useNavigate, Link } from "react-router-dom";

import {
    openNotificationWithIcon,
    getCurrentUser
} from '../../../helpers/Utils';
import moment from "moment/moment";

import { useDispatch, useSelector } from 'react-redux';
import Select from '../../../Admin/Reports/Helpers/Select.jsx';
import { Bar } from 'react-chartjs-2';
// import { cardData } from '../../../Student/Pages/Ideas/SDGData.js';

import axios from 'axios';
import '../../../Admin/Reports/reports.scss';
import { Doughnut } from 'react-chartjs-2';
import { notification } from 'antd';
import * as XLSX from 'xlsx';

import { encryptGlobal } from '../../../constants/encryptDecrypt.js';
// import { categoryValue } from '../../Schools/constentText';
import { stateList, districtList } from "../../../RegPage/ORGData";
import { themesList } from "../../../Team/IdeaSubmission/themesData";
const ReportL3 = () => {
    const [RegTeachersdistrict, setRegTeachersdistrict] = React.useState('');
    const [RegTeachersState, setRegTeachersState] = React.useState('');
    const [totalCount, setTotalCount] = useState([]);
    const [studentDetailedReportsData, setstudentDetailedReportsData] = useState(
      []
    );
  
    const [sdg, setsdg] = React.useState('');
    const [filterType, setFilterType] = useState('');
    const [category, setCategory] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const categoryData = ["All Categories", "ATL", "Non ATL"];
   

    const [downloadData, setDownloadData] = useState(null);
    // console.log(downloadData, '1');
    const [downloadNotRegisteredData, setDownloadNotRegisteredData] =
        useState(null);
    const [chartTableData, setChartTableData] = useState([]);
    const [chartTableData2, setChartTableData2] = useState([]);

    const csvLinkRefTable = useRef();
    const csvLinkRefTable2 = useRef();
    const categoryDataTn = [
     "All Categories",
     "HSS",
    "HS",
      "Non ATL",
      ];
      useEffect(() => {
        setRegTeachersdistrict("");
       
      }, [RegTeachersState]);
      const newThemesList = ["All Themes", ...themesList];
      const newstateList = ["All States", ...stateList];
      const fullStatesNames = newstateList;

      const allDistricts = {
        "All Districts": [...Object.values(districtList).flat()],
        ...districtList,
      };
    const fiterDistData = [...districtList["Telangana"]];
         fiterDistData.unshift("All Districts");

    const csvLinkRef = useRef();
    const csvLinkRefNotRegistered = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = getCurrentUser('current_user');
    const [registeredGenderChartData, setRegisteredGenderChartData] =
        useState(null);
    const [registeredChartData, setRegisteredChartData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [newFormat, setNewFormat] = useState('');
    const [barChart1Data, setBarChart1Data] = useState({
        labels: [],
        datasets: []
    });
    
    const [downloadTableData, setDownloadTableData] = useState(null);
    const [downloadTableData2, setDownloadTableData2] = useState(null);

    const summaryHeaders = [
        {
            label: 'Score Type',
            key: 'name'
        },
        {
            label: '1to3',
            key: '1to3'
        },
        {
            label: '3to5',
            key: '3to5'
        },
        {
            label: '5to6',
            key: '5to6'
        },
        {
            label: '6to7',
            key: '6to7'
        },
        {
            label: '7to8',
            key: '7to8'
        },
        {
            label: '8to9',
            key: '8to9'
        },
        {
            label: '9to10',
            key: '9to10'
        }
    ];
    const summaryHeaders2 = [
        {
            label: 'District Name',
            key: 'district'
        },
        {
            label: ' No of Ideas Shortlistedfor L3',
            key: 'shortedlisted'
        },
        {
            label: 'No of Ideas Promoted(Winners)',
            key: 'winners'
        },

        {
            label: 'No of Ideas Not Promoted(Runners)',
            key: 'runners'
        }
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
        key: "organization_name",
      },
      {
        label: "College Type",
        key: "category",
      },
      // {
      //   label: "Pin code",
      //   key: "pin_code",
      // },
      // {
      //   label: "Address",
      //   key: "address",
      // },
      {
        label: "Teacher Name",
        key: "full_name",
      },
      {
        label: "Teacher Email",
        key: "username",
      },
      // {
      //   label: "Teacher Gender",
      //   key: "gender",
      // },
      // {
      //   label: "Teacher Contact",
      //   key: "mobile",
      // },
      {
        label: "Team Name",
        key: "team_name",
      },
      {
        label: "Team Username",
        key: "team_username",
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
        label: 'Upload images/documents & video links related to your Idea.(total size limit : 50 MB)',
        key: 'prototype_image'
      },
      {
        label: 'Upload images/documents & video links related to your Idea.(total size limit : 50 MB)',
        key: 'prototype_link'
      },
      {
        label: "Idea Submission Status",
        key: "status",
      },
      // {
      //   label: "Teacher Verified Status",
      //   key: "verifiedment",
      // },
      // {
      //   label: "Teacher Verified At",
      //   key: "verified_at",
      // },
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
        label: "Status",
        key: "finalstatus",
      },
      // {
      //   label: "Evaluator Count",
      //   key: "eval_count",
      // },
    ];
 const handleExport = () => {
      const ws = XLSX.utils.json_to_sheet(studentDetailedReportsData);  // Converts the JSON data to a sheet
      const wb = XLSX.utils.book_new();  // Creates a new workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');  // Appends the sheet to the workbook
      XLSX.writeFile(wb, `L3DetailedReport_${newFormat}.xlsx`);  // Triggers download of the Excel file
      
    };
  
    useEffect(() => {
       
        fetchChartTableData();
        fetchChartTableData2();
    }, []);
    useEffect(() => {
      if (studentDetailedReportsData.length > 0) {
        console.log("Performing operation with the updated data.");
        handleExport();
        // csvLinkRef.current.link.click();
      }
    }, [studentDetailedReportsData]);
    const handleDownload = () => {
      // alert('hii');
      if (
          // !RegTeachersState ||
          !RegTeachersdistrict ||
          !category ||
          !sdg
      ) {
          notification.warning({
              message:
                  'Please select a District,College Type and Theme type before Downloading Reports.'
          });
          return;
      }
      setIsDownloading(true);
      fetchData();
  };
    

    const fetchData = () => {
        // const distApi =
        //     RegTeachersdistrict === '' ? 'All Districts' : RegTeachersdistrict;
        const variables = encryptGlobal(
            JSON.stringify({
                // state: RegTeachersState,
                district: RegTeachersdistrict,
                category: category,
                theme: sdg,
            })
        );
        const url = `/reports/L3deatilreport?Data=${variables}`;

        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + url,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
              if (response.status === 200) {
                const teamDataMap = response.data.data[0].teamData.reduce(
                    (map, item) => {
                      map[item.team_id] = item;
                      return map;
                    },
                    {}
                  );
                  const teamUsernameMap = response.data.data[0].teamUsername.reduce(
                    (map, item) => {
                      map[item.teamuserId] = item.teamUsername;
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
                  const mentorUsernameMap = response.data.data[0].mentorUsername.reduce(
                    (map, item) => {
                      map[item.user_id] = item.username;
                      return map;
                    },
                    {}
                  );
                  const studentNamesMap = response.data.data[0].
                    student_names
                    .reduce(
                      (map, item) => {
                        map[item.team_id] = item.names;
                        return map;
                      },
                      {}
                    );
                    const studentAndteam = response.data.data[0].summary.map((item) => {
                        return {
                          ...item,
                          // pre_survey_status: preSurveyMap[item.user_id] || "Not started",
                          // post_survey_status: postSurveyMap[item.user_id] || "Not started",
                          // idea_status: ideaStatusDataMap[item.team_id] || "Not Initiated",
                          // user_count:
                          //   userTopicDataMap[item.user_id] === 0 ||
                          //   userTopicDataMap[item.user_id] === undefined
                          //     ? "Not Started"
                          //     : userTopicDataMap[item.user_id] === 31
                          //     ? "Completed"
                          //     : "In Progress",
                          // course_per:
                          //   userTopicDataMap[item.user_id] &&
                          //   typeof userTopicDataMap[item.user_id] === "number"
                          //     ? `${Math.round(
                          //         (userTopicDataMap[item.user_id] / 31) * 100
                          //       )}%`
                          //     : `0%`,
                          names: studentNamesMap[item.team_id],
            
                          team_name: teamDataMap[item.team_id].team_name,
                          team_email: teamDataMap[item.team_id].team_email,
                          mentor_id: teamDataMap[item.team_id].mentor_id,
                          teamuserId: teamDataMap[item.team_id].teamuserId,
            
                        };
                      });
            
                      const mentorAndOrg = studentAndteam.map((item) => {
                        return {
                          ...item,
            
                          team_username: teamUsernameMap[item.teamuserId],
                          category: mentorMap[item.mentor_id].category,
                          district: mentorMap[item.mentor_id].district,
                          full_name: mentorMap[item.mentor_id].full_name,
                          gender: mentorMap[item.mentor_id].gender,
                          mobile: mentorMap[item.mentor_id].mobile,
                          organization_code: mentorMap[item.mentor_id].organization_code,
                          unique_code: mentorMap[item.mentor_id].unique_code,
                          organization_name: mentorMap[item.mentor_id].organization_name,
                          state: mentorMap[item.mentor_id].state,
                          // whatapp_mobile: mentorMap[item.mentor_id].whatapp_mobile,
                          mentorUserId: mentorMap[item.mentor_id].mentorUserId,
                          city: mentorMap[item.mentor_id].city,
                          principal_name: mentorMap[item.mentor_id].principal_name,
                          principal_mobile: mentorMap[item.mentor_id].principal_mobile,
                          pin_code: mentorMap[item.mentor_id].pin_code,
                          address: mentorMap[item.mentor_id].address,
            
                        };
                      });
                      const evaluatorRatingValuesMap =
                      response.data.data[0].evaluatorRatingValues.reduce((map, item) => {
                        map[item.challenge_response_id] = item;
                        return map;
                      }, {});
                      const newdatalist = mentorAndOrg.map((item) => {
                        const rating =
                        evaluatorRatingValuesMap[item.challenge_response_id] || {};
                      const formatValue = (value) => {
                        return value ? parseFloat(value).toFixed(1) : null;
                      };
                        return {
                          //  "UDISE CODE":item.organization_code,
                                                                          //  State:item.state,
                                                                           District:item.district,
                                                                           CID:item.challenge_response_id,
                                                                           "College Name":item.organization_name,
                                   "College Type":item.category,
                                                                          //  "Pin code":item.pin_code,
                                                                          //  Address:item.address,
                                                                            "Teacher Name":item.full_name,
                                                                            "Teacher Email":mentorUsernameMap[item.mentorUserId],
                                                                            // "Teacher Gender":item.gender,
                                                                            // "Teacher Contact":item.mobile,
                                                                            "Team Name":item.team_name,
                                                                            "Team Username":item.team_username,
                                                                            "Student Names":item.names,
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
                                                                            // "Teacher Verified Status":item.verified_status == null ? "Not yet Reviewed" : item.verified_status,
                                                                            // "Teacher Verified At":item.verified_at ? moment(item.verified_at).format(
                                                                            //   "DD-MM-YYYY"
                                                                            // ) : '',
                                                                            "Overall Score": formatValue(rating.overall_score),
                            "Novelty Score": formatValue(rating.novelty),
                            "Usefulness Score": formatValue(rating.useful),
                          
                            "Feasibility Score": formatValue(rating.feasibility),
                            // "Feasibility": formatValue(rating.feasibility_score),
                            "Scalability Score": formatValue(rating.scalability),
                            // "Quality": formatValue(rating.quality_score),
                            "Sustainability Score": formatValue(rating.sustainability),
                            // "Evaluators Count": rating.eval_count,
                                                                            "Status":item.final_result === "0" ?  'Runner-Not Promoted'
                                                                            : 'Winner-Promoted',
                //           ...item,
                //           overall_score: formatValue(rating.overall_score),
                //           novelty: formatValue(rating.novelty),
                //           feasibility: formatValue(rating.feasibility),
                //           feasibility_score: formatValue(rating.feasibility_score),
                //           scalability: formatValue(rating.scalability),
                //           quality_score: formatValue(rating.quality_score),
                //           sustainability: formatValue(rating.sustainability),
                //           useful: formatValue(rating.useful),
                //           finalstatus:
                // item.final_result === '0'
                // ? 'Runner-Not Promoted'
                // : 'Winner-Promoted',
                //           verifiedment: item.verified_status == null ? "Not yet Reviewed" : item.verified_status,
                //           username: mentorUsernameMap[item.mentorUserId],
                //           focus_area: item.focus_area ? item.focus_area.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           prototype_image: item.prototype_image ? item.prototype_image.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           problem_solving: item.problem_solving ? item.problem_solving.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           feedback: item.feedback ? item.feedback.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           stakeholders: item.stakeholders ? item.stakeholders.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           solution: item.solution ? item.solution.replace(/,/g, ';').replace(/\n/g, ' ') : '',

                //           facing: item.facing ? item.facing.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           community: item.community ? item.community.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           effects: item.effects ? item.effects.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           causes: item.causes ? item.causes.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           workbook: item.workbook ? item.workbook.replace(/,/g, ';').replace(/\n/g, ' ') : '',

                //           problem_statement: item.problem_statement ? item.problem_statement.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           title: item.title ? item.title.replace(/,/g, ';').replace(/\n/g, ' ') : '',
                //           verified_at:item.verified_at ? moment(item.verified_at).format(
                //             "DD-MM-YYYY"
                //           ) : ''
                        };
    
                      });
                      setDownloadData(newdatalist);
                      setstudentDetailedReportsData(newdatalist);
                      if (response.data.data[0].summary.length > 0) {
                        openNotificationWithIcon(
                            'success',
                            `L3 Status Detailed Reports Downloaded Successfully`
                        );
                      } else {
                        openNotificationWithIcon("error", "No Data Found");
                      }
                     
                      setIsDownloading(false);
                            // csvLinkRef.current.link.click();
                            // openNotificationWithIcon(
                            //     'success',
                            //     `L1 Status Detailed Reports Downloaded Successfully`
                            // );
                            // setIsDownloading(false);
            }
            })
            .catch((error) => {
                console.log('API error:', error);
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
            // setRegTeachersState('');

            setRegTeachersdistrict('');

            // setFilterType('');
            setsdg('');
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
            url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + '/reports/L3ReportTable1',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    // console.log(res, '6');

                    const countData = {
                        overall: {
                            '1to3': 0,
                            '3to5': 0,
                            '5to6': 0,
                            '6to7': 0,
                            '7to8': 0,
                            '8to9': 0,
                            '9to10': 0
                        },
                        Quality: {
                            '1to3': 0,
                            '3to5': 0,
                            '5to6': 0,
                            '6to7': 0,
                            '7to8': 0,
                            '8to9': 0,
                            '9to10': 0
                        },
                        Feasibility: {
                            '1to3': 0,
                            '3to5': 0,
                            '5to6': 0,
                            '6to7': 0,
                            '7to8': 0,
                            '8to9': 0,
                            '9to10': 0
                        }
                    };
                    response.data.data.forEach((item) => {
                        ['overall', 'Quality', 'Feasibility'].forEach((key) => {
                            const rating = parseFloat(item[key]);
                            if (rating >= 1 && rating <= 3) {
                                countData[key]['1to3']++;
                            } else if (rating > 3 && rating <= 5) {
                                countData[key]['3to5']++;
                            } else if (rating > 5 && rating <= 6) {
                                countData[key]['5to6']++;
                            } else if (rating > 6 && rating <= 7) {
                                countData[key]['6to7']++;
                            } else if (rating > 7 && rating <= 8) {
                                countData[key]['7to8']++;
                            } else if (rating > 8 && rating <= 9) {
                                countData[key]['8to9']++;
                            } else if (rating > 9 && rating <= 10) {
                                countData[key]['9to10']++;
                            }
                        });
                    });
                    const overallObj = {
                        name: 'Overall',
                        '1to3': countData.overall['1to3'],
                        '3to5': countData.overall['3to5'],
                        '5to6': countData.overall['5to6'],
                        '6to7': countData.overall['6to7'],
                        '7to8': countData.overall['7to8'],
                        '8to9': countData.overall['8to9'],
                        '9to10': countData.overall['9to10']
                    };
                    const QualityObj = {
                        name: 'Quality',
                        '1to3': countData.Quality['1to3'],
                        '3to5': countData.Quality['3to5'],
                        '5to6': countData.Quality['5to6'],
                        '6to7': countData.Quality['6to7'],
                        '7to8': countData.Quality['7to8'],
                        '8to9': countData.Quality['8to9'],
                        '9to10': countData.Quality['9to10']
                    };
                    const FeasibilityObj = {
                        name: 'Feasibility',
                        '1to3': countData.Feasibility['1to3'],
                        '3to5': countData.Feasibility['3to5'],
                        '5to6': countData.Feasibility['5to6'],
                        '6to7': countData.Feasibility['6to7'],
                        '7to8': countData.Feasibility['7to8'],
                        '8to9': countData.Feasibility['8to9'],
                        '9to10': countData.Feasibility['9to10']
                    };
                    const combineNewarry = [
                        overallObj,
                        QualityObj,
                        FeasibilityObj
                    ];
                    setChartTableData(combineNewarry);
                    setDownloadTableData(combineNewarry);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
            });
    };
    const fetchChartTableData2 = () => {
        const config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL_FOR_REPORTS + '/reports/L3ReportTable2',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };

        axios(config)
            .then((response) => {
                if (response.status === 200) {
                    const chartTableData2 = response?.data?.data || [];
                    const total = chartTableData2.reduce(
                        (acc, item) => {
                            (acc.shortedlisted += item.shortedlisted),
                                // (acc.state += item.state);
                                (acc.winners += item.winners),
                                (acc.runners += item.runners);

                            return acc;
                        },
                        {
                            // state: 0,
                            shortedlisted: 0,
                            winners: 0,
                            runners: 0
                        }
                    );

                    var array = chartTableData2;
                    array.push({ state: 'Total Count', ...total });
                    setChartTableData2(array);

                    // setChartTableData2(chartTableData2);
                    setDownloadTableData2(chartTableData2);
                }
            })
            .catch((error) => {
                console.log('API error:', error);
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
                <h4>L3 - Report</h4>
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
                        list={categoryData}
                        setValue={setCategory}
                        placeHolder={"Select Category"}
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
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h4 className="card-title mb-0">
                            L3 Score Type Wise Stats
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
                            <table className="table table-border recent-transactions">
                              <thead>
                                <tr>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    #
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
                                  </th>  <th
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
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '1to3'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '3to5'
                                                                                ]
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '5to6'
                                                                                ]
                                                                            }
                                                                        </td>

                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '6to7'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '7to8'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '8to9'
                                                                                ]
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item[
                                                                                    '9to10'
                                                                                ]
                                                                            }
                                                                        </td>
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
                {chartTableData2.length > 0 && (
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-xl-12 d-flex">
                      <div className="card flex-fill default-cover w-100 mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <h4 className="card-title mb-0">
                          L3 State wise Overview
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
                            <table className="table table-border recent-transactions">
                              <thead>
                                <tr>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    #
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                      State Name
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                      No of Ideas
                                                                    Shortlisted
                                                                    for L3
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                     No of Ideas
                                                                    Promoted
                                                                    (Winners)
                                  </th>
                                  <th
                                    style={{
                                      whiteSpace: "wrap",
                                      color: "#36A2EB",
                                      fontWeight: "bold",
                                    }}
                                  >
                                     No of Ideas
                                                                    Not Promoted
                                                                    (runners)
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
                                      {item.state}
                                    </td>
                                    <td> {item.shortedlisted}</td>
                                    <td>{item.winners}</td>
                                    <td>{item.runners}</td>
                                   
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
                  filename={`L3StatusTable_${newFormat}.csv`}
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
                  filename={`L3EvaluatorTable_${newFormat}.csv`}
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
                  filename={`L3DetailedReport_${newFormat}.csv`}
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
export default ReportL3;
