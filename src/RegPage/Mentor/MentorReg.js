/* eslint-disable indent */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  decryptGlobal,
  encryptGlobal,
} from "../../constants/encryptDecrypt.js";
import OtpInput from "react-otp-input-rc-17";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { openNotificationWithIcon } from "../../helpers/Utils.js";

const Register = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);

  const [btnOtp, setBtnOtp] = useState(false);
  const [otpRes, setOtpRes] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [mentorData, setMentorData] = useState({});
  const [change, setChange] = useState("Send OTP");
  const [holdKey, setHoldKey] = useState(false);

  const [buttonData, setButtonData] = useState("");
  const [disable, setDisable] = useState(false);
  const [areInputsDisabled, setAreInputsDisabled] = useState(false);
  const [timer, setTimer] = useState(0);
  const [person, setPerson] = useState(true);

  const [mentData, setMentData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  
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
        .matches(
          /^[aA-zZ\s]+$/,
            "Special Characters are not allowed"
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
            "Special Characters are not allowed"
        )
        .required(
          <span style={{ color: "red" }}>Please Enter Area of Expertise</span>
        ),
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true);
      if (values.otp.length < 5) {
        setErrorMsg(true);
      } else {
       
        const body = JSON.stringify({
          full_name: values.full_name.trim(),
          username: values.email.trim(),
          mobile: values.mobile.trim(),
          areas_of_expertise: values.area_of_expertise.trim(),
          college_name: values.college_name.trim(),
        });
        setMentorData(body);

        localStorage.setItem("mentorData", body);
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
              setMentData(mentorRegRes.data && mentorRegRes.data.data[0]);

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
    // this function Sends a request to trigger the mentor welcome email
    const body = {
      email: formik.values.email,
      mobile: mentData.mobile,
    };

    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/mentorships/triggerWelcomeEmail",
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
          navigate("/mentor-success", {
            state: {
              // college_name: mentorData.college_name,
              // area_of_expertise: mentorData.areas_of_expertise,
              email: formik.values.email,
              mobile: formik.values.mobile,
              full_name: formik.values.full_name,
            },
          });
          openNotificationWithIcon("success", "Email Sent Successfully");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

 
  const handleSendOtp = async (e) => {
    // This function  Sends a request to generate and send OTP to the user's mobile and email

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
      url: process.env.REACT_APP_API_BASE_URL + "/mentorships/emailOtp",
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
          console.log(UNhashedPassword,"otp");
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

          setDisable(true);
          setAreInputsDisabled(false);
          setTimer(0);
        }
      });
    e.preventDefault();
  };
  const handleOtpChange = (e) => {
    formik.setFieldValue("otp", e);
    setErrorMsg(false);
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
  useEffect(() => {
    if (
      formik.values.full_name.length > 0 &&
      formik.values.email.length > 0 &&
      formik.values.mobile.length > 0 &&
      formik.values.area_of_expertise.length > 0 &&
      formik.values.college_name.length > 0
    ) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [
    formik.values.full_name,
    formik.values.email,
    formik.values.mobile,
    formik.values.area_of_expertise,
    formik.values.college_name,
  ]);
  const handleLogoClick = () => {
    navigate("/");
  };
  useEffect(() => {
    document.body.style.overflow = "auto"; // Enable scrolling
    document.body.style.overflowY = "hidden"; // Hide vertical scrollbar
  }, []);

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
                    <h3>Mentor Registration Form Details </h3>
                  </div>
                )}

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
                              <small className="error-cls" style={{ color: "red" }}>
                                {formik.errors.mobile}
                              </small>
                            ) : null}
                          </div>
                          <div className={`col-md-12`}>
                            <label
                              htmlFor="college_name"
                              className="form-label"
                            >
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
                              disabled={areInputsDisabled}
                              id="college_name"
                              name="college_name"
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const lettersOnly = inputValue.replace(
                                  /[^a-zA-Z\s]/g,
                                  ""
                                );
                                formik.setFieldValue(
                                  "college_name",
                                  lettersOnly
                                );
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.college_name}
                            />
                            {formik.touched.college_name &&
                            formik.errors.college_name ? (
                              <small className="error-cls" style={{ color: "red" }}>
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
                              disabled={areInputsDisabled}
                              placeholder="Areas of Expertise"
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
                              <small className="error-cls" style={{ color: "red" }}>
                                {formik.errors.area_of_expertise}
                              </small>
                            ) : null}
                          </div>
                        </>
                        <div className="col-md-12">
                          <button
                            type="button"
                            className="btn btn-warning m-2"
                            onClick={(e) => handleSendOtp(e)}
                            disabled={
                              !formik.isValid || !formik.dirty || otpSent
                            }
                          >
                            {otpSent ? `Resend OTP (${timer})` : change}
                          </button>
                        </div>
                        {btnOtp && (
                          <>
                            <div className="Otp-expire text-center">
                              <p>
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
                                "Submit for Verification"
                              )}
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
