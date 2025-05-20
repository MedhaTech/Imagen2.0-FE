/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";

import {
  getCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";

import { useLocation } from "react-router-dom";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import {
  districtList,
  yearofstudyList,
  genderList,
} from "../../RegPage/ORGData.js";
import { MaskedEmail, MaskedMobile } from "../../RegPage/MaskedData.js";

const StuEdit = () => {
  const location = useLocation();
  const studentData = location.state || {};
  const currentUser = getCurrentUser("current_user");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  useEffect(() => {
    mentorViewApi();
  }, [studentData.student_id]);

  const mentorViewApi = () => {
    // this function fetches current user all details from the API 

    let supId;
    if (typeof studentData.student_id !== "string") {
      supId = encryptGlobal(JSON.stringify(studentData.student_id));
    } else {
      supId = encryptGlobal(studentData.student_id);
    }
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
          setData(response.data.data[0]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
 

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile: "",
      district: "",
      rollnumber: "",
      branch: "",
      yearofstudy: "",
      id_number: "",
      gender: "",
      college_town: "",
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
      id_number: Yup.string().optional(),
      email: Yup.string()
        .email(
          <span style={{ color: "red" }}>Please Enter Valid Email Address</span>
        )
        .optional()
       
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email Must be Valid"
        )
        .max(255),
      college_town: Yup.string().optional(),
      gender: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Gender</span>
      ),
      mobile: Yup.string()
      
        .optional()
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
     
      district: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Institution District</span>
      ),
     
      rollnumber: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Roll Number</span>
      ),
      branch: Yup.string().required(
        <span style={{ color: "red" }}>
          Please Enter Branch/Group/Stream Name
        </span>
      ),
      yearofstudy: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Year of Study</span>
      ),
    }),

    onSubmit: (values) => {
      const body = {
        full_name: values.full_name,
        district: values.district,
        college_type: currentUser?.data[0]?.college_type,
        college_name: currentUser?.data[0]?.college_name,
        roll_number: values.rollnumber,
        branch: values.branch,
        year_of_study: values.yearofstudy,
        gender: values.gender,
        college_town: values.college_town,
        id_number: values.id_number,
      };
      if (data && data.username_email !== values.email && values.email) {
        body["username"] = values.email;
    }
    
    if (data && data.mobile !== values.mobile && values.mobile) {
        body["mobile"] = values.mobile;
    }
      const teamparamId = encryptGlobal(JSON.stringify(data?.student_id));
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
              "Student Details Updated Successfully"
            );
            navigate("/mentorteams");
          } else {
            openNotificationWithIcon("error", "Opps! Something Wrong");
          }
        })
        .catch(function (err) {
          if (err?.response?.data?.status === 400) {
            openNotificationWithIcon(
              "error",
              err.response.data?.message !== "Bad Request"
                ? err.response.data?.message
                : "Email id is Invalid"
            );
          } else {
            openNotificationWithIcon("error", "Email id is Invalid");
          }
        });
    },
  });
  useEffect(() => {
    if (data) {
      formik.setValues({
        full_name: data.full_name || "",
        district: data.district || "",
        rollnumber: data.roll_number || "",
        branch: data.branch || "",
        yearofstudy: data.year_of_study || "",
        college_town: data.college_town || "",
        gender: data.gender || "",

        id_number: data.id_number || "",
      });
    }
  }, [data]);
 
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
                        <div className="col-md-6">
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
                            value={formik.values.full_name || ""}
                          />
                          {formik.touched.full_name &&
                          formik.errors.full_name ? (
                            <small className="error-cls">
                              {formik.errors.full_name}
                            </small>
                          ) : null}
                        </div>
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
                            <small
                              className="error-cls"
                              style={{ color: "red" }}
                            >
                              {formik.errors.gender}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-6`}>
                          <label
                            htmlFor="email"
                            className="form-label d-flex align-items-center"
                          >
                            Email : &nbsp;
                            <MaskedEmail email={data?.username_email} />
                            &nbsp;
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email || ""}
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
                          <label
                            htmlFor="email"
                            className="form-label d-flex align-items-center"
                          >
                            Mobile Number : &nbsp;
                            <MaskedMobile mobile={data?.mobile} />
                            &nbsp;
                          </label>

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
                            value={formik.values.mobile || ""}
                          />

                          {formik.touched.mobile && formik.errors.mobile ? (
                            <small className="error-cls">
                              {formik.errors.mobile}
                            </small>
                          ) : null}
                        </div>
                        <div className={`col-md-6`}>
                          <label htmlFor="district" className="form-label">
                            Institution District
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <select
                            id="district"
                            className="form-select"
                            name="district"
                            value={formik.values.district || ""}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          >
                            <option value={""}>
                              Select Your Institution District
                            </option>
                            {districtList["Andhra Pradesh"].map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>
                          {formik.touched.district && formik.errors.district ? (
                            <small className="error-cls">
                              {formik.errors.district}
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
                        {/* <div className={`col-md-4`}>
                            <label htmlFor="collegeType" className="form-label">
                              College Type
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="collegeType"
                              className="form-select"
                              name="collegeType"
                              value={formik.values.collegeType || ""}
                              onBlur={formik.handleBlur}
                              onChange={handleCollegeTypeChange}
                            >
                              <option value={""}>College Type</option>
                              {collegeType.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.collegeType &&
                            formik.errors.collegeType ? (
                              <small className="error-cls">
                                {formik.errors.collegeType}
                              </small>
                            ) : null}
                          </div>

                          <div className={`col-md-6`}>
                            <label htmlFor="college" className="form-label">
                              College Name
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="college"
                              className="form-select"
                              name="college"
                              value={formik.values.college || ""}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>College Name</option>
                              {collegeNamesList.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.college && formik.errors.college ? (
                              <small className="error-cls">
                                {formik.errors.college}
                              </small>
                            ) : null}
                          </div> */}
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
                        <div className={`col-md-6`}>
                          <label htmlFor="id_number" className="form-label">
                            APAAR ID
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="id_number"
                            placeholder="APAAR ID"
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
                        <div className={`col-md-6`}>
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
                          className="btn btn-warning m-2"
                          type="button"
                          onClick={() => navigate("/mentorteams")}
                        >
                          Discard
                        </button>
                        <button
                          className={`btn btn-warning m-2 ${
                            !formik.dirty || !formik.isValid
                              ? "default"
                              : "primary"
                          }`}
                          type="submit"
                          disabled={!formik.isValid || !formik.dirty}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StuEdit;
