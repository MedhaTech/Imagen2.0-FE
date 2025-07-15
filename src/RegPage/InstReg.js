/* eslint-disable indent */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../core/img/imagewithbasebath.jsx";
import { Link } from "react-router-dom";
// import { all_routes } from "../../../Router/all_routes";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { decryptGlobal, encryptGlobal } from "../constants/encryptDecrypt.js";
import OtpInput from "react-otp-input-rc-17";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/newapt.png";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import user from "../assets/img/icons/user-icon.svg";
import play from "../assets/img/playicon.png";
import copy from "../assets/img/copyrights.png";
import { ArrowRight } from "feather-icons-react";
import { openNotificationWithIcon } from "../helpers/Utils.js";
import { districtList, collegeType } from "./ORGData.js";
import Select from "react-select";

const Register = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [districtData, setDistrictData] = useState(
    districtList["Andhra Pradesh"] || []
  );
  const [stateData, setStateData] = useState();
  const [diesCode, setDiesCode] = useState("");
  const [orgData, setOrgData] = useState({});
  const [data, setData] = useState(false);
  const [error, setError] = useState("");
  const [schoolBtn, setSchoolBtn] = useState(false);
  const [btnOtp, setBtnOtp] = useState(false);
  const [otpRes, setOtpRes] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [mentorData, setMentorData] = useState({});
  const [diceBtn, setDiceBtn] = useState(true);
  const [btn, setBtn] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [checkBox1, setCheckBox1] = useState(false);
  const [change, setChange] = useState("Send OTP");
  const [wtsNum, setWtsNum] = useState("");
  const [mobNum, setMobNum] = useState("");
  const [holdKey, setHoldKey] = useState(false);
  const [sendOtp, setSendOtp] = useState("");
  const [time] = useState("00");
  const [counter, setCounter] = useState(59);
  const [sec, setSec] = useState(59);
  const [buttonData, setButtonData] = useState("");
  const [disable, setDisable] = useState(false);
  const [areInputsDisabled, setAreInputsDisabled] = useState(false);
  const [dropdownbtn, setDropDownbtn] = useState("");
  const [timer, setTimer] = useState(0);
  const [person, setPerson] = useState(true);
  const [design, setDesign] = useState(false);
  const [emailData, setEmailData] = useState("");
  const [mobileData, setMobileData] = useState("");
  const [mentData, setMentData] = useState({});
  const [multiData, setMultiData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collegeNamesList, setCollegeNamesList] = useState([]);
  const [selectedCollegeType, setSelectedCollegeType] = useState("");

  const handleCollegeTypeChange = (event) => {
     const selectedCollegeType = event.target.value;
     formik.setFieldValue("college_type", selectedCollegeType);
     setSelectedCollegeType(selectedCollegeType);
     formik.setFieldValue("college", "");
     formik.setFieldValue("ocn", "");
     AllCollegesApi(selectedCollegeType, formik.values.district);
   };
   const handledistrictChange = (event) =>{
     formik.setFieldValue("district", event.target.value);
     formik.setFieldValue("college", "");
     formik.setFieldValue("ocn", "");
     AllCollegesApi(formik.values.college_type, event.target.value);
   };
  const AllCollegesApi = (item,district) => {
    const distParam = encryptGlobal(
      JSON.stringify({
        college_type: item,
        district:district
      })
    );

    var config = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/dashboard/CollegeNameForCollegeTypeDistrict?Data=${distParam}`,
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
        setCollegeNamesList([...collegeNames,'Other']);
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
  const normalizeStateName = (stateName) => {
    return stateName
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleOnChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const trimmedValue = numericValue.trim();

    setDiesCode(trimmedValue);

    if (trimmedValue.length === 11 && checkBox1) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }

    setOrgData();
    setError("");
  };

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Watch Demo
    </Tooltip>
  );

  const handleCheckbox1 = (e, click) => {
    if (click) {
      setCheckBox1(true);
      if (diesCode.length === 11) {
        setIsButtonEnabled(true);
      }
      //formik.setFieldValue("whatapp_mobile", formik.values.mobile);
      //setWtsNum(formik.values.mobile);
    } else {
      setCheckBox1(false);
      setIsButtonEnabled(false);
      //formik.setFieldValue("whatapp_mobile", "");
    }
  };

  localStorage.setItem("orgData", JSON.stringify(orgData));
  localStorage.setItem("diesCode", JSON.stringify(diesCode));

  useEffect(() => {
    if (!dropdownbtn) {
      setDesign(true);
    } else {
      setDesign(false);
    }
  }, [dropdownbtn]);
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
      ocn: "",
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
        <span style={{ color: "red" }}>Please Select Institution District</span>
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
      // confirmPassword: Yup.string().required(
      //   <span style={{ color: "red" }}>Please Enter Confirm Password</span>
      // ),
      password: Yup.string()
      .min(8, () => <span style={{ color: "red" }}>Password must be at least 8 characters</span>)
      .matches(/[a-z]/, () => <span style={{ color: "red" }}>Password must contain at least one lowercase letter</span>)
      .matches(/[A-Z]/, () => <span style={{ color: "red" }}>Password must contain at least one uppercase letter</span>)
      .matches(/\d/, () => <span style={{ color: "red" }}>Password must contain at least one number</span>)
      .matches(/[@$!%*?&()]/, () => <span style={{ color: "red" }}>Password must contain at least one special character (@$!%*?&())</span>)
      .required(() => <span style={{ color: "red" }}>Please Enter Password</span>),
    
  
    confirmPassword: Yup.string()
      .required(<span style={{ color: "red" }}>Please Enter Confirm Password</span>),
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true);
      if (values.otp.length < 5) {
        setErrorMsg(true);
      } else {
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
          college_name:
            values.college === "Other" ? values.ocn : values.college,
        });
        setMentorData(body);

        localStorage.setItem("mentorData", body);
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
              // console.log(mentorRegRes,"mm");
              setMentData(mentorRegRes.data && mentorRegRes.data.data[0]);
              // navigate("/atl-success");
              // openNotificationWithIcon("success", "Email sent successfully");
              setTimeout(() => {
                apiCall(mentorRegRes.data && mentorRegRes.data.data[0]);
              }, 3000);
            }
          })
          .catch((err) => {
            if (err?.response?.data?.status === 406) {
              openNotificationWithIcon("error", err.response.data?.message);
            } else {
              openNotificationWithIcon("error", "Email id is Invalid");
            }
            // openNotificationWithIcon("error", "Email id is Invalid");

            // setBtn(false);
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
  async function apiCall(mentData) {
    // Dice code list API //
    // where list = diescode  //
    const body = {
      college_name: mentData.college_name,
      college_type: mentData.college_type,

      district: mentData.district,
      email: mentData.username,
      mobile: mentData.mobile,
    };

    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/mentors/triggerWelcomeEmail",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: JSON.stringify(body),
    };

    await axios(config)
      .then(async function (response) {
        if (response.status == 200) {
          setButtonData(response?.data?.data[0]?.data);
          navigate("/atl-success");
          openNotificationWithIcon("success", "Email Sent Successfully");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const handleCheckbox = (e, click) => {
    if (click) {
      setCheckBox(click);
      formik.setFieldValue("whatapp_mobile", formik.values.mobile);
      setWtsNum(formik.values.mobile);
    } else {
      setCheckBox(click);
      formik.setFieldValue("whatapp_mobile", "");
    }
  };
  useEffect(() => {
    setCheckBox(false);
    formik.setFieldValue("whatapp_mobile", "");
  }, [formik.values.mobile.length == 0]);
  const handleSendOtp = async (e) => {
    formik.setFieldValue("mobile", formik.values.mobile);
    setTimer(60);

    setOtpSent(true);
    setChange("Resend OTP");
    setDisable(false);
    setAreInputsDisabled(true);

    const body = JSON.stringify({
      username: formik.values.email,
      mobile: formik.values.mobile,
    });
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/mentors/emailOtp",
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
          // console.log(UNhashedPassword, "111111111111111111111111111");
          setOtpRes(JSON.parse(UNhashedPassword));
          openNotificationWithIcon("success", "OTP Sent to Given Email Id");
          setBtnOtp(true);
          setPerson(false);
          setTimeout(() => {
            setOtpSent("Resend OTP");
            setDisable(true);
            setHoldKey(false);
            setTimer(0);
          }, 60000);
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.status === 406) {
          openNotificationWithIcon("error", error?.response.data?.message);
          // openNotificationWithIcon("error", "Email id is Invalid");

          setDisable(true);
          setAreInputsDisabled(false);
          setTimer(0);
          // openNotificationWithIcon("error", "Email ID already exists");
          // setTimeout(() => {
          //   setDisable(true);
          //   setHoldKey(false);
          //   setTimer(0);
          // }, 1000);
        }
      });
    e.preventDefault();
  };
  const handleOtpChange = (e) => {
    formik.setFieldValue("otp", e);
    setErrorMsg(false);
  };

  // useEffect(() => {
  //   if (timer > 0) {
  //     const intervalId = setInterval(() => {
  //       setTimer((prevTimer) => prevTimer - 1);
  //     }, 1000);
  //     return () => clearInterval(intervalId);
  //   } else if (timer === 0 && otpSent) {
  //     setAreInputsDisabled(false);
  //     setOtpSent(false);
  //   }
  // }, [timer, otpSent]);
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
  useEffect(() => {
    if (
      formik.values.full_name.length > 0 &&
      formik.values.email.length > 0 &&
      formik.values.mobile.length > 0 &&
      formik.values.district.length > 0 &&
      formik.values.college.length > 0 &&
      formik.values.college_type.length > 0 &&
      formik.values.password.length > 0 &&
      formik.values.confirmPassword.length > 0
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [
    formik.values.full_name,
    formik.values.email,
    formik.values.mobile,
    formik.values.district,
    formik.values.college,
    formik.values.college_type,
    formik.values.password,
    formik.values.confirmPassword,
  ]);
  const handleLogoClick = () => {
    navigate("/");
  };
  useEffect(() => {
    document.body.style.overflow = "auto"; // Enable scrolling
    document.body.style.overflowY = "hidden"; // Hide vertical scrollbar
  }, []);
  //console.log(formik.values.district,"district", );
  // const route = all_routes;
  const style = {
    overflow: "auto",

    scrollbarWidth: "none", // Hides scrollbar in Firefox
    msOverflowStyle: "none", // Hides scrollbar in Internet Explorer
  };
  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper register-wrap  bg-img">
          <div className="login-content" style={style}>
            <form action="signin" onSubmit={formik.handleSubmit}>
              <div className="login-userset">
                <div
                  className="login-logo logo-normal"
                  onClick={handleLogoClick}
                >
                  <img src={logo} alt="Logo" />
                </div>

                {person && (
                  <div className="login-userheading">
                    <h3> Registration Form Details </h3>
                  </div>
                )}

                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-body">
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
                              // onChange={formik.handleChange}
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
                              disabled={areInputsDisabled}
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
                          <div className={`col-md-6`}>
                            <label htmlFor="district" className="form-label">
                            District
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
                              onChange={handledistrictChange}
                            >
                              <option value={""}>District</option>
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

                          <div className={`col-md-6`}>
                            <label
                              htmlFor="college_type"
                              className="form-label"
                            >
                              College Type
                            </label>
                            &nbsp;
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              *
                            </span>
                            <select
                              id="college_type"
                              className="form-select"
                              disabled={areInputsDisabled}
                              name="college_type"
                              value={formik.values.college_type}
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
                            {formik.touched.college_type &&
                            formik.errors.college_type ? (
                              <small className="error-cls">
                                {formik.errors.college_type}
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
                            {/* <select
                              id="college"
                              className="form-select"
                              disabled={areInputsDisabled}
                              name="college"
                              value={formik.values.college}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            >
                              <option value={""}>College Name</option>
                              {collegeNamesList.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select> */}
                              <Select
        classNamePrefix="react-select"
        options={collegeOptions}
         placeholder=" Type here to Select Your College Name"
        isDisabled={areInputsDisabled}
        value={collegeOptions.find(
                            (option) => option.value === formik.values.college
                          ) === undefined ? null : collegeOptions.find(
                            (option) => option.value === formik.values.college
                          )}
        onChange={(selectedOption) => formik.setFieldValue("college", selectedOption?.value)}
        onBlur={formik.handleBlur}
      />
                            {formik.touched.college && formik.errors.college ? (
                              <small className="error-cls">
                                {formik.errors.college}
                              </small>
                            ) : null}
                          </div>

                          {formik.values.college === "Other" && (
                            <div className={`col-md-12`}>
                              <label htmlFor="ocn" className="form-label">
                                Other College Name
                              </label>
                              &nbsp;
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
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
                            {formik.touched.password &&
                            formik.errors.password ? (
                              <small className="error-cls">
                                {formik.errors.password}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-6`}>
                            <label
                              htmlFor="confirmPassword"
                              className="form-label"
                            >
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
                              <p>
                                {timer > 0
                                  ? `Access Resend OTP in ${
                                      timer < 10 ? `0${timer}` : timer
                                    } sec`
                                  : "Resend OTP enabled"}
                                {/* {timer > 0
                                    ? `Otp will expire in 00:${
                                        timer < 10 ? `0${timer}` : timer
                                      } seconds`
                                    : "Otp expired"} */}
                              </p>
                            </div>

                            <div className="login-content user-login">
                              <div className="login-logo">
                                {/* <ImageWithBasePath
                                    src="assets/img/newap.png"
                                    alt="img"
                                  /> */}
                                {/* <Link className="login-logo logo-white">
                                    <ImageWithBasePath
                                      src="assets/img/logo-white.png"
                                      alt
                                    />
                                  </Link> */}
                              </div>
                              <div className="login-userset text-center justify-content-center">
                                <div className="login-userheading">
                                  <h3>Verify your Email with OTP</h3>
                                  <h4 className="verfy-mail-content">
                                    We sent a verification code to your email.
                                    Enter the code from the email in the field
                                    below
                                  </h4>
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
                          <div className="form-login text-center">
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
                              {/* Verify My Account */}
                            </button>
                          </div>
                        )}
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
  );
};

export default Register;
