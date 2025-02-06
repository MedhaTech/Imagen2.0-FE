/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
// import Layout from '../../Admin/Layout';
import { useNavigate} from 'react-router-dom';
import { Container, Row, Card, CardBody, CardText, Col } from 'reactstrap';
// import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import { Button } from '../../stories/Button';
import { useDispatch } from 'react-redux';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { encryptGlobal } from '../../constants/encryptDecrypt';
// import {
//     getStudentDashboardStatus,
//     getStudentDashboardTeamProgressStatus
// } from '../../redux/studentRegistration/actions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import logout from '../../assets/img/logout.png';
import { studentResetPassword } from '../../Teacher/store/teacher/actions';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Table} from "react-bootstrap";
const CommonUserProfile = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [button, setButton] = useState('');
    const [data, setData] = useState('');
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
    const [badges, setBadges] = useState(0);
    const [quiz, setQuiz] = useState(0);
    const [videos, setVideos] = useState(0);
    const StudentsDaTa = JSON.parse(localStorage.getItem('studentData'));
    // console.log(StudentsDaTa,"111");
    const [course, setCourse] = useState([]);
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const dashboardStatus = useSelector(
        (state) => state?.studentRegistration.dashboardStatus
    );
    useEffect(()=>{
        stuQuizCount();
        stuVideosCount();
        stuBadgesCount();
        courseApi();
        QuizScoreApi();
    },[]);
    const QuizScoreApi=()=>{
        const stuParam = encryptGlobal(
            JSON.stringify({
                user_id: StudentsDaTa.user_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/quizscores?Data=${stuParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"table");

                    // setCourseTable(response.data.data[0]?.scores);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const courseApi=()=>{
        const stuParam = encryptGlobal(
            JSON.stringify({
                user_id: StudentsDaTa.user_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/stuCourseStats?Data=${stuParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    // console.log(response,"res");
                    // const per = Math.round(
                    //     (response.data.data[0].topics_completed_count /
                    //       response.data.data[0].all_topics_count) *
                    //     100
                    //   );
                    setCourse(response.data.data[0]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    const stuQuizCount = () => {
        const quizApi = encryptGlobal(
          JSON.stringify({
            user_id: StudentsDaTa?.user_id
          })
        );
        var config = {
          method: 'get',
          url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuQuizStats?Data=${quizApi}`,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
          }
        };
        axios(config)
          .then(function (response) {
            if (response.status === 200) {
            //   console.log(response,"quiz");
              setQuiz(response.data.data[0].quiz_completed_count);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      };
      const stuVideosCount = () => {
        const videoApi = encryptGlobal(
          JSON.stringify({
            user_id: StudentsDaTa?.user_id
          })
        );
        var config = {
          method: 'get',
          url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuVideoStats?Data=${videoApi}`,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
          }
        };
        axios(config)
          .then(function (response) {
            if (response.status === 200) {
              // console.log(response);
              setVideos(response.data.data[0].videos_completed_count);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      };
    const stuBadgesCount = () => {
        const badgeApi = encryptGlobal(
          JSON.stringify({
            user_id: StudentsDaTa?.user_id
          })
        );
        var config = {
          method: 'get',
          url:
            process.env.REACT_APP_API_BASE_URL +
            `/dashboard/stuBadgesStats?Data=${badgeApi}`,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentUser.data[0]?.token}`
          }
        };
        axios(config)
          .then(function (response) {
            if (response.status === 200) {
              // console.log(response);
              setBadges(response.data.data[0].badges_earned_count);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      };
    // useEffect(() => {
    //     if (currentUser) {
    //         dispatch(getStudentDashboardStatus(StudentsDaTa.user_id, language));
    //         dispatch(
    //             getStudentDashboardTeamProgressStatus(
    //                 currentUser?.data[0]?.user_id,
    //                 language
    //             )
    //         );
    //     }
    // }, [currentUser?.data[0]?.user_id, language]);
    // useEffect(() => {
    //     const stuParam = encryptGlobal(
    //         JSON.stringify({
    //             user_id: StudentsDaTa.user_id
    //         })
    //     );
    //     var config = {
    //         method: 'get',
    //         url:
    //             process.env.REACT_APP_API_BASE_URL +
    //             `/dashboard/quizscores?Data=${stuParam}`,
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json',
    //             Authorization: `Bearer ${currentUser.data[0]?.token}`
    //         }
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 200) {
    //                 setCourse(response.data.data[0]?.scores);
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }, []);
    const dashboardTeamProgressStatus = useSelector(
        (state) => state?.studentRegistration.dashboardTeamProgressStatus
    );
    const handleViewBack = () => {
        // history.push({
        //     pathname: '/admin/userlist'
        // });
        navigate("/students");
        // localStorage.setItem('dist', props.location.dist);
        // localStorage.setItem('num', props.location.num);
    };
   
    const handleReset = () => {
        // here we can reset password as  user_id //
        // here data = student_id //
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-submit',
                cancelButton: 'btn btn-cancel'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: "<h4>Are you sure?</h4>",
                text: 'You are attempting to reset the password',
                imageUrl: `${logout}`,
                confirmButtonText: 'Reset Password',
                showCancelButton: true,
                cancelButtonText: "Cancel",
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    dispatch(
                        studentResetPassword({
                            student_id:StudentsDaTa.student_id,
                            email:StudentsDaTa.username_email,
                            role:"STUDENT",
                            otp:false
                        })
                    );
                }
            })
            .catch((err) => console.log(err.response));
    };
    // useEffect(() => {
    //     mentorsData();
    // }, []);
    const mentorsData = () => {
        const mentorsParam = encryptGlobal(
            JSON.stringify({
                team_id: StudentsDaTa.team.team_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/teams/teamMentor?Data=${mentorsParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                   
                    setData(response?.data?.data[0]);
                    setButton(response.data.data[0].moc_name);
                    // if (response.data.data[0].moc_name !== null) {
                    //     setshowMentorCard(true);
                    // }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    // const handleReset = () => {
    //     // where we can reset the password  as diesCode //

    //     const body = JSON.stringify({
    //         organization_code:
    //             StudentsDaTa?.team?.mentor?.organization.organization_code,
    //         mentor_id: StudentsDaTa?.team?.mentor.mentor_id,
    //         otp: false
    //     });
    //     var config = {
    //         method: 'put',
    //         url: process.env.REACT_APP_API_BASE_URL + '/mentors/resetPassword',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${currentUser?.data[0]?.token}`
    //         },
    //         data: body
    //     };
    //     axios(config)
    //         .then(function (response) {
    //             if (response.status === 202) {
    //                 openNotificationWithIcon(
    //                     'success',
    //                     'Reset Password Successfully Update!',
    //                     ''
    //                 );
    //             }
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // };

    // const handleEdit = () => {
    //     // where we can edit  the users data //
    //     history.push({
    //         pathname: '/admin/student/edit-user-profile',
    //         data: {
    //             username: props.location.data && props.location.data.username,
    //             full_name: props.location.data && props.location.data.full_name,
    //             organization_code:
    //                 props.location.data &&
    //                 props.location.data?.organization_code,
    //             mentor_id: props.location.data && props.location.data.mentor_id
    //         }
    //     });
    // };
    const handleEdit = () => {
        navigate(
            "/student-edit",
            { state: { student_id: StudentsDaTa.student_id } });
    };
    const CourseData = {
        data: course && course.length > 0 ? course : [],
        columns: [
            {
                name: 'No',
                selector: (row, key) => key + 1,
                // sortable: true,
                width: '10rem'
            },
            {
                name: 'Quiz',
                // sortable: true,
                selector: (row) => row.quiz_id,
                sortable: true,
                width: '10rem'
            },

            {
                name: 'Attempts',
                // sortable: true,
                selector: (row) => row.attempts,
                sortable: true,
                width: '15rem'
            },
            {
                name: 'Score',
                selector: (row) => (row.score ? row.score : '-'),
                width: '20rem'
            }
        ]
    };
    // console.log(StudentsDaTa,"StudentsDaTa");
    return (
        <div className="page-wrapper">
        <div className="content">
            {/* <Container className="dynamic-form"> */}
                <Row>
                    <div className="col-6">
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        {/* <h4 className="mt-2"> User Details</h4> */}
                        <h4 className="mt-2">Student Profile - <span style={{color:"#17A2B8"}}>{StudentsDaTa?.full_name}</span></h4>


                    </div>
                    <div className="col-6 text-end mb-2">
                      
                         <button
                          className='btn btn-info me-2'
                          onClick={handleEdit}
                        >
                       <i data-feather="edit" className="feather-edit" /> Edit
                        </button> 
                        <button
                          className='btn btn-success me-2'
                          onClick={handleReset}
                        >
                    <FontAwesomeIcon icon={faKey} style={{marginRight:"5px"}} /> Reset 
                        </button>
                        <button
                          className='btn btn-secondary'
                            onClick={handleViewBack}
                        >
                        Back
                        </button>
                    </div>
                </Row>

<Row className="my-2">
  <Card className="py-2">
    <CardBody>
      <h4 className="mb-3">User Details</h4>

      <Table striped bordered >
        <tbody>
          <tr>
            <td className="w-50"><b>Full Name</b></td>
            <td className="w-50">{StudentsDaTa?.full_name}</td>
          </tr>
          <tr>
            <td><b>Email Address</b></td>
            <td>{StudentsDaTa?.username_email}</td>
          </tr>
          <tr>
            <td><b>Mobile Number</b></td>
            <td>{StudentsDaTa?.mobile}</td>
          </tr>
          <tr>
            <td><b>District</b></td>
            <td>{StudentsDaTa?.district}</td>
          </tr>
          <tr>
            <td><b>College Type</b></td>
            <td>{StudentsDaTa?.college_type}</td>
          </tr>

          {/* Conditional Rendering for College Name */}
          {StudentsDaTa?.college_type !== "Other" ? (
            <tr>
              <td><b>College Name</b></td>
              <td>{StudentsDaTa?.college_name}</td>
            </tr>
          ) : (
            <>
              <tr>
                <td><b>College Name</b></td>
                <td>Other</td>
              </tr>
              <tr>
                <td><b>Other College Name</b></td>
                <td>{StudentsDaTa?.college_name}</td>
              </tr>
            </>
          )}

          <tr>
            <td><b>Roll Number Provided by the College</b></td>
            <td>{StudentsDaTa?.roll_number}</td>
          </tr>
          <tr>
            <td><b>Branch</b></td>
            <td>{StudentsDaTa?.branch}</td>
          </tr>
          <tr>
            <td><b>APAAR ID</b></td>
            <td>{StudentsDaTa?.id_number ? StudentsDaTa?.id_number : "-"}</td>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  </Card>
</Row>

<Row className="my-2">
  <Card className="py-2">
    <CardBody>
      <h4 className="mb-3">Course Details</h4>

      <Table striped bordered>
        <tbody>
          <tr>
            <td className="w-50"><b>Completed Videos</b></td>
            <td className="w-50">{videos}</td>
          </tr>
          <tr>
            <td><b>Course Completion</b></td>
            <td>
              {course?.topics_completed_count !== undefined
                ? `${Math.round(
                    (course?.topics_completed_count /
                      course?.all_topics_count) *
                      100
                  )}%`
                : "-"}
            </td>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  </Card>
</Row>

                {/* <Row>
                    <Card className="py-1 mb-2">
                        <CardBody>
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b>Full Name :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>
                                    {StudentsDaTa.full_name}
                                   
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b>Email Address :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa.username_email}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b> Mobile Number :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa.mobile}</b>
                            </CardText>

                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b >District :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa.district}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b >College Type :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa?.college_type}</b>
                            </CardText>
                           {StudentsDaTa?.college_type !== "Other" && (<CardText>
                                   <span className="mx-3" style={{ fontSize: "1rem" }}>
                                       <b>College Name :</b>
                                   </span>
                                   <b style={{ fontSize: "1rem" }}>{StudentsDaTa?.college_name}</b>
                               </CardText>
                               )} 
                           {StudentsDaTa?.college_type == "Other" && ( <><CardText>
                                   <span className="mx-3" style={{ fontSize: "1rem" }}>
                                       <b>College Name :</b>
                                   </span>
                                   <b style={{ fontSize: "1rem" }}>Other</b>
                               </CardText><CardText>
                                       <span className="mx-3" style={{ fontSize: "1rem" }}>
                                           <b>Other College Name </b>
                                       </span>
                                       <b style={{ fontSize: "1rem" }}>{StudentsDaTa?.college_name}</b>
                                   </CardText></>
                            )}
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b>Roll Number Provided by the College :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa.roll_number}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b >Branch :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa?.branch}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b >APAAR ID :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa?.
id_number? StudentsDaTa?.
id_number :"-" }</b>
                            </CardText>
                        </CardBody>
                    </Card>
                </Row> */}
          {/* <Row>
  <Card className="py-1 mb-2">
    <CardBody>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td className="w-50"><b>Full Name</b></td>
            <td className="w-50">{StudentsDaTa?.full_name}</td>
          </tr>
          <tr>
            <td><b>Email Address</b></td>
            <td>{StudentsDaTa?.username_email}</td>
          </tr>
          <tr>
            <td><b>Mobile Number</b></td>
            <td>{StudentsDaTa?.mobile}</td>
          </tr>
          <tr>
            <td><b>District</b></td>
            <td>{StudentsDaTa?.district}</td>
          </tr>
          <tr>
            <td><b>College Type</b></td>
            <td>{StudentsDaTa?.college_type}</td>
          </tr>

          {StudentsDaTa?.college_type !== "Other" ? (
            <tr>
              <td><b>College Name</b></td>
              <td>{StudentsDaTa?.college_name}</td>
            </tr>
          ) : (
            <>
              <tr>
                <td><b>College Name</b></td>
                <td>Other</td>
              </tr>
              <tr>
                <td><b>Other College Name</b></td>
                <td>{StudentsDaTa?.college_name}</td>
              </tr>
            </>
          )}

          <tr>
            <td><b>Roll Number Provided by the College</b></td>
            <td>{StudentsDaTa?.roll_number}</td>
          </tr>
          <tr>
            <td><b>Branch</b></td>
            <td>{StudentsDaTa?.branch}</td>
          </tr>
          <tr>
            <td><b>APAAR ID</b></td>
            <td>{StudentsDaTa?.id_number ? StudentsDaTa?.id_number : "-"}</td>
          </tr>
        </tbody>
      </Table>
    </CardBody>
  </Card>
</Row> */}
          
                {/* <Row className="my-1">
                    <Card className="py-1">
                        <CardBody>
                            <h4 className="mb-2">Course Details</h4>

                            <CardText>
                                <span className="mx-3">
                                    <b>Completed Videos :</b>
                                </span>
                                <b>
                                {videos
                                    }
                                </b>
                            </CardText>

                           
                            <CardText>
                                <span className="mx-3">
                                    <b>Course Completion :</b>
                                </span>
                                <b>
                                {course?.topics_completed_count !==
                                    undefined
                                        ? `${
                                              Math.round(
                                                  (course?.topics_completed_count /
                                                    course?.all_topics_count) *
                                                      100
                                              ) + '%'
                                          }`
                                        : '-'}
                                </b>
                            </CardText>
                           
                        </CardBody>
                    </Card>
                </Row> */}
              
            {/* </Container> */}
            </div>
            </div>
    );
};

export default CommonUserProfile;
