/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState,useEffect } from "react";
// import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../helpers/Utils";
import edit from "../assets/img/icons/edit-set.svg";
// import customer from "../assets/img/customer/customer5.jpg";
import { useNavigate } from "react-router-dom";
// import male from "../assets/img/admin.jpg";
import male from "../assets/img/imazenlogo1.jpg";

import { Row, Col, Label, Container, Card, } from 'reactstrap';
import { encryptGlobal } from '../constants/encryptDecrypt';
import axios from 'axios';

const EvaluatorProfile = () => {
  const currentUser = getCurrentUser("current_user");
  const [mobile,setMobile]=useState("-");
  const [states,setStates]=useState([]);

  const navigate = useNavigate();
 useEffect(()=>{
getAPi();
 },[]);
 const getAPi = () => {
  const teamApi = encryptGlobal(
      JSON.stringify(
          currentUser?.data[0]?.evaluator_id
      )
  );
  var config = {
      method: 'get',
      url:
          process.env.REACT_APP_API_BASE_URL +
          `/evaluators/${teamApi}`,
      headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${currentUser.data[0]?.token}`
      }
  };
  axios(config)
      .then(function (response) {
          if (response.status === 200) {
            console.log(response,"response");
            setMobile(response.data.data[0].mobile);
            const statesString = response.data.data[0].state; 
            setStates(statesString.split(','));
            // setStates(response.data.data[0].states);


          }
      })
      .catch(function (error) {
          console.log(error);
      });
};
console.log(mobile,"m");
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Evaluator Profile</h4>
          </div>
        </div>
        {/* /product list */}
        <div className="card">
          <div className="card-body">
            <div className="profile-set">
              <div className="profile-head"></div>
              <div className="profile-top">
                <div className="profile-content">
                  <div className="profile-contentimg">
                  <img src={male} alt="Male" id="blah" />
                  {/* <img src={customer} alt="Customer" id="blah" /> */}
                  <div className="profileupload"></div>
                  </div>
                  <div className="profile-contentname">
                    <h2>{currentUser?.data[0]?.full_name}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={currentUser?.data[0]?.full_name}
                    readOnly="readonly"
                  />
                </div>
              </div>
             
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={currentUser?.data[0]?.name}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label>Mobile Number</label>
                  <input
                    type="email"
                    className="form-control"
                    // defaultValue={mobile}
                    value={mobile}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <Container>
                <Card className="m-3 p-3">
                  
                    <Row>
                        <Label className="mb-2">Evaluator Enable States:</Label>
                        <Row>
                        {/* {states.length > 0 ? (
                        states.map((state, index) => (
                            <Col key={index} xs={12} md={6} lg={3} className="mb-2">
                                <div>
                                    {state.trim()} 
                                </div>
                            </Col>
                        ))
                    ) : (
                        <div>No states available</div>
                    )} */}
                     {states.length > 0 ? (
                        states.map((state, index) => (
                            <Col key={index} xs={12} md={6} lg={3} className="mb-2">
                                <div className="d-flex align-items-center">
                                    {/* <input 
                                        type="checkbox" 
                                        checked 
                                        readOnly 
                                        className="me-2" 
                                        style={{ 
                                          pointerEvents: 'none', 
                                          cursor: 'default' 
                                      }} 
                                    /> */}
                                    <span>{state.trim()}</span>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <div>No states available</div>
                    )}
                </Row>
                    </Row>
                </Card>
              
            </Container>
             
             
             
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default EvaluatorProfile;
