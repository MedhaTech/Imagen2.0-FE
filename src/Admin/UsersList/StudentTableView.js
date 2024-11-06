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

const CommonUserProfile = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [button, setButton] = useState('');
    const [data, setData] = useState('');
    const currentUser = getCurrentUser('current_user');

    const StudentsDaTa = JSON.parse(localStorage.getItem('studentData'));
    // console.log(StudentsDaTa,"111");
    const [course, setCourse] = useState([]);
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const dashboardStatus = useSelector(
        (state) => state?.studentRegistration.dashboardStatus
    );

    const dispatch = useDispatch();
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
                            user_id: StudentsDaTa.user_id.toString()
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
    return (
        <div className="page-wrapper">
        <div className="content">
            <Container className="dynamic-form">
                <Row>
                    <div className="col-6">
                        {/* <BreadcrumbTwo {...headingDetails} /> */}
                        <h4 className="mt-2"> User List Details</h4>
                    </div>
                    <div className="col-6 text-end mb-2">
                      
                         <button
                          className='btn btn-info me-2'
                          onClick={handleEdit}
                        >
                        Edit
                        </button> 
                        {/* <button
                          className='btn btn-success me-2'
                          onClick={handleReset}
                        >
                    Reset
                        </button> */}
                        <button
                          className='btn btn-secondary'
                            onClick={handleViewBack}
                        >
                        Back
                        </button>
                    </div>
                </Row>
                <Row>
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
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b>College Name :</b>
                                </span>
                                <b style={{fontSize:"1rem"}} >{StudentsDaTa?.college_name}</b>
                            </CardText>

                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b>Roll number provided by the college :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa.roll_number}</b>
                            </CardText>
                            <CardText>
                                <span className="mx-3" style={{fontSize:"1rem"}}>
                                    <b >Branch :</b>
                                </span>
                                <b style={{fontSize:"1rem"}}>{StudentsDaTa?.branch}</b>
                            </CardText>
                        </CardBody>
                    </Card>
                </Row>
                {/* <Row className="my-1">
                    <Card className="py-1">
                        <CardBody>
                            <h4 className="mb-2">Organization Details</h4>

                            <CardText>
                                <span className="mx-3">
                                    <b>UDISCE Code :</b>
                                </span>

                                <b>
                                    {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .organization_code
                                    }
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>School Name :</b>
                                </span>
                                <b>
                                    {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .organization_name
                                    }
                                </b>
                            </CardText>

                            <CardText>
                                <span className="mx-3">
                                    <b>District :</b>
                                </span>
                                <b>
                                    {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .district
                                    }
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>State :</b>
                                </span>
                                <b>
                                    {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .state
                                    }
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Category :</b>
                                </span>
                                <b>
                                    {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .category
                                    }
                                   
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Pincode :</b>
                                </span>
                                <b>
                                    {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .pin_code
                                    }
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Address :</b>
                                </span>
                                <b>
                                    {
                                        StudentsDaTa?.team?.mentor?.organization
                                            .address
                                    }
                                </b>
                            </CardText>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="my-1">
                    <Card className="py-1">
                        <CardBody>
                            <h4 className="mb-2">Course Details</h4>

                            <CardText>
                                <span className="mx-3">
                                    <b>Completed Videos :</b>
                                </span>
                                <b>
                                    {dashboardStatus &&
                                    dashboardStatus?.videos_completed_count
                                        ? dashboardStatus?.videos_completed_count
                                        : '-'}
                                </b>
                            </CardText>

                            <CardText>
                                <span className="mx-3">
                                    <b>Completed Quiz :</b>
                                </span>
                                <b>
                                    {dashboardStatus &&
                                    dashboardStatus?.quiz_completed_count
                                        ? dashboardStatus?.quiz_completed_count
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Course Completion :</b>
                                </span>
                                <b>
                                    {dashboardStatus?.topics_completed_count !==
                                    undefined
                                        ? `${
                                              Math.round(
                                                  (dashboardStatus?.topics_completed_count /
                                                      dashboardStatus?.all_topics_count) *
                                                      100
                                              ) + '%'
                                          }`
                                        : '-'}
                                </b>
                            </CardText>
                            <CardText>
                                <span className="mx-3">
                                    <b>Earned Badges :</b>
                                </span>
                                <b>
                                    {dashboardStatus &&
                                    dashboardStatus?.badges_earned_count
                                        ? dashboardStatus?.badges_earned_count
                                        : '-'}
                                </b>
                            </CardText>
                        </CardBody>
                    </Card>
                </Row> */}
                {/* <Row className="my-5">
                    {button ? (
                        <Col md={12}>
                            <Card className="w-100  mb-5 p-4">
                                <CardBody>
                                    <h2 className="mb-4">Mentor Details</h2>
                                    <Row>
                                        <Col
                                            md={8}
                                            className="border-right my-auto "
                                        >
                                            <Row>
                                                <Col
                                                    md={7}
                                                    className="my-auto profile-detail w-100"
                                                >
                                                    <CardText>
                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    Mentor Name
                                                                </b>
                                                            </Col>
                                                            <Col
                                                                xs={1}
                                                                sm={1}
                                                                md={1}
                                                                xl={1}
                                                            >
                                                                :
                                                            </Col>
                                                            <Col
                                                                xs={6}
                                                                sm={6}
                                                                md={6}
                                                                xl={6}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {data?.moc_name
                                                                        ? data?.moc_name
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    Email
                                                                    Address
                                                                </b>
                                                            </Col>
                                                            <Col
                                                                xs={1}
                                                                sm={1}
                                                                md={1}
                                                                xl={1}
                                                            >
                                                                :
                                                            </Col>
                                                            <Col
                                                                xs={6}
                                                                sm={6}
                                                                md={6}
                                                                xl={6}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {data?.moc_email
                                                                        ? data?.moc_email
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>Gender</b>
                                                            </Col>
                                                            <Col
                                                                xs={1}
                                                                sm={1}
                                                                md={1}
                                                                xl={1}
                                                            >
                                                                :
                                                            </Col>
                                                            <Col
                                                                xs={6}
                                                                sm={6}
                                                                md={6}
                                                                xl={6}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {data?.moc_gender
                                                                        ? data?.moc_gender
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                        <Row className="pt-3 pb-3">
                                                            <Col
                                                                xs={5}
                                                                sm={5}
                                                                md={5}
                                                                xl={5}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>Mobile</b>
                                                            </Col>
                                                            <Col
                                                                xs={1}
                                                                sm={1}
                                                                md={1}
                                                                xl={1}
                                                            >
                                                                :
                                                            </Col>
                                                            <Col
                                                                xs={6}
                                                                sm={6}
                                                                md={6}
                                                                xl={6}
                                                                className="my-auto profile-detail"
                                                            >
                                                                <b>
                                                                    {data?.moc_phone
                                                                        ? data?.moc_phone
                                                                        : '-'}
                                                                </b>
                                                            </Col>
                                                        </Row>
                                                    </CardText>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    ) : (
                        <div>
                            <Row className="py-5">
                                <Card className="py-5">
                                    <CardBody>
                                        <h2 className="mb-4 ">
                                            No Mentor assigned yet
                                        </h2>
                                    </CardBody>
                                </Card>
                            </Row>
                        </div>
                    )}
                </Row> */}
                {/* <Row>
                    <Card className="py-2">
                        <CardBody>
                            <h4 className="mb-2">Quiz Details Table Format</h4>
                        </CardBody>
                        <div className="my-2">
                            <DataTableExtensions
                                {...CourseData}
                                exportHeaders
                                print={false}
                            >
                                <DataTable
                                    data={setCourse}
                                    defaultSortField="id"
                                    defaultSortAsc={false}
                                    pagination
                                    highlightOnHover
                                    fixedHeader
                                    subHeaderAlign={Alignment.Center}
                                />
                            </DataTableExtensions>
                        </div>
                    </Card>
                </Row> */}
            </Container>
            </div>
            </div>
    );
};

export default CommonUserProfile;
