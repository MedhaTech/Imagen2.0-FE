/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React from "react";
import { Link } from 'react-router-dom';
import reg from "../../../assets/img/reportregister1.png";

import { IoStatsChartSharp } from "react-icons/io5";

const Reports = () => {
    

return (
<div>
    <div className="page-wrapper">
        <div className="content">
            <div className="page-header">
                <div className="add-item d-flex">
                <div className="page-title">
                    <h4>YFSI Reports</h4>
                    <h6>Find user data and analytical reports here</h6>
                </div>
                </div>
            </div>
            <div className="employee-grid-widget">
                <div className="row">
                   
                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
                        <div className="employee-grid-profile"  style={{ boxShadow: "none",  }}>
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">L1 - Reports</h5>
                            </div>
                        </div>
                        <Link  to="/l1-report">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                   
                                    <IoStatsChartSharp size="40"  style={{color:"0E4B99"}}/>
                                    </div>
                                    <h4>L1 - Reports Stats</h4>
                            </div>
                        </Link>
                       
                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
                        <div className="employee-grid-profile"  style={{ boxShadow: "none",  }}>
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">L2 - Reports</h5>
                            </div>
                        </div>
                        <Link  to="/l2-report">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                    <img
                                        src={reg}
                                        alt=""
                                    />
                                    </div>
                                    <h4>L2 - Reports Stats</h4>
                            </div>
                        </Link>

                        </div>
                    </div>
                    <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6">
                        <div className="employee-grid-profile"  style={{ boxShadow: "none",}}>
                        <div className="profile-head">
                            <div className="dep-name">
                                <h5 className="active">L3 - Reports</h5>
                            </div>
                        </div>
                        <Link  to="/l3-report">
                            <div className="profile-info department-profile-info" >
                                
                                    <div className="profile-pic">
                                    <IoStatsChartSharp size="40"  style={{color:"092C4C"}}/>
                                   
                                    </div>
                                    <h4>L3 - Reports Stats</h4>
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
