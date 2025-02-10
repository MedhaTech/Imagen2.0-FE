/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from 'react';
import { Link } from 'react-router-dom';
import reg from "../../assets/img/reportregister1.png";
import school from "../../assets/img/reportschool.png";
import student from "../../assets/img/reportsstudent1.png";
import idea from "../../assets/img/reportidea.png";
import user from "../../assets/img/user.png";
import user1 from "../../assets/img/reportuser1.png";
import user2 from "../../assets/img/reportuser2.png";
import user3 from "../../assets/img/reportuser3.png";
import { FcPositiveDynamic } from "react-icons/fc";
const Reports = () => {
    
return (
<div>
    <div className="page-wrapper">
        <div className="content">
            <div className="page-header">
                <div className="add-item d-flex">
                <div className="page-title">
                    <h4>Reports</h4>
                    <h6>Find user data and analytical reports here</h6>
                </div>
                </div>
            </div>
            <div className="employee-grid-widget">
                <div className="row d-flex justify-content-center">
                    <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6"
                    >
                        <div className="employee-grid-profile">
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">Registration</h5>
                            </div>
                        </div>
                        <Link  to="/reportsregistration">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                    <img
                                        src={reg}
                                        alt=""
                                    />
                                    </div>
                                    <h4>District wise Students Reg Status</h4>
                            </div>
                        </Link>
                       
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                        <div className="employee-grid-profile">
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">Registration</h5>
                            </div>
                        </div>
                        <Link  to="/reportsteacher">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                    <img
                                        src={school}
                                        alt=""
                                    />
                                    </div>
                                    <h4>District wise Institutions Reg Status</h4>
                            </div>
                        </Link>
                       
                        </div>
                    </div>
                    </div>
                    <div className="row d-flex justify-content-center">

                    <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                        <div className="employee-grid-profile">
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">Institutions Progress</h5>
                            </div>
                        </div>
                        <Link  to="/institution-progress">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                    <img
                                        src={student}
                                        alt=""
                                    />
                                    </div>
                                    <h4>Institution Individuals status</h4>
                            </div>
                        </Link>
                       
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                        <div className="employee-grid-profile">
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">Students Progress</h5>
                            </div>
                        </div>
                        <Link  to="/student-Report">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                    {/* <img
                                        src={student}
                                        alt=""
                                    /> */}
                                    <FcPositiveDynamic size="50"/>

                                    </div>
                                    <h4>Individuals status</h4>
                            </div>
                        </Link>
                       
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-4 col-lg-6 col-md-6">
                        <div className="employee-grid-profile">
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">Ideas Submitted</h5>
                            </div>
                        </div>
                        <Link  to="/idea-submission-report ">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                    <img
                                        src={idea}
                                        alt=""
                                    />

                                    </div>
                                    <h4>Innovations</h4>
                            </div>
                        </Link>
                       
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    </div>
</div>

);
};
export default Reports;
