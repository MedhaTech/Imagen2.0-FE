/* eslint-disable indent */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { decryptGlobal } from "../../constants/encryptDecrypt.js";
import OtpInput from "react-otp-input-rc-17";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { openNotificationWithIcon } from "../../helpers/Utils.js";
import { districtList, collegeType, collegeNameList } from '../../RegPage/ORGData.js';
import { ArrowRight } from 'react-feather';
import { encryptGlobal } from "../../constants/encryptDecrypt";
import Select from "react-select";

const AddInstitution = () => {
  const navigate = useNavigate();
  const [districtData, setDistrictData] = useState(districtList["Telangana"] || []);
 
  const [areInputsDisabled, setAreInputsDisabled] = useState(false);
 
  const [collegeNamesList, setCollegeNamesList] = useState([]);
   const [selectedCollegeType, setSelectedCollegeType] = useState("");

  // const handleCollegeTypeChange = (event) => {
  //   const collegeType = event.target.value;
  //   formik.setFieldValue("college_type", collegeType);
  //   formik.setFieldValue('college', '');
  //   formik.setFieldValue('ocn', '');
  //   setCollegeNamesList(collegeNameList[collegeType] || []);
  // };
  const handleCollegeTypeChange = (event) => {
    const selectedCollegeType = event.target.value;
    console.log("Selected College Type:", selectedCollegeType);
    
    formik.setFieldValue("college_type", selectedCollegeType);
    setSelectedCollegeType(selectedCollegeType);
    formik.setFieldValue("college", "");
    formik.setFieldValue("ocn", "");
  
   
    const existingColleges = collegeNameList[selectedCollegeType] || [];
    setCollegeNamesList(existingColleges);
  
    AllCollegesApi(selectedCollegeType, existingColleges);
  };
  const AllCollegesApi = (item,existingColleges) => {
    const distParam = encryptGlobal(
      JSON.stringify({
        college_type: item,
      })
    );

    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/dashboard/CollegeNameForCollegeType?Data=${distParam}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          // console.log(response, "res");
          const apiData = response.data.data || [];
          const collegeNames = apiData.map((college) => college.college_name);
          
          // setCollegeNamesList([...existingColleges, ...collegeNames]);
          const mergedColleges = [...existingColleges, ...collegeNames];
        const uniqueColleges = [...new Set(mergedColleges)];

        setCollegeNamesList(uniqueColleges);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const collegeOptions = collegeNamesList.map((item) => ({
    value: item,
    label: item,
  }));
  // console.log(collegeNamesList,"options");
  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile: "",
      district: "",
      college: "",
      college_type: "",
      branch: "",
      yearofstudy: "",
      password: "",
      confirmPassword: "",
      ocn: ""
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
      district: Yup.string().required(
        <span style={{ color: "red" }}>Please Select District</span>
      ),
      college: Yup.string().required(
        <span style={{ color: "red" }}>Please Select College</span>
      ),
      college_type: Yup.string().required(
        <span style={{ color: "red" }}>Please Select College Type</span>
      ),
      // password: Yup.string().required(
      //   <span style={{ color: "red" }}>Please Enter Password</span>
      // ),
        password: Yup.string()
            .min(8, () => <span style={{ color: "red" }}>Password must be at least 8 characters</span>)
            .matches(/[a-z]/, () => <span style={{ color: "red" }}>Password must contain at least one lowercase letter</span>)
            .matches(/[A-Z]/, () => <span style={{ color: "red" }}>Password must contain at least one uppercase letter</span>)
            .matches(/\d/, () => <span style={{ color: "red" }}>Password must contain at least one number</span>)
            .matches(/[@$!%*?&]/, () => <span style={{ color: "red" }}>Password must contain at least one special character (@$!%*?&)</span>)
            .required(() => <span style={{ color: "red" }}>Please Enter Password</span>),
      confirmPassword: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter Confirm Password</span>
      ),
    }),

    onSubmit: async (values) => {
     

        const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        const encrypted = CryptoJS.AES.encrypt(values.confirmPassword, key, {
          iv: iv,
          padding: CryptoJS.pad.NoPadding,
        }).toString();
        const body = JSON.stringify({
          full_name: values.full_name.trim(),
          username: values.email.trim(),
          mobile: values.mobile.trim(),
          district: values.district,
          confirmPassword: encrypted,
          college_type: values.college_type,
          college_name: values.college === 'Other' ? values.ocn : values.college,
        });

        var config = {
          method: "post",
          url: process.env.REACT_APP_API_BASE_URL + "/mentors/register",
          headers: {
            "Content-Type": "application/json",
            Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
          },

          data: body,
        };
        await axios(config)
          .then((mentorRegRes) => {
            if (mentorRegRes?.data?.status == 201) {
                navigate("/institution-users-list");
                openNotificationWithIcon("success", "Institution Added Successfully");
            }
          })
          .catch((err) => {
            openNotificationWithIcon("error", err.response.data?.message);
            formik.setErrors({
              check: err.response && err?.response?.data?.message,
            });
            return err.response;
          });
    }
  });
 

 
 
 

 

 
  return (
    <div className="page-wrapper">
      <div className="content">
          <div className="login-userheading">
          <h4>Add New Institution</h4>
        </div >
        <div className='d-flex justify-content-center align-items-center'>
          <div className="card container m-4">
            <div className="row">
              <div className="col-md-12 p-4" style={{ backgroundColor: '#EEEEEE' }}>
            <form action="signin" onSubmit={formik.handleSubmit}>
              <div className="login-userset">
                <div className="col-xl-12">
                 
                      <div className="row g-3 mt-0">
                        <>
                          <div className="col-md-6">
                            <label className="form-label" htmlFor="full_name">Full Name</label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
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
                                formik.setFieldValue(
                                  "full_name",
                                  lettersOnly
                                );
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
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="email"
                              className="form-label"
                            >
                              Email
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder="Email"
                              disabled={areInputsDisabled}
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

                          <div className="col-md-6"
                          >
                            <label className="form-label" htmlFor="mobile">
                              Mobile Number
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>

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
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="district"
                              className="form-label"
                            >
                              District
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="district"
                              className="form-select"
                              name="district"
                              value={formik.values.district}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>Select District</option>
                              {districtData.map((item) => (
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


                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="college_type"
                              className="form-label"
                            >
                              College Type
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <select
                              id="college_type"
                              className="form-select"
                              name="college_type"
                              value={formik.values.college_type}
                              onBlur={formik.handleBlur}
                              onChange={handleCollegeTypeChange}
                            >
                              <option value={""}>Select College Type</option>
                              {collegeType.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                            {formik.touched.college_type &&
                              formik.errors.college_type ? (
                              <small className="error-cls">
                                {formik.errors.college_type}
                              </small>
                            ) : null}
                          </div>

                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="college"
                              className="form-label"
                            >
                              College Name
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            {/* <select
                              id="college"
                              className="form-select"
                              name="college"
                              value={formik.values.college}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>Select College Name</option>
                              {collegeNamesList.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select> */}
                              <Select
        classNamePrefix="react-select"
        options={collegeOptions}
        placeholder="Select Your College Name"
        value={collegeOptions.find(option => option.value === formik.values.college)}
        onChange={(selectedOption) => formik.setFieldValue("college", selectedOption?.value)}
        onBlur={formik.handleBlur}
      />
                            {formik.touched.college &&
                              formik.errors.college ? (
                              <small className="error-cls">
                                {formik.errors.college}
                              </small>
                            ) : null}
                          </div>

                          {formik.values.college === 'Other' &&
                            <div className={`col-md-12`}
                            >
                              <label
                                htmlFor="ocn"
                                className="form-label"
                              >
                                Other College Name
                              </label>&nbsp;
                              <span style={{color:"red",fontWeight:"bold"}}>*</span>
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
                                  formik.setFieldValue(
                                    "ocn",
                                    lettersOnly
                                  );
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.ocn}
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
                          }


                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="password"
                              className="form-label"
                            >
                              Password
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="text"
                              name="password"
                              placeholder="Password"
                              id="password"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.password}
                            />
                            {formik.touched.password &&
                              formik.errors.password ? (
                              <small className="error-cls">
                                {formik.errors.password}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-6`}
                          >
                            <label
                              htmlFor="confirmPassword"
                              className="form-label"
                            >
                              Confirm Password
                            </label>&nbsp;
                            <span style={{color:"red",fontWeight:"bold"}}>*</span>
                            <input
                              type="text"
                              name="confirmPassword"
                              placeholder="Confirm Password"
                              id="confirmPassword"
                              className="form-control"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword &&
                              formik.errors.confirmPassword ? (
                              <small className="error-cls">
                                {formik.errors.confirmPassword}
                              </small>
                            ) : null}
                            {
                              (formik.values.confirmPassword !== '' && !(formik.values.password === formik.values.confirmPassword)) &&
                              <small className="text-danger">
                                Confirm Password is not same as Password
                              </small>
                            }
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
                            {/* <ArrowRight /> */}
                          </button>
                          <button
                            className="btn btn-warning m-2"
                            type="submit"
                            onClick={() => navigate("/institution-users-list")}
                          >
                            Discard
                            {/* <ArrowRight /> */}
                          </button>
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

export default AddInstitution;
