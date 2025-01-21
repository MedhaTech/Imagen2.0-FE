/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import {
  File,
  User,
  UserCheck,
} from "feather-icons-react/build/IconComponents";
// import ImageWithBasePath from "../../core/img/imagewithbasebath";
// import { all_routes } from "../../Router/all_routes";
import { getCurrentUser } from "../../../helpers/Utils";
import axios from "axios";

import { Card, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { KEY, URL } from "../../../constants/defaultValues";
import { getNormalHeaders } from "../../../helpers/Utils";
const Dashboard = () => {
  const currentUser = getCurrentUser("current_user");

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
          console.log(response,"11");
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

            {/* <Container> */}
              {/* <Row className="mb-5"> */}
              {/* <Row> */}
                {/* <Col md={4}> */}
                  {/* <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/dashboard?status=ACCEPTED">
                    <div className="dash-widget w-100">
                      <div className="dash-widgetimg">
                          <span style={{ fontSize: "1.5rem" }}>
                              <i className="fas fa-user-check" style={{ color: "orange" }}></i>
                          </span>
                      </div>

                      <div className="dash-widgetcontent">
                        <h5>{dateCount.mentorAcceptedCount}</h5>
                        <h6 className="text">Mentor Accepted Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div> */}
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/dashboard?status=SUBMITTED">
                    <div className="dash-widget w-100">
                      <div className="dash-widgetimg">
                          <span style={{ fontSize: "1.5rem" }}>
                              <i className="fas fa-user-check" style={{ color: "rgb(65 105 217)" }}></i>
                          </span>
                      </div>

                      <div className="dash-widgetcontent">
                        <h5>{dateCount.submitted_count}</h5>
                        <h6 className="text">Submitted Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                {/* </Col> */}
                {/* <Col md={4}> */}
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/dashboard?status=DRAFT">
                    <div className="dash-widget w-100">
                      <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <i className="fas fa-pencil-alt" style={{ color: "orange" }}></i>
                        </span>
                    </div>

                      <div className="dash-widgetcontent">
                        <h5> {dateCount.draft_count}</h5>
                        <h6 className="text">Draft Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                {/* </Col> */}
                {/* <Col md={4}> */}
                <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewlist?title=L1 - Yet to Processed&level=L1">
                    <div className="dash-widget dash2">
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
                    <div className="dash-widget dash2">
                      <div className="dash-widgetimg">
                          <span style={{ fontSize: "1.5rem" }}>
                              <i className="fas fa-thumbs-up" style={{ color: "rgb(65 105 217)" }}></i>
                          </span>
                      </div>
                      <div className="dash-widgetcontent">
                        <h5>  {dateCount.selected_round_one_count}</h5>
                        <h6 className="text">Accepted Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>
                {/* </Col> */}
              {/* </Row> */}
                  <div className="col-xl-4 col-sm-6 col-12 ">
                <Link to="/eadmin/evaluationStatus/viewlist?evaluation_status=REJECTEDROUND1&title=Rejected&level=L1">
                    <div className="dash-widget dash2">
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <i className="fas fa-thumbs-down" style={{ color: "rgb(65 105 217)" }}></i>
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
                    <div className="dash-widget dash1">
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <i className="fas fa-clock" style={{ color: "rgb(32 201 151)" }}></i>
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
                    <div className="dash-widget dash1">
                    <div className="dash-widgetimg">
                      <span style={{ fontSize: "1.5rem" }}>
                          <i className="fas fa-tasks" style={{ color: "rgb(32 201 151)" }}></i>
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
                    <div className="dash-widget dash1">
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <i className="fas fa-clipboard-list" style={{ color: "rgb(32 201 151)" }}></i>
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
                    <div className="dash-widget dash3">
                    <div className="dash-widgetimg">
                        <span style={{ fontSize: "1.5rem" }}>
                            <i className="fas fa-flag-checkered" style={{ color: "rgb(128 0 128)" }}></i>
                        </span>
                    </div>

                      <div className="dash-widgetcontent">
                        <h5> {dateCount.final_evaluation_final}</h5>
                        <h6 className="text">Final Winners Challenges</h6>
                      </div>
                    </div>
                </Link>
                  </div>

                {/* <Col lg={6} md={6}>
                  <Link to="/eadmin/dashboard?status=DRAFT">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-secondary">DRAFT CHALLENGES</b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.draft_count}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
              {/* </Row> */}
              {/* <Row className="mb-5"> */}
                {/* <Col lg={4} md={4}>
                  <Link to="/eadmin/evaluationStatus/viewlist?evaluation_status=SELECTEDROUND1&title=L1 Accepted&level=L1">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-success">ACCEPTED CHALLENGES</b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.selected_round_one_count}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
                {/* <Col lg={4} md={4}>
                  <Link to="/eadmin/evaluationStatus/viewlist?evaluation_status=REJECTEDROUND1&title=L1 Rejected&level=L1">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-danger">REJECTED CHALLENGES</b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.rejected_round_one_count}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
                {/* <Col lg={4} md={4}>
                  <Link to="/eadmin/evaluationStatus/viewlist?title=L1 - Yet to be Processed&level=L1">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-warning">
                        L1 - YET TO PROCESSED CHALLENGES
                      </b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.l1_yet_to_process}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
              {/* </Row> */}
              {/* <Row className="mb-5"> */}
                {/* <Col lg={6} md={6}>
                  <Link to="/eadmin/evaluationStatus/viewlist?title=L2 - Processed&level=L2">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-success">L2 - PROCESSED CHALLENGES</b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.l2_processed}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
                {/* <Col lg={6} md={6}>
                  <Link to="/eadmin/evaluationStatus/viewlist?title=L2 - Yet to be Processed&level=L2">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-warning">
                        L2 - YET TO PROCESSED CHALLENGES
                      </b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.l2_yet_to_processed}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
              {/* </Row> */}
              {/* <Row className="mb-5"> */}
                {/* <Col md={6}>
                  <Link to="/eadmin/evaluationStatus/viewfinallist?title=0&level=L2">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-warning">
                        FINAL EVALUATION CHALLENGES
                      </b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.final_evaluation_challenge}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
                {/* <Col md={6}>
                  <Link to="/eadmin/evaluationStatus/viewfinallist?title=1&level=L2">
                    <Card className="p-4 text-center card-effect mb-3">
                      <b className="text-success">FINAL WINNERS CHALLENGES</b>
                      <h3 className="display-5 bold m-2">
                        {dateCount.final_evaluation_final}
                      </h3>
                    </Card>
                  </Link>
                </Col> */}
              {/* </Row> */}
            {/* </Container> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
