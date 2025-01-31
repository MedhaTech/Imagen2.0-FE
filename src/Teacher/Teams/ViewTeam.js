/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useLayoutEffect, useEffect } from "react";
// import ImageWithBasePath from "../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../helpers/Utils";
// import edit from "../assets/img/icons/edit-set.svg";
// import customer from "../assets/img/customer/customer5.jpg";
import { useNavigate } from "react-router-dom";
// import female from "../assets/img/Female_Profile.png";
// import male from "../assets/img/Male_Profile.png";
// import { useDispatch, useSelector } from 'react-redux';
// import { getTeacherByID } from '../redux/actions';
import { encryptGlobal } from "../../constants/encryptDecrypt";

import user from "../../assets/img/user.png";
import { useLocation } from "react-router-dom";

import axios from "axios";
const TeacherProfile = () => {
  //   const dispatch = useDispatch();
  const location = useLocation();
  const mentorData = location.state || {};
  // console.log(mentorData, "data");
  const currentUser = getCurrentUser("current_user");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    mentorViewApi();
  }, [mentorData.student_id]);
  // console.log(typeof(mentorData.student_id),"type");
  const mentorViewApi = () => {
    let supId;
    if(typeof(mentorData.student_id) !== "string"){
  supId = encryptGlobal(
      JSON.stringify(mentorData.student_id)
    );
    }else{
     supId = encryptGlobal(mentorData.student_id);

    }
    // const teamApi = encryptGlobal(mentorData.student_id);
    var config = {
      method: "get",
      url: process.env.REACT_APP_API_BASE_URL + `/students/${supId}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setData(response?.data?.data[0]);
          // console.log(response, "res");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Profile Details</h4>
            {/* <h6>User Profile</h6> */}
          </div>
          <div>
          <button onClick={() =>navigate("/mentorteams") }className={"btn btn-primary"}>
            Back to Teams
           </button>
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
                    {/* <ImageWithBasePath
                      src="assets/img/customer/customer5.jpg"
                      alt="img"
                      id="blah"
                    /> */}
                    {/* <img src={customer} alt="Customer" id="blah" /> */}
                    
                      <img src={user} alt="user" id="blah" />
                    <div className="profileupload">
                      {/* <input type="file" id="imgInp" /> */}
                    </div>
                  </div>
                  <div className="profile-contentname">
                    <h2 style={{color:"blue"}} >
                    {data.full_name}
                    </h2>
                    {/* <h4>Update Personal Details.</h4> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.full_name}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.username_email}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.mobile}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.district}
                    readOnly="readonly"
                  />
                </div>
              </div>

              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label>College Type</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={data.college_type}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">College Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.college_name}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">
                    Roll Number Provided by the College
                  </label>
                  <input
                    type="text"
                    defaultValue={data.roll_number}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Branch</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.branch}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">APAAR ID</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.id_number}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Year of Study</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.year_of_study}
                    readOnly="readonly"
                  />
                </div>
              </div>

              {/* <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Password</label>
                  <div className="pass-group">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      className="pass-input form-control"
                    />
                    <span
                      className={`fas toggle-password ${
                        isPasswordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                      onClick={togglePasswordVisibility}
                    ></span>
                  </div>
                </div>
              </div> */}
              {/* <div className="col-12">
                <Link to={"/institution-dashboard"} className="btn btn-submit me-2">
                  Submit
                </Link>
                <Link className="btn btn-cancel" to={"/institution-dashboard"}>
                  Cancel
                </Link>
              </div> */}
            </div>
          </div>
        </div>
        {/* /product list */}
      </div>
    </div>
  );
};

export default TeacherProfile;
