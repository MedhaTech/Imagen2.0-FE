/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState ,useLayoutEffect,} from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../helpers/Utils";
import { useNavigate } from "react-router-dom";
import male from "../assets/img/imazenlogo1.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherByID } from '../redux/actions';

import axios from "axios";
const TeacherProfile = () => {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser("current_user");
  const { teacher } = useSelector((state) => state.teacher);
  // console.log(teacher,"11");
  const navigate = useNavigate();
const [data,setData]=useState({});
  const handleEdit = () => {
    navigate("/mentoreditprofile", {
      state: {
        full_name:currentUser?.data[0]?.full_name,
        mentor_id: currentUser?.data[0]?.mentor_id,
        // mobile: teacher?.mobile,
        username: currentUser?.data[0]?.name,
        title:currentUser?.data[0]?.title,
        gender: currentUser?.data[0]?.gender,
        // whatapp_mobile: teacher?.whatapp_mobile
      },
    });
  };
  useLayoutEffect(() => {
    if (currentUser?.data[0]?.mentor_id) {
        dispatch(getTeacherByID(currentUser?.data[0]?.mentor_id));
    }
}, [currentUser?.data[0]?.mentor_id]);
const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email; 
  const [username, domain] = email.split('@');
  const maskedUsername = username.slice(0, 3) + '****'; 
  return `${maskedUsername}@${domain}`;
};
const maskMobileNumber = (mobile) => {
  if (!mobile || mobile.length < 10) return mobile; 
  return mobile.slice(0, -3).replace(/\d/g, '*') + mobile.slice(-3);
};
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Institution Profile</h4>
            {/* <h6>User Profile</h6> */}
          </div>
          <div>
          {/* <button onClick={() => handleEdit() }className={"btn btn-primary"}>
                        <img src={edit} alt="Edit" />
                      </button> */}
                        {/* <h4>Update Personal Details.</h4> */}
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
                   
                    <div className="profileupload">
                      {/* <input type="file" id="imgInp" /> */}
                      
                    </div>
                    
                  </div>
                  <div className="profile-contentname">
                    <h2>
                      {
                        teacher?.full_name}
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
                    defaultValue={
                     
                      teacher.full_name
                    }
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
                    defaultValue={maskEmail(teacher?.username_email)}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={maskMobileNumber(teacher?.mobile)}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">District</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={
                      teacher?.district
                    }
                  />
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label>College Type</label>
                  <input
                    type="email"
                    className="form-control"
                    defaultValue={teacher?.college_type
                    }
                    readOnly="readonly"
                  />
                </div>
              </div>
              {teacher?.college_type == "Other" &&( <><div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">College Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Other"
                    readOnly="readonly" />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Other College Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={teacher?.college_name}
                      readOnly="readonly" />
                  </div>
                </div></>)}
              {/* <div className="col-lg-6 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">College Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={
                      teacher?.college_name


                    }
                    readOnly="readonly"
                  />
                </div>
              </div> */}
              {teacher.college_type !== "Other" &&( <div className="col-lg-6 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">College Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={teacher.college_name}
                      readOnly="readonly" />
                  </div>
                </div>)}
             
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
