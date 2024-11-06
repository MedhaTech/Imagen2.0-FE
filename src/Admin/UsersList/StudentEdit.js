/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Label } from "reactstrap";

import {
  getCurrentUser,
  setCurrentUser,
  openNotificationWithIcon,
} from "../../helpers/Utils";
import {
  getAdminTeamMembersList,
  // studentResetPassword
} from "../../redux/actions";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import { ArrowRight } from "react-feather";
import {
  districtList,
  collegeType,
  yearofstudyList,
  collegeNameList,
} from "../../RegPage/ORGData.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { encryptGlobal } from "../../constants/encryptDecrypt";
import { useNavigate } from "react-router-dom";
import female from "../../assets/img/Female_Profile.png";
import male from "../../assets/img/Male_Profile.png";
import user from "../../assets/img/user.png";
import { isString } from "antd/es/button";
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
  const [collegeNamesList, setCollegeNamesList] = useState([]);
  const handleCollegeTypeChange = (event) => {
    const selectedCollegeType = event.target.value;
    formik.setFieldValue("collegeType", selectedCollegeType); 
    formik.setFieldValue("college", ""); 
    formik.setFieldValue("ocn", "");
  
    const updatedCollegeNames = collegeNameList[selectedCollegeType] || [];
    setCollegeNamesList(updatedCollegeNames);
   
  };
 
  const formik = useFormik({
    initialValues: {
      full_name: '',
      email: '',
      mobile: '',
      district: '',
      college: '',
      rollnumber: '',
      branch: '',
      yearofstudy: '',
      collegeType: '',
      ocn: '',
    },
    // initialValues: {
    //   full_name: data?.full_name || '',
    //   email: data.username_email,
    //   mobile: data?.mobile,
    //   district: data?.district,
    //   college: data?.college_name,
    //   rollnumber: data?.roll_number,
    //   branch: data?.branch,
    //   yearofstudy: data?.
    //   year_of_study
    //   ,
    //   collegeType: data?.college_type,
    //   ocn: data?.college_name,
    // },

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
      email: Yup.string()
        .email(
          <span style={{ color: "red" }}>Please Enter Valid Email Address</span>
        )
        .required(
          <span style={{ color: "red" }}>Please Enter Email Address</span>
        )
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Email Must be VALID"
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
      collegeType: Yup.string().required(
        <span style={{ color: "red" }}>Please Select collegeType</span>
      ),
      district: Yup.string().required(
        <span style={{ color: "red" }}>Please Select District</span>
      ),
      college: Yup.string().required(
        <span style={{ color: "red" }}>Please Select college</span>
      ),
      rollnumber: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Roll Number</span>
      ),
      branch: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Branch</span>
      ),
      yearofstudy: Yup.string().required(
        <span style={{ color: "red" }}>Please Select yearofstudy</span>
      ),
    
    }),

    onSubmit: (values) => {
      // alert("hii");
      const body ={
        full_name: values.full_name,
        mobile: String(values.mobile),
        district: values.district,
        college_type: values.collegeType,
        college_name: values.college === 'Other' ? values.ocn : values.college,
        roll_number: values.rollnumber,
        branch: values.branch,
        year_of_study: values.yearofstudy,
      };
      if (data && data.username_email !== values.email) {
        body['username'] = values.email;
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
              "Student details updated Successfully"
            );
            navigate("/students");
            // handleView(studentData);
          } else {
            openNotificationWithIcon("error", "Opps! Something Wrong");
          }
        })
        .catch(function (error) {
          openNotificationWithIcon("error", error?.response?.data?.message);
        });
    },
  });
  useEffect(() => {
    if (data) {
      formik.setValues({
        full_name: data.full_name || '',
        email: data.username_email || '',
        mobile: data.mobile || '',
        district: data.district || '',
        college: data.college_name || '',
        rollnumber: data.roll_number || '',
        branch: data.branch || '',
        yearofstudy: data.year_of_study || '',
        collegeType: data.college_type || '',
        ocn: data.college_name || '',
      });
    }
  }, [data]); 
  useEffect(() => {
    if (data?.college_type) {
      formik.setFieldValue('collegeType', data.college_type);
    }
  }, [data?.college_type]);
  useEffect(() => {
    if (data.college_name) {
      formik.setFieldValue('college', data.college_name);
    }
  }, [data.college_name]);
  useEffect(()=>{
    setCollegeNamesList(
      collegeNameList[
            
        data.college_type
        ] || []
    );
   },[data.college_type]);
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
                <form  onSubmit={formik.handleSubmit}>
                  {/* <div className="login-userset"> */}
                    <div className="col-xl-12">
                      <div className="row g-3 mt-0">
                        <>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="full_name">
                              Full Name
                            </label>
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
                            <label htmlFor="email" className="form-label">
                              Email
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

                          <div className="col-md-4">
                            <label className="form-label" htmlFor="mobile">
                              Mobile Number
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
                          <div className={`col-md-4`}>
                            <label htmlFor="district" className="form-label">
                              District
                            </label>
                            <select
                              id="district"
                              className="form-select"
                              name="district"
                              value={formik.values.district || ""}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>District</option>
                              {districtList["Tamil Nadu"].map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.district &&
                            formik.errors.district ? (
                              <small className="error-cls">
                                {formik.errors.district}
                              </small>
                            ) : null}
                          </div>

                          <div className={`col-md-4`}>
                            <label htmlFor="collegeType" className="form-label">
                              College Type
                            </label>
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
                            </label>
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
                          </div>
                          <div className={`col-md-6`}>
                            <label htmlFor="rollnumber" className="form-label">
                              Roll number provided by the college
                            </label>
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
                          {formik.values.college === "Other" && (
                            <div className={`col-md-12`}>
                              <label htmlFor="ocn" className="form-label">
                                Other College Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="ocn"
                                placeholder="Other College Name"
                                name="ocn"
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  const lettersOnly = inputValue.replace(
                                    /[^a-zA-Z0-9 \s]/g,
                                    ""
                                  );
                                  formik.setFieldValue("ocn", lettersOnly);
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.ocn || ""}
                              />
                              {formik.touched.ocn && formik.errors.ocn ? (
                                <small
                                  className="error-cls"
                                  style={{ color: "red" }}
                                >
                                  {formik.errors.ocn}
                                </small>
                              ) : null}
                            </div>
                          )}

                          <div className="col-md-6">
                            <label className="form-label" htmlFor="branch">
                              Branch
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Branch"
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

                          <div className={`col-md-6`}>
                            <label htmlFor="yearofstudy" className="form-label">
                              Year of Study
                            </label>
                            <select
                              id="yearofstudy"
                              className="form-select"
                              name="yearofstudy"
                              value={formik.values.yearofstudy}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>Year of Study</option>
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
    //                         type="submit"
    // className={`btn btn-warning m-2 ${
    //   !formik.dirty || !formik.isValid ? "default" : "primary"
    // }`}
    className="btn btn-warning m-2"
    type="submit"
    disabled={
      !formik.isValid || !formik.dirty
    }
    // disabled={!formik.dirty || !formik.isValid}
                          >
                            Submit
                          </button>
                          <button
                            className="btn btn-warning m-2"
                            type="button"
                            onClick={() => navigate("/students")}
                          >
                            Back
                            <ArrowRight />
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
