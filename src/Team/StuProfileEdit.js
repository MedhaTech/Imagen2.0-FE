/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Form, Label, FormGroup } from "reactstrap";

import { getCurrentUser, openNotificationWithIcon } from "../helpers/Utils";

import { useLocation } from "react-router-dom";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";

import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import { genderList , disabilityList,
  areaList, yearofstudyList,} from "../RegPage/ORGData.js";
import moment from "moment/moment";

const StuProfileEdit = () => {
  const location = useLocation();
  const studentData = location.state || {};
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const dispatch = useDispatch();
console.log(studentData,"res");
  const formik = useFormik({
    initialValues: {
      gender: studentData.gender,
      college_town: studentData.college_town,
      branch: studentData.branch,
      yearofstudy: studentData.yearofstudy,
      id_number: studentData.id_number,
      dateofbirth: studentData.dateofbirth,
      area: studentData.area,
      disability: studentData.disability,
      rollnumber: studentData.rollnumber,

    },
    validationSchema: Yup.object({
      gender: Yup.string()
        .required(<span style={{ color: "red" }}>Please Select Gender</span>)
        .nonNullable(),
      college_town: Yup.string().optional(),

      dateofbirth: Yup.date()
        .required(
          <span style={{ color: "red" }}>Please Select Date of Birth</span>
        )
        .min(
          moment().subtract(27, "years").startOf("day").toDate(),
          "Your age must be at most 27 years"
        )
        .max(
          moment().subtract(15, "years").endOf("day").toDate(),
          "Your age must be at least 15 years"
        ),
      disability: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Disability Status</span>
      ),
      area: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Area of Residence</span>
      ),
      rollnumber: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter your Roll Number</span>
      ),
      branch: Yup.string().required(
        <span style={{ color: "red" }}>
          Please Enter Branch/Group/Stream Name
        </span>
      ),
      yearofstudy: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Year of Study</span>
      ),
      id_number: Yup.string().optional(),
    }),
    onSubmit: (values) => {
      const body = {
        gender: values.gender,
        college_town: values.college_town,
         roll_number: values.rollnumber,
          branch: values.branch,
        year_of_study: values.yearofstudy,
         dateofbirth: values.dateofbirth,
        disability: values.disability,
        area: values.area,
      };
       if (values.id_number !== "") {
        body["id_number"] = values.id_number;
      }
      if (values.gender === null || values.gender === "") {
        openNotificationWithIcon("error", "Gender should not be empty");
      }
      
      const teamparamId = encryptGlobal(
        JSON.stringify(currentUser?.data[0]?.student_id)
      );
      var config = {
        method: "put",
        url: process.env.REACT_APP_API_BASE_URL + "/students/" + teamparamId,
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
              "Student Details Updated Successfully "
            );
            navigate("/student-profile");
          } else {
            openNotificationWithIcon("error", "Opps! Something Wrong");
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="login-userheading">
          <h4>Edit Student</h4>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card container m-4">
            <div className="row">
              <div
                className="col-md-12 p-4"
                style={{ backgroundColor: "#EEEEEE" }}
              >
                <form onSubmit={formik.handleSubmit}>
                  {/* <div className="login-userset"> */}
                  <div className="col-xl-12">
                    <div className="row g-3 mt-0">
                      <>
                        <div className={`col-md-2`}>
                          <label htmlFor="gender" className="form-label">
                            Gender
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="gender"
                            className="form-select"
                            name="gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <option value={""}>Gender</option>
                            {genderList.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.gender && formik.errors.gender ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.gender}
                            </small>
                          ) : null}
                        </div>
                         <div className={`col-md-2`}>
                                                  <label htmlFor="dateofbirth" className="form-label">
                                                    Date of Birth
                                                  </label>
                                                  &nbsp;
                                                  <span style={{ color: "red", fontWeight: "bold" }}>
                                                    *
                                                  </span>
                                                  <input
                                                    type="date"
                                                    className="form-control"
                                                    id="dateofbirth"
                                                    name="dateofbirth"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.dateofbirth}
                                                  />
                                                  {formik.touched.dateofbirth &&
                                                  formik.errors.dateofbirth ? (
                                                    <small
                                                      className="error-cls"
                                                      style={{ color: "red" }}
                                                    >
                                                      {formik.errors.dateofbirth}
                                                    </small>
                                                  ) : null}
                                                </div>
                                                <div className={`col-md-4`}>
                                                  <label htmlFor="disability" className="form-label">
                                                    Disability Status
                                                  </label>
                                                  &nbsp;
                                                  <span style={{ color: "red", fontWeight: "bold" }}>
                                                    *
                                                  </span>
                                                  <select
                                                    id="disability"
                                                    className="form-select"
                                                    name="disability"
                                                    value={formik.values.disability}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                  >
                                                    <option value={""}>Disability Status</option>
                                                    {disabilityList.map((item) => (
                                                      <option key={item} value={item}>
                                                        {item}
                                                      </option>
                                                    ))}
                                                  </select>
                                                  {formik.touched.disability &&
                                                  formik.errors.disability ? (
                                                    <small
                                                      className="error-cls"
                                                      style={{ color: "red" }}
                                                    >
                                                      {formik.errors.disability}
                                                    </small>
                                                  ) : null}
                                                </div>
                                                <div className={`col-md-4`}>
                                                  <label htmlFor="area" className="form-label">
                                                    Area of Residence
                                                  </label>
                                                  &nbsp;
                                                  <span style={{ color: "red", fontWeight: "bold" }}>
                                                    *
                                                  </span>
                                                  <select
                                                    id="area"
                                                    className="form-select"
                                                    name="area"
                                                    value={formik.values.area}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                  >
                                                    <option value={""}>Area of Residence</option>
                                                    {areaList.map((item) => (
                                                      <option key={item} value={item}>
                                                        {item}
                                                      </option>
                                                    ))}
                                                  </select>
                                                  {formik.touched.area && formik.errors.area ? (
                                                    <small
                                                      className="error-cls"
                                                      style={{ color: "red" }}
                                                    >
                                                      {formik.errors.area}
                                                    </small>
                                                  ) : null}
                                                </div>
                                                 <div className={`col-md-6`}>
                          <label htmlFor="rollnumber" className="form-label">
                            Roll Number Provided by the College
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="rollnumber"
                            placeholder="Roll Number"
                            name="rollnumber"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const lettersOnly = inputValue.replace(
                                /[^a-zA-Z0-9 \s]/g,
                                ""
                              );
                              formik.setFieldValue("rollnumber", lettersOnly);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.rollnumber || ""}
                          />
                          {formik.touched.rollnumber &&
                          formik.errors.rollnumber ? (
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.rollnumber}
                            </small>
                          ) : null}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="branch">
                            College Town
                          </label>
                          &nbsp;
                          {/* <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span> */}
                          <input
                            type="text"
                            className="form-control"
                            placeholder="College Town"
                            id="college_town"
                            name="college_town"
                            // onChange={formik.handleChange}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const lettersOnly = inputValue.replace(
                                /[^a-zA-Z0-9 \s]/g,
                                ""
                              );
                              formik.setFieldValue("college_town", lettersOnly);
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.college_town}
                          />
                          {formik.touched.college_town &&
                          formik.errors.college_town ? (
                            <small className="error-cls">
                              {formik.errors.college_town}
                            </small>
                          ) : null}
                        </div>
                          <div className="col-md-4">
                                                  <label className="form-label" htmlFor="branch">
                                                    Branch/Group/Stream
                                                  </label>
                                                  &nbsp;
                                                  <span style={{ color: "red", fontWeight: "bold" }}>
                                                    *
                                                  </span>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder=" Branch/Group/Stream"
                                                    id="branch"
                                                    name="branch"
                                                    // onChange={formik.handleChange}
                                                    onChange={(e) => {
                                                      const inputValue = e.target.value;
                                                      const lettersOnly = inputValue.replace(
                                                        /[^a-zA-Z0-9 \s]/g,
                                                        ""
                                                      );
                                                      formik.setFieldValue("branch", lettersOnly);
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.branch || ""}
                                                  />
                                                  {formik.touched.branch && formik.errors.branch ? (
                                                    <small className="error-cls">
                                                      {formik.errors.branch}
                                                    </small>
                                                  ) : null}
                                                </div>
                                                <div className={`col-md-4`}>
                                                  <label htmlFor="id_number" className="form-label">
                                                    APAAR ID
                                                  </label>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    id="id_number"
                                                    placeholder="APAAR ID"
                                                    // disabled={areInputsDisabled}
                                                    name="id_number"
                                                    onChange={(e) => {
                                                      const inputValue = e.target.value;
                                                      const lettersOnly = inputValue.replace(
                                                        /[^a-zA-Z0-9 \s]/g,
                                                        ""
                                                      );
                                                      formik.setFieldValue("id_number", lettersOnly);
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.id_number}
                                                  />
                                                  {formik.touched.id_number &&
                                                  formik.errors.id_number ? (
                                                    <small
                                                      className="error-cls"
                                                      style={{ color: "red" }}
                                                    >
                                                      {formik.errors.id_number}
                                                    </small>
                                                  ) : null}
                                                </div>
                                                <div className={`col-md-4`}>
                                                  <label htmlFor="yearofstudy" className="form-label">
                                                    Year of Study
                                                  </label>
                                                  &nbsp;
                                                  <span style={{ color: "red", fontWeight: "bold" }}>
                                                    *
                                                  </span>
                                                  <select
                                                    id="yearofstudy"
                                                    className="form-select"
                                                    name="yearofstudy"
                                                    value={formik.values.yearofstudy}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                  >
                                                    <option value={""}>Select Year of Study</option>
                                                    {yearofstudyList.map((item) => (
                                                      <option key={item} value={item}>
                                                        {item}
                                                      </option>
                                                    ))}
                                                  </select>
                                                  {formik.touched.yearofstudy &&
                                                  formik.errors.yearofstudy ? (
                                                    <small className="error-cls">
                                                      {formik.errors.yearofstudy}
                                                    </small>
                                                  ) : null}
                                                </div>
                      </>
                      <div className="form-login d-flex justify-content-between">
                        <button
                          className={`btn btn-warning m-2 ${
                            !formik.dirty || !formik.isValid
                              ? "default"
                              : "primary"
                          }`}
                          type="submit"
                          disabled={!formik.dirty || !formik.isValid}
                        >
                          Submit
                          {/* <ArrowRight /> */}
                        </button>
                        <button
                          className="btn btn-warning m-2"
                          type="button"
                          onClick={() => navigate("/student-profile")}
                        >
                          Back
                          {/* <ArrowRight /> */}
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

export default StuProfileEdit;
