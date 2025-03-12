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
import DoughnutChart from '../../Teacher/Dashboard/TeamsProgDD';

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
import { MaskedEmail,MaskedMobile } from '../../RegPage/MaskedData';
const InstProfile = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [button, setButton] = useState('');
    const [data, setData] = useState('');
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
   
    const StudentsDaTa = JSON.parse(localStorage.getItem('studentData'));
    // console.log(StudentsDaTa,"111");
  
    var teamId = [];
    teamId.push({
        mentor_id: StudentsDaTa.mentor_id,
        user_id: StudentsDaTa.user_id,
        college_name:StudentsDaTa.college_name
    });
 
    
  
    const handleViewBack = () => {
       
        navigate("/institution-users-list");
       
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
                  handleResetApi();
                }
            })
            .catch((err) => console.log(err.response));
    };
      const handleResetApi = () => {
        const body = JSON.stringify({
            email: StudentsDaTa.username_email,
            otp: false,
            role:"MENTOR",
            mentor_id: StudentsDaTa.mentor_id
        });
        var config = {
            method: 'put',
            url: process.env.REACT_APP_API_BASE_URL + '/mentors/resetPassword',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            },
            data: body
        };
        axios(config)
            .then(function (response) {
              // console.log(response,"res");
                if (response.status === 202) {
                    openNotificationWithIcon(
                        'success',
                        'Password Updated to Mobile Number Successfully'
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
   
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
   

    const handleEdit = () => {
        navigate(
            "/Institution-edit",
            { state: { mentor_id: StudentsDaTa.mentor_id ,studentsData: StudentsDaTa} });
    };
    
    return (
        <div className="page-wrapper">
        <div className="content">
            {/* <Container className="dynamic-form"> */}
                <Row>
                    <div className="col-6">
                        <h4 className="mt-2">Institution Profile - <span style={{color:"#17A2B8"}}>{StudentsDaTa?.full_name}</span></h4>


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
                            // onClick={() => navigate(-1)}
                        >
                        Back
                        </button>
                    </div>
                </Row>

<Row className="mx-1 my-2">
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
            <td> <MaskedEmail email={StudentsDaTa?.username_email} /></td>
           
          </tr>
          <tr>
            <td><b>Mobile Number</b></td>
            <td> <MaskedMobile mobile={StudentsDaTa?.mobile} /></td>
          </tr>
          <tr>
            <td><b>District</b></td>
            <td>{StudentsDaTa?.district}</td>
          </tr>
          <tr>
            <td><b>College Type</b></td>
            <td>{StudentsDaTa?.college_type}</td>
          </tr>
          <tr>
                <td><b>College Name</b></td>
                <td>{StudentsDaTa?.college_name}</td>
              </tr>
          {/* {StudentsDaTa?.college_type !== "Other" ? (
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
          )} */}

          {/* <tr>
            <td><b>Roll Number Provided by the College</b></td>
            <td>{StudentsDaTa?.roll_number}</td>
          </tr>
          <tr>
            <td><b> Branch/Group/Stream</b></td>
            <td>{StudentsDaTa?.branch}</td>
          </tr>
          <tr>
            <td><b>APAAR ID</b></td>
            <td>{StudentsDaTa?.id_number ? StudentsDaTa?.id_number : "-"}</td>
          </tr> */}
        </tbody>
      </Table>
    </CardBody>
  </Card>
</Row>


<Row>
                            <Col>
                                <div >
                                    <DoughnutChart
                                        user={teamId}
                                        dashBoard={'Admin'}
                                    />
                                </div>
                            </Col>
                    </Row>
               
          
              
              
            {/* </Container> */}
            </div>
            </div>
    );
};

export default InstProfile;
