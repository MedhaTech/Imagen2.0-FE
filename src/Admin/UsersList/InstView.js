/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Container, Row, Card, CardBody, CardText, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';

import 'react-data-table-component-extensions/dist/index.css';
import { getCurrentUser, openNotificationWithIcon } from '../../helpers/Utils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DoughnutChart from '../../Teacher/Dashboard/TeamsProgDD';


import Swal from 'sweetalert2/dist/sweetalert2.js';
import logout from '../../assets/img/logout.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Table} from "react-bootstrap";
const InstProfile = (props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const dispatch = useDispatch();
   
    const StudentsDaTa = JSON.parse(localStorage.getItem('studentData'));
  
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
      // this function reset the password for Institution 

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
   
  
   

    const handleEdit = () => {
        navigate(
            "/Institution-edit",
            { state: { mentor_id: StudentsDaTa.mentor_id ,studentsData: StudentsDaTa} });
    };
    
    return (
        <div className="page-wrapper">
        <div className="content">
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
            <td> {StudentsDaTa?.username_email}</td>
           
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
          <tr>
                <td><b>College Name</b></td>
                <td>{StudentsDaTa?.college_name}</td>
              </tr>
         
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
               
          
              
              
            </div>
            </div>
    );
};

export default InstProfile;
