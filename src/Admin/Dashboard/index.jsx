/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState ,useEffect} from "react";
import CountUp from "react-countup";
import {
  File,
  User,
  UserCheck,
} from "feather-icons-react/build/IconComponents";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
// import { all_routes } from "../../Router/all_routes";
import {
  getCurrentUser,
 
} from '../../helpers/Utils';
import axios from 'axios';
import { FaChalkboardTeacher } from 'react-icons/fa'; 
import { FaPaperPlane } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaUserGraduate } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMale, faFemale, faSchool } from '@fortawesome/free-solid-svg-icons';
import { FcLibrary } from "react-icons/fc";
import teacherreg from "../../assets/img/teacherreg.png";
import ideasub from "../../assets/img/submission.png";
import ideanotsub from "../../assets/img/ideanotsub.png";
import ideadraft from "../../assets/img/ideadraft.png";
import schoolreg from "../../assets/img/schoolreg.png";
import stucorin from "../../assets/img/stucorin.png";
import stucorcom from "../../assets/img/stucorcom.png";
import stu from "../../assets/img/students.png";
import teafem from "../../assets/img/teacher-female.png";
import stufem from "../../assets/img/female-student.png";
import stucornot from "../../assets/img/stucornot.png";
import stumale from "../../assets/img/male-student.png";
import teamale from "../../assets/img/teacher-male.png";

import teaoth from "../../assets/img/teacher-other.png";
import stuoth from "../../assets/img/student-other.png";

const Dashboard = () => {
  const currentUser = getCurrentUser('current_user');
  // const route = all_routes;
  useEffect(() => {
    adminTeamsCount();
    adminSudentCount();
    adminideasCount();
    adminMentorCount();
    adminSudentbygenderCount();
    adminSchoolCount();
    adminmentorCourseCount();
    adminStudentCourseCount();
    nonAtlCount();
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

const nonAtlCount = () => {
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/ATLNonATLRegCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {

                setAtl(response.data.data[0].ATLCount);
                setNonAtl(response.data.data[0].NONATLCount);
                setOther(response.data.data[0].OthersCount);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};
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
                setTotalteamsCount(response.data.data[0].teams_count);
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
    console.log(response,"res");
    setTotalMentorCount(response.data.data[0].mentorCount);
    setTotalMentorFeMaleCount(response.data.data[0].mentorFemale
    );
    setTotalMentorMaleCount(response.data.data[0].mentorMale);
  }
                // setTotalMentorCount(response.data.data[0].mentorCount);
                // setTotalMentorMaleCount(response.data.data[0].mentorMale);
        })
        .catch(function (error) {
            console.log(error);
        });
};
const adminSudentbygenderCount = () => {
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/studentCountbygender`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {

                setTotalStudentMaleCount(response.data.data[0].studentMale);
                setTotalStudentFemaleCount(
                    response.data.data[0].studentFemale
                );
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};
const adminSchoolCount = () => {
    var config = {
        method: 'get',
        url: process.env.REACT_APP_API_BASE_URL + `/dashboard/schoolCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {

                setTotalSchoolCount(response.data.data[0].schoolCount);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};
const adminmentorCourseCount = () => {
    var config = {
        method: 'get',
        url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/mentorCourseCount`,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
        }
    };
    axios(config)
        .then(function (response) {
            if (response.status === 200) {

                setMentorCoursesCompletedCount(
                    response.data.data[0].mentorCoursesCompletedCount
                );
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
              // console.log(response,"11");

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
            <div className="col-xl-4 col-sm-6 col-12 d-flex">
              
            </div>
            <div className="col-xl-4 col-sm-6 col-12 d-flex">
              <div className="dash-widget">
                <div className="dash-widgetimg">
                  <span>
                 
                    <FcLibrary size={30} style={{ color: 'crimson' }}  />
                  </span>
                
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {totalSchoolCount}

                  </h5>
                  <h6>Total Schools in Database</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-sm-6 col-12 d-flex">
              
            </div>
            {/* row1 */}
            
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                  <span>
                  <img src={schoolreg} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                  {Number(atl) + Number(nonAtl) + Number(other) }
                  </h5>
                  <h6>Registered Schools</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                  <span style={{fontSize:"1.5rem"}}>
                    <i className="fas fa-school" style={{color:"orange"}}></i>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>{atl}</h5>
                  <h6>Atl Schools Reg</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                  <span style={{fontSize:"1.5rem"}}>
                    <i className="fas fa-school" style={{color:"orange"}}></i>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {nonAtl}

                  </h5>
                  <h6>Non-ATL Schools Reg</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                  <span style={{fontSize:"1.5rem"}}>
                    <i className="fas fa-school" style={{color:"orange"}}></i>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                    {other}

                  </h5>
                  <h6>Other Schools Reg</h6>
                </div>
              </div>
            </div>
            
            
            {/* row2 */}
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                  <span>
                    <img src={teacherreg} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {totalMentorCount}
                  </h5>
                  <h6>Registered Teachers</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                <span>
                  <img src={teamale} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                    {totalMentorMaleCount}

                  </h5>
                  <h6>Male Teachers</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                <span>
                  <img src={teafem} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                  {totalMentorFeMaleCount}
                  </h5>
                  <h6>Female Teachers</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash2 w-100">
                <div className="dash-widgetimg">
                  
                <span>
                  <img src={teaoth} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    
                  {(Number(totalMentorCount) - (Number(totalMentorMaleCount) + Number(totalMentorFeMaleCount)))}
                   
                    {/* {totalteamsCount} */}
                  </h5>
                  <h6>Other Teachers</h6>
                </div>
              </div>
            </div>
            
            {/* row3 */}
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
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
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                 
                <span>
                    <img src={stumale} style={{width:"65%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                                                {totalStudentMaleCount}

                  </h5>
                  <h6>Male Students</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                 
                <span>
                  <img src={stufem} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                                                {totalStudentFemaleCount}

                  </h5>
                  <h6>Female Students</h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash1 w-100">
                <div className="dash-widgetimg">
                 
                <span>
                  <img src={stuoth} style={{width:"70%"}} />
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                   
                    {(Number(totalStudentCount) - (Number(totalStudentMaleCount) + Number(totalStudentFemaleCount)))}

                  </h5>
                  <h6>Others Students</h6>
                </div>
              </div>
            </div>
            {/* row4 */}
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash3 w-100">
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
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash3 w-100">
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
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash3 w-100">
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
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget dash3 w-100">
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
            
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                 
                  <span>
                    <FaChalkboardTeacher size={30} style={{color:"#fd7e14"}}/>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {mentorCoursesCompletedCount}

                  </h5>
                  <h6>Teachers Completed Course </h6>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
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
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
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
            <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
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
            



            


            {/* <div className="col-xl-3 col-sm-6 col-12 d-flex">
              <div className="dash-widget w-100">
                <div className="dash-widgetimg">
                 
                  <span>
                    <FaChalkboardTeacher size={30} style={{color:"royalblue"}}/>
                  </span>
                </div>
                <div className="dash-widgetcontent">
                  <h5>
                    {mentorCoursesCompletedCount}

                  </h5>
                  <h6>Teachers Course Completed</h6>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
