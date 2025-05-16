/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  getCurrentUser,
  setCurrentUser,
  openNotificationWithIcon,
} from "../helpers/Utils";
import { useLocation } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import female from "../assets/img/Female_Profile.png";
import male from "../assets/img/Male_Profile.png";
import user from "../assets/img/user.png";
const TeacherEditProfile = () => {
  const location = useLocation();
  const mentorData = location.state || {};
  const navigate = useNavigate();

  const currentUser = getCurrentUser("current_user");
  const getValidationSchema = () => {
    // where data = mentorData //
    const adminValidation = Yup.object({
     
      title: Yup.string().required(
        <span style={{ color: "red" }}>Please select Title</span>
      ),
      gender:Yup.string().required(
        <span style={{ color: "red" }}>Please select Gender</span>
      ),
      full_name: Yup.string()
       
        .trim()
        .min(2, <span style={{ color: "red" }}>Please Enter Full Name</span>)
        .matches(/^[aA-zZ\s]+$/, "Special Characters are not allowed")
        .required(<span style={{ color: "red" }}>Please Enter Full Name</span>),
    
    });
    return adminValidation;
  };
  const getInitialValues = (mentorData) => {
    const commonInitialValues = {
      full_name: mentorData?.full_name,

      title: mentorData.title,
        gender: mentorData.gender,
    };
    return commonInitialValues;
  };
  const formik = useFormik({
    initialValues: getInitialValues(mentorData),
    validationSchema: getValidationSchema(),
    onSubmit: (values) => {
      const full_name = values.full_name;
      const title = values.title;
        const gender = values.gender;
      const body = JSON.stringify({
        full_name: full_name,
        title: title,
        gender: gender,
        username: mentorData.username,
      });
      const ment = encryptGlobal(JSON.stringify(mentorData.mentor_id));
      const url = process.env.REACT_APP_API_BASE_URL + "/mentors/" + ment;
      var config = {
        method: "put",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data[0]?.token}`,
        },
        data: body,
      };
      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            openNotificationWithIcon("success", "Updated Successfully");
            currentUser.data[0].full_name = values.full_name;
            currentUser.data[0].title = values.title;
            currentUser.data[0].gender = values.gender;

            setCurrentUser(currentUser);
            setTimeout(() => {
              navigate("/mentorprofile");
            }, 2000);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  });
  const formLoginStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const buttonStyle = {
    marginRight: '10px'
  };

  const cancelLinkStyle = {
    marginLeft: 'auto'
  };
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Teacher Edit Profile</h4>
            <h6>User Profile</h6>
          </div>
        </div>
        {/* /product list */}
        <form onSubmit={formik.handleSubmit}>
          <div className="card">
            <div className="card-body">
              <div className="profile-set">
                <div className="profile-head"></div>
                <div className="profile-top">
                  <div className="profile-content">
                    <div className="profile-contentimg">
                    {currentUser?.data[0]?.gender === "Male" || currentUser?.data[0]?.gender === "MALE" ? (
                      <img src={male} alt="Male" id="blah" />
                    ) : ((currentUser?.data[0]?.gender === "Female" || currentUser?.data[0]?.gender === "FEMALE")?(
                      <img src={female} alt="Female" id="blah" />):(<img src={user} alt="user" id="blah" />)
                    )}
                    </div>
                    <div className="profile-contentname">
                      <h2>
                        {currentUser?.data[0]?.title +
                          "." +
                          currentUser?.data[0]?.full_name}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-login col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label>Title</label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="title"
                      value={formik.values.title}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    >
                      <option value="">Title</option>
                      <option value="Dr">Dr</option>
                      <option value="Mr">Mr</option>
                      <option value="Miss">Miss</option>
                      <option value="Mrs">Mrs</option>
                    </select>
                    {formik.touched.title && formik.errors.title ? (
                      <small className="error-cls">{formik.errors.title}</small>
                    ) : null}
                  </div>
                </div>
                <div className="form-login col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label className="form-label">Teacher Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="full_name"
                      name="full_name"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const lettersOnly = inputValue.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        );
                        formik.setFieldValue("full_name", lettersOnly);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.full_name}
                    />
                    {formik.touched.full_name && formik.errors.full_name ? (
                      <small className="error-cls">
                        {formik.errors.full_name}
                      </small>
                    ) : null}
                  </div>
                </div>
                <div className="form-login col-lg-4 col-sm-12">
                  <div className="input-blocks">
                    <label>Gender</label>
                    <select
                      id="inputState"
                      className="form-select"
                      name="gender"
                      value={formik.values.gender}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    >
                      <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Prefer Not to Mention">Prefer Not to Mention</option>
                    </select>
                    {formik.touched.gender && formik.errors.gender ? (
                      <small className="error-cls">{formik.errors.gender}</small>
                    ) : null}
                  </div>
                </div>
                <div className="form-login" style={formLoginStyle}>
                  <button
                    style={buttonStyle}
                    
                    type="submit"
                    className={`btn btn-warning  ${
                      !(formik.dirty && formik.isValid) ? "default" : "primary"
                    }`}
                    disabled={!(formik.dirty && formik.isValid)}
                  >
                    Submit
                  </button>
                  <Link className="btn btn-cancel" to={"/mentorprofile"}  style={cancelLinkStyle}>
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditProfile;
