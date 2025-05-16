/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState ,useEffect} from "react";

import {
  getCurrentUser,
 
} from '../../helpers/Utils';
import axios from 'axios';

import { FaUsers } from 'react-icons/fa';

import teacherreg from "../../assets/img/teacherreg.png";
import ideasub from "../../assets/img/submission.png";
import ideanotsub from "../../assets/img/ideanotsub.png";
import ideadraft from "../../assets/img/ideadraft.png";
import stucorin from "../../assets/img/stucorin.png";
import stucorcom from "../../assets/img/stucorcom.png";
import stu from "../../assets/img/students.png";

import stucornot from "../../assets/img/stucornot.png";

const Dashboard = () => {
  const currentUser = getCurrentUser('current_user');
  useEffect(() => {
    adminMentorCount();
    adminTeamsCount();
    adminSudentCount();
    adminideasCount();
    adminStudentCourseCount();
}, []);
const [totalteamsCount, setTotalteamsCount] = useState('-');
const [totalStudentCount, setTotalStudentCount] = useState('-');
const [totalideasCount, setTotalideasCount] = useState('-');
const [totalSubmittedideasCount, setTotalSubmittedideasCount] =
    useState('-');
const [totalMentorCount, setTotalMentorCount] = useState('-');
const [totalMentorMaleCount, setTotalMentorMaleCount] = useState('-');
const [totalStudentMaleCount, setTotalStudentMaleCount] = useState('-');
const [totalStudentFemaleCount, setTotalStudentFemaleCount] = useState('-');
const [totalSchoolCount, setTotalSchoolCount] = useState('-');
const [nonAtl, setNonAtl] = useState('-');
const [atl, setAtl] = useState('-');
const [other, setOther] = useState('-');
const [totalMentorFeMaleCount, setTotalMentorFeMaleCount] = useState('-');

const [mentorCoursesCompletedCount, setMentorCoursesCompletedCount] =
    useState('-');
const [studentCoursesCompletedCount, setStudentCoursesCompletedCount] =
    useState('-');
const [totalstudentCoursesCount, setTotalstudentCoursesCount] =
    useState('-');


const adminTeamsCount = () => {
    var config = {
        method: 'get',
        url: process.env.REACT_APP_API_BASE_URL + `/dashboard/teamCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
                setTotalteamsCount(response.data.data[0].teamCount);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};
const adminSudentCount = () => {
    var config = {
        method: 'get',
        url: process.env.REACT_APP_API_BASE_URL + `/dashboard/studentCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {

                setTotalStudentCount(response.data.data[0].student_count);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};
const adminideasCount = () => {
    var config = {
        method: 'get',
        url: process.env.REACT_APP_API_BASE_URL + `/dashboard/ideasCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {

                setTotalideasCount(response.data.data[0].initiated_ideas);
                setTotalSubmittedideasCount(
                    response.data.data[0].submitted_ideas
                );
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};
const adminMentorCount = () => {
    var config = {
        method: 'get',
        url: process.env.REACT_APP_API_BASE_URL + `/dashboard/mentorCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {
    setTotalMentorCount(response.data.data[0].mentorCount);
    setTotalMentorFeMaleCount(response.data.data[0].mentorFemale
    );
    setTotalMentorMaleCount(response.data.data[0].mentorMale);
  }
              
        })
        .catch(function (error) {
            console.log(error);
        });
};

const adminStudentCourseCount = () => {
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/studentCourseCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {

                setStudentCoursesCompletedCount(
                    response.data.data[0].StudentCoursesCompletedCount
                );
                setTotalstudentCoursesCount(response.data.data[0].started);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
          <div className="page-title">
                           
                                    <h4>Dashboard</h4>
                    
                        </div>
           
           
            <div className="col-xl-4 col-sm-6 col-12 d-flex mb-3 mt-3">
              <div className="dash-widget dash2 w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                  <span>
                    <img src={teacherreg} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {totalMentorCount}
                  </h5>
                  <h6>Registered Institutions</h6>
                </div>
              </div>
            </div>
           
            
            {/* row3 */}
            <div className="col-xl-4 col-sm-6 col-12 d-flex mb-3 mt-3">
              <div className="dash-widget dash1 w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                 
                <span>
                    <img src={stu} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  {totalStudentCount}

                   
                  </h5>
                  <h6>Students Enrolled</h6>
                </div>
              </div>
            </div>
           
            {/* row4 */}
            <div className="col-xl-4 col-sm-6 col-12 d-flex mb-3 mt-3">
              <div className="dash-widget dash3 w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                  
                <span>
                    <FaUsers size={30} style={{ color: '#800080' }} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    
                   
                    {totalteamsCount}
                  </h5>
                  <h6>Teams Created</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12 d-flex mb-3">
              <div className="dash-widget dash3 w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                 
                <span>
                  <img src={ideasub} style={{ width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                    { totalSubmittedideasCount}
                  </h5>
                  <h6>Teams Submitted Ideas</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12 d-flex mb-3">
              <div className="dash-widget dash3 w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                <span>
                  <img src={ideadraft} style={{ width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                 
                     {totalideasCount - totalSubmittedideasCount}
                  </h5>
                  <h6>Teams Ideas InDraft</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12 d-flex mb-3">
              <div className="dash-widget dash3 w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                <span>
                  <img src={ideanotsub} style={{ width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                     {totalteamsCount - totalideasCount}
                  </h5>
                  <h6>Teams NotStarted Idea</h6>
                </div>
              </div>
            </div>
            
            
            {/* row5 */}
            
          
            <div className="col-xl-4 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                <span>
                    <img src={stucorcom} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5> {studentCoursesCompletedCount}
                  </h5>
                  <h6>Students Completed Course </h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                <span>
                    <img src={stucorin} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                      {totalstudentCoursesCount -
                                                    studentCoursesCompletedCount}
                  </h5>
                  <h6>Students Course Inprogress</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <div className="dash-widgetimg">
                <span>
                   <img src={stucornot} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  
                      {totalStudentCount -totalstudentCoursesCount}
                  </h5>
                  <h6>Students Course NotStarted</h6>
                </div>
              </div>
            </div>
            



            


           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
