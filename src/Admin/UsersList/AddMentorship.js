/* eslint-disable indent */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { openNotificationWithIcon } from "../../helpers/Utils.js";

const AddMentorship = () => {
  const navigate = useNavigate();
 


  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile: "",
      college_name: "",
      area_of_expertise: "",
    },

    validationSchema: Yup.object({
      full_name: Yup.string()
        .trim()
        .min(2, <span style={{ color: "red" }}>Please Enter Full Name</span>)
        .matches(
          /^[aA-zZ\s]+$/,
          <span style={{ color: "red" }}>
            "Special Characters are not allowed"
          </span>
        )
        .required(<span style={{ color: "red" }}>Please Enter Full Name</span>),
      email: Yup.string()
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
       .matches(/^[aA-zZ\s]+$/, "Special Characters are not allowed")
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
       .matches(/^[aA-zZ\s]+$/, "Special Characters are not allowed")
        .required(
          <span style={{ color: "red" }}>Please Enter Area of Expertise</span>
        ),
    }),

    onSubmit: async (values) => {
      const body = JSON.stringify({
        full_name: values.full_name.trim(),
        username: values.email.trim(),
        mobile: values.mobile.trim(),
        areas_of_expertise: values.area_of_expertise.trim(),
        college_name: values.college_name.trim(),
      });

      var config = {
        method: "post",
        url: process.env.REACT_APP_API_BASE_URL + "/mentorships/register",
        headers: {
          "Content-Type": "application/json",
          Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
        },

        data: body,
      };
      await axios(config)
        .then((mentorRegRes) => {
          if (mentorRegRes?.data?.status == 201) {
            const mentorData = mentorRegRes?.data?.data[0];

            navigate("/admin-mentorship-list");
            openNotificationWithIcon("success", "User Registered Successfully");
          }
        })
        .catch((err) => {
          if (err?.response?.data?.status === 406) {
            openNotificationWithIcon("error", err.response.data?.message);
          } else {
            openNotificationWithIcon("error", "Email id is Invalid");
          }

          formik.setErrors({
            check: err.response && err?.response?.data?.message,
          });
          return err.response;
        });
    },
  });
 
 
 

 

 
  return (
    <div className="page-wrapper">
      <div className="content">
          <div className="login-userheading">
          <h4>Add New Mentorship</h4>
        </div >
        <div className='d-flex justify-content-center align-items-center'>
          <div className="card container m-4">
            <div className="row">
              <div className="col-md-12 p-4" style={{ backgroundColor: '#EEEEEE' }}>
            <form action="signin" onSubmit={formik.handleSubmit}>
              <div className="login-userset">
                <div className="col-xl-12">
                 
                      <div className="row g-3 mt-0">
                       
                        <div className="col-xl-12">
                  <div className="card">
                    <div className="card-body">
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
                              <small className="error-cls" style={{ color: "red" }}>
                                {formik.errors.full_name}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-6`}>
                            <label htmlFor="email" className="form-label">
                              Email
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Email"
                              name="email"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                              <small
                                className="error-cls"
                                style={{ color: "red" }}
                              >
                                {formik.errors.email}
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
                              <small className="error-cls" style={{ color: "red" }}>
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
                              <small className="error-cls" style={{color:"red"}}>
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
                              placeholder="Areas of Expertise "
                                                           onChange={(e) => {
                                const inputValue = e.target.value;
                                const lettersOnly = inputValue.replace(
                                  /[^a-zA-Z\s]/g,
                                  ""
                                );
                                formik.setFieldValue(
                                  "area_of_expertise",
                                  lettersOnly
                                );
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.area_of_expertise}
                            />
                            {formik.touched.area_of_expertise &&
                            formik.errors.area_of_expertise ? (
                              <small className="error-cls" style={{color:"red"}}>
                                {formik.errors.area_of_expertise}
                              </small>
                            ) : null}
                          </div>
                        </>
                        <div className="form-login d-flex justify-content-between">
                          <button
                            className="btn btn-warning m-2"
                            type="submit"
                            disabled={
                              !formik.isValid || !formik.dirty || !(formik.values.password === formik.values.confirmPassword) ||(formik.values.college === 'Other' && !formik.values.ocn)
                            }
                          >
                            Proceed
                          </button>
                          <button
                            className="btn btn-warning m-2"
                            type="submit"
                            onClick={() => navigate("/admin-mentorship-list")}
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

export default AddMentorship;
