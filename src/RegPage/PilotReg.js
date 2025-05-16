/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./Styles.css";
import logo from "../assets/img/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import axios from "axios";
import { decryptGlobal, encryptGlobal } from "../constants/encryptDecrypt";
import {
  districtList,
  collegeType,
  yearofstudyList,
  collegeNameList,
  genderList,
} from "./ORGData";
import { openNotificationWithIcon } from "../helpers/Utils.js";
import OtpInput from "react-otp-input-rc-17";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";

const PilotReg = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [btnOtp, setBtnOtp] = useState(false);
  const [otpRes, setOtpRes] = useState("");
  const [change, setChange] = useState("Send OTP");
  const [areInputsDisabled, setAreInputsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collegeNamesList, setCollegeNamesList] = useState([]);
  const [selectedCollegeType, setSelectedCollegeType] = useState("");
 
  const handleCollegeTypeChange = (event) => {
    const selectedCollegeType = event.target.value;

    formik.setFieldValue("collegeType", selectedCollegeType);
    setSelectedCollegeType(selectedCollegeType);
    formik.setFieldValue("college", "");
    formik.setFieldValue("ocn", "");

    const existingColleges = collegeNameList[selectedCollegeType] || [];
    setCollegeNamesList(existingColleges);

    AllCollegesApi(selectedCollegeType, existingColleges);
  };
  const AllCollegesApi = (item, existingColleges) => {
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
          const apiData = response.data.data || [];
          const collegeNames = apiData.map((college) => college.college_name);

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
  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      mobile: "",
      district: "",
      college: "",
      rollnumber: "",
      branch: "",
      yearofstudy: "",
      password: "",
      confirmPassword: "",
      collegeType: "",
      ocn: "",
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
        <span style={{ color: "red" }}>Please Select College Type</span>
      ),
      district: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Institution District</span>
      ),
      college: Yup.string().required(
        <span style={{ color: "red" }}>Please Select College</span>
      ),
      gender: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Gender</span>
      ),
      rollnumber: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter Roll Number</span>
      ),
      id_number: Yup.string().optional(),
      branch: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter  Branch/Group/Stream Name</span>
      ),
      college_town: Yup.string().optional(),
      yearofstudy: Yup.string().required(
        <span style={{ color: "red" }}>Please Select Year of Study</span>
      ),
    
      password: Yup.string()
        .min(8, () => (
          <span style={{ color: "red" }}>
            Password must be at least 8 characters
          </span>
        ))
        .matches(/[a-z]/, () => (
          <span style={{ color: "red" }}>
            Password must contain at least one lowercase letter
          </span>
        ))
        .matches(/[A-Z]/, () => (
          <span style={{ color: "red" }}>
            Password must contain at least one uppercase letter
          </span>
        ))
        .matches(/\d/, () => (
          <span style={{ color: "red" }}>
            Password must contain at least one number
          </span>
        ))
        .matches(/[@$!%*?&]/, () => (
          <span style={{ color: "red" }}>
            Password must contain at least one special character (@$!%*?&)
          </span>
        ))
        .required(() => (
          <span style={{ color: "red" }}>Please Enter Password</span>
        )),
      confirmPassword: Yup.string().required(
        <span style={{ color: "red" }}>Please Enter Confirm Password</span>
      ),
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true);
      if (values.otp.length < 5) {
        // console.log("ooo");
      } else {
        const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        const encrypted = CryptoJS.AES.encrypt(values.confirmPassword, key, {
          iv: iv,
          padding: CryptoJS.pad.NoPadding,
        }).toString();
        const body = {
          full_name: values.full_name,
          username: values.email,
          mobile: values.mobile,
          district: values.district,
          college_type: values.collegeType,
          college_name:
            values.college === "Other" ? values.ocn : values.college,
          roll_number: values.rollnumber,
          branch: values.branch,
          year_of_study: values.yearofstudy,
          confirmPassword: encrypted,
          gender:values.gender,
      college_town: values.college_town
        };
        if (values.id_number !== "") {
          body["id_number"] = values.id_number;
        }
        var config = {
          method: "post",
          url: process.env.REACT_APP_API_BASE_URL + "/students/register",
          headers: {
            "Content-Type": "application/json",
            Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
          },

          data: JSON.stringify(body),
        };
        await axios(config)
          .then((mentorRegRes) => {
            if (mentorRegRes?.data?.status == 201) {
              const mentData = mentorRegRes.data.data[0];
              navigate("/crew1Reg", {
                state: {
                  college_name: mentData.college_name,
                  college_type: mentData.college_type,
                  student_id: mentData.student_id,
                  district: mentData.district,
                  email: mentData.username,
                  mobile: mentData.mobile,
                },
              });
              sessionStorage.setItem(
                "pilotKey",
                mentorRegRes?.data?.data[0]?.student_id
              );
              openNotificationWithIcon(
                "success",
                "Pilot User Registered Successfully"
              );
             
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
      }
    },
  });
 
  useEffect(() => {
    setOtpRes(0);
    setBtnOtp(false);
    formik.setFieldValue("otp", "");
  }, [formik.values.mobile]);
  useEffect(() => {
    setOtpRes(0);
    setBtnOtp(false);
    formik.setFieldValue("otp", "");
  }, [formik.values.email]);

  const handleSendOtp = async (e) => {
    formik.setFieldValue("mobile", formik.values.mobile);
    setTimer(60);

    setOtpSent(true);
    setChange("Resend OTP");
    setAreInputsDisabled(true);

    const body = JSON.stringify({
      username: formik.values.email,
      mobile: formik.values.mobile,
    });
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/students/emailOtp",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: body,
    };
    axios(config)
      .then(function (response) {
        if (response.status === 202) {
          const UNhashedPassword = decryptGlobal(response?.data?.data);
          setOtpRes(JSON.parse(UNhashedPassword));
          openNotificationWithIcon("success", "OTP Sent to Given Email Id");
          setBtnOtp(true);
          setTimeout(() => {
            setOtpSent("Resend OTP");
            setTimer(0);
          }, 60000);
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 406) {
          openNotificationWithIcon("error", error?.response.data?.message);
          setAreInputsDisabled(false);
          setTimer(0);
        }
      });
    e.preventDefault();
  };
  const handleOtpChange = (e) => {
    formik.setFieldValue("otp", e);
  };

  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(intervalId);
            return 0;
          }
        });
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0 && otpSent) {
      setAreInputsDisabled(false);
      setOtpSent(false);
    }
  }, [timer, otpSent]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card container m-4">
        <div className="row">
          <div className="col-md-4">
            <div className="text-center mt-5">
              <img src={logo} alt="Logo" style={{ width: "9rem" }} />
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base complete">
                  <i className="fa fa-info"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className="d-block complete_color">Instructions</span>
                <span className="second_text">
                  Registration and program guidelines.
                </span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base current">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className="d-block current_color">Pilot Information</span>
                <span className="second_text">
                  Enter your personal details.
                </span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base ">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className="d-block">Crew-1 Information</span>
                <span className="second_text">
                  Enter your team member-1 details.
                </span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className="d-block">Crew-2 Information</span>
                <span className="second_text">
                  Enter your team member-2 details.
                </span>
              </div>
            </div>
            <div className="row m-2 mb-3">
              <div className="col-md-2">
                <span className="circle_base">
                  <i className="fa fa-users"></i>
                </span>
              </div>
              <div className="col-md-10">
                <span className="d-block">Crew-3 Information</span>
                <span className="second_text">
                  Enter your team member-3 details.
                </span>
              </div>
            </div>

            <div className="row m-2 mb-3 mt-3">
              <div className="col-md-10 ps-3">
                <span className="mt-5 p">Already have an account?</span>
                <span className="second_text">
                  <Link
                    className="hover-a"
                    to={"/login"}
                    style={{ color: "blue" }}
                  >
                    {" "}
                    Click Here
                  </Link>
                </span>
              </div>
            </div>
            <div className="row m-2 mb-3 mt-3">
              <div className="col-md-10 ps-3">
                <span className="mt-5 p">Register as an Institution</span>

                <span className="second_text">
                  <Link
                    className="hover-a"
                    to={"/institution-registration"}
                    style={{ color: "blue" }}
                  >
                    {" "}
                    Click Here
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-8 p-4" style={{ backgroundColor: "#EEEEEE" }}>
            <form action="signin" onSubmit={formik.handleSubmit}>
              <div className="login-userset">
                <div className="login-userheading">
                  <h4>
                    Hello <i className="fas fa-hand-spock text-warning"></i>
                    {`, Let's create YFSI
                   account for you !`}
                  </h4>
                </div>

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
                          disabled={areInputsDisabled}
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
                          disabled={areInputsDisabled}
                          name="gender"
                          value={formik.values.gender}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
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
                          disabled={areInputsDisabled}
                          name="email"
                          onChange={formik.handleChange}
                          
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <small className="error-cls" style={{ color: "red" }}>
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
                          disabled={areInputsDisabled}
                          name="mobile"
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/\D/g, "");
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
                      <br />
                      <div className={`col-md-4`}>
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
                          disabled={areInputsDisabled}
                          name="district"
                          value={formik.values.district}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                        >
                          <option value={""}>Select Your Institution District</option>
                          {districtList["Telangana"].map((item) => (
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
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="branch">
                          College Town
                        </label>
                        &nbsp;
                       
                        <input
                          type="text"
                          className="form-control"
                          placeholder="College Town"
                          id="college_town"
                          disabled={areInputsDisabled}
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
                      <div className={`col-md-4`}>
                        <label htmlFor="collegeType" className="form-label">
                          College Type
                        </label>
                        &nbsp;
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                        <select
                          id="collegeType"
                          className="form-select"
                          disabled={areInputsDisabled}
                          name="collegeType"
                          value={formik.values.collegeType}
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
                        &nbsp;
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                    
                        <Select
                          classNamePrefix="react-select"
                          options={collegeOptions}
                          placeholder=" Type here to Select Your College Name"
                          isDisabled={areInputsDisabled}
                          value={collegeOptions.find(
                            (option) => option.value === formik.values.college
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "college",
                              selectedOption?.value
                            )
                          }
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.college && formik.errors.college ? (
                          <small className="error-cls">
                            {formik.errors.college}
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
                          disabled={areInputsDisabled}
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
                          value={formik.values.rollnumber}
                        />
                        {formik.touched.rollnumber &&
                        formik.errors.rollnumber ? (
                          <small className="error-cls" style={{ color: "red" }}>
                            {formik.errors.rollnumber}
                          </small>
                        ) : null}
                      </div>
                      {formik.values.college === "Other" && (
                        <div className={`col-md-12`}>
                          <label htmlFor="ocn" className="form-label">
                            Other College Name
                          </label>
                          &nbsp;
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="ocn"
                            placeholder="Other College Name"
                            disabled={areInputsDisabled}
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
                      )}

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
                          disabled={areInputsDisabled}
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
                          value={formik.values.branch}
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
                          disabled={areInputsDisabled}
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
                        {formik.touched.id_number && formik.errors.id_number ? (
                          <small className="error-cls" style={{ color: "red" }}>
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
                          disabled={areInputsDisabled}
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
                      <br />
                      <div className={`col-md-6`}>
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        &nbsp;
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                        <input
                          type="text"
                          disabled={areInputsDisabled}
                          name="password"
                          placeholder="Password"
                          id="password"
                          className="form-control"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <small className="error-cls">
                            {formik.errors.password}
                          </small>
                        ) : null}
                      </div>
                      <div className={`col-md-6`}>
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm Password
                        </label>
                        &nbsp;
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                        <input
                          type="text"
                          disabled={areInputsDisabled}
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
                        {formik.values.confirmPassword !== "" &&
                          !(
                            formik.values.password ===
                            formik.values.confirmPassword
                          ) && (
                            <small className="text-danger">
                              Confirm Password is not same as Password
                            </small>
                          )}
                      </div>
                    </>
                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn btn-warning m-2"
                        onClick={(e) => handleSendOtp(e)}
                        disabled={
                          !formik.isValid ||
                          !formik.dirty ||
                          otpSent ||
                          !(
                            formik.values.password ===
                            formik.values.confirmPassword
                          ) ||
                          (formik.values.college === "Other" &&
                            !formik.values.ocn)
                        }
                      >
                        {otpSent ? `Resend OTP (${timer})` : change}
                      </button>
                    </div>
                    {/* )} */}
                    {btnOtp && (
                      <>
                        <div className="Otp-expire text-center">
                          <p style={{ color: "red" }}>
                            {timer > 0
                              ? `Access Resend OTP in ${
                                  timer < 10 ? `0${timer}` : timer
                                } sec`
                              : "Resend OTP enabled"}
                          </p>
                        </div>

                        <div className="login-content user-login">
                          <div className="login-logo"></div>
                          <div className="login-userset text-center justify-content-center">
                            <div className="login-userheading">
                              <h3 className="mb-2">
                                Verify your Email with OTP
                              </h3>
                              <h5
                                className="verfy-mail-content"
                                style={{ marginBottom: "16px" }}
                              >
                                We sent a verification code to your email.
                                <br />
                                Enter the code from the email in the field below
                              </h5>
                            </div>

                            <div className="wallet-add">
                              <div className="otp-box">
                                <div className="forms-block text-center">
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <OtpInput
                                      numInputs={6}
                                      isDisabled={false}
                                      errorStyle="error"
                                      onChange={handleOtpChange}
                                      separator={<span>{"-"}</span>}
                                      isInputNum={true}
                                      isInputSecure={false}
                                      shouldAutoFocus
                                      value={formik.values.otp}
                                      placeholder={""}
                                      inputStyle={{
                                        border: "1px solid",
                                        borderRadius: "8px",
                                        width: "2.5rem",
                                        height: "2.5rem",
                                        fontSize: "2rem",
                                        color: "#000",
                                        fontWeight: "400",
                                        caretColor: "blue",
                                      }}
                                      focusStyle={{
                                        border: "1px solid #CFD3DB",
                                        outline: "none",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {formik.values.otp.length > 5 &&
                          otpRes != formik.values.otp && (
                            <div className="form-row row text-center">
                              <span
                                className=" w-100 d-flex justify-content-center"
                                style={{
                                  color: "red",
                                }}
                              >
                                Invalid OTP
                              </span>
                            </div>
                          )}
                      </>
                    )}

                    {btnOtp && (
                      <div
                        className="form-login text-center"
                        style={{ marginTop: "2rem" }}
                      >
                        <button
                          className="btn btn-success"
                          type="submit"
                          disabled={
                            isSubmitting ||
                            !(
                              formik.values.otp.length === 6 &&
                              formik.values.otp === otpRes
                            )
                          }
                        >
                          {isSubmitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2" />
                              Processing your Registration
                            </>
                          ) : (
                            "Verify My Account"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PilotReg;
