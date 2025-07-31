/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";

import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";


import { useLocation } from "react-router-dom";
import axios from "axios";

import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";



const MentorShipEditUser = () => {
  const location = useLocation();
  const MentorShiptData = location.state || {};
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: MentorShiptData.full_name,
      college_name: MentorShiptData.college_name,
      mobile: MentorShiptData.mobile,
      username: MentorShiptData.username,
      area_of_expertise: MentorShiptData.area_of_expertise,

      

    },
     validationSchema: Yup.object({
         full_name: Yup.string()
           .trim()
           .min(2, <span style={{ color: "red" }}>Please Enter Full Name</span>)
           .matches(
             /^[aA-zZ\s]+$/,
             <span style={{ color: "red" }}>
               Special Characters are not allowed
             </span>
           )
           .required(<span style={{ color: "red" }}>Please Enter Full Name</span>),
         username: Yup.string()
           .email(
             <span style={{ color: "red" }}>Please Enter Valid Email Address</span>
           )
           .required(
             <span style={{ color: "red" }}>Please Enter Email Address</span>
           )
           .matches(
             /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
             "Email must be Valid"
           )
           .max(255),
         mobile: Yup.string()
           .required(
             <span style={{ color: "red" }}>Please Enter Mobile Number</span>
           )
           .trim()
           .matches(
             /^\d+$/,
             <span style={{ color: "red" }}>
               Mobile number is not valid (Enter only digits)
             </span>
           )
           .max(
             10,
             <span style={{ color: "red" }}>
               Please enter only 10 digit valid number
             </span>
           )
           .min(
             10,
             <span style={{ color: "red" }}>Number is less than 10 digits</span>
           ),
   
         college_name: Yup.string()
           .trim()
           .min(
             2,
             <span style={{ color: "red" }}>
               Please Enter Organization / Institution
             </span>
           )
           .matches(
             /^[aA-zZ\s]+$/,
             <span style={{ color: "red" }}>
               "Special Characters are not allowed"
             </span>
           )
           .required(
             <span style={{ color: "red" }}>
               Please Enter Organization / Institution
             </span>
           ),
   
         area_of_expertise: Yup.string()
           .trim()
           .min(
             2,
             <span style={{ color: "red" }}>Please Enter Area of Expertise</span>
           )
           .matches(
             /^[aA-zZ\s]+$/,
             <span style={{ color: "red" }}>
               "Special Characters are not allowed"
             </span>
           )
           .required(
             <span style={{ color: "red" }}>Please Enter Area of Expertise</span>
           ),
       }),
    onSubmit: (values) => {
      const body = {
      full_name: values.full_name.trim(),
        areas_of_expertise: values.area_of_expertise.trim(),
        college_name: values.college_name.trim(),
      };
       if (MentorShiptData && MentorShiptData.username !== values.username && values.username) {
        body["username"] = values.username;
    }
    
    if (MentorShiptData && MentorShiptData.mobile !== values.mobile && values.mobile) {
        body["mobile"] = values.mobile;
    }
    
      const teamparamId = encryptGlobal(JSON.stringify(MentorShiptData.mentorship_id));
      var config = {
        method: "put",
        url: process.env.REACT_APP_API_BASE_URL + "/mentorships/" + teamparamId,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data[0]?.token}`,
        },
        data: JSON.stringify(body),
      };

      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            openNotificationWithIcon(
              "success",
              "Mentor Details Updated Successfully "
            );
            navigate("/admin-mentorship-list");
          } else {
            openNotificationWithIcon("error", "Opps! Something Wrong");
          }
        })
        .catch(function (err) {
          if (err.response.data?.message === "mobile_UNIQUE must be unique") {
            openNotificationWithIcon("error","Mobile Number is already exists");
          } else if (err.response.data?.message === "username_UNIQUE must be unique") {
            openNotificationWithIcon("error", "Email Id is already exists");
          } else {
            openNotificationWithIcon("error", err.response.data?.message);
          }
        });
    },
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="login-userheading">
          <h4>Edit Mentor User Details</h4>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card container m-4">
            <div className="row">
              <div
                className="col-md-12 p-4"
                style={{ backgroundColor: "#EEEEEE" }}
              >
                <form onSubmit={formik.handleSubmit}>
                  <div className="col-xl-12">
                    <div className="row g-3 mt-0">
                     <>
                          <div className="col-md-12">
                            <label className="form-label" htmlFor="full_name">
                              Full Name
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Full Name"
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
                            {formik.touched.full_name &&
                            formik.errors.full_name ? (
                              <small className="error-cls">
                                {formik.errors.full_name}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-6`}>
                            <label htmlFor="username" className="form-label">
                              Email
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <input
                              type="username"
                              className="form-control"
                              id="username"
                              placeholder="Email"
                              name="username"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.username}
                            />
                            {formik.touched.username && formik.errors.username ? (
                              <small
                                className="error-cls"
                                style={{ color: "red" }}
                              >
                                {formik.errors.username}
                              </small>
                            ) : null}
                          </div>

                          <div className="col-md-6">
                            <label className="form-label" htmlFor="mobile">
                              Mobile Number
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              id="mobile"
                              placeholder="Mobile"
                              name="mobile"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(
                                  /\D/g,
                                  ""
                                );
                                formik.setFieldValue("mobile", numericValue);
                              }}
                              maxLength={10}
                              minLength={10}
                              onBlur={formik.handleBlur}
                              value={formik.values.mobile}
                            />
                            {formik.touched.mobile && formik.errors.mobile ? (
                              <small className="error-cls">
                                {formik.errors.mobile}
                              </small>
                            ) : null}
                          </div>

                          <div className={`col-md-12`}>
                            <label htmlFor="college_name" className="form-label">
                              Organization / Institution
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Organization / Institution"
                              id="college_name"
                              name="college_name"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const lettersOnly = inputValue.replace(
                                  /[^a-zA-Z\s]/g,
                                  ""
                                );
                                formik.setFieldValue("college_name", lettersOnly);
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.college_name}
                            />
                            {formik.touched.college_name && formik.errors.college_name ? (
                              <small className="error-cls">
                                {formik.errors.college_name}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-12`}>
                            <label
                              htmlFor="area_of_expertise"
                              className="form-label"
                            >
                              Areas of Expertise
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <textarea
                               type="text"
                              className="form-control"
                              id="area_of_expertise"
                              name="area_of_expertise"
                              // rows={5}
                              placeholder="Areas of Expertise "
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.area_of_expertise}
                            />
                            {formik.touched.area_of_expertise &&
                            formik.errors.area_of_expertise ? (
                              <small className="error-cls">
                                {formik.errors.area_of_expertise}
                              </small>
                            ) : null}
                          </div>
                        </>
                      <div className="form-login d-flex justify-content-between">
                        <button
                          className={`btn btn-warning m-2 ${!formik.dirty || !formik.isValid
                            ? "default"
                            : "primary"
                            }`}
                          type="submit"
                          disabled={
                            !formik.dirty ||
                            !formik.isValid
                          }
                        >
                          Save Changes
                        </button>
                        <button
                          className="btn btn-warning m-2"
                          type="button"
                          onClick={() => navigate("/admin-mentorship-list")}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorShipEditUser;
