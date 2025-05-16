/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";

import { getCurrentUser } from "../../../helpers/Utils";
import axios from "axios";

import { Link } from "react-router-dom";
import { KEY, URL } from "../../../constants/defaultValues";
import { getNormalHeaders } from "../../../helpers/Utils";
import { GiPodiumWinner } from "react-icons/gi";
import { GiPodiumSecond } from "react-icons/gi";
import { FcIdea } from "react-icons/fc";

import { FcApproval } from "react-icons/fc";
import { RiDraftFill } from "react-icons/ri";
import { FcProcess } from "react-icons/fc";
import { SiStagetimer } from "react-icons/si";
const Dashboard = () => {

  const [dateCount, setdateCount] = useState({});

  useEffect(() => {
    handlecountvalue();
  }, []);

  async function handlecountvalue() {
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);
    await axios
      .get(`${URL.gettotalcount}`, axiosConfig)
      .then(function (response) {
        if (response.status === 200) {
          setdateCount(
            response.data && response.data.data[0] && response.data.data[0]
          );
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row mt-5">

           
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/dashboard?status=SUBMITTED">
                    <div className="dash-widget w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                      <div className="dash-widgetimg">
                          <span style={{ fontSize: "1.5rem" }}>
                          <FcIdea size={60} style={{color:"yellow"}} />
                          </span>
                      </div>

                      <div className="dash-widgetcontent">
                        <h5>{dateCount.submitted_count}</h5>
                        <h6 className="text">Submitted Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
              
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/dashboard?status=DRAFT">
                    <div className="dash-widget w-100" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                      <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <RiDraftFill  size={40} style={{color:"#ff8c00"}}  />
                        </span>
                    </div>

                      <div className="dash-widgetcontent">
                        <h5> {dateCount.draft_count}</h5>
                        <h6 className="text">Draft Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
               
                <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewlist?title=L1 - Yet to Processed&level=L1">
                    <div className="dash-widget dash2" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <i className="fas fa-hourglass-half" style={{ color: "rgb(65 105 217)" }}></i>
                        </span>
                    </div>

                      <div className="dash-widgetcontent">
                        <h5>   {dateCount.l1_yet_to_process}</h5>
                        <h6 className="text"> L1 - Yet To Processed Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                  <div className="col-xl-4 col-sm-6 col-12">
                <Link to="/eadmin/evaluationStatus/viewlist?evaluation_status=SELECTEDROUND1&title=Accepted&level=L1">
                    <div className="dash-widget dash2" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                      <div className="dash-widgetimg">
                          <span style={{ fontSize: "1.5rem" }}>
                             
                              <FcApproval size={40} style={{color:"green"}}/>
                          </span>
                      </div>
                      <div className="dash-widgetcontent">
                        <h5>  {dateCount.selected_round_one_count}</h5>
                        <h6 className="text">Accepted Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
              
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewlist?evaluation_status=REJECTEDROUND1&title=Rejected&level=L1">
                    <div className="dash-widget dash2" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                          
                            <i className="fas fa-thumbs-down" style={{color:"rgb(128 0 128)"}}></i>
                        </span>
                    </div>
                    <div className="dash-widgetcontent">
                        <h5>   {dateCount.rejected_round_one_count}</h5>
                        <h6 className="text">Rejected Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewlist?title=L2 - Yet to Processed&level=L2">
                    <div className="dash-widget dash1" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <SiStagetimer size={40} style={{color:"#3c1414"}}/>
                        </span>
                    </div>




                      <div className="dash-widgetcontent">
                        <h5>{dateCount.l2_yet_to_processed}</h5>
                        <h6 className="text"> L2 - Yet To Processed Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewlist?title=L2 - Processed&level=L2">
                    <div className="dash-widget dash1" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <div className="dash-widgetimg">
                      <span style={{ fontSize: "1.5rem" }}>
                          <FcProcess size="40" style={{ color: "#682860" }}/>
                      </span>
                  </div>


                      <div className="dash-widgetcontent">
                        <h5>{dateCount.l2_processed}</h5>
                        <h6 className="text"> L2 - Processed Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                 
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewfinallist?title=0&level=L2">
                    <div className="dash-widget dash1" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                        <GiPodiumSecond  size="60" style={{ color: "red" }}/>
                        </span>
                    </div>

                      <div className="dash-widgetcontent">
                        <h5> {dateCount.final_evaluation_challenge}</h5>
                        <h6 className="text">L3 Promoted Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewfinallist?title=1&level=L2">
                    <div className="dash-widget dash3" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <GiPodiumWinner size="60" style={{ color: "#008000 " }}/>
                        </span>
                    </div>

                      <div className="dash-widgetcontent">
                        <h5> {dateCount.final_evaluation_final}</h5>
                        <h6 className="text">Final Winners Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>

               

               
               
               
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
