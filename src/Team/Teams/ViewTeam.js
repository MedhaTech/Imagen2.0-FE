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
import Avatar from 'react-string-avatar';
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
  console.log(data,"id",
    data?.college_town,"town"
  );
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
            <h4>Profile Details</h4>
            {/* <h6>User Profile</h6> */}
          </div>
          <div>
          <button onClick={() =>navigate("/student-team") }className={"btn btn-primary"}>
            Back to Manage Team
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
                    
                      {/* <img src={user} alt="user" id="blah" /> */}
                      <Avatar initials={data?.full_name?.split(' ').map(w => w.charAt(0)).join('')} bgColor="#36adf2" textColor="black" roundShape="true" pictureResolution={256} height={100}  width={110}></Avatar>
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
                  <label className="form-label">Gender</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.gender}
                    readOnly="readonly"
                  />
                </div>
              </div>
               <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.dateofbirth}
                    readOnly="readonly"
                  />
                </div>
              </div> <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Disability Status</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data.disability}
                    readOnly="readonly"
                  />
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="input-blocks">
                  <label className="form-label">Area of Residence</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={data?.area}
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
                    defaultValue={maskEmail(data?.username_email)}
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
                    defaultValue={maskMobileNumber(data?.mobile)}
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
                  <label>College Town</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data?.college_town ? data?.college_town :"-"}
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
              {data.college_type == "Other" &&( <><div className="col-lg-4 col-sm-12">
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
                      defaultValue={data.college_name}
                      readOnly="readonly" />
                  </div>
                </div></>)}
              {data.college_type !== "Other" &&( <div className="col-lg-7 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">College Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={data.college_name}
                      readOnly="readonly" />
                  </div>
                </div>)}
              <div  className={`col-lg-${
    data.college_type !== "Other" ? "5" : "4"
  } col-sm-12`}>
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
                  <label className="form-label"> Branch/Group/Stream</label>
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
                    value={data?.id_number ? data.id_number : "-"}
                    // defaultValue={data?.id_number ? data?.id_number : "-"}
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
