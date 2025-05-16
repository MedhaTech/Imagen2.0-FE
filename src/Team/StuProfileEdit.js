/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";

import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../helpers/Utils";


import { useLocation } from "react-router-dom";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";

import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import {
  genderList
} from "../RegPage/ORGData.js";


const StuProfileEdit = () => {
  const location = useLocation();
  const studentData = location.state || {};
  const currentUser = getCurrentUser("current_user");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      gender: studentData.gender,
      college_town: studentData.college_town,
    },
    validationSchema: Yup.object({
      gender: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Gender</span>
      ).nonNullable()
    }),
    onSubmit: (values) => {
      const body = {
        gender: values.gender,
        college_town: values.college_town
      };
      if (values.gender === null || values.gender === '') {
        openNotificationWithIcon("error", "Gender should not be empty");
      }
      const teamparamId = encryptGlobal(JSON.stringify(currentUser?.data[0]?.student_id));
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
                  <div className="col-xl-12">
                    <div className="row g-3 mt-0">
                      <>
                        <div className={`col-md-6`}>
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
                            <small className="error-cls" style={{ color: "red" }}>
                              {formik.errors.gender}
                            </small>
                          ) : null}
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="branch">
                            College Town
                          </label>
                          &nbsp;
                        
                          <input
                            type="text"
                            className="form-control"
                            placeholder="College Town"
                            id="college_town"
                            name="college_town"
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
                          Submit
                        </button>
                        <button
                          className="btn btn-warning m-2"
                          type="button"
                          onClick={() => navigate("/student-profile")}
                        >
                          Back
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
